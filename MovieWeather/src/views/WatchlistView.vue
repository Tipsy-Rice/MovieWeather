<script setup lang="ts">
import { ref, onMounted } from 'vue'
 
type Movie = {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string | null
}
 
const watchlist = ref<Movie[]>([])
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
 
function loadWatchlist() {
  watchlist.value = JSON.parse(localStorage.getItem('watchlist') || '[]')
}
 
function removeFromWatchlist(movieId: number) {
  watchlist.value = watchlist.value.filter((m) => m.id !== movieId)
  localStorage.setItem('watchlist', JSON.stringify(watchlist.value))
}
 
function getPosterUrl(path: string) {
  return `${IMAGE_BASE_URL}${path}`
}
 
onMounted(() => {
  loadWatchlist()
})
</script>
 
<template>
  <section class="watchlist-container">
    <h1 class="page-title">My Watchlist</h1>
 
    <p v-if="watchlist.length === 0" class="empty-message">
      Your watchlist is empty. Go find some movies!
    </p>
 
    <div class="movie-list">
      <div v-for="movie in watchlist" :key="movie.id" class="movie-card">
        <img
          v-if="movie.poster_path"
          :src="getPosterUrl(movie.poster_path)"
          :alt="movie.title"
        />
 
        <h3>{{ movie.title }}</h3>
 
        <p>
          <strong>Release date:</strong>
          {{ movie.release_date || 'Unknown' }}
        </p>
 
        <p>{{ movie.overview || 'No description available.' }}</p>
 
        <button @click="removeFromWatchlist(movie.id)">Remove</button>
      </div>
    </div>
  </section>
</template>
 
<style scoped>
.watchlist-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
}
 
.page-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 1rem;
}
 
.empty-message {
  text-align: center;
  color: #6c757d;
  font-size: 1.1rem;
  margin: 3rem 0;
}
 
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
 
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
  object-fit: cover;
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
  background: #c0392b;
  color: white;
  cursor: pointer;
}
 
.movie-card button:hover {
  background: #e74c3c;
}
 
@media (max-width: 768px) {
  .movie-list {
    grid-template-columns: 1fr;
  }
}
</style>

