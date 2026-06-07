<script setup>
import { ref, watch } from 'vue'

// Props from parent(App.vue)
const props = defineProps({
  coords: Object
})

// Emit event to request location data from parent(App.vue)
const emit = defineEmits(['request-location'])


const weather = ref(null)
const loading = ref(false)
const error = ref(null)


const weatherDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Light showers',
  81: 'Moderate showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
  99: 'Thunderstorm with hail',
}

// Get weather description based on weather code
function getWeatherDescription(weatherCode) {
  return weatherDescriptions[weatherCode] ?? `Weather code: ${weatherCode}`
}

// Fetch weather data from Open-Meteo API
async function fetchWeather(coords) {
  weather.value = null
  error.value = null
  loading.value = true

  try {
    const { latitude, longitude } = coords

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`
    )

    const data = await response.json()

    weather.value = {
      description: getWeatherDescription(data.current.weather_code),
    }
  } catch {
    error.value = 'Could not fetch weather.'
  } finally {
    loading.value = false
  }
}

// Automatically fetch weather when coords arrive from parent
watch(() => props.coords, (newCoords) => {
  if (newCoords) fetchWeather(newCoords)
})
</script>


<template>
  <section class="text-center my-4">
    <button
      class="btn btn-success btn-lg"
      @click="emit('request-location')"
    >
      Use My Location
    </button>
 
 
    <p v-if="loading" class="mt-3">
      Finding movie suggestions...
    </p>
 
 
    <p v-if="error" class="mt-3 text-danger">
      {{ error }}
    </p>
  </section>
 </template>
 
 