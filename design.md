# EDUVISION AI - Design Document

**System Architecture, Database Design, API Architecture, ML Architecture, UI Architecture**

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     EDUVISION AI SYSTEM                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   FRONTEND LAYER     │         │   BACKEND LAYER      │
│  (React + TypeScript)│◄───────►│  (FastAPI + Python)  │
└──────────────────────┘         └──────────────────────┘
         │                                  │
         ├─ Components                      ├─ API Routes
         ├─ Pages                           ├─ Business Logic
         ├─ Charts & Viz                    ├─ Risk Engine
         ├─ State Management                └─ ML Layer
         └─ Services                        
                                 ┌──────────────────────┐
                                 │  DATABASE LAYER      │
                                 │  (PostgreSQL/SQLite) │
                                 └──────────────────────┘
                                          │
                                 ┌────────┴────────┐
                                 │   SQL Schema    │
                                 │   Normalized    │
                                 │   Relationships │
                                 └─────────────────┘
```

---

## 2. Project Structure

```
eduvision-ai/
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── styles/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Badge.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── AcademicHealth.tsx
│   │   │   │   ├── AttentionRequired.tsx
│   │   │   │   ├── RiskDistribution.tsx
│   │   │   │   ├── PerformanceTrend.tsx
│   │   │   │   └── RiskTrend.tsx
│   │   │   │
│   │   │   ├── radar/
│   │   │   │   ├── RiskRadar.tsx
│   │   │   │   └── RiskRadarNode.tsx
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── StudentProfile.tsx
│   │   │   │   ├── WhyThisScore.tsx
│   │   │   │   ├── NextBestAction.tsx
│   │   │   │   ├── InterventionHistory.tsx
│   │   │   │   └── ImprovementTracking.tsx
│   │   │   │
│   │   │   ├── table/
│   │   │   │   ├── StudentRiskTable.tsx
│   │   │   │   ├── TableFilter.tsx
│   │   │   │   └── TableSearch.tsx
│   │   │   │
│   │   │   ├── intervention/
│   │   │   │   ├── InterventionForm.tsx
│   │   │   │   ├── InterventionList.tsx
│   │   │   │   └── InterventionTracking.tsx
│   │   │   │
│   │   │   ├── copilot/
│   │   │   │   ├── CopilotPanel.tsx
│   │   │   │   ├── QuestionTemplates.tsx
│   │   │   │   └── CopilotResponse.tsx
│   │   │   │
│   │   │   ├── notifications/
│   │   │   │   ├── NotificationCenter.tsx
│   │   │   │   └── NotificationItem.tsx
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── ReportGenerator.tsx
│   │   │   │   └── ReportPreview.tsx
│   │   │   │
│   │   │   ├── datacenter/
│   │   │   │   ├── DataUpload.tsx
│   │   │   │   ├── ValidationReport.tsx
│   │   │   │   └── DataPreview.tsx
│   │   │   │
│   │   │   └── auth/
│   │   │       ├── Login.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── StudentProfile.tsx
│   │   │   ├── StudentList.tsx
│   │   │   ├── Interventions.tsx
│   │   │   ├── Notifications.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── DataCenter.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Login.tsx
│   │   │   └── NotFound.tsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   └── AdminLayout.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── studentService.ts
│   │   │   ├── riskService.ts
│   │   │   ├── interventionService.ts
│   │   │   ├── reportService.ts
│   │   │   └── notificationService.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useStudent.ts
│   │   │   ├── useRisk.ts
│   │   │   ├── usePagination.ts
│   │   │   └── useNotifications.ts
│   │   │
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── user.ts
│   │   │   ├── student.ts
│   │   │   ├── risk.ts
│   │   │   ├── intervention.ts
│   │   │   └── api.ts
│   │   │
│   │   ├── charts/
│   │   │   ├── RiskDistributionChart.tsx
│   │   │   ├── PerformanceTrendChart.tsx
│   │   │   ├── AttendanceVsPerformanceChart.tsx
│   │   │   ├── SubjectRiskChart.tsx
│   │   │   └── InterventionImpactChart.tsx
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── variables.css
│   │   │   └── tailwind.config.ts
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── NotificationContext.tsx
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py
│   │   │   │   ├── students.py
│   │   │   │   ├── risk.py
│   │   │   │   ├── interventions.py
│   │   │   │   ├── notifications.py
│   │   │   │   ├── reports.py
│   │   │   │   ├── data.py
│   │   │   │   └── admin.py
│   │   │   │
│   │   │   └── middleware/
│   │   │       ├── __init__.py
│   │   │       ├── auth.py
│   │   │       └── error_handler.py
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── student.py
│   │   │   ├── subject.py
│   │   │   ├── attendance.py
│   │   │   ├── assessment.py
│   │   │   ├── assignment.py
│   │   │   ├── academic_history.py
│   │   │   ├── risk_score.py
│   │   │   ├── intervention.py
│   │   │   └── notification.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── student.py
│   │   │   ├── risk.py
│   │   │   ├── intervention.py
│   │   │   └── common.py
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── student_service.py
│   │   │   ├── risk_service.py
│   │   │   ├── intervention_service.py
│   │   │   ├── notification_service.py
│   │   │   ├── report_service.py
│   │   │   └── data_service.py
│   │   │
│   │   ├── ml/
│   │   │   ├── __init__.py
│   │   │   ├── risk_engine.py
│   │   │   ├── trend_analyzer.py
│   │   │   ├── recommendation_engine.py
│   │   │   └── models/
│   │   │       ├── logistic_regression.pkl
│   │   │       └── random_forest.pkl
│   │   │
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── session.py
│   │   │   └── migrations/
│   │   │       ├── alembic.ini
│   │   │       └── versions/
│   │   │
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── security.py
│   │   │   ├── validators.py
│   │   │   ├── constants.py
│   │   │   ├── helpers.py
│   │   │   └── csv_handler.py
│   │   │
│   │   └── config/
│   │       ├── __init__.py
│   │       └── settings.py
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_students.py
│   │   ├── test_risk.py
│   │   ├── test_interventions.py
│   │   └── fixtures.py
│   │
│   ├── requirements.txt
│   ├── .env.example
│   └── manage.py
│
├── data/
│   ├── seed.py
│   ├── demo_data.csv
│   └── sample_students.json
│
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   ├── SETUP.md
│   └── RISK_ENGINE.md
│
├── requirements.md
├── design.md
├── tasks.md
├── .env.example
├── docker-compose.yml (optional)
├── .gitignore
└── README.md
```

---

## 3. Database Architecture

### 3.1 Database Diagram (Logical Model)

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│ USERS       │◄───────►│ STUDENTS     │◄───────►│ SUBJECTS   │
├─────────────┤         ├──────────────┤         ├────────────┤
│ id (PK)     │         │ id (PK)      │         │ id (PK)    │
│ email       │         │ name         │         │ name       │
│ password    │         │ email        │         │ code       │
│ role        │         │ student_id   │         │ semester   │
│ name        │         │ class        │         └────────────┘
│ created_at  │         │ created_at   │                 │
└─────────────┘         └──────────────┘                 │
      │                       │                          │
      │                       ├──────────────────────────┤
      │                       │                          │
      │              ┌────────▼─────────┐    ┌──────────▼──────────┐
      │              │ ATTENDANCE       │    │ ASSESSMENTS        │
      │              ├──────────────────┤    ├────────────────────┤
      │              │ id               │    │ id                 │
      │              │ student_id (FK)  │    │ student_id (FK)    │
      │              │ date             │    │ subject_id (FK)    │
      │              │ status           │    │ marks              │
      │              │ created_at       │    │ date               │
      │              └──────────────────┘    │ type               │
      │                                       └────────────────────┘
      │
      │         ┌────────────────────┐      ┌────────────────────┐
      │         │ ASSIGNMENTS        │      │ ACADEMIC_HISTORY   │
      │         ├────────────────────┤      ├────────────────────┤
      │         │ id                 │      │ id                 │
      │         │ student_id (FK)    │      │ student_id (FK)    │
      │         │ subject_id (FK)    │      │ semester           │
      │         │ title              │      │ average_marks      │
      │         │ marks              │      │ gpa                │
      │         │ status             │      │ created_at         │
      │         │ due_date           │      └────────────────────┘
      │         │ submission_date    │
      │         └────────────────────┘
      │
      │         ┌────────────────────┐      ┌────────────────────┐
      │         │ RISK_SCORES        │      │ RISK_FACTORS       │
      │         ├────────────────────┤      ├────────────────────┤
      │         │ id                 │      │ id                 │
      │         │ student_id (FK)    │      │ risk_score_id (FK) │
      │         │ overall_score      │      │ factor_name        │
      │         │ attendance_factor  │      │ contribution_pts   │
      │         │ performance_factor │      │ explanation        │
      │         │ created_at         │      └────────────────────┘
      │         └────────────────────┘
      │
      └────────────┬────────────────────────────────────────────┐
                   │                                            │
         ┌─────────▼──────────┐              ┌────────────────▼──────┐
         │ INTERVENTIONS      │              │ NOTIFICATIONS         │
         ├────────────────────┤              ├───────────────────────┤
         │ id                 │              │ id                    │
         │ student_id (FK)    │              │ user_id (FK)          │
         │ teacher_id (FK)    │              │ student_id (FK)       │
         │ problem            │              │ type                  │
         │ intervention_type  │              │ message               │
         │ start_date         │              │ priority              │
         │ status             │              │ read                  │
         │ outcome            │              │ created_at            │
         │ created_at         │              └───────────────────────┘
         └────────────────────┘
```

