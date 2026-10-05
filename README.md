# EDUVISION AI

**"Detect Early. Understand Why. Take Action. Improve Outcomes."**

An AI-powered Student Academic Performance Detection & Early Warning System.

## Overview

EDUVISION AI is a comprehensive platform designed to identify students showing early signs of academic failure, explain the reasons behind their risk, recommend targeted interventions, and track whether those interventions improve their performance.

### Core Features

- **Early Risk Detection**: Identify at-risk students before failure occurs
- **AI Risk Analysis**: Explainable risk scoring with clear factor breakdown
- **Next Best Action**: Personalized intervention recommendations
- **Risk Radar**: Interactive visualization of student academic risk
- **Intervention Tracking**: Monitor intervention effectiveness
- **AI Copilot**: Teacher-focused assistant for data-driven insights

## Project Structure

```
eduvision-ai/
├── frontend/               # React + TypeScript UI
├── backend/                # FastAPI + Python backend
├── data/                   # Demo data and seeding scripts
├── docs/                   # Documentation
├── requirements.md         # Product requirements
├── design.md              # System architecture
├── tasks.md               # Implementation tasks
└── README.md              # This file
```

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Recharts** for visualizations
- **Framer Motion** for animations
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **FastAPI** for REST API
- **SQLAlchemy** for ORM
- **SQLite/PostgreSQL** for database
- **JWT** for authentication
- **Pydantic** for data validation
- **Scikit-learn** for ML (future)

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
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Run development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
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

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Run development server:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## Demo Credentials

After seeding demo data (see Task 6), use:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | password123 |
| Teacher | teacher@school.com | password123 |
| Student | student@school.com | password123 |

## API Documentation

API endpoints are documented in `docs/API.md`

Interactive API docs available at: `http://localhost:8000/docs` (when backend running)

## Risk Calculation

The transparent risk engine calculates academic risk based on:

1. **Attendance** (0-25 points): Student attendance percentage
2. **Performance** (0-25 points): Current average marks
3. **History** (0-20 points): Comparison with previous performance
4. **Assignments** (0-15 points): Assignment completion rate
5. **Trend** (0-15 points): Performance trajectory over time

**Risk Levels:**
- 0-39: LOW
- 40-69: MEDIUM
- 70-100: HIGH

See `docs/RISK_ENGINE.md` for detailed explanation.

## Documentation

- `requirements.md` - Product requirements and feature specifications
- `design.md` - System architecture and technical design
- `tasks.md` - Implementation tasks breakdown
- `docs/SETUP.md` - Detailed setup instructions
- `docs/API.md` - API endpoint documentation
- `docs/DATABASE.md` - Database schema documentation
- `docs/RISK_ENGINE.md` - Risk calculation documentation

## Development Roadmap

### Phase 1 (Current)
- ✅ Specification documents
- ✅ Project setup
- [ ] Database schema
- [ ] Demo data seeding
- [ ] Authentication

### Phase 2
- [ ] Risk calculation engine
- [ ] Dashboard
- [ ] Student management
- [ ] Student profiles

### Phase 3
- [ ] Intervention system
- [ ] Risk Radar
- [ ] AI Copilot
- [ ] Reports

### Phase 4 (Future)
- [ ] Advanced ML models
- [ ] Mobile app
- [ ] Parent/student portal
- [ ] Real LLM integration

## Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Build & Deployment

### Frontend Build
```bash
cd frontend
npm run build
# Output in dist/
```

### Backend Production
```bash
cd backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

See `docs/SETUP.md` for detailed deployment instructions.

## Contributing

This is a college project built by Kiro AI. Each task is structured for incremental implementation and testing.

See `tasks.md` for the complete development breakdown.

## License

Educational use only - College Project

## Support

For issues or questions:
1. Check the documentation in `docs/`
2. Review the specification in `requirements.md`
3. Refer to the design in `design.md`

---

**EDUVISION AI** - Making education smarter, one student at a time.
