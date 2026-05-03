import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!user) { navigate("/login"); return; }
    setAdding(true);
    try {
      await addToCart(product._id);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: ".75rem" }}>
          {product.description.substring(0, 70)}...
        </p>
        <p className="product-price">₹{product.price.toLocaleString()}</p>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleAdd} disabled={adding}>
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
