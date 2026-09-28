const API_BASE_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.error || "Something went wrong while fetching data"
    );
  }

  return response.json();
}

export function getPopularMovies(page = 1) {
  return request(`/movies/popular?page=${page}`);
}

export function searchMovies(query, page = 1) {
  return request(
    `/movies/search?q=${encodeURIComponent(query)}&page=${page}`
  );
}

export function getGenres() {
  return request("/movies/genres");
}

export function discoverMovies(genreId, sortBy = "popularity.desc", page = 1) {
  return request(
    `/movies/discover?genre=${genreId}&sortBy=${encodeURIComponent(sortBy)}&page=${page}`,
  );
}

export function getMovieDetails(movieId) {
  return request(`/movies/${movieId}`);
}

export function getWishlist() {
  return request("/wishlist");
}

export function addToWishlist(movie) {
  return request("/wishlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });
}

export function removeFromWishlist(movieId) {
  return request(`/wishlist/${movieId}`, {
    method: "DELETE",
  });
}