<script setup lang="ts">
import { ref } from "vue";
import MovieCard from "./MovieCard.vue";

type WeatherType =
  | "sunny"
  | "rainy"
  | "cold"
  | "snowy"
  | "foggy"
  | "stormy"
  | "cloudy"
  | "hot"
  | "windy";

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
const selectedWeatherType = ref<WeatherType>("rainy");
const currentWeatherText = ref("");

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const weatherVibeGenreMap: Record<WeatherType, number[]> = {
    sunny: [35, 12, 10751],      // Comedy, Adventure, Family
    hot: [28, 12, 878],          // Action, Adventure, Sci-Fi
    rainy: [14, 16, 10751],      // Fantasy, Animation, Family
    cold: [10749, 18, 10751],    // Romance, Drama, Family
    snowy: [14, 10751, 16],      // Fantasy, Family, Animation
    foggy: [9648, 53, 27],       // Mystery, Thriller, Horror
    stormy: [53, 28, 80],        // Thriller, Action, Crime
    cloudy: [18, 35, 10749],     // Drama, Comedy, Romance
    windy: [12, 14, 28],         // Adventure, Fantasy, Action
};

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

async function getMoviesByWeather(weatherType: WeatherType) {
  const genreIds = weatherVibeGenreMap[weatherType].join(",");

  loading.value = true;
  error.value = "";

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIds}&sort_by=popularity.desc&include_adult=false&language=en-US&page=1`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Could not fetch movies by weather.");
    }

    const data = await response.json();
    movies.value = data.results;
  } catch {
    error.value = "Something went wrong while fetching weather movies.";
  } finally {
    loading.value = false;
  }
}

function suggestMoviesByWeather(weatherType: WeatherType) {
  currentWeatherText.value = `Selected weather vibe: ${weatherType}`;
  getMoviesByWeather(weatherType);
}

async function getMoviesFromCurrentLocation() {
  loading.value = true;
  error.value = "";

  try {
    // TODO: Open-Meteo API 
    const placeholderWeatherType: WeatherType = "rainy";

    currentWeatherText.value =
      "Weather API placeholder: using rainy weather vibe for now.";

    await getMoviesByWeather(placeholderWeatherType);
  } catch {
    error.value = "Could not get weather recommendations.";
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

<template>
  <section class="movie-container">
    <h1 class="page-title">MovieWeather</h1>

    <div class="description">
      Get movie recommendations based on your local weather or choose a weather type manually.
    </div>


    <div class="control-panel">
      <select v-model="selectedWeatherType">
        <option value="sunny">Sunny</option>
        <option value="rainy">Rainy</option>
        <option value="cold">Cold</option>
        <option value="snowy">Snowy</option>
        <option value="foggy">Foggy</option>
        <option value="stormy">Stormy</option>
        <option value="cloudy">Cloudy</option>
        <option value="hot">Hot</option>
        <option value="windy">Windy</option>
      </select>

      <button
        class="weather-btn"
        @click="suggestMoviesByWeather(selectedWeatherType)"
      >
        Weather Type
      </button>
    </div>

    <div class="location-panel">
      <button
        class="weather-btn"
        @click="getMoviesFromCurrentLocation"
      >
        Use My Location
      </button>
    </div>

    <p v-if="currentWeatherText">
      {{ currentWeatherText }}
    </p>

    <div class="search-section">
      <h2>Search manually</h2>

      <form class="search-form" @submit.prevent="searchMovies">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for a movie..."
        />

        <button type="submit">
          Search
        </button>
      </form>
    </div>

    <p v-if="loading">Loading movies...</p>
    <p v-if="error">{{ error }}</p>

    <div class="movie-list">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @save="saveToWatchlist"
      />
    </div>
  </section>
</template>
<style scoped>
.movie-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
}

.page-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.description {
  text-align: center;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.control-panel {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.location-panel {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.weather-btn {
  background: #008979;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  cursor: pointer;
}

.weather-btn:hover {
  background: #1f75e8;
}

.search-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.search-section h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 1rem;
}

.search-form {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.search-form input {
  width: 300px;
  padding: 0.8rem;
}

.search-form button {
  background: #008979;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .control-panel,
  .search-form {
    flex-direction: column;
    align-items: center;
  }

  .search-form input {
    width: 100%;
  }

  .movie-list {
    grid-template-columns: 1fr;
  }
}
</style>