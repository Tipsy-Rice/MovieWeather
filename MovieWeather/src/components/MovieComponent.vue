<template>
  <section>
    <h2>Search Movies</h2>

    <form @submit.prevent="searchMovies">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for a movie..."
      />

      <button type="submit">
        Search
      </button>
    </form>

    <p v-if="loading">Loading movies...</p>
    <p v-if="error">{{ error }}</p>

    <div v-for="movie in movies" :key="movie.id">
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

      <button @click="saveToWatchlist(movie)">
        Save to Watchlist
      </button>

      <hr />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

type Movie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
};

const searchQuery = ref("");
const movies = ref<Movie[]>([]);
const loading = ref(false);
const error = ref("");

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function getPosterUrl(path: string) {
  return `${IMAGE_BASE_URL}${path}`;
}

async function searchMovies() {
  if (!searchQuery.value.trim()) {
    error.value = "Please enter a movie title.";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        searchQuery.value
      )}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Could not fetch movies.");
    }

    const data = await response.json();
    movies.value = data.results;
  } catch {
    error.value = "Something went wrong while fetching movies.";
  } finally {
    loading.value = false;
  }
}

function saveToWatchlist(movie: Movie) {
  const savedMovies: Movie[] = JSON.parse(
    localStorage.getItem("watchlist") || "[]"
  );

  const exists = savedMovies.some(
    (savedMovie) => savedMovie.id === movie.id
  );

  if (!exists) {
    savedMovies.push(movie);
    localStorage.setItem(
      "watchlist",
      JSON.stringify(savedMovies)
    );
  }
}
</script>