### 3.2 Database Tables

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'teacher', -- 'admin', 'teacher', 'student'
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Students Table
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    class_semester VARCHAR(50) NOT NULL,
    enrollment_status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'graduated'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Subjects Table
```sql
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    semester INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Attendance Table
```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'present', 'absent', 'late'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
```

#### Assessments Table
```sql
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    marks DECIMAL(10, 2) NOT NULL,
    max_marks DECIMAL(10, 2) NOT NULL DEFAULT 100,
    date DATE NOT NULL,
    assessment_type VARCHAR(50), -- 'quiz', 'midterm', 'final', 'project'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessments_student_date ON assessments(student_id, date);
```

#### Assignments Table
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    submission_date DATE,
    marks DECIMAL(10, 2),
    max_marks DECIMAL(10, 2) DEFAULT 100,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'submitted', 'graded', 'overdue'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignments_student_date ON assignments(student_id, due_date);
```

#### Academic History Table
```sql
CREATE TABLE academic_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester VARCHAR(50) NOT NULL,
    average_marks DECIMAL(10, 2),
    gpa DECIMAL(4, 2),
    status VARCHAR(50), -- 'pass', 'fail', 'incomplete'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, semester)
);
```

#### Risk Scores Table
```sql
CREATE TABLE risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    overall_score DECIMAL(10, 2) NOT NULL,
    attendance_factor DECIMAL(10, 2) DEFAULT 0,
    performance_factor DECIMAL(10, 2) DEFAULT 0,
    history_factor DECIMAL(10, 2) DEFAULT 0,
    assignment_factor DECIMAL(10, 2) DEFAULT 0,
    trend_factor DECIMAL(10, 2) DEFAULT 0,
    risk_level VARCHAR(50) NOT NULL, -- 'low', 'medium', 'high'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_scores_student_date ON risk_scores(student_id, created_at DESC);
```

