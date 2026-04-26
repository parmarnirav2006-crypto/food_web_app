# 🍔 QuickBite – Production-Grade Food Ordering Platform

> A full-stack MERN food delivery web application inspired by Swiggy & Zomato, built with scalability, security, and real-world architecture in mind.

---

## 🚀 Overview

QuickBite is a modern food ordering platform that enables users to browse restaurants, order food, and track orders in real-time. It features secure authentication, persistent cart, admin management, and cloud-based media handling.

---

## ✨ Key Features

### 👤 User Features
- 🔐 Secure Authentication (JWT Access + Refresh Tokens)
- 📩 Email OTP Verification (Login / Signup)
- 🍽️ Browse Restaurants & Menus
- 🔍 Search, Filter, Sort, Pagination
- 🛒 Add to Cart (Persistent DB Storage)
- 📦 Place Orders & Track Status
- 👤 User Profile Management

### 🛠️ Admin Features
- 📊 Admin Dashboard Analytics
- 🏪 Manage Restaurants & Menus
- 👥 User Management
- 📦 Order Moderation & Status Control
- ☁️ Upload Images via Cloudinary

---

## 🧑‍💻 Tech Stack

### 🎨 Frontend
- React.js (Vite)
- Tailwind CSS (Responsive + Dark Mode)
- Zustand (State Management)
- Axios (API Handling with Token Refresh)

### ⚙️ Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (Access + Refresh Tokens)
- Nodemailer (Email OTP System)
- Cloudinary (Image Uploads)

---

## 🏗️ Architecture

- RESTful API Design
- MVC Pattern (Backend)
- Monorepo Structure
- Token-based Authentication Flow
- Secure Middleware (Helmet, Rate Limiting, CORS)

---

## 📂 Project Structure
food-app/
├── client/ # React Frontend
├── server/ # Express Backend
├── images/ # Screenshots
├── docker-compose.yml
└── README.md


---

## ⚙️ Environment Setup

### Server `.env`

Create `server/.env` from `.env.example`:


NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
CLIENT_URL=http://localhost:5173

JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx


---

## 🚀 Run Locally

### 1️⃣ Install Dependencies


cd server && npm install
cd ../client && npm install


### 2️⃣ Start Backend


cd server
npm run dev


### 3️⃣ Start Frontend


cd client
npm run dev


👉 Frontend: http://localhost:5173  
👉 Backend: http://localhost:5000  

---

## 🐳 Docker Setup


docker compose up --build


---

## 🔗 API Endpoints (Core)

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login/request-otp`
- POST `/api/auth/verify-otp`
- POST `/api/auth/refresh`

### Restaurants
- GET `/api/restaurants`
- POST `/api/restaurants`

### Cart
- GET `/api/cart`
- POST `/api/cart`

### Orders
- POST `/api/orders`
- GET `/api/orders`

---

## 📸 Screenshots

> Add your UI screenshots here








---

## 🔐 Security Features

- JWT Token Rotation (Access + Refresh)
- HTTP Security Headers (Helmet)
- Rate Limiting (Brute-force Protection)
- Secure CORS Configuration
- Environment-based secrets

---

## 🚧 Future Enhancements

- 💳 Online Payments (Stripe / Razorpay)
- 📍 Live Order Tracking (Maps)
- 🔔 Push Notifications
- 📱 Mobile App (React Native)

---

## 🌐 Deployment (Coming Soon)

- Frontend → Vercel  
- Backend → Render  

---

## 👨‍💻 Author

**Nirav Parmar**  
- GitHub: https://github.com/parmarnirav2006-crypto  

---

## ⭐ Support

If you like this project:
- ⭐ Star this repo
- 🍴 Fork it
- 📢 Share it

---

## 📜 License

This project is licensed under the MIT License.
