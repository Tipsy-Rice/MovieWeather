<script setup lang="ts">
import { ref } from "vue";
import FetchLocation from "./components/FetchLocation.vue";
import FetchWeather from "./components/FetchWeather.vue";
import MovieSearch from "./components/MovieSearch.vue";

type Coords = {
  latitude: number;
  longitude: number;
};

const coords = ref<Coords | null>(null);
const locationRef = ref<InstanceType<typeof FetchLocation> | null>(null);

function handleLocated(newCoords: Coords) {
  coords.value = newCoords;
}

function requestLocation() {
  locationRef.value?.getLocation();
}
</script>

<template>
  <div>
    <FetchLocation
      ref="locationRef"
      @located="handleLocated"
    />

    <FetchWeather
      :coords="coords"
      @request-location="requestLocation"
    />

    <MovieSearch />
  </div>
</template>