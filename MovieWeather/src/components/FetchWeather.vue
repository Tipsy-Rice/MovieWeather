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
  <div>
    <button @click="emit('request-location')">Get My Weather</button>

    <p v-if="error">{{ error }}</p>

    <div v-if="weather">
      <p>{{ weather.description }}</p>
    </div>
  </div>
</template>
