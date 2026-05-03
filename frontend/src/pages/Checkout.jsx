import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const CARD_TYPES = {
  "4": { name: "Visa", color: "#1a1f71", logo: "💳" },
  "5": { name: "Mastercard", color: "#eb001b", logo: "💳" },
  "3": { name: "Amex", color: "#007bc1", logo: "💳" },
};

function getCardType(number) {
  return CARD_TYPES[number[0]] || { name: "Card", color: "#6366f1", logo: "💳" };
}

function formatCardNumber(value) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export default function Checkout() {
  const { cart, cartTotal, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState("form"); // form | processing | success | failed
  const [form, setForm] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [flipped, setFlipped] = useState(false);

  const cardType = getCardType(form.number.replace(/\s/g, ""));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    const digits = form.number.replace(/\s/g, "");
    if (digits.length < 16) e.number = "Enter a valid 16-digit card number";
    if (form.expiry.length < 5) e.expiry = "Enter a valid expiry date";
    else {
      const [mm] = form.expiry.split("/");
      if (parseInt(mm) > 12 || parseInt(mm) < 1) e.expiry = "Invalid month";
    }
    if (form.cvv.length < 3) e.cvv = "Enter a valid CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setStep("processing");

    // Simulate payment processing delay
    await new Promise((res) => setTimeout(res, 2500));

    // Simulate 90% success rate
    const success = Math.random() > 0.1;

    if (success) {
      try {
        const items = cart.items.map((i) => ({
          product: i.product._id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
        }));
        await api.post("/orders", { items, totalPrice: cartTotal });
        for (const item of cart.items) await removeFromCart(item.product._id);
        clearCart();
        setStep("success");
      } catch {
        setStep("failed");
      }
    } else {
      setStep("failed");
    }
  };

  if (step === "processing") {
    return (
      <div style={styles.centerPage}>
        <div style={styles.processingCard}>
          <div style={styles.spinner} />
          <h2 style={{ marginTop: "1.5rem", marginBottom: ".5rem" }}>Processing Payment</h2>
          <p style={{ color: "var(--muted)" }}>Please wait, do not close this page...</p>
          <p style={{ marginTop: "1rem", fontWeight: 600, color: "var(--primary)" }}>
            ₹{cartTotal.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div style={styles.centerPage}>
        <div style={styles.resultCard}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={{ margin: "1rem 0 .5rem" }}>Payment Successful!</h2>
          <p style={{ color: "var(--muted)", marginBottom: ".5rem" }}>
            Your order has been placed successfully.
          </p>
          <p style={{ fontWeight: 700, fontSize: "1.3rem", color: "var(--primary)", marginBottom: "1.5rem" }}>
            ₹{cartTotal.toLocaleString()} paid
          </p>
          <p style={{ fontSize: ".82rem", color: "var(--muted)", marginBottom: "1.5rem", background: "#f1f5f9", padding: ".75rem", borderRadius: "8px" }}>
            Transaction ID: TXN{Date.now().toString().slice(-10).toUpperCase()}
          </p>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}
            onClick={() => navigate("/orders")}>
            View My Orders →
          </button>
        </div>
      </div>
    );
  }

  if (step === "failed") {
    return (
      <div style={styles.centerPage}>
        <div style={styles.resultCard}>
          <div style={styles.failIcon}>❌</div>
          <h2 style={{ margin: "1rem 0 .5rem" }}>Payment Failed</h2>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
            Your payment could not be processed. Please try again.
          </p>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: ".75rem" }}
            onClick={() => setStep("form")}>
            Try Again
          </button>
          <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}
            onClick={() => navigate("/cart")}>
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={{ marginBottom: "1.5rem" }}>Checkout</h1>
      <div style={styles.grid}>
        {/* Left — Card form */}
        <div>
          {/* Visual card */}
          <div
            style={{ ...styles.card, background: `linear-gradient(135deg, ${cardType.color}, #6366f1)` }}
            onClick={() => setFlipped(!flipped)}
          >
            {!flipped ? (
              <>
                <div style={styles.cardChip}>▮▯</div>
                <div style={styles.cardNumber}>
                  {form.number || "•••• •••• •••• ••••"}
                </div>
                <div style={styles.cardBottom}>
                  <div>
                    <div style={styles.cardLabel}>Card Holder</div>
                    <div style={styles.cardValue}>{form.name || "YOUR NAME"}</div>
                  </div>
                  <div>
                    <div style={styles.cardLabel}>Expires</div>
                    <div style={styles.cardValue}>{form.expiry || "MM/YY"}</div>
                  </div>
                  <div style={{ fontSize: "1.4rem" }}>{cardType.logo}</div>
                </div>
              </>
            ) : (
              <div style={styles.cardBack}>
                <div style={styles.magStripe} />
                <div style={styles.cvvBox}>
                  <span style={styles.cardLabel}>CVV</span>
                  <span style={styles.cvvValue}>{form.cvv || "•••"}</span>
                </div>
              </div>
            )}
          </div>
          <p style={{ fontSize: ".78rem", color: "var(--muted)", textAlign: "center", marginBottom: "1.5rem" }}>
            Click card to see CVV side
          </p>

          {/* Form */}
          <div style={styles.formCard}>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input type="text" placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })} />
              {errors.name && <p style={styles.error}>{errors.name}</p>}
            </div>
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: formatCardNumber(e.target.value) })} />
              {errors.number && <p style={styles.error}>{errors.number}</p>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY"
                  value={form.expiry}
                  onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })} />
                {errors.expiry && <p style={styles.error}>{errors.expiry}</p>}
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="password" placeholder="•••"
                  maxLength={4}
                  value={form.cvv}
                  onFocus={() => setFlipped(true)}
                  onBlur={() => setFlipped(false)}
                  onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "") })} />
                {errors.cvv && <p style={styles.error}>{errors.cvv}</p>}
              </div>
            </div>

            <div style={styles.simNotice}>
              🧪 <strong>Simulation Mode</strong> — Use any fake card details. Try: <code>4111 1111 1111 1111</code>
            </div>
          </div>
        </div>

        {/* Right — Order summary */}
        <div>
          <div className="order-summary">
            <h3 style={{ marginBottom: "1rem" }}>Order Summary</h3>
            {cart.items.map((item) => (
              <div key={item.product._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: ".75rem", fontSize: ".9rem" }}>
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: ".75rem", marginTop: ".5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".5rem", fontSize: ".9rem" }}>
                <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".5rem", fontSize: ".9rem", color: "var(--success)" }}>
                <span>Delivery</span><span>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem", marginTop: ".5rem" }}>
                <span>Total</span><span style={{ color: "var(--primary)" }}>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <button className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "1.25rem", padding: ".8rem" }}
              onClick={handlePay}>
              🔒 Pay ₹{cartTotal.toLocaleString()}
            </button>
            <p style={{ fontSize: ".78rem", color: "var(--muted)", textAlign: "center", marginTop: ".75rem" }}>
              🔐 Secured with 256-bit SSL encryption (simulated)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "2rem 1.5rem", maxWidth: "1000px", margin: "0 auto" },
  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" },
  card: { borderRadius: "16px", padding: "1.5rem", color: "#fff", height: "200px", display: "flex",
    flexDirection: "column", justifyContent: "space-between", cursor: "pointer",
    boxShadow: "0 20px 40px rgba(0,0,0,.2)", marginBottom: ".5rem", userSelect: "none" },
  cardChip: { fontSize: "1.2rem", letterSpacing: "2px" },
  cardNumber: { fontSize: "1.25rem", letterSpacing: "4px", fontFamily: "monospace", textAlign: "center" },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
  cardLabel: { fontSize: ".65rem", opacity: .7, textTransform: "uppercase", marginBottom: ".2rem" },
  cardValue: { fontSize: ".85rem", fontWeight: 600, fontFamily: "monospace" },
  cardBack: { display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" },
  magStripe: { height: "40px", background: "rgba(0,0,0,.6)", margin: "0 -1.5rem", marginBottom: "1rem" },
  cvvBox: { background: "#fff", color: "#333", borderRadius: "4px", padding: ".5rem 1rem",
    display: "flex", justifyContent: "space-between", alignItems: "center" },
  cvvValue: { fontFamily: "monospace", letterSpacing: "4px", fontSize: "1rem" },
  formCard: { background: "var(--card)", borderRadius: "var(--radius)", padding: "1.5rem",
    boxShadow: "var(--shadow)" },
  simNotice: { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px",
    padding: ".75rem 1rem", fontSize: ".82rem", color: "#1d4ed8", marginTop: "1rem" },
  error: { color: "var(--danger)", fontSize: ".78rem", marginTop: ".25rem" },
  centerPage: { display: "flex", justifyContent: "center", alignItems: "center",
    minHeight: "calc(100vh - 65px)", padding: "2rem" },
  processingCard: { background: "var(--card)", borderRadius: "var(--radius)", padding: "3rem 2rem",
    textAlign: "center", boxShadow: "var(--shadow)", maxWidth: "360px", width: "100%" },
  resultCard: { background: "var(--card)", borderRadius: "var(--radius)", padding: "2.5rem 2rem",
    textAlign: "center", boxShadow: "var(--shadow)", maxWidth: "400px", width: "100%" },
  successIcon: { fontSize: "3.5rem" },
  failIcon: { fontSize: "3.5rem" },
  spinner: {
    width: "56px", height: "56px", border: "5px solid #e2e8f0",
    borderTop: "5px solid var(--primary)", borderRadius: "50%",
    animation: "spin 1s linear infinite", margin: "0 auto",
  },
};

// Inject spinner animation
const styleTag = document.createElement("style");
styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);
