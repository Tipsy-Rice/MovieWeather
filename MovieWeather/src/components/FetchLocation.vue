<script setup>
import { ref } from 'vue'

// Props from parent(App.vue)
const emit = defineEmits(['located'])

// State for location data and error message
const latitude = ref(null)
const longitude = ref(null)
const error = ref(null)

// Function to get user's location using Geolocation API
function getLocation() {
  error.value = null

  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude.value = position.coords.latitude
      longitude.value = position.coords.longitude

      emit('located', { latitude: latitude.value, longitude: longitude.value })
    },
    () => {
      error.value = 'Could not get your location.'
    }
  )
}
// Expose getLocation method to parent component (App.vue) so it can be called when FetchWeather component requests location data
defineExpose({ getLocation })
</script>

<template>
  <div>
    <p v-if="error">{{ error }}</p>
  </div>
</template>
