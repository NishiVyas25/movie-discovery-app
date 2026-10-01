import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  function goHome() {
    if (location.pathname === "/") {
      window.location.href = "/";
    }
  }
  return (
    <nav className="navbar">
      <Link
        to="/"
        className="navbar-brand"
        onClick={goHome}
      >
        Movie Discovery
      </Link>

      <div className="navbar-links">
        <Link
          to="/"
          onClick={goHome}
        >
          Home
        </Link>
        <Link to="/wishlist">Wishlist</Link>
      </div>
    </nav>
  );
}

export default Navbar;