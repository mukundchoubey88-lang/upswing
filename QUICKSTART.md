# EDUVISION AI - Quick Start Guide

**Get the application running in 5 minutes**

---

## Prerequisites Check

Ensure you have:
- ✅ **Node.js 18+** installed (`node --version`)
- ✅ **Python 3.10+** installed (`python --version`)
- ✅ **npm** installed (`npm --version`)

---

## Step 1: Backend Setup (2 minutes)

### 1.1 Navigate to backend directory
```powershell
cd c:\projettttttt22222\backend
```

### 1.2 Create virtual environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 1.3 Install dependencies
```powershell
pip install -r requirements.txt
```

### 1.4 Create .env file
```powershell
cp .env.example .env
```

### 1.5 Initialize database and seed data
```powershell
# Run from backend directory
python ..\data\seed.py
```

Expected output:
```
🌱 Seeding EDUVISION AI Demo Data...
📚 Creating subjects...
👥 Creating users...
👨‍🎓 Creating students and academic data...
✅ Demo data seeding completed successfully!
   - 8 subjects created
   - 6 users created
   - 260 students created
```

### 1.6 Start backend server
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ Backend ready at: http://localhost:8000

---

## Step 2: Frontend Setup (2 minutes)

### 2.1 Open NEW terminal/PowerShell window

### 2.2 Navigate to frontend directory
```powershell
cd c:\projettttttt22222\frontend
```

### 2.3 Install dependencies
```powershell
npm install
```

This will take 1-2 minutes. Expected output:
```
added 200+ packages in 45s
```

### 2.4 Create .env file
```powershell
cp .env.example .env
```

The default `.env.example` already has correct values:
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=EDUVISION AI
```

### 2.5 Start frontend dev server
```powershell
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ Frontend ready at: http://localhost:5173

---

## Step 3: Login & Test (30 seconds)

### 3.1 Open browser
Navigate to: http://localhost:5173

### 3.2 You should see:
- ✅ EDUVISION AI login page
- ✅ Professional gradient background
- ✅ Demo credential buttons

### 3.3 Quick Login Options

**Option 1: Click Demo Button**
- Click "👨‍🏫 Teacher" button
- Automatically logs in as teacher

**Option 2: Manual Login**
- Email: `teacher1@school.com`
- Password: `password123`
- Click "Sign In"

### 3.4 After login you'll see:
- ✅ Dashboard with welcome message
- ✅ Sidebar with navigation
- ✅ Header with user menu
- ✅ Metric cards (currently showing 0 - API integration in Task 9)

---

## Verification Checklist

### Backend Running ✅
- [ ] Terminal shows "Uvicorn running on http://0.0.0.0:8000"
- [ ] Visit http://localhost:8000 - should show JSON response
- [ ] Visit http://localhost:8000/docs - should show Swagger UI
- [ ] Database file exists: `backend/eduvision.db`

### Frontend Running ✅
- [ ] Terminal shows "Local: http://localhost:5173/"
- [ ] Visit http://localhost:5173 - should show login page
- [ ] Login page has demo credential buttons
- [ ] Can login with teacher credentials

### Demo Data Loaded ✅
- [ ] Seeding script completed successfully
- [ ] 260 students created message shown
- [ ] Database file size ~10-20 MB

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | password123 |
| Teacher 1 | teacher1@school.com | password123 |
| Teacher 2 | teacher2@school.com | password123 |
| Teacher 3 | teacher3@school.com | password123 |
| Teacher 4 | teacher4@school.com | password123 |
| Teacher 5 | teacher5@school.com | password123 |
| Student | student@school.com | password123 |

---

## What You Can Do Now

### Current Features (Working)
✅ **Authentication**
- Login/logout
- Role-based access
- JWT tokens
- Session persistence

✅ **Navigation**
- Sidebar menu
- Role-based menu items
- Mobile responsive
- Active route highlighting

✅ **Layout**
- Professional UI design
- Dark/light mode
- Responsive grid
- User dropdown menu

### Coming Soon (Tasks 9+)
⏳ **Dashboard with real data** (Task 9)
⏳ **Student list & risk table** (Task 16)
⏳ **Student profiles with AI** (Task 11)
⏳ **Risk Radar visualization** (Task 10)
⏳ **Intervention system** (Task 14-15)

---

## Troubleshooting

### Backend won't start
**Error**: `Module not found: fastapi`
```powershell
# Make sure you're in virtual environment
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Frontend won't start
**Error**: `command not found: npm`
```powershell
# Install Node.js from https://nodejs.org/
# Then run: npm install
```

### Login fails
**Error**: "Invalid credentials"
```powershell
# Check backend is running
# Check database was seeded
python ..\data\seed.py
```

### Port already in use
**Backend**: Use different port
```powershell
uvicorn app.main:app --reload --port 8001
# Update frontend .env: VITE_API_URL=http://localhost:8001/api/v1
```

**Frontend**: Use different port
```powershell
npm run dev -- --port 5174
```

---

## File Structure Check

After setup, you should have:

```
c:\projettttttt22222\
├── backend\
│   ├── venv\                    # ✅ Should exist after setup
│   ├── eduvision.db            # ✅ Should exist after seeding
│   └── .env                    # ✅ Should exist
│
└── frontend\
    ├── node_modules\            # ✅ Should exist after npm install
    └── .env                    # ✅ Should exist
```

---

## Next Steps

After successfully running the app:

1. **Explore the UI**
   - Try different navigation items
   - Test the user dropdown
   - Check mobile responsive design

2. **Check the API**
   - Visit http://localhost:8000/docs
   - Test the /auth/login endpoint
   - Explore available endpoints

3. **Review the Data**
   - 260 students created
   - Risk scores calculated
   - Realistic correlations

4. **Ready for Task 9**
   - Dashboard API implementation
   - Real data integration
   - Charts and visualizations

---

## Support

If you encounter issues:

1. **Check logs** in both terminal windows
2. **Verify prerequisites** (Node.js, Python versions)
3. **Review** SETUP.md for detailed instructions
4. **Check** PROGRESS.md for current status

---

## Quick Commands Reference

```powershell
# Backend (Terminal 1)
cd c:\projettttttt22222\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000

# Frontend (Terminal 2)
cd c:\projettttttt22222\frontend
npm run dev

# Seed Data (if needed)
cd c:\projettttttt22222\backend
python ..\data\seed.py
```

---

**Status**: UI code complete. Follow steps above to run.  
**Time to run**: ~5 minutes  
**Current phase**: Ready for Task 9 (Dashboard implementation)
