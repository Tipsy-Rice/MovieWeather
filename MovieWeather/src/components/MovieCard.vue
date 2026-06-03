<script setup lang="ts">
type Movie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
};

defineProps<{
  movie: Movie;
}>();

const emit = defineEmits<{
  save: [movie: Movie];
}>();

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function getPosterUrl(path: string) {
  return `${IMAGE_BASE_URL}${path}`;
}
</script>

<template>
  <div class="movie-card">
    <img
      v-if="movie.poster_path"
      :src="getPosterUrl(movie.poster_path)"
      :alt="movie.title"
      width="200"
    />

    <h3>{{ movie.title }}</h3>

    <p>
      Release date:
      {{ movie.release_date || "Unknown" }}
    </p>

    <p>
      {{ movie.overview || "No description available." }}
    </p>

    <button @click="emit('save', movie)">
      Save to Watchlist
    </button>
  </div>
</template>