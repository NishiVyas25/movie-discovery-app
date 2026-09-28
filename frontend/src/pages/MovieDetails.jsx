import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getMovieDetails,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../api/movieApi";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    async function loadMovie() {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  useEffect(() => {
    async function checkWishlist() {
        try {
            const data = await getWishlist();

            const exists = data.results.some(
                (item) => item.movieId === Number(id)
            );

            setInWishlist(exists);
        } catch (err) {
            console.error("Failed to check wishlist:", err);
        }
    }

    checkWishlist();
  }, [id]);

  async function handleWishlist() {
    setWishlistLoading(true);

    try {
        if (inWishlist) {
            await removeFromWishlist(Number(id));
            setInWishlist(false);
        } else {
        await addToWishlist({
            movieId: movie.id,
            title: movie.title,
            posterUrl: movie.posterUrl,
            releaseDate: movie.releaseDate,
            rating: movie.rating,
        });

        setInWishlist(true);
        }
    } catch (err) {
        setError(err.message);
    } finally {
        setWishlistLoading(false);
    }
}

  if (loading) {
    return <p>Loading movie details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!movie) {
    return <p>Movie not found.</p>;
  }

  return (
    <main className="movie-details">
      <Link to="/" className="back-link">
        ← Back to movies
      </Link>

      <div className="movie-details-container">
        <div className="movie-details-poster">
          {movie.posterUrl && (
            <img
              src={movie.posterUrl}
              alt={movie.title}
            />
          )}
        </div>

        <div className="movie-details-content">
          <h1>{movie.title}</h1>

          {movie.tagline && (
            <p className="movie-tagline">
              <em>{movie.tagline}</em>
            </p>
          )}

          <div className="movie-info">
            <p>
              <strong>Rating:</strong> {movie.rating ?? "N/A"}
            </p>

            <p>
              <strong>Release date:</strong>{" "}
              {movie.releaseDate || "Unknown"}
            </p>

            <p>
              <strong>Runtime:</strong>{" "}
              {movie.runtime ? `${movie.runtime} minutes` : "Unknown"}
            </p>

            {movie.genres?.length > 0 && (
              <p>
                <strong>Genres:</strong>{" "}
                {movie.genres.map((genre) => genre.name).join(", ")}
              </p>
            )}
          </div>

          <button
            className="wishlist-button"
            onClick={handleWishlist}
            disabled={wishlistLoading}>
            {wishlistLoading
                ? "Updating..."
                : inWishlist
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
          </button>

          <section className="overview-section">
            <h2>Overview</h2>
            <p>
              {movie.overview || "No overview available."}
            </p>
          </section>
        </div>
      </div>  
    </main>
  );
}

export default MovieDetails;