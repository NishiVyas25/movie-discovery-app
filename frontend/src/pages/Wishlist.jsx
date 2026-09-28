import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist } from "../api/movieApi";

function Wishlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWishlist() {
      try {
        const data = await getWishlist();
        setMovies(data.results || []);
      } catch (err) {
        setError("Unable to load your wishlist.");
      } finally {
        setLoading(false);
      }
    }

    loadWishlist();
  }, []);

  if (loading) {
    return <p>Loading wishlist...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="wishlist-page">
      <h1>My Wishlist</h1>

      {movies.length === 0 ? (
        <p className="empty-wishlist">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {movies.map((movie) => (
            <div className="wishlist-card" key={movie.movieId}>
              <Link to={`/movie/${movie.movieId}`}>
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  width="200"
                />
                <h2>{movie.title}</h2>
              </Link>

              <div className="wishlist-meta">
                <p>
                  <strong>Release date: </strong>{" "}
                  {movie.releaseDate}
                </p>
                <p>
                  <strong>Rating: </strong>{" "}
                  {movie.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;