#### Risk Factors Table
```sql
CREATE TABLE risk_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_score_id UUID NOT NULL REFERENCES risk_scores(id) ON DELETE CASCADE,
    factor_name VARCHAR(255) NOT NULL,
    contribution_points DECIMAL(10, 2) NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Interventions Table
```sql
CREATE TABLE interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    assigned_teacher_id UUID NOT NULL REFERENCES users(id),
    problem TEXT NOT NULL,
    intervention_type VARCHAR(100), -- 'mentoring', 'assignment_follow_up', 'attendance_monitoring'
    start_date DATE NOT NULL,
    follow_up_date DATE,
    status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'monitoring'
    notes TEXT,
    outcome TEXT,
    risk_score_before DECIMAL(10, 2),
    risk_score_after DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interventions_student_date ON interventions(student_id, created_at DESC);
```

#### Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    type VARCHAR(100), -- 'high_risk_alert', 'risk_increase', 'intervention_reminder'
    message TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
```

---

## 4. API Architecture

### 4.1 API Structure

#### Authentication Endpoints
```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - User login
POST   /api/v1/auth/logout            - User logout
POST   /api/v1/auth/refresh           - Refresh JWT token
GET    /api/v1/auth/me                - Get current user
```

#### Student Endpoints
```
GET    /api/v1/students               - List all students (paginated)
GET    /api/v1/students/{id}          - Get student detail
POST   /api/v1/students               - Create student (admin)
PUT    /api/v1/students/{id}          - Update student
DELETE /api/v1/students/{id}          - Delete student (admin)
GET    /api/v1/students/{id}/profile  - Get student AI profile
```

