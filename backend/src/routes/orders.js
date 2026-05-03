const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/auth");
const router = express.Router();

// POST /api/orders  — place order from cart items
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items in order" });

    const order = await Order.create({ user: req.user._id, items, totalPrice });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/mine  — get logged-in user's orders
router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
