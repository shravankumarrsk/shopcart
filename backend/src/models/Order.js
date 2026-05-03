const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name:     String,
      price:    Number,
      quantity: Number,
      image:    String,
    },
  ],
  totalPrice: { type: Number, required: true },
  status:     { type: String, default: "Processing", enum: ["Processing", "Shipped", "Delivered"] },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
