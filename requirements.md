# EDUVISION AI - Requirements Document

**"Detect Early. Understand Why. Take Action. Improve Outcomes."**

An AI-powered Student Academic Performance Detection & Early Warning System

---

## 1. Executive Summary

EDUVISION AI is an intelligent early warning platform that shifts academic intervention from reactive (discovering failure after it happens) to proactive (identifying risk signals before failure occurs).

The system addresses a critical gap in educational institutions: the inability to detect struggling students early enough for meaningful intervention.

### Core Philosophy

Transform the academic intervention model from:
```
Student fails → Analyze what happened
```

To:
```
Early warning → Understand why → Intervene → Track → Improve
```

---

## 2. Problem Statement

### Current State
- Institutions discover student struggles only after: final exams, semester results, repeated failures, or severe attendance problems
- By this point, intervention may be ineffective
- Teachers lack predictive insights into student performance
- No systematic tracking of intervention effectiveness

### Solution
- Real-time early warning detection based on multiple academic signals
- Explainable AI reasoning showing *why* a student is at risk
- Actionable recommendations for targeted interventions
- Outcome tracking to measure intervention effectiveness

---

## 3. Core Product Objectives

The application must answer **four critical questions** for every student:

### 1. WHAT is happening?
Detect current academic status with clear metrics and trends.

**Example:**
> "Academic performance has declined by 18% during the last three assessments."

### 2. WHY is it happening?
Identify the contributing factors driving the risk.

**Example:**
> "Low attendance (64%), declining Mathematics scores (39%), and 3 incomplete assignments are the major factors."

### 3. WHAT should the teacher do?
Provide specific, actionable interventions.

**Example:**
> "1. Schedule Mathematics mentoring  
> 2. Follow up on missing assignments  
> 3. Monitor attendance for next 14 days  
> 4. Review performance after next assessment"

### 4. DID IT WORK?
Measure whether interventions improved student performance.

**Example:**
> "Risk score decreased from 82 → 58 after intervention."

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization

- **User Roles:**
  - Admin: Full system access, user management, data management, institution analytics
  - Teacher: View assigned students, create interventions, monitor progress
  - Student: View personal performance, recommendations, track progress
  
- **Authentication:**
  - Secure login with email/password
  - Password hashing (bcrypt)
  - Session management
  - Role-based access control (RBAC)

### 4.2 Student Management

- **Student Data:**
  - Unique student ID
  - Name, email, class/semester
  - Enrollment status
  - Academic history tracking

- **Data Upload:**
  - CSV import with validation
  - Detect missing values, invalid data, duplicates
  - Provide validation report with error details
  - Batch student creation

### 4.3 Academic Data Tracking

Track and store:
- **Attendance:** Percentage, dates, absences
- **Assessments:** Marks, dates, subject, weight
- **Assignments:** Completion status, marks, due dates
- **Subject Performance:** Subject-wise scores, trends
- **Academic History:** Previous semester performance, cumulative trends

### 4.4 Risk Detection & Analysis

#### 4.4.1 Risk Calculation Engine

**Hybrid Transparent Risk Engine (v1):**

Risk Score Components:
1. **Attendance Factor** (0-25 points)
   - Below 70%: +25 points
   - 70-80%: +15 points
   - 80-90%: +5 points
   - Above 90%: 0 points

2. **Current Performance** (0-25 points)
   - Below 40%: +25 points
   - 40-60%: +15 points
   - 60-75%: +10 points
   - Above 75%: 0 points

3. **Historical Performance** (0-20 points)
   - Previous semester significantly lower: +20 points
   - Previous semester lower: +10 points
   - Stable/similar: +5 points
   - Previous semester higher: 0 points

4. **Assignment Completion** (0-15 points)
   - Below 50% complete: +15 points
   - 50-70% complete: +10 points
   - 70-85% complete: +5 points
   - Above 85%: 0 points

5. **Performance Trend** (0-15 points)
   - Declining trend: +15 points
   - Unstable trend: +10 points
   - Stable trend: +5 points
   - Improving trend: 0 points

**Risk Classification:**
- 0-39: LOW RISK
- 40-69: MEDIUM RISK
- 70-100: HIGH RISK

