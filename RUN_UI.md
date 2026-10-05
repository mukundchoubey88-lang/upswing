# 🚀 How to Run EDUVISION AI UI

## Quick Start (5 Minutes)

### Step 1: Setup Environment File
```bash
cd frontend
copy .env.example .env
```

### Step 2: Install Dependencies
```bash
npm install
```
⏱️ This takes ~2 minutes

### Step 3: Start the UI
```bash
npm run dev
```

The UI will open at: **http://localhost:5173**

---

## ⚠️ Important Notes

### Without Backend (UI Only Mode)
- ✅ You'll see the **login screen**
- ✅ Navigation and layout work
- ❌ Login will fail (needs backend API)
- ❌ Data won't load (needs backend API)

**This is perfect for seeing the UI design and layout!**

### With Backend (Full Mode)
To get everything working with real data, you also need:

#### Terminal 1 - Backend Setup:
```bash
# From project root
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python ..\data\seed.py
uvicorn app.main:app --reload --port 8000
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Then login with:
- **Email:** admin@school.com
- **Password:** password123

---

## 🎯 Current State

| Feature | Status |
|---------|--------|
| UI Code | ✅ Complete |
| Styling | ✅ Complete |
| Routing | ✅ Complete |
| Components | ✅ Complete |
| Login Screen | ✅ Works (shows UI) |
| Dashboard | ⚠️ Shows placeholders |
| Navigation | ✅ Works |
| Backend API | 📦 Needs setup |
| Real Data | 📦 Needs backend |

---

## 🐛 Troubleshooting

### "npm: command not found"
**Fix:** Install Node.js from https://nodejs.org/ (LTS version)

### "Port 5173 already in use"
**Fix:** Kill the process or change port:
```bash
npm run dev -- --port 3000
```

### "Cannot find module"
**Fix:** Delete node_modules and reinstall:
```bash
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.tsx              # Main app with routing
│   ├── pages/               # 10 page components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Login.tsx        # Login screen
│   │   ├── StudentList.tsx  # Student list
│   │   └── ...
│   ├── components/          # Reusable components
│   │   └── common/
│   │       ├── Header.tsx   # Top navigation
│   │       └── Sidebar.tsx  # Side menu
│   ├── layouts/
│   │   └── MainLayout.tsx   # Page wrapper
│   ├── context/
│   │   └── AuthContext.tsx  # Auth state
│   └── services/
│       └── authService.ts   # API calls
├── package.json             # Dependencies
├── tailwind.config.js       # Styling config
├── vite.config.ts           # Build config
└── .env                     # API URL config

```

---

## 🎨 What You'll See

### Login Page
- 🎓 Clean login form
- 📧 Email input
- 🔒 Password input
- 🚀 "Sign In" button
- 🎨 EDUVISION AI branding

### After Login (with backend)
- 📊 Dashboard with metrics
- 🎯 Risk overview cards
- 📈 Charts and graphs
- 🧭 Navigation sidebar
- 👤 User menu

### Pages Available
1. 🏠 Dashboard - Risk overview
2. 👥 Students - Student list
3. 👤 Profile - Individual student details
4. 🎯 Interventions - Action tracking
5. 🔔 Notifications - Alerts
6. 📊 Reports - Analytics
7. 💾 Data Center - Import/Export
8. ⚙️ Settings - Configuration

---

## ✨ Next Steps

**For UI Preview Only:**
```bash
cd frontend
npm install
npm run dev
```

**For Full App:**
Follow QUICKSTART.md for complete backend setup

---

**Need Help?** Check:
- 📖 QUICKSTART.md - Full setup guide
- 📋 PROGRESS.md - Current status
- 🎯 tasks.md - Implementation plan
