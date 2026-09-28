const axios = require("axios");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const tmbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000,
});

function formatMovie(movie) {
    return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterUrl: movie.poster_path
            ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
            : null,
        backdropUrl: movie.backdrop_path
            ? `${TMDB_IMAGE_BASE_URL}/w280${movie.backdrop_path}`
            : null,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        voteCount: movie.vote_count,
        genreIds: movie.genre_ids || [],
    };
}

async function getPopularMovies(page = 1) {
  const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
    params: {
      api_key: process.env.TMDB_API_KEY,
      language: "en-US",
      page,
    },
  });

  return {
    page: response.data.page,
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
    results: response.data.results.map(formatMovie),
  };
}

async function searchMovies(query, page = 1) {
  const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: {
      api_key: process.env.TMDB_API_KEY,
      language: "en-US",
      query,
      page,
      include_adult: false,
    },
  });

  return {
    page: response.data.page,
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
    results: response.data.results.map(formatMovie),
  };
}

async function getMovieDetails(movieId) {
    const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}`,
        {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: "en-us",
            },
        }
    );

    const movie = response.data;

    return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterUrl: movie.poster_path
            ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
            : null,
        backdropUrl: movie.backdrop_path
            ? `${TMDB_IMAGE_BASE_URL}/w1280${movie.backdrop_path}`
            : null,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        voteCount: movie.vote_count,
        runtime: movie.runtime,
        genres: movie.genres || [],
        originalLanguage: movie.original_language,
        tagline: movie.tagline,
    };
}

async function getGenres() {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: {
            api_key: process.env.TMDB_API_KEY,
            language: "en-us",
        },
    });

    return {
        genres: response.data.genres,
    };
}

async function discoverMovies(genreId, sortBy = "popularity.desc", page = 1) {
  const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
    params: {
      api_key: process.env.TMDB_API_KEY,
      language: "en-US",
      with_genres: genreId,
      sort_by: sortBy,
      page,
      include_adult: false,
    },
  });

  return {
    page: response.data.page,
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
    results: response.data.results.map(formatMovie),
  };
}

module.exports = {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
  discoverMovies,
};