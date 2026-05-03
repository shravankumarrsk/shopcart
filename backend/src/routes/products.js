const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

const sampleProducts = [
  { name: "Wireless Headphones", description: "Premium noise-cancelling over-ear headphones with 30hr battery life.", price: 2999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", category: "Electronics", stock: 50 },
  { name: "Running Sneakers", description: "Lightweight and breathable running shoes for all terrains.", price: 1499, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", category: "Footwear", stock: 80 },
  { name: "Leather Wallet", description: "Slim genuine leather bifold wallet with RFID blocking.", price: 599, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400", category: "Accessories", stock: 120 },
  { name: "Mechanical Keyboard", description: "TKL mechanical keyboard with RGB backlight and blue switches.", price: 3499, image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400", category: "Electronics", stock: 30 },
  { name: "Sunglasses", description: "Polarised UV400 protection sunglasses with metal frame.", price: 799, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", category: "Accessories", stock: 60 },
  { name: "Smart Watch", description: "Fitness tracking smartwatch with heart rate monitor and GPS.", price: 4999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", category: "Electronics", stock: 25 },
  { name: "Backpack", description: "30L waterproof travel backpack with laptop compartment.", price: 1299, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", category: "Bags", stock: 70 },
  { name: "Coffee Mug", description: "Insulated stainless steel travel mug, keeps hot for 12hrs.", price: 399, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400", category: "Kitchen", stock: 200 },
];

// GET /api/products/seed  (run once to populate DB)
router.get("/seed", async (req, res) => {
  try {
    await Product.deleteMany();
    const products = await Product.insertMany(sampleProducts);
    res.json({ message: `${products.length} products seeded ✅` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
