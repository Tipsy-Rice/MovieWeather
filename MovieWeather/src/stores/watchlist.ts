export const useWatchlistStore = defineStore('watchlist', () => {
  const watchlist = ref([])

  const addMovie = (movie) => {
    watchlist.value.push(movie)
  }

  const removeMovie = (movie) => {
    watchlist.value = watchlist.value.filter((m) => m.id !== movie.id)
  }

  return {
    watchlist,
    addMovie,
    removeMovie
  }
})