#### Risk Endpoints
```
GET    /api/v1/risk/dashboard         - Dashboard risk metrics
GET    /api/v1/risk/scores            - List risk scores (paginated)
GET    /api/v1/risk/{student_id}      - Get student risk details
GET    /api/v1/risk/radar/data        - Get radar visualization data
GET    /api/v1/risk/trends            - Get risk trends
POST   /api/v1/risk/calculate         - Recalculate risk (admin)
```

#### Intervention Endpoints
```
GET    /api/v1/interventions          - List interventions
POST   /api/v1/interventions          - Create intervention
GET    /api/v1/interventions/{id}     - Get intervention details
PUT    /api/v1/interventions/{id}     - Update intervention
POST   /api/v1/interventions/{id}/complete - Mark complete
GET    /api/v1/interventions/{id}/outcome - Get outcome data
```

#### Notification Endpoints
```
GET    /api/v1/notifications          - List notifications
POST   /api/v1/notifications/{id}/read - Mark notification read
DELETE /api/v1/notifications/{id}     - Delete notification
```

#### Report Endpoints
```
POST   /api/v1/reports/student        - Generate student report
POST   /api/v1/reports/class          - Generate class report
POST   /api/v1/reports/interventions  - Generate intervention effectiveness report
```

#### Data Endpoints
```
POST   /api/v1/data/upload            - Upload CSV
GET    /api/v1/data/validate          - Validate CSV data
POST   /api/v1/data/import            - Import validated data
```

#### Copilot Endpoints
```
POST   /api/v1/copilot/ask            - Ask question to copilot
GET    /api/v1/copilot/templates      - Get question templates
```

### 4.2 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error code",
  "message": "Error description",
  "details": { ... }
}
```

### 4.3 Authentication

- JWT token-based authentication
- Token stored in httpOnly cookie
- Refresh token mechanism
- Role-based authorization middleware

---

## 5. Risk Engine Architecture

### 5.1 Risk Calculation Module

```python
# risk_engine.py

class RiskCalculator:
    """
    Transparent hybrid risk engine.
    Version 1: Rule-based calculation
    Can be extended to ML models
    """
    
    def calculate_risk(student_id: str) -> RiskScore:
        """Calculate risk score for student"""
        # 1. Get student data
        # 2. Calculate individual factors
        # 3. Sum weighted factors
        # 4. Determine risk level
        # 5. Generate explanations
        # 6. Store risk score and factors
        pass
    
    def calculate_attendance_factor(attendance_pct: float) -> float:
        """Calculate attendance contribution (0-25 points)"""
        pass
    
    def calculate_performance_factor(current_avg: float) -> float:
        """Calculate current performance contribution (0-25 points)"""
        pass
    
    def calculate_history_factor(prev_avg: float, current_avg: float) -> float:
        """Calculate historical comparison contribution (0-20 points)"""
        pass
    
    def calculate_assignment_factor(completion_pct: float) -> float:
        """Calculate assignment completion contribution (0-15 points)"""
        pass
    
    def calculate_trend_factor(performance_history: List[float]) -> float:
        """Calculate trend contribution (0-15 points)"""
        # Analyze declining, stable, improving trends
        pass
```

### 5.2 Trend Analysis Module

```python
# trend_analyzer.py

class TrendAnalyzer:
    """Analyze performance trends and detect early warnings"""
    
    def detect_trend(performance_history: List[float]) -> TrendType:
        """DECLINING | STABLE | IMPROVING"""
        pass
    
    def calculate_trend_rate(performance_history: List[float]) -> float:
        """Rate of change"""
        pass
    
    def detect_early_warning(performance_history: List[float]) -> bool:
        """Detect consecutive performance decline"""
        pass
    
    def predict_next_value(performance_history: List[float]) -> float:
        """Simple linear prediction"""
        pass
```

### 5.3 Recommendation Engine

```python
# recommendation_engine.py

class RecommendationEngine:
    """Generate next best action recommendations"""
    
    def get_recommendations(risk_score: RiskScore) -> List[Recommendation]:
        """Generate prioritized recommendations based on risk factors"""
        # 1. Identify top 3 risk factors
        # 2. Map to interventions
        # 3. Prioritize by impact
        # 4. Add context and reasoning
        pass
    
    def recommend_intervention(risk_factor: str) -> Intervention:
        """Map risk factor to specific intervention"""
        pass
```

### 5.4 ML Architecture (Future)

```python
# models/ml_predictor.py

