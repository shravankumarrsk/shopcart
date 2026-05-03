import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-logo">🛒 ShopKart</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Shop</Link>
          {user ? (
            <>
              <Link to="/orders" className="nav-link">Orders</Link>
              <Link to="/cart" className="nav-link cart-badge">
                🛍 Cart
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>
              <span className="nav-link" style={{ color: "var(--text)" }}>Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
