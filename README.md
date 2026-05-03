# ShopKart 🛒

A full-stack e-commerce web app built with **React**, **Node/Express**, and **MongoDB**.

## Features
- 🔐 JWT-based authentication (Register / Login)
- 🛍 Product listing with category filters and search
- 🛒 Persistent cart (stored in MongoDB per user)
- 📦 Order placement and order history
- 📱 Fully responsive UI

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt |
| Deployment | Vercel (frontend) + Render (backend) |

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/shopkart.git
cd shopkart
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env   # Fill in MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env   # Set VITE_API_URL
npm run dev
```

### 4. Seed the database
Open your browser and visit:
```
http://localhost:5000/api/products/seed
```

## Live Demo
- **Frontend:** https://shopkart.vercel.app
- **Backend:** https://shopkart-api.onrender.com
