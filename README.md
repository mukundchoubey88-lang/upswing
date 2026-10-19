# UPswing

**"Detect Early. Understand Why. Take Action. Improve Outcomes."**

An AI-powered Student Academic Performance Detection & Early Warning System.

## Overview

UPswing is a comprehensive platform designed to identify students showing early signs of academic failure, explain the reasons behind their risk, recommend targeted interventions, and track whether those interventions improve their performance.

### Core Features

- **Interactive Landing Page**: Public-facing marketing page showcasing the platform with 10 interactive sections
- **Early Risk Detection**: Identify at-risk students before failure occurs
- **AI Risk Analysis**: Explainable risk scoring with clear factor breakdown
- **Next Best Action**: Personalized intervention recommendations
- **Risk Radar**: Interactive visualization of student academic risk
- **Intervention Tracking**: Monitor intervention effectiveness
- **Role-Based Dashboard**: Separate views for Admin, Teacher, and Counselor
- **Theme Support**: Light and dark modes with smooth switching
- **Keyboard Accessible**: Full keyboard navigation and screen reader support
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Project Structure

```
upswing/
├── frontend/               # React + TypeScript UI
│   ├── src/
│   │   ├── pages/Landing/          # Landing page (10 sections)
│   │   ├── pages/Dashboard/        # App dashboard
│   │   ├── hooks/                  # Custom hooks (useReveal, useMagnetic, etc.)
│   │   ├── components/             # Shared components
│   │   └── App.tsx                 # Main app with routing
│   └── ...
├── backend/                # FastAPI + Python backend
├── data/                   # Demo data and seeding scripts
├── docs/                   # Documentation
│   ├── CHANGES.md          # Changelog for recent updates
│   └── ...
└── README.md              # This file
```

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Recharts** for visualizations
- **Lucide React** for icons
- **Axios** for API communication
- **React Router** for navigation
- **React Query** for data fetching
- **Zustand** for state management

### Backend
- **FastAPI** for REST API
- **SQLAlchemy** for ORM
- **SQLite** for development (PostgreSQL ready)
- **JWT** for authentication
- **Pydantic** for data validation

## Getting Started

### Prerequisites

- **Node.js** 18+ (frontend)
- **Python** 3.10+ (backend)
- **npm** or **yarn** (frontend package manager)
- **pip** (Python package manager)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file from template:
```bash
# Copy .env.example to .env - already configured for development
```

5. Run development server:
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

API documentation at: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from template:
```bash
# Copy .env.example to .env - already configured for development
```

4. Run development server:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173` (or next available port)

### Full Stack Running

With both backend and frontend running:

1. Visit `http://localhost:5173` - Landing page loads at `/`
2. Click "Launch demo" → Login page
3. After login → Dashboard at `/dashboard`
4. Click "Home" in sidebar → Returns to landing page

## Site Navigation

### Public Routes (No Authentication)
- `/` - Landing page (hero, features, how it works, FAQ, etc.)
- `/login` - Login page

### Protected Routes (Authentication Required)
- `/dashboard` - Main dashboard
- `/students` - Student list and management
- `/students/:studentId` - Individual student profile
- `/risk-analysis` - Risk analysis and scoring
- `/interventions` - Intervention tracking
- `/notifications` - System notifications
- `/reports` - Reports and analytics
- `/data-center` - Admin data management
- `/settings` - Admin settings

## Landing Page Features

The interactive landing page includes 10 sections:

1. **Hero** - Headline, value prop, CTA, real student statistics
2. **Problem/Solution** - Problem statement and UPswing solution
3. **Features** - Interactive bento grid of key features
4. **How It Works** - 5-step timeline process
5. **Risk Checker** - Interactive risk calculator with real logic
6. **Role Tabs** - Feature overview for Admin, Teacher, Counselor (keyboard accessible)
7. **Before/After Slider** - Intervention impact comparison (mouse + keyboard operable)
8. **FAQ** - Frequently asked questions with smooth animations
9. **Final CTA** - Call-to-action section
10. **Footer** - Links and company info

### Landing Page Features
- **Real Student Data** - Uses actual database stats (total students, risk distribution, active interventions, attendance)
- **Smooth Animations** - Scroll-triggered reveals, count-up numbers, parallax effects (respects prefers-reduced-motion)
- **Theme Support** - Light/dark modes work across landing and app
- **Responsive** - Optimized for 390px mobile to 1440px desktop
- **Keyboard Accessible** - Tab navigation, Enter/Space on tabs, arrow keys on slider
- **Lazy-Loaded** - Landing code in separate chunk, loads only when needed

## Demo Credentials

After seeding demo data, use:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | password123 |
| Teacher | teacher@school.com | password123 |

## API Documentation

API endpoints are documented in `docs/API.md`

Interactive API docs available at: `http://localhost:8000/docs` (when backend running)

## Risk Calculation

The transparent risk engine calculates academic risk based on:

1. **Attendance** (30% weight): Student attendance percentage
2. **Performance** (30% weight): Current average marks
3. **Failed Subjects** (25% weight): Number of low-score subjects
4. **Trend** (15% weight): Performance trajectory over time

**Risk Levels:**
- 0-39: LOW RISK
- 40-69: MEDIUM RISK
- 70-100: HIGH RISK

For implementation details, see `frontend/src/utils/riskCalculator.ts`

## Documentation

- `docs/CHANGES.md` - Latest updates and changelog
- `docs/SETUP.md` - Detailed setup instructions
- `docs/API.md` - API endpoint documentation
- `docs/DATABASE.md` - Database schema documentation
- `design.md` - System architecture and design decisions

## Build & Deployment

### Frontend Build
```bash
cd frontend
npm run build
# Output: dist/ folder (~0.92 MB)
```

### Production Run
```bash
# Backend (from backend/)
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app

# Frontend (from frontend/)
npm run preview  # Preview production build locally
```

## Recent Updates

See `docs/CHANGES.md` for detailed changelog including:
- Landing page implementation
- Unified navigation system
- New custom hooks and utilities
- Routing restructure
- Theme and accessibility improvements

## Testing

All features tested for:
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Theme switching (light/dark)
- ✅ Keyboard accessibility (Tab, Enter, Space, Arrow keys)
- ✅ Reduced motion preference
- ✅ Real data integration
- ✅ TypeScript compilation (0 errors)
- ✅ Production build success

## Browser Compatibility

Tested and working on:
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

## Contributing

This project is actively developed. Each feature is tested for accessibility, responsiveness, and performance.

## License

Educational use only - College Project

## Support

For issues or questions:
1. Check the documentation in `docs/`
2. Review `docs/CHANGES.md` for recent updates
3. Refer to the API documentation at `http://localhost:8000/docs`

---

**UPswing** - AI Student Early Warning System
*Making education smarter, one student at a time.*
