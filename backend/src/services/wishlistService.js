const pool = require("../config/database");

async function getWishlist() {
  const result = await pool.query(
    `SELECT
      movie_id AS "movieId",
      title,
      poster_url AS "posterUrl",
      release_date AS "releaseDate",
      rating,
      added_at AS "addedAt"
    FROM wishlist
    ORDER BY added_at DESC`
  );

  return result.rows;
}

async function addToWishlist(movie) {
  const result = await pool.query(
    `INSERT INTO wishlist (
      movie_id,
      title,
      poster_url,
      release_date,
      rating
    )
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (movie_id)
    DO NOTHING
    RETURNING
      movie_id AS "movieId",
      title,
      poster_url AS "posterUrl",
      release_date AS "releaseDate",
      rating,
      added_at AS "addedAt"`,
    [
      movie.movieId,
      movie.title,
      movie.posterUrl,
      movie.releaseDate || null,
      movie.rating || null,
    ]
  );

  return result.rows[0] || null;
}

async function removeFromWishlist(movieId) {
  const result = await pool.query(
    `DELETE FROM wishlist
     WHERE movie_id = $1
     RETURNING movie_id AS "movieId"`,
    [movieId]
  );

  return result.rows[0] || null;
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};