import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WatchlistView from '../views/WatchlistView.vue'
 
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: WatchlistView,
    },
  ],
})
 
export default router
 