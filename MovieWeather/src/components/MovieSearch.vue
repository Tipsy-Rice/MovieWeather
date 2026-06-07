<script setup>
import { ref, watch } from 'vue'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  coords: Object,
  weatherCode: Number,
  weatherDescription: String,
  temperature: Number,
})

const emit = defineEmits(['request-location'])
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
  const genres = weatherCodeGenreMap[weatherCode] || [18, 35]
  getMoviesByGenres(genres)
}

function getMoviesByManualWeather() {
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
  <div class="p-4 mb-2">
    <h3>Get movie recommendations based on weather!</h3>
    <h3>Pick one of the three methods below:</h3>
  </div>

  <!-- Tabs -->
  <div class="d-flex justify-content-center mb-4">
    <div class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'location' }"
        @click="activeTab = 'location'"
      >
        My Location
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'manual' }"
        @click="activeTab = 'manual'"
      >
        Weather 
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'search' }"
        @click="activeTab = 'search'"
      >
        Movie Title
      </button>
    </div>
  </div>

  <!-- Tab: My Location -->
  <section class="container-fluid bg-white text-center py-4">
    <div v-if="activeTab === 'location'" class="tab-content">
      
      <div class="mb-3">
        <button
          class="btn btn-success btn-lg"
          @click="emit('request-location')"
        >
          Use My Location
        </button>
      </div>

      <div v-if="props.coords" class="bg-success-subtle rounded p-3 mb-4 weather-summary">
        <p class="mb-1 fw-semibold">Your current weather:</p>
        <p v-if="weatherDescription" class="mb-0">
          {{ weatherDescription }}
        </p>
      </div>
      <p v-else class="text-muted fst-italic">
        Press "Use My Location" above to get started.
      </p>
    </div>
    
  </section>

  <!-- Tab: Pick Weather -->
  <div v-if="activeTab === 'manual'" class="tab-content">
    <div class="row justify-content-center g-3">
      <div class="col-12 col-md-4">
        <select v-model="selectedWeatherType" class="form-select form-select-lg">
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
        <button class="btn btn-success btn-lg w-100" @click="getMoviesByManualWeather">
          Search by Weather
        </button>
      </div>
    </div>
  </div>

  <div v-if="activeTab === 'search'" class="tab-content">
    <form class="row justify-content-center g-3" @submit.prevent="searchMovies">
      <div class="col-12 col-md-5">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control form-control-lg"
          placeholder="Search for a movie..."
        >
      </div>
      <div class="col-12 col-md-auto">
        <button class="btn btn-success btn-lg w-100" type="submit">
          Search
        </button>
      </div>
    </form>
  </div>

  <p v-if="loading" class="fs-5 mt-4">Loading...</p>
  <p v-if="error" class="text-danger fs-5 mt-2">{{ error }}</p>

  <div class="row g-4 px-3 mt-2">
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

.weather-summary {
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.tab-bar {
  display: flex;
  border: 1.5px solid #008979;
  border-radius: 10px;
  overflow: hidden;
}

.tab-btn {
  flex: 1;
  padding: 0.65rem 1.5rem;
  border: none;
  background: white;
  color: #008979;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.tab-btn:not(:last-child) {
  border-right: 1.5px solid #008979;
}

.tab-btn.active {
  background: #008979;
  color: white;
  font-weight: 600;
}

.tab-btn:hover:not(.active) {
  background: #e8f7f5;
}

.tab-content {
  min-height: 100px;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .tab-btn {
    padding: 0.65rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>