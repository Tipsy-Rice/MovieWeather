<script setup>
import { ref, watch } from 'vue'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  coords: Object,
  weatherCode: Number,
  weatherDescription: String,
  temperature: Number,
})

const activeMode = ref(null)
const searchQuery = ref('')
const movies = ref([])
const loading = ref(false)
const error = ref('')
const selectedWeatherType = ref('')
const activeTab = ref('location') 

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN
// Mapping of Open-Meteo weather codes to TMDb genre IDs
const weatherCodeGenreMap = {
  // Sunny / Clear
  0: [35, 12, 10751],
  1: [35, 12, 10751],

  // Cloudy
  2: [18, 35, 10749],
  3: [18, 9648, 10749],

  // Foggy
  45: [9648, 53, 27],
  48: [9648, 53, 27],

  // Drizzle
  51: [14, 16, 10751],
  53: [14, 16, 10751],
  55: [14, 16, 10751],

  // Freezing drizzle
  56: [53, 9648, 27],
  57: [53, 9648, 27],

  // Rain
  61: [14, 16, 10751],
  63: [14, 16, 10751],
  65: [53, 80, 27],

  // Freezing rain
  66: [53, 9648, 27],
  67: [53, 9648, 27],

  // Snow
  71: [14, 10751, 16],
  73: [14, 10751, 16],
  75: [14, 10751, 16],
  77: [14, 10751, 16],

  // Rain showers
  80: [14, 16, 10751],
  81: [14, 16, 10751],
  82: [53, 80, 27],

  // Snow showers
  85: [14, 10751, 16],
  86: [14, 10751, 16],

  // Thunderstorms
  95: [53, 28, 80],
  96: [53, 28, 80],
  99: [53, 28, 80],
}
// Manual mapping for weather descriptions to genres (for when user selects weather type instead of using weather code)
const manualWeatherGenreMap = {
  sunny: [35, 12, 10751],
  cloudy: [18, 35, 10749],
  rainy: [14, 16, 10751],
  snowy: [14, 10751, 16],
  foggy: [9648, 53, 27],
  stormy: [53, 28, 80],
  hot: [28, 12, 878],
  windy: [12, 14, 28],
}
//basic search function to search movies by title 
async function searchMovies() {
  if (!searchQuery.value.trim()) {
    error.value = 'Please enter a movie title.'
    return
  }
  activeMode.value = 'search' 
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
// fetch movies based on genre ids
async function getMoviesByGenres(genres) {
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
function getMoviesByWeatherCode(weatherCode) {
  activeMode.value = 'location'
  const genres = weatherCodeGenreMap[weatherCode] || [18, 35]
  getMoviesByGenres(genres)
}

function getMoviesByManualWeather() {
  activeMode.value = 'manual' 
  const genres = manualWeatherGenreMap[selectedWeatherType.value]
  getMoviesByGenres(genres)
}

function saveToWatchlist(movie) {
  const savedMovies = JSON.parse(localStorage.getItem('watchlist') || '[]')
  const exists = savedMovies.some((savedMovie) => savedMovie.id === movie.id)

  if (!exists) {
    savedMovies.push(movie)
    localStorage.setItem('watchlist', JSON.stringify(savedMovies))
  }
   movies.value = [...movies.value] 
}

function removeFromWatchlist(movie) {
  const saved = JSON.parse(localStorage.getItem('watchlist') || '[]')
  localStorage.setItem('watchlist', JSON.stringify(saved.filter(m => m.id !== movie.id)))
  movies.value = [...movies.value]
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
  <section class="container-fluid bg-white text-center py-4">
    <div class="p-4 mb-4 fs-5">
      <h3>
        Get movie recommendations based on your weather
      </h3>
    </div>

    <div v-if="props.coords" class="bg-success-subtle rounded p-3 mb-4 weather-summary">
      <p class="mb-1 fw-semibold">
        Weather 
      </p>

      <p v-if="weatherDescription" class="mb-1">
        Type: {{ weatherDescription }}
      </p>

    </div>

    <div class="row justify-content-center g-3 mb-4">
      <div class="col-12 col-md-4">
        <select
          v-model="selectedWeatherType"
          class="form-select form-select-lg"
        >
          <option value="" disabled selected hidden>Choose a weather...</option>
          <option value="sunny">Sunny</option>
          <option value="cloudy">Cloudy</option>
          <option value="rainy">Rainy</option>
          <option value="snowy">Snowy</option>
          <option value="foggy">Foggy</option>
          <option value="stormy">Stormy</option>
          <option value="hot">Hot</option>
          <option value="windy">Windy</option>
        </select>
      </div>

      <div class="col-12 col-md-auto">
        <button
          class="btn btn-success btn-lg w-100"
          @click="getMoviesByManualWeather"
        >
          Choose Weather Type
        </button>
</div>
    </div>
<div class="p-4 mb-4" :class="{ dimmed: activeMode && activeMode !== 'search' }">
  <h3 class="movie-title mb-4">
    Or just Search movies
  </h3>

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

  <div v-if="activeMode === 'search'" class="mt-3">
    <button class="btn btn-outline-secondary btn-sm" @click="activeMode = null; movies = []; searchQuery = ''">
      Clear
    </button>
  </div>
</div>

    <p v-if="loading" class="fs-5">
      Loading
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
          @remove="removeFromWatchlist"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
h3 {
  font-family: Georgia, serif;
}

.dimmed {
  opacity: 0.35;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.weather-summary {
  max-width: 15%;
  margin-left: auto;
  margin-right: auto;
}

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