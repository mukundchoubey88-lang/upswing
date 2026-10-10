# UPSWING - Setup Guide

**Complete installation and configuration guide for development and deployment.**

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Database Configuration](#database-configuration)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

---

## Prerequisites

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Disk Space**: Minimum 2GB free
- **RAM**: Minimum 4GB (8GB recommended)

### Required Software

#### Backend (Python)
- **Python**: 3.10 or higher
  - [Download Python](https://www.python.org/downloads/)
  - Verify: `python --version`
  - Ensure pip is installed: `pip --version`

#### Frontend (Node.js)
- **Node.js**: 18.0 or higher
  - [Download Node.js](https://nodejs.org/)
  - Verify: `node --version` and `npm --version`

#### Database (Optional)
- **PostgreSQL**: 14+ (for production)
  - [Download PostgreSQL](https://www.postgresql.org/download/)
  - For development, SQLite is included

---

## Development Setup

### 1. Clone/Download Project

```bash
# Navigate to workspace
cd c:\projettttttt22222

# Verify project structure
ls
```

You should see:
```
frontend/
backend/
data/
docs/
requirements.md
design.md
tasks.md
README.md
```

### 2. Set Environment Variables

Create `.env` files in both frontend and backend:

**Backend** (`backend/.env`):
```bash
cp backend\.env.example backend\.env
```

**Frontend** (`frontend/.env`):
```bash
cp frontend\.env.example frontend\.env
```

Edit `.env` files if needed (defaults are fine for development).

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Virtual Environment

**On Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**On macOS/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

You should see `(venv)` prefix in your terminal.

### Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs:
- FastAPI (web framework)
- SQLAlchemy (ORM)
- Pydantic (data validation)
- All other required packages

**Expected time**: 2-5 minutes

### Step 4: Initialize Database

The database is automatically initialized when you run the server. To verify:

```bash
# Python interactive shell
python

# In Python shell:
from app.database import init_db
init_db()
exit()
```

You should see `upswing.db` created in the backend directory.

### Step 5: Seed Demo Data (Later)

```bash
python data/seed.py
```

**Note**: We'll implement this in Task 6. For now, skip this step.

### Step 6: Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started server process
```

**Test the API:**

Open browser to: `http://localhost:8000`

You should see:
```json
{
  "name": "UPSWING",
  "version": "1.0.0",
  "api": "/api/v1"
}
```

**API Documentation:**

Visit: `http://localhost:8000/docs` for interactive API documentation.

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- React and React DOM
- Tailwind CSS
- Recharts (charts)
- Axios (HTTP client)
- All other required packages

**Expected time**: 3-10 minutes (first time)

### Step 3: Run Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 4: Open in Browser

Visit: `http://localhost:5173`

You should see the UPSWING login page.

---

## Running the Application

### Option 1: Manual Start (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or .\venv\Scripts\Activate.ps1 on Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Data Seeding (Later - Task 6):**
```bash
cd backend
python data/seed.py
```

### Option 2: Using npm Scripts (Future)

We'll add `start` scripts later for easier startup.

---

## Database Configuration

### SQLite (Development - Default)

No configuration needed. SQLite automatically creates `upswing.db`.

**Location**: `backend/upswing.db`

**Pros**: 
- No installation required
- Perfect for development
- File-based, easy to backup

**Cons**:
- Single-user only
- Not suitable for production with multiple users

### PostgreSQL (Production)

For production or multi-user development:

#### 1. Install PostgreSQL

[Download PostgreSQL](https://www.postgresql.org/download/)

#### 2. Create Database

**On Windows (pgAdmin GUI):**
- Open pgAdmin
- Create new database `eduvision`

**On macOS/Linux (Command Line):**
```bash
psql -U postgres
CREATE DATABASE upswing;
\q
```

#### 3. Configure Backend

Edit `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/eduvision
```

Replace `password` with your PostgreSQL password.

#### 4. Install PostgreSQL Adapter

```bash
cd backend
pip install psycopg2-binary
```

#### 5. Test Connection

```bash
python
from app.database import engine
with engine.connect() as conn:
    print("Connected to PostgreSQL!")
exit()
```

---

## Environment Variables Explained

### Backend (.env)

```env
# App Settings
APP_NAME=UPSWING
APP_VERSION=1.0.0
DEBUG=True                    # Set to False in production

# Database
DATABASE_URL=sqlite:///./upswing.db

# Security (⚠️ CHANGE IN PRODUCTION)
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS (allowed frontend origins)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# API
API_V1_STR=/api/v1
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=UPSWING
```

---

## Troubleshooting

### Backend Issues

#### Error: `Module not found: fastapi`

**Solution**: Install requirements:
```bash
cd backend
pip install -r requirements.txt
```

#### Error: `Port 8000 already in use`

**Solution**: Use different port:
```bash
uvicorn app.main:app --reload --port 8001
```

Update frontend `.env`:
```env
VITE_API_URL=http://localhost:8001/api/v1
```

#### Error: `Database locked` (SQLite)

**Solution**: Close other connections and restart:
```bash
# Stop backend server
# Delete upswing.db
# Restart server
```

### Frontend Issues

#### Error: `npm: command not found`

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

#### Error: `Port 5173 already in use`

**Solution**: Use different port:
```bash
npm run dev -- --port 5174
```

Update API call in code if needed.

#### Blank white screen

**Solution**: 
1. Clear browser cache: Ctrl+Shift+Delete
2. Check browser console for errors: F12
3. Check that backend is running on port 8000

### Database Issues

#### Error: `table 'users' does not exist`

**Solution**: Initialize database:
```bash
cd backend
python -c "from app.database import init_db; init_db()"
```

#### Error: `sqlite3.DatabaseError: database disk image is malformed`

**Solution**: Delete corrupted database and restart:
```bash
# Backend directory
rm upswing.db
# Restart backend server
```

---

## Production Deployment

### 1. Security Configuration

**Backend (.env changes):**
```env
DEBUG=False
SECRET_KEY=use-a-strong-random-key-here
```

Generate strong secret key:
```python
import secrets
print(secrets.token_urlsafe(32))
```

### 2. Database

Switch to PostgreSQL (recommended):
```env
DATABASE_URL=postgresql://user:password@db-host:5432/eduvision
```

### 3. Backend Deployment

Using Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

Or using Docker:
```bash
# Create Dockerfile
docker build -t upswing-api .
docker run -p 8000:8000 upswing-api
```

### 4. Frontend Deployment

Build for production:
```bash
cd frontend
npm run build
```

Deploy `dist/` folder to:
- Static hosting (Vercel, Netlify, AWS S3)
- Web server (Nginx, Apache)
- Same server as backend

### 5. SSL/TLS

Use HTTPS in production:
- Use Let's Encrypt for free SSL
- Configure Nginx/Apache with SSL
- Update CORS_ORIGINS to use https://

### 6. Environment Files

**Never commit `.env` files to version control.**

Set environment variables on deployment server instead:
- Environment variables
- Configuration management services
- Docker secrets
- Kubernetes ConfigMaps

---

## Verification Checklist

- [ ] Python 3.10+ installed and available
- [ ] Node.js 18+ installed and available
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] `.env` files created for both backend and frontend
- [ ] Backend server running on http://localhost:8000
- [ ] Frontend server running on http://localhost:5173
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Login page loads at http://localhost:5173
- [ ] Demo credentials work (after Task 6)

---

## Next Steps

1. **Complete Task 5**: Database schema
2. **Complete Task 6**: Seed demo data
3. **Complete Task 7**: Authentication system
4. **Continue with remaining tasks** in tasks.md

---

## Getting Help

### Common Resources

- **API Issues**: Check `docs/API.md`
- **Database Issues**: Check `docs/DATABASE.md`
- **Requirements**: Check `requirements.md`
- **Architecture**: Check `design.md`

### Testing Commands

```bash
# Test backend health
curl http://localhost:8000/health

# Test API docs
open http://localhost:8000/docs

# Test frontend
open http://localhost:5173

# List dependencies
pip list
npm list
```

---

## Document Version
- Version: 1.0
- Date: 2026-10-04
- Status: Ready for Use
