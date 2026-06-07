<script setup>
defineProps({
  movie: Object
})

const emit = defineEmits(['save'])

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

function getPosterUrl(path) {
  return `${IMAGE_BASE_URL}${path}`
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
        class="btn btn-success mt-auto"
        @click="emit('save', movie)"
      >
        Save to Watchlist
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