class MLRiskPredictor:
    """Machine learning model for risk prediction (Phase 2)"""
    
    def __init__(self, model_type: str = 'logistic_regression'):
        # Load pre-trained model
        pass
    
    def predict(student_data: Dict) -> float:
        """Predict risk score using ML model"""
        pass
    
    def predict_proba(student_data: Dict) -> float:
        """Get probability of high risk"""
        pass
```

---

## 6. UI/UX Architecture

### 6.1 Component Hierarchy

```
App
├── AuthContext
├── NotificationContext
│
├── Router
│   ├── Login (AuthLayout)
│   │
│   ├── MainLayout
│   │   ├── Header
│   │   │   ├── Logo
│   │   │   ├── UserMenu
│   │   │   └── Notifications
│   │   │
│   │   ├── Sidebar
│   │   │   ├── NavItem
│   │   │   └── RoleBasedMenu
│   │   │
│   │   └── MainContent
│   │       ├── Dashboard
│   │       ├── StudentList
│   │       ├── StudentProfile
│   │       ├── Interventions
│   │       ├── Reports
│   │       ├── DataCenter
│   │       └── Notifications
```

### 6.2 Design Tokens

```typescript
// constants/design.ts

export const COLORS = {
  primary: {
    50: '#f0f4ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  risk: {
    low: '#10b981',    // Green
    medium: '#f59e0b', // Amber
    high: '#ef4444',   // Red
  },
  neutral: {
    50: '#f9fafb',
    900: '#111827',
  },
}

export const TYPOGRAPHY = {
  h1: { size: '2.5rem', weight: 700 },
  h2: { size: '2rem', weight: 700 },
  h3: { size: '1.5rem', weight: 600 },
  body: { size: '1rem', weight: 400 },
}

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
}
```

### 6.3 State Management

Use Context API + React Hooks:
- AuthContext: User auth state, role
- NotificationContext: Notifications
- Query-based state: React Query for server state

---

## 7. Authentication & Authorization

### 7.1 Authentication Flow

```
1. User submits credentials
2. Backend validates and creates JWT
3. JWT returned in httpOnly cookie
4. Frontend stores token reference
5. Subsequent requests include JWT
6. Backend validates JWT before responding
7. On token expiry, refresh endpoint called
```

### 7.2 Role-Based Authorization

```python
# Middleware

@require_role('admin')
def admin_only_endpoint():
    pass

@require_role('teacher', 'admin')
def teacher_endpoint():
    pass

@require_role('student')
def student_endpoint():
    pass
```

---

## 8. Data Security & Privacy

### 8.1 Security Measures

- Password hashing: bcrypt
- JWT tokens with expiry (15 min access, 7 day refresh)
- HTTPS/SSL encryption
- Input validation and sanitization
- SQL injection prevention (SQLAlchemy ORM)
- CORS configuration
- Rate limiting
- Environment variables for secrets

### 8.2 Data Privacy

- Role-based access control
- Students can only view own data
- Teachers see only assigned students
- No automatic punishment/labeling
- Audit logs for sensitive operations

---

## 9. Deployment Architecture

### 9.1 Development Environment
- Frontend: Vite dev server on localhost:5173
- Backend: FastAPI dev server on localhost:8000
- Database: SQLite (development) or PostgreSQL (production)

### 9.2 Production Environment
```
├── Frontend
│   └── Vite build → Static files
│       └── CDN / Static server
│
├── Backend
│   └── FastAPI
│       └── Gunicorn/Uvicorn
│
├── Database
│   └── PostgreSQL
│
└── Reverse Proxy
    └── Nginx
```

---

## 10. Error Handling & Logging

### 10.1 Frontend Error Handling
- Try-catch blocks for async operations
- User-friendly error messages
- Error boundaries for React components
- Graceful degradation

### 10.2 Backend Error Handling
- Custom exception classes
- Proper HTTP status codes
- Detailed error logs
- User-safe error responses

---

## 11. Performance Considerations

### 11.1 Frontend
- Code splitting by route
- Lazy loading components
- Memoization of expensive calculations
- Debouncing filters and searches
- Chart virtualization for large datasets

### 11.2 Backend
- Database indexes on frequently queried columns
- Query optimization (select specific fields)
- Pagination for large result sets
- Caching with Redis (optional)
- Batch operations

### 11.3 Database
- Proper indexing strategy
- Query optimization
- Connection pooling
- Regular maintenance

---

## Document Version
- Version: 1.0
- Date: 2026-10-04
- Status: Final for Implementation
