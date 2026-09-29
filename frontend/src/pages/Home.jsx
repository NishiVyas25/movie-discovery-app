import { useEffect, useState } from "react";
import {
  getPopularMovies,
  searchMovies,
  getGenres,
  discoverMovies,
} from "../api/movieApi";
import MovieCard from "../components/MovieCard";

function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadGenres() {
      try {
        const data = await getGenres();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    }

    loadGenres();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      async function loadMovies() {
        setLoading(true);
        setError("");
        setPage(1);

        try {
          let data;

          if (query.trim()) {
            data = await searchMovies(query.trim(), 1);
          } else if (selectedGenre) {
            data = await discoverMovies(
              selectedGenre,
              sortBy,
              1
            );
          } else {
            data = await getPopularMovies(1);
          }

          setMovies(data.results || []);
          setHasMore(data.page < data.totalPages);
        } catch (err) {
          setError(err.message);
          setMovies([]);
          setHasMore(false);
        } finally {
          setLoading(false);
        }
      }

      loadMovies();
    }, 400);

    return () => {
      clearTimeout(timer);
    }
  }, [query, selectedGenre, sortBy]);

  function handleGenreChange(event) {
    setSelectedGenre(event.target.value);
  }

  function handleSortChange(event) {
    setSortBy(event.target.value);
  }

  async function loadMoreMovies() {
    if (loadingMore || !hasMore) {
      return;
    }
    const nextPage = page + 1;
    setLoadingMore(true);
    setError("");

    try {
      let data;

      if (query.trim()) {
        data = await searchMovies(query.trim(), nextPage);
      } else if (selectedGenre) {
        data = await discoverMovies(
          selectedGenre,
          sortBy,
          nextPage,
        );
      } else {
        data = await getPopularMovies(nextPage);
      }

      setMovies((currentMovies) => [
        ...currentMovies,
        ...(data.results || []),
      ]);

      setPage(nextPage);
      setHasMore(data.page < data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <main className="home-page">
      <h1>Movie Discovery</h1>

      <div className="search-section">
        <div className="search-box">
          <input
            className="search-input"
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

        </div>
        
        <div className="filter-controls">
          <select
            className="filter-select"
            value={selectedGenre}
            onChange={handleGenreChange}
            disabled={Boolean(query.trim())}
          >
            <option value="">All Genres</option>

            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={handleSortChange}
            disabled={Boolean(query.trim())}
          >
            <option value="popularity.desc">
              Most Popular
            </option>
            <option value="vote_average.desc">
              Highest Rated
            </option>
            <option value="release_date.desc">
              Newest
            </option>
            <option value="release_date.asc">
              Oldest
            </option>
          </select>
        </div>
      </div>
      
      <h2>
        {query.trim()
          ? `Search results for "${query}"`
          : selectedGenre
            ? "Discover Movies"
            : "Popular Movies"}
      </h2>

      {loading && <p>Loading movies...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p>No movies found.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {hasMore && (
            <button
              className="load-more-button"
              onClick={loadMoreMovies}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading......" : "Load More Movie"}
            </button>
          )}
        </>
      )}
    </main>
  );
}

export default Home;