#### 4.4.2 Trend Detection

- Detect negative trends over consecutive periods
- Identify sharp performance drops
- Recognize improving trends
- Generate early warnings for at-risk students

#### 4.4.3 AI Risk Explanation

- Display contributing factors with weights
- Provide human-readable explanation of risk drivers
- Show "Why This Score?" breakdown with visual indicators
- Connect data to actionable insights

### 4.5 Intervention Management

#### 4.5.1 Intervention Creation

Teachers can create interventions specifying:
- Student
- Problem identified
- Intervention type (mentoring, assignment follow-up, attendance monitoring, etc.)
- Assigned teacher
- Start date
- Follow-up/completion date
- Notes
- Expected outcomes

#### 4.5.2 Intervention Tracking

- Status workflow: Planned → In Progress → Completed → Monitoring
- Track completion dates
- Record outcomes
- Associate with student risk score

#### 4.5.3 Outcome Measurement

- Compare before/after metrics:
  - Risk score change
  - Attendance improvement
  - Performance improvement
  - Assignment completion
- Visualize intervention effectiveness
- Track cumulative intervention success

### 4.6 Dashboard & Analytics

#### 4.6.1 Main Dashboard

Display:
- **Academic Health Summary:**
  - Total students
  - High risk count
  - Medium risk count
  - Low risk count
  - Improving count
  - Declining count
  - Active interventions

- **Attention Required Section:**
  - Top 5-10 highest-risk students
  - Quick action buttons
  - Key metrics per student

- **Key Visualizations:**
  - Risk distribution (pie/donut)
  - Risk trend over time
  - Attendance vs performance scatter plot
  - Subject-wise risk distribution
  - Intervention impact chart
  - Class performance trend

#### 4.6.2 Analytics & Reporting

- Risk distribution analytics
- Trend analysis
- Subject performance analysis
- Intervention effectiveness metrics
- Generate reports (PDF/CSV)

### 4.7 Student Profile & AI Analysis

Detailed student page showing:

**Header:**
- Student name, ID, class/semester
- Current risk score (with risk level badge)
- Quick status indicators

**Key Sections:**
1. **Performance Snapshot** - Current marks, attendance, overall status
2. **Academic Snapshot** - Subject performance
3. **Attendance Trend** - Visual trend over time
4. **Performance Trend** - Visual trend over time
5. **Why This Score?** - Breakdown of risk factors with visual indicators
6. **Next Best Action** - Specific recommendations
7. **Assignment Status** - Pending, completed, overdue
8. **Intervention History** - Past and current interventions
9. **Improvement Tracking** - Before/after intervention comparison
10. **AI Insights** - Explanatory analysis

### 4.8 Risk Radar (Signature Feature)

Interactive visualization of students as nodes/points based on:
- X-axis: Attendance (Low → High)
- Y-axis: Performance (Low → High)
- Color: Risk level (Green/Yellow/Red)
- Size: Magnitude of risk

Interactions:
- Hover: Show student name, risk score, key metrics
- Click: Open student profile
- Filter by risk level, class, subject

### 4.9 Student Risk Table (Monitoring Table)

Powerful table interface with:

**Columns:**
- Student name
- Risk score (with trend arrow)
- Attendance %
- Average marks
- Trend indicator
- Top risk factor
- Last intervention
- Next best action

**Features:**
- Search by name/ID
- Sort by any column
- Multi-filter:
  - Risk level (All/High/Medium/Low)
  - Trend (All/Improving/Stable/Declining)
  - Subject
  - Last intervention
- Pagination
- Inline actions (View Profile, Create Intervention)

### 4.10 AI Copilot (Teacher Assistant)

Intelligent assistant answering questions like:
- "Why is [Student] at risk?"
- "What are [Student]'s biggest problems?"
- "What should I do next for [Student]?"
- "Has [Student]'s performance improved?"
- "Which students need attention this week?"

Features:
- Predefined question templates
- Data-driven answers using system data
- Explanation source attribution
- Follow-up question support

Implementation: Initially mock/structured responses, future integration with LLM API.

### 4.11 Notifications

