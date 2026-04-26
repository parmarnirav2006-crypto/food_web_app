# QuickBite Food Ordering Web App

QuickBite is a production-style MERN food ordering platform inspired by Swiggy/Zomato. It includes React + Vite + Tailwind on the frontend, Express + MongoDB on the backend, JWT access/refresh token authentication, email OTP verification, Cloudinary uploads, server-side cart persistence, order tracking, and an admin dashboard.

## Monorepo structure

- `client/` – React + Vite frontend with Zustand state management
- `server/` – Node.js + Express API with MongoDB, OTP auth, and admin APIs
- `docker-compose.yml` – MongoDB + app stack definition

## Features

### Frontend
- React functional components with hooks
- Tailwind CSS responsive design with dark mode support
- Zustand stores for auth, cart, and restaurants
- Axios instance with automatic access-token refresh
- Protected routes and admin-only screens
- Search, filter, sort, and pagination for restaurants

### Backend
- Express MVC folder structure
- MongoDB schemas with indexes
- JWT access token (15m) and refresh token (7d)
- Email OTP registration/login flow using Nodemailer
- Helmet, CORS, morgan logging, auth rate limiting
- Cloudinary image upload support
- Persistent DB cart, order placement, and status tracking
- Admin dashboard stats and moderation endpoints

## Required environment variables

### Server `.env`
Copy `server/.env.example` to `server/.env` and configure:

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `CLIENT_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`

### Client `.env`
Copy `client/.env.example` to `client/.env`:

- `VITE_API_URL`
- `VITE_API_PROXY`

## Local development

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Run MongoDB

Use local MongoDB or Docker:

```bash
docker compose up mongo -d
```

### 3. Start the backend

```bash
cd server
npm run dev
```

### 4. Start the frontend

```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Docker workflow

After creating `server/.env`, run:

```bash
docker compose up --build
```

## Core API endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/resend-otp`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `POST /api/auth/logout`

### Restaurants
- `GET /api/restaurants`
- `GET /api/restaurants/:identifier`
- `POST /api/restaurants`
- `PUT /api/restaurants/:id`
- `DELETE /api/restaurants/:id`
- `POST /api/restaurants/:restaurantId/menu`

### Cart
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:itemId`
- `DELETE /api/cart/:itemId`
- `DELETE /api/cart`

### Orders
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`

### Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/restaurants`
- `PATCH /api/admin/restaurants/:id/review`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`

## Production hardening checklist

- Replace placeholder JWT secrets with long random values
- Use SMTP app passwords, not account passwords
- Configure Cloudinary folder permissions and moderation
- Restrict CORS origins in production
- Place backend behind HTTPS reverse proxy
- Add centralized logging service and uptime monitoring
- Seed an admin account directly in MongoDB or via a protected seed script

## Notes

- The login flow is password-first plus email OTP verification for stronger auth.
- Cart persistence is database-backed and synced across sessions/devices.
- Admin dashboard endpoints assume an existing admin user in the `users` collection.
- Cloudinary uploads are wired via `/api/upload` for admin-managed assets.
