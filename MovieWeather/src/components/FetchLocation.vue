<script setup lang="ts">
import { ref } from 'vue'

const latitude = ref<number | null>(null)
const longitude = ref<number | null>(null)

function getLocation() {

    navigator.geolocation.getCurrentPosition(
        (position) => {
            latitude.value = position.coords.latitude
            longitude.value = position.coords.longitude

            console.log("Latitude:", position.coords.latitude)
            console.log("Longitude:", position.coords.longitude)
        },
    );
}
</script>

<template>
  <div>
    
    <button @click="getLocation">Get My Location</button>

    <div v-if="latitude && longitude">
      <p>Latitude: {{ latitude }}</p>
      <p>Longitude: {{ longitude }}</p>
    </div>

  </div>
</template>
