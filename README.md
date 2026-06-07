----------------------------------------------------
MovieWeather

MovieWeather is a web application that combines real-time weather data with movie recommendations. Based on your current location and the weather outside, it suggests films that match the mood; sunny days get comedies and adventures, stormy nights get thrillers. You can also search for movies manually and save favourites to a personal watchlist.

Built with Vue 3 + TypeScript as part of a frontend development course assignment.

----------------------------------------------------
Features:

Location-based weather = fetches your GPS coordinates via the browser's Geolocation API
Live weather data = pulls current conditions from the Open-Meteo API (no API key required)
Weather-to-movie matching = maps weather types (rainy, sunny, stormy, etc.) to film genres via TMDB
Manual movie search = search for any film by title
Watchlist = save movies to a personal watchlist stored in localStorage, with the ability to remove them
Responsive design = works on mobile and desktop

----------------------------------------------------
Tech Stack
Tool
Purpose
Vue 3 (Composition API)
UI framework
TypeScript
Type safety
Vite
Dev server & bundler
Vue Router
Client-side navigation
Bootstrap 5
Responsive styling
Open-Meteo API
Weather data
TMDB API
Movie data

----------------------------------------------------
Getting Started

Prerequisites:
Node.js ^20.19.0 or >=22.12.0
A free TMDB API token from themoviedb.org

Installation:
# Clone the repository
git clone https://github.com/Tipsy-Rice/MovieWeather.git
cd MovieWeather/MovieWeather

# Install dependencies
npm install

Environment variables:
Create a .env file in the MovieWeather/ folder:
VITE_TMDB_TOKEN=your_tmdb_read_access_token_here

Run locally:
npm run dev

Build for production:
npm run build

Run unit tests:
npm run test:unit

----------------------------------------------------
Project Structure

src/
  components/
    FetchLocation.vue   # Gets GPS coordinates from the browser
    FetchWeather.vue    # Fetches weather from Open-Meteo using coords
    MovieCard.vue       # Displays a single movie with save button
    MovieSearch.vue     # Weather-based and manual movie search
  views/
    HomeView.vue        # Main page
    WatchlistView.vue   # Saved movies from localStorage
  router/
    index.ts            # Route definitions (/, /watchlist)
  stores/	              # empty, reserved for future use
  App.vue               # Root component with navbar and RouterView
  main.ts               # App entry point

----------------------------------------------------
VUE vs REACT

We chose to use Vue over React. When comparing the different frameworks and libraries, we narrowed it down to either Vue or React, and ultimately went with Vue. This was due to the advantages we felt Vue offered compared to Reactsince it's better structured for smaller projects, its documentation is considered among the best for frontend tools, and the learning curve is low which we found to be the most important factor for us, as we had other commitments alongside this project. [strapi.io/blog/vue-vs-react]

VUE vs ANGULAR
We also considered Angular, but ruled it out early on due to its steep learning curve and its focus on large-scale enterprise applications, which felt like overkill for a project of this scope.[https://dev.to/kevinwalker/vuejs-vs-angular-choose-the-right-framework-fb5]

Summary
Vue offered the right balance of structure and simplicity for a three-person team building a focused, API-driven web app. Its gentle learning curve and excellent documentation made it possible to get productive quickly while still writing clean, maintainable code.

----------------------------------------------------
APIs Used
Open-Meteo
Free, open-source weather API. No API key required. Used to fetch current temperature and weather code based on latitude and longitude.
TMDB : The Movie Database
Provides movie data including titles, genres, posters, and descriptions. Used to fetch movie recommendations by genre and to support manual title search. Requires a free API token.

----------------------------------------------------
Authors:

Karin Sandstedt
Leonard Werder
Moa Ancar


