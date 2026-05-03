import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/mine")
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page" style={{ textAlign: "center", color: "var(--muted)", paddingTop: "4rem" }}>Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>No orders yet 📦</h2>
          <p style={{ marginBottom: "1.5rem" }}>Start shopping to see your orders here</p>
          <Link to="/" className="btn btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  const statusClass = (s) => `order-status status-${s.toLowerCase()}`;

  return (
    <div className="page">
      <h1 style={{ marginBottom: "1.5rem" }}>My Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <div>
              <p style={{ fontWeight: 600 }}>Order #{order._id.slice(-8).toUpperCase()}</p>
              <p style={{ fontSize: ".85rem", color: "var(--muted)" }}>
                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontWeight: 700, color: "var(--primary)" }}>₹{order.totalPrice.toLocaleString()}</span>
              <span className={statusClass(order.status)}>{order.status}</span>
            </div>
          </div>
          <div className="order-items">
            {order.items.map((item, i) => (
              <div key={i} className="order-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p style={{ fontWeight: 500 }}>{item.name}</p>
                  <p style={{ fontSize: ".85rem", color: "var(--muted)" }}>Qty: {item.quantity} · ₹{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
