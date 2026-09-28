const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../services/wishlistService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const wishlist = await getWishlist();

    res.json({
      results: wishlist,
    });
  } catch (error) {
    console.error("Failed to fetch wishlist:");
    console.error("Message:", error.message);

    res.status(500).json({
      error: "Failed to fetch wishlist",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { movieId, title, posterUrl, releaseDate, rating } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({
        error: "movieId and title are required",
      });
    }

    const movie = await addToWishlist({
      movieId,
      title,
      posterUrl,
      releaseDate,
      rating,
    });

    if (!movie) {
      return res.status(409).json({
        error: "Movie is already in the wishlist",
      });
    }

    res.status(201).json(movie);
  } catch (error) {
    console.error("Failed to add movie to wishlist:");
    console.error("Message:", error.message);

    res.status(500).json({
      error: "Failed to add movie to wishlist",
    });
  }
});

router.delete("/:movieId", async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId) || movieId <= 0) {
      return res.status(400).json({
        error: "Invalid movie ID",
      });
    }

    const movie = await removeFromWishlist(movieId);

    if (!movie) {
      return res.status(404).json({
        error: "Movie not found in wishlist",
      });
    }

    res.json({
      message: "Movie removed from wishlist",
      movieId: movie.movieId,
    });
  } catch (error) {
    console.error("Failed to remove movie from wishlist:");
    console.error("Message:", error.message);

    res.status(500).json({
      error: "Failed to remove movie from wishlist",
    });
  }
});

module.exports = router;