import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Your cart is empty 🛒</h2>
          <p style={{ marginBottom: "1.5rem" }}>Add some items to get started</p>
          <Link to="/" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: "1.5rem" }}>Your Cart</h1>
      <div className="cart-grid">
        <div>
          {cart.items.map((item) => (
            <div key={item.product._id} className="cart-item">
              <img src={item.product.image} alt={item.product.name} />
              <div className="cart-item-info">
                <p className="cart-item-name">{item.product.name}</p>
                <p className="cart-item-price">₹{item.product.price.toLocaleString()}</p>
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => updateQty(item.product._id, item.quantity - 1)}>−</button>
                  <span style={{ minWidth: "24px", textAlign: "center" }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.product._id, item.quantity + 1)}>+</button>
                  <button className="btn btn-danger btn-sm" style={{ marginLeft: "auto" }}
                    onClick={() => { removeFromCart(item.product._id); toast.success("Removed from cart"); }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div key={item.product._id} className="summary-row">
              <span>{item.product.name} × {item.quantity}</span>
              <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
            onClick={() => navigate("/checkout")}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
