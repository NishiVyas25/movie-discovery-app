import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-poster-link">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="movie-poster"
          />
        ) : (
          <div className="movie-poster movie-poster-placeholder">
            No poster
          </div>
        )}
      </Link>

      <div className="movie-card-content">
        <h2 className="movie-title">
          <Link to={`/movie/${movie.id}`}>
            {movie.title}
          </Link>
        </h2>

        <div className="movie-meta">
          <span>
            {movie.releaseDate || "Release date unavailable"}
          </span>

          <span>
            Rating: {movie.rating ?? "N/A"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;