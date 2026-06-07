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

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function getMoviesFromCurrentLocation() {
  loading.value = true;
  error.value = "";

  try {
    const position = await getCurrentPosition();

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`
    );

    if (!weatherResponse.ok) {
      throw new Error("Could not fetch weather.");
    }

    const weatherData = await weatherResponse.json();

    const weatherCode = weatherData.current.weather_code;
    const temperature = weatherData.current.temperature_2m;
    const windSpeed = weatherData.current.wind_speed_10m;

    const weatherType = getWeatherTypeFromCode(
      weatherCode,
      temperature,
      windSpeed
    );

    currentWeatherText.value =
      `Current weather: ${weatherType} (${temperature}°C)`;

    await getMoviesByWeather(weatherType);
  } catch {
    error.value = "Could not get weather from your location.";
  } finally {
    loading.value = false;
  }
}

function getWeatherTypeFromCode(
  weatherCode: number,
  temperature: number,
  windSpeed: number
): WeatherType {
  if (temperature >= 25 && weatherCode === 0) return "hot";
  if (temperature <= 5) return "cold";
  if (windSpeed >= 35) return "windy";

  if (weatherCode === 0) return "sunny";
  if ([1, 2, 3].includes(weatherCode)) return "cloudy";
  if ([45, 48].includes(weatherCode)) return "foggy";

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    return "rainy";
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return "snowy";
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return "stormy";
  }

  return "cloudy";
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
  <section class="container-fluid bg-white min-vh-100 text-center py-5">
    <h1 class="display-2 mb-4 movie-title">MovieWeather</h1>

    <div class="bg-light p-4 mb-5 fs-5">
      Get movie recommendations based on your local weather or choose a weather type manually.
    </div>

    <div class="row justify-content-center g-3 mb-4">
      <div class="col-12 col-md-auto">
        <select
          v-model="selectedWeatherType"
          class="form-select form-select-lg"
        >
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
      </div>

      <div class="col-12 col-md-auto">
        <button
          class="btn btn-success btn-lg w-100"
          @click="suggestMoviesByWeather(selectedWeatherType)"
        >
          Weather Type
        </button>
      </div>
    </div>

    <div class="mb-5">
      <button
        class="btn btn-success btn-lg"
        @click="getMoviesFromCurrentLocation"
      >
        Use My Location
      </button>
    </div>

    <p v-if="currentWeatherText" class="fs-5">
      {{ currentWeatherText }}
    </p>

    <div class="bg-light p-4 mb-4">
      <h2 class="movie-title mb-4">Search manually</h2>

      <form
        class="row justify-content-center g-3"
        @submit.prevent="searchMovies"
      >
        <div class="col-12 col-md-5">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control form-control-lg"
            placeholder="Search for a movie..."
          />
        </div>

        <div class="col-12 col-md-auto">
          <button class="btn btn-success btn-lg w-100" type="submit">
            Search
          </button>
        </div>
      </form>
    </div>

    <p v-if="loading" class="fs-5">Loading movies...</p>
    <p v-if="error" class="text-danger fs-5">{{ error }}</p>

    <div class="row g-4 px-3">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="col-12 col-sm-6 col-lg-4 col-xl-3"
      >
        <MovieCard
          :movie="movie"
          @save="saveToWatchlist"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.movie-title {
  font-family: Georgia, serif;
}

@media (max-width: 768px) {
  .display-2 {
    font-size: 2.4rem;
  }
}

@media (max-width: 480px) {
  .display-2 {
    font-size: 2rem;
  }
}
</style>