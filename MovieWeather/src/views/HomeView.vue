<script setup>
import { ref } from 'vue'
import FetchLocation from '../components/FetchLocation.vue'
import FetchWeather from '../components/FetchWeather.vue'
import MovieSearch from '../components/MovieSearch.vue'
 
const coords = ref(null)
const locationRef = ref(null)
 
function handleLocated(newCoords) {
  coords.value = newCoords
}
 
function requestLocation() {
  locationRef.value?.getLocation?.()
}
</script>
 
<template>
  <div>
    <FetchLocation ref="locationRef" @located="handleLocated" />
    <FetchWeather :coords="coords" @request-location="requestLocation" />
    <MovieSearch />
  </div>
</template>
 