const express = require("express");

const movieService = require("../services/movieService");

const router = express.Router();

router.get("/popular", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const movies = await movieService.getPopularMovies(page);

    res.json(movies);
  } catch (error) {
    console.error("TMDB request failed:", error.message);

    res.status(500).json({
      error: "Failed to fetch movies",
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const page = Number(req.query.page) || 1;

    if (!query) {
      return res.status(400).json({
        error: "Search query is required",
      });
    }

    const movie = await movieService.searchMovies(query, page);
    res.json(movie);
  } catch (error) {
    console.error("TMDB search request failed:");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);

    res.status(500).json({
      error: "Failed to search movies",
    });
  }
});


router.get("/genres", async (req, res) => {
  try {
    const genres = await movieService.getGenres();

    res.json(genres);
  } catch (error) {
    console.error("TMDB genres request failed:");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);

    res.status(500).json({
      error: "Failed to fetch genres",
    });
  }
});

router.get("/discover", async (req, res) => {
  try {
    const genreId = req.query.genre;
    const sortBy = req.query.sortBy || "popularity.desc"
    const page = Number(req.query.page) || 1;

    if (!genreId) {
      return res.status(400).json({
        error: "Genre is required",
      });
    }

    const movies = await movieService.discoverMovies(genreId, sortBy, page);

    res.json(movies);
  } catch (error) {
    console.error("TMDB discover request failed:");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);

    res.status(500).json({
      error: "Failed to discover movies",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movieId = Number(req.params.id);

    if (!Number.isInteger(movieId) || movieId <= 0) {
      return res.status(400).json({
        error: "Invalid movie ID",
      });
    }

    const movies = await movieService.getMovieDetails(movieId);

    res.json(movies);
  } catch (error) {
    console.error("TMDB search details request failed:");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);

    if (error.response?.status === 404) {
        return res.status(404).json({
            error: "Movie not found",
        });
    }

    res.status(500).json({
      error: "Failed to fetch movies details",
    });
  }
});

module.exports = router;