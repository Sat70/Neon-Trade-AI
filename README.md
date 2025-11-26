# NeonTrade AI – Stock Market Prediction Platform

Full-stack starter kit for a market-intel dashboard featuring a React + Vite frontend, Tailwind CSS styling, and an Express + MongoDB backend.

## Tech Stack
- React 19 with Vite + TypeScript (`/client`)
- Tailwind CSS 3 configured with PostCSS
- Node.js 18+ / Express 5, Prisma + Neon PostgreSQL for auth, Mongoose for other models (`/server`)
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

## Environment variables
- `PORT` (default `5000`)
- `CLIENT_ORIGIN` (default `http://localhost:5173` for CORS)
- `MONGODB_URI` (Mongo connection string; optional – used for non-auth Mongo features)
- `JWT_SECRET` (required for signing login/register tokens)
- `DATABASE_URL` (Neon PostgreSQL connection string used by Prisma)

## Auth Flow Overview
- **Server**: `/api/auth/register` and `/api/auth/login` hash passwords with `bcryptjs`, store users in Neon PostgreSQL via Prisma, and return JWTs signed with `JWT_SECRET`. `requireAuth` middleware validates `Authorization: Bearer <token>` for future protected routes.
- **Client**: `LoginPage` and `RegisterPage` call the endpoints, persist the token/user profile in `localStorage`, and hydrate the global `AuthContext`.
- **UI Guards**: Navbar switches between Login/Register buttons and user avatar + Logout. Hero metrics and signal console stay hidden until `isAuthenticated` is true, showing CTA links otherwise.

## Neon / Prisma Notes
- Prisma schema for Neon lives in `server/prisma/schema.prisma` with a `User` model matching auth fields.
- Set `DATABASE_URL` in `server/.env` using the Neon dashboard connection string, for example:
  - `postgresql://<USER>:<PASSWORD>@<HOST>/<DB_NAME>?sslmode=require`
- After updating the schema, run `npx prisma migrate dev --name <migration_name>` from the `server` folder to sync the Neon database.

## Next Steps
- Wire `/api/predictions` routes to actual Mongo or Neon-backed collections & guard with `requireAuth`
- Replace mock hero stats/console with live data and streaming sockets
- Harden auth (refresh tokens, password reset, email verification)



