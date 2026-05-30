<template>
  <section class="movie-container">

    <h1 class="page-title">
      MovieWeather
    </h1>

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

    <div class="search-section">
      <h2>Search manually</h2>

      <form
        class="search-form"
        @submit.prevent="searchMovies"
      >
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
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

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
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

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
      `${weatherType} (${temperature}°C, code ${weatherCode})`;

    await getMoviesByWeather(weatherType);
  } catch {
    error.value =
      "Could not get weather from your location. Try choosing a manually.";
  } finally {
    loading.value = false;
  }
}

function getWeatherTypeFromCode(
  weatherCode: number,
  temperature: number,
  windSpeed: number
): WeatherType {
  if (temperature >= 25 && weatherCode === 0) {
    return "hot";
  }

  if (temperature <= 5) {
    return "cold";
  }

  if (windSpeed >= 35) {
    return "windy";
  }

  if (weatherCode === 0) {
    return "sunny";
  }

  if ([1, 2, 3].includes(weatherCode)) {
    return "cloudy";
  }

  if ([45, 48].includes(weatherCode)) {
    return "foggy";
  }

  if (
    [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)
  ) {
    return "rainy";
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return "snowy";
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return "stormy";
  }

  if ([66, 67].includes(weatherCode)) {
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