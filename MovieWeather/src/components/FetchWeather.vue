<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  coords: Object
})

const emit = defineEmits([
  'request-location',
  'weather-loaded'
])

const weatherCode = ref(null)
const temperature = ref(null)
const windSpeed = ref(null)
const description = ref('')
const loading = ref(false)
const error = ref('')

// Open-Meteo weather code descriptions
const weatherDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',

  45: 'Fog',
  48: 'Depositing rime fog',

  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',

  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',

  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',

  66: 'Light freezing rain',
  67: 'Heavy freezing rain',

  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',

  77: 'Snow grains',

  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',

  85: 'Slight snow showers',
  86: 'Heavy snow showers',

  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

function getWeatherDescription(code) {
  return weatherDescriptions[code] || `Weather code: ${code}`
}

async function fetchWeather(coords) {
  weatherCode.value = null
  temperature.value = null
  windSpeed.value = null
  description.value = ''
  error.value = ''
  loading.value = true

  try {
    const { latitude, longitude } = coords

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=celsius`
    )

    if (!response.ok) {
      throw new Error('Could not fetch weather.')
    }

    const data = await response.json()

    weatherCode.value = data.current.weather_code
    temperature.value = data.current.temperature_2m
    windSpeed.value = data.current.wind_speed_10m
    description.value = getWeatherDescription(weatherCode.value)

    emit('weather-loaded', {
      weatherCode: weatherCode.value,
      temperature: temperature.value,
      windSpeed: windSpeed.value,
      description: description.value
    })
  } catch {
    error.value = 'Could not fetch weather.'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.coords,
  (newCoords) => {
    if (newCoords) {
      fetchWeather(newCoords)
    }
  }
)
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