# ይሳኮር ቤቴ — Student Enrollment System

A private university student enrollment management web application with role-based access control.

## Features

- 🎓 Enroll students with full name, department, graduation year, gender, and phone number
- 🔒 Private student registry — only privileged users can access
- 👑 Owner / Admin privilege system (like Telegram admin model)
- 🔍 Search students by name, department, or graduation year
- 📊 Students sorted descending by graduation year
- 🔄 Ownership transfer support

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (via better-sqlite3)
- **Auth**: JWT in HttpOnly cookies + bcrypt

## Quick Start

### 1. Install dependencies

```bash
# From the project root
cd yisakor-bete
npm install

cd client && npm install
cd ../server && npm install
```

### 2. Configure environment

```bash
cp .env.example server/.env
```

Edit `server/.env`:
```
OWNER_USERNAME=your_username
OWNER_PASSWORD=your_secure_password
JWT_SECRET=your-long-random-secret
PORT=3001
```

### 3. Run in development

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd yisakor-bete/server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd yisakor-bete/client
npm run dev
```

Open http://localhost:5173

### 4. First login

Use the `OWNER_USERNAME` and `OWNER_PASSWORD` you set in `.env`. The owner account is created automatically on first startup.

## Role System

| Role | Can view students | Can enroll | Can manage admins | Can transfer ownership |
|------|:-----------------:|:----------:|:-----------------:|:---------------------:|
| Owner | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ❌ | ❌ |
| User | ❌ | ❌ | ❌ | ❌ |

## Project Structure

```
yisakor-bete/
├── client/          # React frontend
│   └── src/
│       ├── api/     # API client modules
│       ├── components/
│       ├── context/ # Auth context
│       └── pages/
├── server/          # Express backend
│   └── src/
│       ├── auth/    # JWT + bcrypt
│       ├── middleware/
│       ├── repositories/
│       └── routes/
└── shared/          # Shared TypeScript types
```
