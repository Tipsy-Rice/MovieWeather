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
    />

    <h3>{{ movie.title }}</h3>

    <p>
      <strong>Release date:</strong>
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

<style scoped>
.movie-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
}

.movie-card img {
  width: 100%;
  height: 350px;
  object-fit:contain;
  display: block;
}

.movie-card h3 {
  margin: 1rem 1rem 0.5rem;
}

.movie-card p {
  margin: 0.5rem 1rem;
  line-height: 1.4;
}

.movie-card button {
  margin: auto 1rem 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background: #008979;
  color: white;
  cursor: pointer;
}

.movie-card button:hover {
  background: #1f75e8;
}
</style>