Intelligent alert system:

**Notification Types:**
- High-risk student alert
- Risk increase alert
- Intervention reminder
- Performance milestone
- Attendance warning
- Assignment alert

**Notification Features:**
- Priority levels (Critical, High, Medium, Low)
- Read/unread status
- Timestamp
- Student/class association
- Quick action links
- Notification center

### 4.12 Data Management

#### 4.12.1 Data Center

- CSV file upload with validation
- Data quality reporting:
  - Valid records
  - Warnings (fixable issues)
  - Errors (blocking issues)
- Batch create/update students
- Data mapping configuration

#### 4.12.2 Data Security

- Role-based access control
- Student data privacy
- No automatic punishment/labeling
- Secure password storage
- Input validation
- Protected API endpoints

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Dashboard loads in < 2 seconds
- Risk calculations complete in < 1 second
- Data queries optimized with indexing
- Responsive UI interactions (< 100ms)

### 5.2 Scalability
- Support 500+ students initially
- Support 50+ teachers
- Database normalized and indexed
- API pagination for large datasets
- Efficient filtering and search

### 5.3 Reliability
- Graceful error handling
- Data validation at input
- Transaction integrity
- Backup capability

### 5.4 Usability
- Intuitive navigation
- Consistent design language
- Clear visual hierarchy
- Responsive on desktop, tablet, mobile
- Accessibility compliance (WCAG 2.1 AA)

### 5.5 Security
- Authentication required for all access
- Role-based authorization
- HTTPS/SSL encryption
- Password requirements (min 8 chars, complexity)
- Environment variables for secrets
- Input sanitization

### 5.6 Maintainability
- Clean code architecture
- Reusable components
- Clear documentation
- TypeScript for type safety
- Modular design
- Proper separation of concerns

---

## 6. User Roles & Permissions

### Admin
- Create/manage users
- Create/manage students
- Upload and manage data
- View institution-level analytics
- Configure system settings
- Access audit logs

### Teacher
- View assigned students
- Monitor risk scores
- View AI explanations
- Create interventions
- Track intervention outcomes
- Generate student reports
- Access student profiles
- Use AI Copilot

### Student
- View personal performance
- View recommendations
- Track progress
- View intervention history
- Cannot modify data

---

## 7. User Journeys

### 7.1 Teacher Morning Check-In

1. Login to EDUVISION AI
2. View dashboard: "7 students need attention"
3. Identify high-risk student from Attention Required section
4. Click to open AI analysis
5. Review: Risk score (82), Why (attendance + performance), What to do (recommendations)
6. Click "Create Intervention"
7. Fill intervention form
8. Save intervention

### 7.2 Monitoring Student Progress

1. View Student Profile
2. Check "Why This Score?" breakdown
3. See improvement opportunities
4. Review intervention history
5. Check "Did It Work?" section showing before/after metrics
6. Plan next intervention if needed

### 7.3 Class Analytics Review

1. Access dashboard
2. Review risk distribution
3. Check performance trends
4. Identify subject-specific issues
5. Check intervention effectiveness
6. Generate class report

---

## 8. Data Model Overview

### Core Entities

**Users**
- ID, email, password_hash, role, name, phone, created_at, updated_at

**Students**
- ID, name, email, student_id, class/semester, enrollment_status, created_at, updated_at

**Subjects**
- ID, name, code, semester, created_at, updated_at

**Attendance**
- ID, student_id, date, status (present/absent), created_at

**Assessments**
- ID, student_id, subject_id, marks, max_marks, date, assessment_type, created_at

**Assignments**
- ID, student_id, subject_id, title, due_date, submission_date, marks, status, created_at

**Academic History**
- ID, student_id, semester, average_marks, gpa, status, created_at

**Risk Scores**
- ID, student_id, date, overall_score, attendance_factor, performance_factor, history_factor, assignment_factor, trend_factor, risk_level, created_at

**Risk Factors**
- ID, risk_score_id, factor_name, contribution_points, explanation, created_at

**Interventions**
- ID, student_id, assigned_teacher_id, problem, intervention_type, start_date, follow_up_date, status, notes, outcome, created_at, updated_at

