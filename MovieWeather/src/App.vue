<script setup>
import { ref } from 'vue'
import FetchLocation from './components/FetchLocation.vue'
import FetchWeather from './components/FetchWeather.vue'

// State for coordinates and reference to FetchLocation component
const coords = ref(null)
const locationRef = ref(null)

// Handle location data sent from FetchLocation component
function handleLocated(newCoords) {
  coords.value = newCoords
}

// Parent component (App.vue) will pass coords to FetchWeather component which will fetch weather data
function requestLocation() {
  locationRef.value?.getLocation?.()
}
</script>

<template>
  <div>
    <!-- Child components -->
    <!-- FetchLocation will get coords and send them to parent(App.vue) -->
    <FetchLocation ref="locationRef" @located="handleLocated" />
    <!-- Pass coords to FetchWeather component which will fetch weather -->
    <FetchWeather :coords="coords" @request-location="requestLocation" />
  </div>
</template>

<style scoped></style>
