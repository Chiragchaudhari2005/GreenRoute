# GreenRoute — Waste Pickup Scheduling Platform 🌿

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen.svg)](https://www.mongodb.com/)
[![DevOps Ready](https://img.shields.io/badge/DevOps-Jenkins%20%7C%20Docker%20%7C%20Selenium-orange.svg)](#devops--cicd-readiness)

A modern, responsive, full-stack **MERN** web application designed to streamline community doorstep waste collection, prevent truck overbooking through live capacity slots, and empower residents to measure verified carbon offsets.

---

## 🎨 UI/UX Design System (Nexcent Theme)

GreenRoute implements a human-crafted design matching modern SaaS aesthetics and sustainable branding:

### Design Tokens:
- **Primary Color:** `#4CAF4F` (Primary Green)
- **Shades:** `#43A046` (Shade 1), `#388E3C` (Shade 2), `#2E7D32` (Shade 3), `#1B5E1F` (Shade 4), `#103E12` (Shade 5)
- **Tints:** `#66BB69` (Tint 1), `#81C784` (Tint 2), `#A5D6A7` (Tint 3), `#C8E6C9` (Tint 4), `#E8F5E9` (Tint 5 Mint)
- **Neutral Palette:**
  - `Black`: `#263238`
  - `D_Grey`: `#4D4D4D`
  - `Grey`: `#717171`
  - `L_Grey`: `#89939E`
  - `Grey-blue`: `#ABBED1`
  - `Silver`: `#F5F7FA` (Used across section backgrounds & cards)
  - `White`: `#FFFFFF`
- **Actions:** Warning (`#FBC02D`), Error (`#E53835`), Success (`#2E7D32`)
- **Typography:** `Inter` font family (64px headlines to 12px captions)

---

## 🚀 Key Features

### 👤 1. Secure Authentication & Role-Based Access
- User registration and login with **JWT** authentication.
- Passwords securely salted and hashed using **bcryptjs**.
- Role-based route protection (`resident` vs `admin`).
- Quick one-click demo login buttons on the sign-in screen.

### 📅 2. Real-Time Capacity & Overbooking Prevention
- Municipal collection slots have strict maximum capacity limits.
- **Race-Condition Safe:** Concurrency-protected atomic queries (`$expr: { $lt: ['$bookedCount', '$maxCapacity'] }`) prevent overbooking collection trucks.
- Real-time remaining capacity indicators (`3 slots remaining`, `Full`).

### 📦 3. Interactive Waste Pickup Scheduling
- **Categorized Waste Streams:** Recyclables (Plastic/Paper), Organic Compost, Electronic Waste, General Waste, Hazardous Waste, Bulk Furniture.
- Step-by-step intuitive wizard with address validation and estimated load weight (kg).
- Instant carbon offset forecasting based on waste stream emission factors.

### 📊 4. Resident Dashboard
- Sustainability metrics: Total bookings, completed pickups, landfill diversion weight (kg), and CO₂ emissions saved.
- Active upcoming pickups with live truck assignment (`GreenRoute Eco-Truck #4`).
- Comprehensive pickup history table with filter tabs.
- Safe cancellation modal that releases capacity back to the neighborhood.

### 🛡️ 5. Municipal Admin Console
- **Booking Management:** Filter, search, and update pickup status (`Pending` ➔ `Confirmed` ➔ `In Progress` ➔ `Completed` ➔ `Cancelled`) and assign collection trucks.
- **Slot Management:** Add new calendar pickup dates, time windows, and capacity limits. Delete or disable slots.
- **Resident Directory:** Manage registered users, review activity, and assign coordinator privileges.

---

## 🛠️ Tech Stack & Architecture

```
GreenRoute/
├── backend/
│   ├── config/            # Database connection & In-Memory fallback
│   ├── controllers/       # Auth, Slot, Booking, User, Stats controllers
│   ├── middleware/        # JWT auth, RBAC, Centralized error handling
│   ├── models/            # Mongoose Schemas (User, PickupSlot, Booking)
│   ├── routes/            # REST API endpoints & Health check
│   ├── seeds/             # Starter seed script with sample data
│   ├── tests/             # Automated Jest & Supertest integration tests
│   ├── Dockerfile         # Production container config
│   ├── .env.example       # Documented environment variables
│   └── server.js          # Express entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, Footer, Badge, Modal, ProtectedRoute
│   │   ├── context/       # AuthContext, ToastContext
│   │   ├── pages/         # LandingPage, Login, Register, Dashboards
│   │   ├── services/      # Axios API client
│   │   ├── App.jsx        # Routing & layouts
│   │   └── index.css      # Design system & Tailwind imports
│   ├── Dockerfile         # Multi-stage production Nginx container
│   ├── nginx.conf         # Production Nginx reverse-proxy
│   ├── tailwind.config.js # Nexcent design tokens
│   └── vite.config.js     # Vite configuration
├── docker-compose.yml     # Multi-container orchestration (Mongo, API, Client)
└── README.md
```

---

## 🧪 Testing & Automated Verification

Run the automated test suite verifying DevOps health checks, authentication, and slot overbooking prevention:

```bash
cd backend
npm test
```

Test results:
```
PASS tests/api.test.js
  GreenRoute Automated Test Suite
    DevOps Health Check Endpoint
      √ GET /api/health should return 200 with service status and metadata
    Authentication Endpoints
      √ POST /api/auth/register should create a resident account
      √ POST /api/auth/login should authenticate valid user credentials
      √ POST /api/auth/login should reject invalid passwords
    Slot Management and Overbooking Prevention
      √ Should prevent overbooking when slot capacity is exhausted
```

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- *(Optional)* Local MongoDB or Docker. If local MongoDB is not installed, the application automatically initializes an embedded in-memory MongoDB instance for zero-configuration startup.

### 1. Install Dependencies
```bash
# In backend directory
cd backend
npm install

# In frontend directoryy
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` in both directories:
```bash
# In backend
cp .env.example .env

# In frontend
cp .env.example .env
```

### 3. Run Development Servers

**Start Backend (Port 5000):**
```bash
cd backend
npm start
```
*(On first startup, the database is automatically seeded with demo accounts and upcoming pickup slots).*

**Start Frontend (Port 5173):**
```bash
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Preconfigured Demo Accounts

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@greenroute.com` | `admin123` | Full access to Admin Console, Slot Management, All Bookings |
| **Resident** | `resident@greenroute.com` | `resident123` | Resident Dashboard, Pickup Scheduling, My History |
| **Resident** | `sarah@greenroute.com` | `password123` | Household account with pre-scheduled pickups |

*(One-click demo login buttons are also provided directly on the Login page).*

---

## 🐳 Docker & DevOps CI/CD Readiness

GreenRoute is built to be cloud-native and ready for automated Jenkins CI/CD pipelines and Selenium UI testing:

### 1. Health-Check Endpoint
```
GET /api/health
```
Response:
```json
{
  "status": "UP",
  "timestamp": "2026-10-12T18:00:00.000Z",
  "uptimeSeconds": 482,
  "service": "greenroute-backend-api",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "name": "greenroute"
  }
}
```

### 2. Docker Compose
Run all services with a single command:
```bash
docker compose up --build
```
- **MongoDB:** `localhost:27017`
- **Backend API:** `http://localhost:5000`
- **Frontend Web App:** `http://localhost:3000`

### 3. Future Jenkins Integration
- **Build stage:** `npm --prefix backend test && npm --prefix frontend run build`
- **Quality stage:** Jest test coverage reports
- **Docker stage:** Build Docker containers using provided Dockerfiles
- **Deploy stage:** Docker Compose / Ansible staging deployment

---

## 📄 License
ISC License — GreenRoute Sustainable Platform 2026.
