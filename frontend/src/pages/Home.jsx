import { useState, useEffect } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["All", "Electronics", "Footwear", "Accessories", "Bags", "Kitchen"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== "All") params.category = category;
        if (search) params.search = search;
        const { data } = await api.get("/products", { params });
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [category, search]);

  return (
    <div>
      <div className="hero">
        <h1>Welcome to ShopKart 🛒</h1>
        <p>Discover amazing products at unbeatable prices</p>
      </div>
      <div className="page">
        <div className="filters">
          <input
            className="search-input"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`filter-btn ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>Loading products...</p>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
