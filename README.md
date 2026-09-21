# CoWork Hub — Coworking Space Booking System

A full-stack MERN application for discovering coworking desks and meeting rooms, checking availability, submitting bookings, and managing bookings through an admin workflow.

## What is included

- Member registration, login, logout, JWT access-token refresh, and protected routes.
- Public space discovery with search, type, capacity, date filters, and pagination.
- Daily availability view for 09:00–18:00 slots.
- Booking conflict prevention, including overlap checks, concurrent-request protection, and future-date validation.
- Member booking history and cancellation.
- Admin-only space management, booking list/filtering, approval/rejection queue, and maintenance blackout windows.
- Responsive React UI, Express validation/error handling, MongoDB models/indexes, seed data, Docker support, and backend tests.

## Prerequisites

- Node.js 20+ and npm
- MongoDB 7+ running locally, or Docker Desktop

## Run locally

1. Install server dependencies and create its environment file.

   ```powershell
   cd server
   npm install
   Copy-Item .env.example .env
   ```

2. Update `server/.env` with secure JWT secrets. Ensure `MONGODB_URI` points to your running MongoDB instance.

3. Install and run the React client.

   ```powershell
   cd ..\client
   npm install
   Copy-Item .env.example .env
   ```

4. Use two terminals to start the application.

   ```powershell
   cd server
   npm run dev
   ```

   ```powershell
   cd client
   npm run dev
   ```

Open `http://localhost:5173`. The client proxies `/api` requests to `http://localhost:5000` in development.

## Seed demo data

With MongoDB running and `server/.env` configured:

```powershell
cd server
npm run seed
```

### Start MongoDB with Docker only

If you are running the server with `npm run dev` on your machine and do not have MongoDB installed as a Windows service, start the database from the project root first:

```powershell
docker compose up -d mongodb
```

This exposes MongoDB at `mongodb://localhost:27017`, which matches the default `MONGODB_URI` in `server/.env.example`.

Demo accounts (development only):

- Admin: `admin@cowork.local` / `Admin@123`
- Member: `alice@cowork.local` / `Member@123`

## Verification

```powershell
cd server
npm test

cd ..\client
npm run build
```

The backend tests cover authentication, validation of duplicate users, booking creation, time overlaps, adjacent slots, past bookings, concurrent booking requests, admin authorization, and approval behavior.

## Docker

From the project root:

```powershell
docker compose up --build
```

Open `http://localhost:8080`. For a real deployment, replace the JWT secret values in `docker-compose.yml` with securely managed values before starting the services.

## API overview

| Area | Endpoints |
| --- | --- |
| Authentication | `POST /api/auth/register`, `/login`, `/refresh`, `/logout` |
| Spaces | `GET /api/spaces`, `GET /api/spaces/:id`, `GET /api/spaces/:id/availability` |
| Member bookings | `POST /api/bookings`, `GET /api/bookings/my`, `GET /api/bookings/:id`, `PATCH /api/bookings/:id/cancel` |
| Admin | Space CRUD under `/api/spaces`; booking review and maintenance endpoints under `/api/admin` |

All protected endpoints use `Authorization: Bearer <accessToken>`.
