# NeonTrade AI – Stock Market Prediction Platform

Full-stack starter kit for a market-intel dashboard featuring a React + Vite frontend, Tailwind CSS styling, and an Express + MongoDB backend.

## Tech Stack
- React 19 with Vite + TypeScript (`/client`)
- Tailwind CSS 3 configured with PostCSS
- Node.js 18+ / Express 5, Mongoose + local MongoDB for auth (`/server`)
- npm for dependency management

## Project Structure
```
client/               # React UI with Tailwind
server/               # Express API + Mongoose models
  src/
    index.ts          # Server entry point + health route
    routes/           # /api/predictions placeholder CRUD
    models/           # Prediction & User schemas
README.md             # You are here
package.json          # Root scripts for client+server dev
```

## Getting Started

### 1. Install dependencies
```bash
npm install               # installs root dev deps (concurrently)
npm install --prefix client
npm install --prefix server
```

### 2. Run the dev servers
```bash
npm run dev               # starts client (Vite) + server (nodemon) concurrently
```

- Client: http://localhost:5173
- Server: http://localhost:5000 (health check: `/api/health`, predictions: `/api/predictions`)

### 3. Individual scripts
- `npm run client` – Vite dev server only
- `npm run server` – Express API with nodemon/ts-node
- `npm --prefix client run build` – Production build for the frontend
- `npm --prefix server run build` – TypeScript compile to `server/dist`

## Local MongoDB

Auth and data use **local MongoDB**. Start MongoDB before running the server.

**macOS / Linux:**
```bash
mongod
```
With Homebrew (macOS):
```bash
brew services start mongodb-community
```

**Windows:** run `mongod` from your MongoDB install.

**Verify:** open a new terminal and run `mongosh` (or `mongo`), then:
```bash
use neontrade
show collections
```
You should see `users` after the first signup (or demo user seed).

**Test connection from project:**
```bash
cd server
npm run test:db
```
Expected: `MongoDB local connection OK ✅`

**Environment:** In `server/.env` use:
```env
MONGODB_URI="mongodb://127.0.0.1:27017/neontrade"
```
Use `127.0.0.1` instead of `localhost` if you have connection issues.

## Environment variables
- `MONGODB_URI` – MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/neontrade` for local)
- `JWT_SECRET` – required for signing login/register tokens
- `PORT` (default `3000`)
- `CLIENT_ORIGIN` (default `http://localhost:5173` for CORS)

## Authentication (Local MongoDB + Mongoose)

### APIs
- **POST /api/auth/signup** – Register: `name`, `age` (≥18), `email`, `password`. Validates age and email; hashes password with bcrypt (12 rounds); stores in MongoDB `users` collection; sets HTTP-only cookie and returns JWT + user.
- **POST /api/auth/login** – Login: `email`, `password`. Verifies with bcrypt; sets HTTP-only cookie and returns JWT + user.
- **GET /api/auth/me** – Protected: returns current user (JWT from cookie or `Authorization: Bearer`).
- **POST /api/auth/logout** – Clears auth cookie.

### Security
- Passwords hashed with bcrypt (12 salt rounds); never exposed.
- JWT stored in HTTP-only cookie (and optionally returned in body for clients that need it).
- Rate limiting on auth routes (20 requests per 15 minutes).
- Age validated on frontend and backend (≥18).
- Email format validated; duplicate email rejected on signup.
- Mongoose used for all DB access (ODM, no raw SQL).

### Frontend
- **Sign up** (`/signup`) and **Log in** (`/login`) forms with validation errors.
- On success, redirect to **Dashboard** (`/dashboard`). Auth state in React Context; session restored via `GET /api/auth/me` (cookie sent with `credentials: 'include'`).
- Navbar shows Sign up / Log in when guest, user name + Log out when authenticated.
- Protected routes (e.g. `/dashboard`) redirect to `/login` if not authenticated.

### DB connection
- Connection: `server/src/config/db.ts`. Server calls `connectDB()` before listening; DB must be reachable at startup.
- User model: `server/src/models/User.ts` (Mongoose schema: `name`, `age`, `email`, `password`, `createdAt`).
- If connection fails: ensure MongoDB is running (`mongod`), port 27017 is free, and `MONGODB_URI` in `.env` uses `127.0.0.1`.

## Next Steps
- Wire `/api/predictions` routes to actual Mongo or Neon-backed collections & guard with `requireAuth`
- Replace mock hero stats/console with live data and streaming sockets
- Harden auth (refresh tokens, password reset, email verification)



