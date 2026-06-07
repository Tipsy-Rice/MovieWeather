<script setup>
import { ref } from 'vue'
import FetchLocation from './components/FetchLocation.vue'
import FetchWeather from './components/FetchWeather.vue'
import MovieSearch from './components/MovieSearch.vue'

const coords = ref(null)
const locationRef = ref(null)

const movieGenres = ref([])
const weatherDescription = ref('')
const temperature = ref(null)

function handleLocated(newCoords) {
  coords.value = newCoords
}

function requestLocation() {
  locationRef.value?.getLocation()
}

function handleWeatherLoaded(weather) {
  movieGenres.value = weather.genres
  weatherDescription.value = weather.description
  temperature.value = weather.temperature
}
</script>

<template>
  <main class="container-fluid bg-white min-vh-100 text-center py-5">
    <h1 class="display-2 mb-4 movie-title">
      MovieWeathe.   r
    </h1>

    <FetchLocation
      ref="locationRef"
      @located="handleLocated"
    />

    <FetchWeather
      :coords="coords"
      @request-location="requestLocation"
      @weather-loaded="handleWeatherLoaded"
    />

    <MovieSearch
      :genres="movieGenres"
      :weather-description="weatherDescription"
      :temperature="temperature"
    />
  </main>
</template>

<style scoped>
.movie-title {
  font-family: Georgia, serif;
}
</style>