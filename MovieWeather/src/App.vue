<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>
 
<template>
  <div>
    <nav class="navbar">
      <RouterLink to="/" class="nav-brand">MovieWeather</RouterLink>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/watchlist">My Watchlist</RouterLink>
      </div>
    </nav>
 
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>
 
<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #008979;
  color: white;
}
 
.nav-brand {
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}
 
.nav-links {
  display: flex;
  gap: 1.5rem;
}
 
.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  opacity: 0.85;
}
 
.nav-links a:hover,
.nav-links a.router-link-active {
  opacity: 1;
  text-decoration: underline;
}
 
.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}
 
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}
</style>