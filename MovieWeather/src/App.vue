<script setup>
import { ref } from 'vue'
import FetchLocation from './components/FetchLocation.vue'
import FetchWeather from './components/FetchWeather.vue'
import MovieSearch from './components/MovieSearch.vue'

const coords = ref(null)      // { latitude: Number, longitude: Number }
const locationRef = ref(null) // reference to FetchLocation component

const weatherCode = ref(null) // weather code from Open-Meteo API
const weatherDescription = ref('') // ref for weather description string (sunny, rainy....etc)

const temperature = ref(null)

function handleLocated(newCoords) {
  coords.value = newCoords
}
// call the getLocation method in FetchLocation
function requestLocation() {
  locationRef.value?.getLocation()
}
// calls handleWeatherLoaded when weather is loaded in FetchWeather
function handleWeatherLoaded(weather) {
  weatherCode.value = weather.weatherCode
  weatherDescription.value = weather.description
  temperature.value = weather.temperature
}
</script>

<template>
  <main class="container-fluid bg-white min-vh-100 text-center py-5">
    <h1 class="display-2 mb-4 movie-title">
      MovieWeather
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
      :coords="coords"
      :weather-code="weatherCode" 
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