**Notifications**
- ID, user_id, student_id, type, message, priority, read, created_at, updated_at

---

## 9. Risk Engine Specifications

### 9.1 Transparent Hybrid Model (Version 1)

Structure allows replacement by ML model without API changes.

**Current Implementation:**
- Rule-based calculation with explicit formulas
- Clear factor attribution
- Explainable scoring

**Future Extension:**
- Logistic Regression model
- Random Forest classifier
- XGBoost predictor
- Maintain same output format for API compatibility

### 9.2 Early Warning Detection

Detect not only low performance but negative trends:

**Trend Analysis:**
- Monitor performance over consecutive periods
- Identify declining trends (e.g., 45 → 49 → 57 is increasing, acceptable)
- Identify increasing instability
- Flag sharp drops as early warnings

**Example:**
```
Week 1: 75
Week 2: 73
Week 3: 70
Week 4: 65
Week 5: 58

Alert: "Academic risk has increased continuously for 5 weeks."
```

---

## 10. UI/UX Requirements

### 10.1 Design Philosophy

**Signature UI Concepts:**

1. **AI Risk Radar** - Interactive node map of students by risk
2. **Why This Score?** - Visual breakdown of risk factors
3. **Next Best Action** - Clear intervention recommendations
4. **Did It Work?** - Before/after intervention comparison

### 10.2 Design Language

- Modern "AI Academic Command Center" aesthetic
- Premium SaaS visual style
- Clean typography
- Strong visual hierarchy
- Dark/light mode support
- Deep navy/charcoal foundation
- Controlled accent colors
- Subtle gradients and glass effects
- Soft shadows, thin borders
- Minimal, meaningful icons
- Smooth micro-interactions

### 10.3 Visual Hierarchy

**Critical Information First:**
```
ATTENTION → EXPLANATION → ACTION
```

Example instead of just "Risk Score: 82":
```
🔴 HIGH RISK
Aarav Sharma
82 / 100

WHY?
- Attendance ↓ 64%
- Math performance ↓ 39%
- 3 missing assignments

WHAT NEXT?
[CREATE INTERVENTION]
```

### 10.4 Responsiveness

- **Desktop:** Full AI analytics command center
- **Tablet:** Optimized multi-column layout
- **Mobile:** Prioritize alerts, risk, profiles, actions

Not simply shrinking the desktop interface.

### 10.5 Accessibility

- Good contrast ratios (WCAG AA compliance)
- Keyboard navigation support
- Meaningful semantic HTML
- Screen reader optimization
- Accessible form labels and error messages
- Not relying solely on color to communicate risk

---

## 11. Success Criteria

A teacher should be able to easily answer:

- ✓ "Which students need my attention today?"
- ✓ "Why are they at risk?"
- ✓ "How serious is the risk?"
- ✓ "What should I do?"
- ✓ "Did my intervention work?"

If the UI cannot clearly answer these questions, improve the design.

---

## 12. Out of Scope (Phase 1)

- Student behavior tracking
- Parent/guardian portal
- Advanced ML models (future phase)
- Mobile native apps
- Real-time LLM integration (placeholder implementation)
- Automated intervention execution
- Predictive graduation rates

---

## 13. Constraints & Assumptions

### Constraints
- Development timeline: College project scope
- Technology: React, FastAPI, PostgreSQL
- Team: Solo developer (using Kiro AI)
- Demo data: 100-500 students

### Assumptions
- Students have consistent data entry
- Teachers understand academic context
- Institutions have regular assessment schedules
- Attendance data is available
- Teachers will use recommendations responsibly

---

## 14. Future Enhancements

**Phase 2:**
- Machine learning models (Logistic Regression, Random Forest, XGBoost)
- Real LLM integration for Copilot
- Parent/student portal
- Advanced analytics and predictive modeling
- Integration with existing student information systems
- Automated report generation

**Phase 3:**
- Behavioral tracking
- Course recommendation system
- Peer comparison analytics
- Intervention recommendation engine (AI-driven)
- Mobile app

---

## Document Version
- Version: 1.0
- Date: 2026-10-04
- Status: Final for Implementation
