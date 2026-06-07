<script setup>
import { ref } from 'vue'

const emit = defineEmits(['located'])

const error = ref('')

function getLocation() {
  error.value = ''

  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by this browser.'
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      emit('located', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    },
    () => {
      error.value = 'Could not get your location.'
    }
  )
}

defineExpose({
  getLocation,
})
</script>

<template>
  <p v-if="error" class="text-danger">
    {{ error }}
  </p>
</template>