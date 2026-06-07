<script setup>
import { ref, watch } from 'vue'
import MovieCard from './MovieCard.vue'
//props from App.vue
const props = defineProps({
  weatherCode: Number,
  weatherDescription: String,
  temperature: Number,
})

const searchQuery = ref('')
const movies = ref([])
const loading = ref(false)
const error = ref('')

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN
// Mapping of weather codes to TMDB genre IDs
const weatherCodeGenreMap = {
// Sunny / Clear
  0: [35, 12, 10751], // Comedy, Adventure, Family
  1: [35, 12, 10751], 


// Cloudy
  2: [18, 35, 10749], // Drama, Comedy, Romance
  3: [18, 9648, 10749], // Drama, Mystery, Romance
// Foggy
  45: [9648, 53, 27], // Mystery, Thriller, Horror
  48: [9648, 53, 27], // Mystery, Thriller, Horror


// Drizzle
  51: [14, 16, 10751], // Fantasy, Animation, Family
  53: [14, 16, 10751], 
  55: [14, 16, 10751], 
  // Rain
  61: [14, 16, 10751], // Fantasy, Animation, Family
  63: [14, 16, 10751], 
  65: [53, 80, 27], // Thriller, Crime, Horror
// Rain showers
  80: [14, 16, 10751], // Fantasy, Animation, Family
  81: [14, 16, 10751], 
  82: [53, 80, 27], // Thriller, Crime, Horror
// Freezing rain
  66: [53, 9648, 27], // Thriller, Mystery, Horror
  67: [53, 9648, 27], 
// Thunderstorms
  95: [53, 28, 80], // Thriller, Action, Crime
  96: [53, 28, 80], 
  99: [53, 28, 80], 


// Freezing drizzle
  56: [53, 9648, 27], // Thriller, Mystery, Horror
  57: [53, 9648, 27], 
// Snow
  71: [14, 10751, 16], // Fantasy, Family, Animation
  73: [14, 10751, 16], 
  75: [14, 10751, 16], 
  77: [14, 10751, 16], 
// Snow showers
  85: [14, 10751, 16], // Fantasy, Family, Animation
  86: [14, 10751, 16], 
}

async function searchMovies() {
  if (!searchQuery.value.trim()) {
    error.value = 'Please enter a movie title.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery.value)}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Could not fetch movies.')
    }

    const data = await response.json()
    movies.value = data.results
  } catch {
    error.value = 'Something went wrong while fetching movies.'
  } finally {
    loading.value = false
  }
}

async function getMoviesByWeatherCode(weatherCode) {
  const genres = weatherCodeGenreMap[weatherCode] || [18, 35]
  const genreIds = genres.join(',')

  loading.value = true
  error.value = ''

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIds}&sort_by=popularity.desc&include_adult=false&language=en-US&page=1`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Could not fetch movies by weather.')
    }

    const data = await response.json()
    movies.value = data.results
  } catch {
    error.value = 'Something went wrong while fetching weather movies.'
  } finally {
    loading.value = false
  }
}
//
function saveToWatchlist(movie) {
  const savedMovies = JSON.parse(localStorage.getItem('watchlist') || '[]')

  const exists = savedMovies.some((savedMovie) => savedMovie.id === movie.id)

  if (!exists) {
    savedMovies.push(movie)
    localStorage.setItem('watchlist', JSON.stringify(savedMovies))
  }
}

watch(
  () => props.weatherCode,
  (newWeatherCode) => {
    if (newWeatherCode !== null && newWeatherCode !== undefined) {
      getMoviesByWeatherCode(newWeatherCode)
    }
  }
)
</script>

<template>
  <section class="container-fluid bg-white min-vh-100 text-center py-5">
    <h1 class="display-2 mb-4 movie-title">MovieWeather</h1>

    <div class="bg-light p-4 mb-5 fs-5">
      Get movie recommendations based on your local weather.
    </div>

    <p
      v-if="weatherCode !== null && weatherCode !== undefined"
      class="fs-5"
    >
      Current weather: {{ weatherDescription }}
      <br>
      Temperature: {{ temperature }}°C
      <br>
    </p>

    <div class="bg-light p-4 mb-4">
      <h2 class="movie-title mb-4">Search manually</h2>

      <form
        class="row justify-content-center g-3"
        @submit.prevent="searchMovies"
      >
        <div class="col-12 col-md-5">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control form-control-lg"
            placeholder="Search for a movie..."
          >
        </div>

        <div class="col-12 col-md-auto">
          <button
            class="btn btn-success btn-lg w-100"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>
    </div>

    <p v-if="loading" class="fs-5">
      Loading movies...
    </p>

    <p v-if="error" class="text-danger fs-5">
      {{ error }}
    </p>

    <div class="row g-4 px-3">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="col-12 col-sm-6 col-lg-4 col-xl-3"
      >
        <MovieCard
          :movie="movie"
          @save="saveToWatchlist"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>

@media (max-width: 768px) {
  .display-2 {
    font-size: 2.4rem;
  }
}

@media (max-width: 480px) {
  .display-2 {
    font-size: 2rem;
  }
}
</style>