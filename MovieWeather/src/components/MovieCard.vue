<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  movie: Object
})

const emit = defineEmits(['save', 'remove'])

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

function getPosterUrl(path) {
  return `${IMAGE_BASE_URL}${path}`
}

function isInWatchlist(movieId) {
  const saved = JSON.parse(localStorage.getItem('watchlist') || '[]')
  return saved.some(m => m.id === movieId)
}

const saved = ref(false)

watchEffect(() => {
  if (props.movie?.id) {
    saved.value = isInWatchlist(props.movie.id)
  }
})

function handleSave() {
  emit('save', props.movie)
  saved.value = true
}

function handleRemove() {
  emit('remove', props.movie)
  saved.value = false
}
</script>

<template>
  <div class="card h-100 shadow-sm">
    <img
      v-if="movie.poster_path"
      :src="getPosterUrl(movie.poster_path)"
      :alt="movie.title"
      class="card-img-top movie-poster"
    >

    <div class="card-body d-flex flex-column">
      <h3 class="card-title h5">
        {{ movie.title }}
      </h3>

      <p class="card-text">
        <strong>Release date:</strong>
        {{ movie.release_date || 'Unknown' }}
      </p>

      <p class="card-text">
        {{ movie.overview || 'No description available.' }}
      </p>

  <button
    v-if="!saved"
    class="btn btn-success mt-auto"
    @click="handleSave"
  >
    Save to Watchlist
  </button>

  <button
    v-else
    class="btn btn-danger mt-auto"
    @click="handleRemove"
  >
    Remove from Watchlist
  </button>
    </div>
  </div>
</template>

<style scoped>
.movie-poster {
  height: 350px;
  object-fit: contain;
}
</style>