# SKYSQLStudio 🎯

A browser-based SQL learning platform where students practice SQL queries on pre-configured assignments with real-time execution and intelligent hints.

## Features

- 📋 **Assignment Listing** — Browse assignments by difficulty (Easy, Medium, Hard)
- ✍️ **Monaco SQL Editor** — Full-featured SQL editor with syntax highlighting & Ctrl+Enter execution
- 📊 **Results Panel** — Formatted table output with row counts and execution time
- 💡 **AI Hints** — LLM-powered hints (Gemini/OpenAI) that guide without giving solutions
- 📋 **Sample Data Viewer** — View table schemas and sample data per assignment
- 🔐 **Authentication** — User signup/login with JWT
- 🛡️ **Secure Execution** — SQL validation blocks dangerous operations (only SELECT allowed)
- 🎮 **Demo Mode** — Works without databases using built-in mock data

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, SCSS (BEM), Monaco Editor |
| Backend | Node.js, Express.js |
| Sandbox DB | PostgreSQL |
| Persistence | MongoDB (Atlas) |
| AI Hints | Gemini / OpenAI API |

## Quick Start

### 1. Install Dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
# Edit server/.env with your credentials
```

### 3. Start (Demo Mode)

```bash
# Terminal 1 — Server
cd server && npm run dev

# Terminal 2 — Client
cd client && npm run dev
```

Open http://localhost:5173

### 4. Production Mode (requires DBs)

Set `DEMO_MODE=false` in `.env` and configure MongoDB + PostgreSQL credentials.

```bash
# Seed databases
cd server && npm run seed
```

## Project Structure

```
├── client/           # React frontend
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route pages
│       ├── styles/      # SCSS architecture
│       ├── context/     # Auth context
│       └── services/    # API service layer
├── server/           # Express backend
│   ├── config/       # DB connections
│   ├── middleware/    # Auth & SQL validation
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── services/     # LLM hint service
│   └── seeds/        # Database seed scripts
```

## Responsive Design

Mobile-first with breakpoints at: 320px, 641px, 1024px, 1281px
