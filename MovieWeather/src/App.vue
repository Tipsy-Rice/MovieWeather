<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-md" style="background-color: #008979;">
      <div class="container-fluid px-4">
        <RouterLink to="/" class="navbar-brand text-white fw-bold fs-4">MovieWeather</RouterLink>
        <div class="d-flex gap-4">
          <RouterLink to="/" class="text-white text-decoration-none">Home</RouterLink>
          <RouterLink to="/watchlist" class="text-white text-decoration-none">My Watchlist</RouterLink>
        </div>
      </div>
    </nav>
    <main class="container-fluid px-4 py-4">
      <RouterView />
    </main>
  </div>
</template>