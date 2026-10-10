# UPSWING - Database Documentation

**Complete database schema, relationships, and design rationale.**

---

## Table of Contents

1. [Database Overview](#database-overview)
2. [Schema Design](#schema-design)
3. [Table Specifications](#table-specifications)
4. [Relationships](#relationships)
5. [Indexing Strategy](#indexing-strategy)
6. [Data Types](#data-types)
7. [Constraints & Validation](#constraints--validation)
8. [Database Initialization](#database-initialization)
9. [Backup & Maintenance](#backup--maintenance)

---

## Database Overview

### Architecture

UPSWING uses a **normalized relational database** with 11 tables, designed for:

- **Data Integrity**: Foreign keys enforce referential integrity
- **Query Performance**: Strategic indexes on frequently queried columns
- **Scalability**: Proper normalization to avoid redundancy
- **Flexibility**: Support for SQLite (development) and PostgreSQL (production)

### Environment Support

| Environment | Database | Driver | Use Case |
|-------------|----------|--------|----------|
| Development | SQLite | sqlite3 | Local development, testing |
| Production | PostgreSQL | psycopg2 | Multi-user, concurrent access |

---

## Schema Design

### Design Principles

1. **Normalization**: 3rd Normal Form (3NF) to eliminate redundancy
2. **Integrity**: Foreign keys maintain data consistency
3. **Auditability**: created_at and updated_at timestamps
4. **Scalability**: UUID primary keys for distributed systems
5. **Performance**: Indexes on frequently filtered/joined columns

### Entity Relationship Diagram (Logical)

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│ USERS       │◄───────►│ STUDENTS     │◄───────►│ SUBJECTS   │
└─────────────┘         └──────────────┘         └────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
         ┌──────────▼──┐ ┌──────▼──┐ ┌────▼─────┐
         │ ATTENDANCE  │ │ASSESSM. │ │ASSIGN.   │
         └─────────────┘ └──────────┘ └──────────┘
                    │           │           │
                    └───────────┼───────────┘
                                │
                        ┌───────▼────────┐
                        │ ACADEMIC_HIST. │
                        └────────────────┘
                                │
                        ┌───────▼────────┐
                        │ RISK_SCORES    │
                        └────────────────┘
                                │
                        ┌───────▼────────┐
                        │ RISK_FACTORS   │
                        └────────────────┘
                                │
                    ┌───────────┴──────────┐
                    │                      │
         ┌──────────▼──────┐    ┌─────────▼─────────┐
         │ INTERVENTIONS   │    │ NOTIFICATIONS     │
         └─────────────────┘    └───────────────────┘
```

---

## Table Specifications

### 1. Users Table

**Purpose**: Store system users (admin, teacher, student)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'teacher',
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `email`: User email (unique, required for login)
- `password_hash`: Bcrypt hashed password
- `name`: User full name
- `role`: User role (admin/teacher/student)
- `phone`: Optional phone number
- `is_active`: Account status
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Key Features**:
- Unique email constraint for login
- Role-based access control
- Password stored as hash (never plaintext)

---

### 2. Students Table

**Purpose**: Store student profiles and enrollment information

```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    class_semester VARCHAR(50) NOT NULL,
    enrollment_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_class ON students(class_semester);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `student_id`: Student ID (e.g., StuID123)
- `name`: Student name
- `email`: Student email
- `class_semester`: Class/semester (e.g., BCA-4, CSE-2)
- `enrollment_status`: active/inactive/graduated
- `created_at`: Record creation
- `updated_at`: Last update

**Key Features**:
- Unique student_id for external system integration
- Class/semester tracking for cohort analysis
- Enrollment status for filtering active students

---

### 3. Subjects Table

**Purpose**: Store course/subject information

```sql
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    semester INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_subjects_semester ON subjects(semester);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `name`: Subject name (e.g., "Data Structures")
- `code`: Subject code (e.g., "CS201")
- `semester`: Semester offered (optional, for filtering)
- `created_at`: Record creation

---

### 4. Attendance Table

**Purpose**: Track daily attendance records

```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,  -- present, absent, late
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `student_id`: Foreign key to students
- `date`: Attendance date
- `status`: present/absent/late
- `created_at`: Record creation

**Key Features**:
- Unique constraint on (student_id, date) prevents duplicate entries
- Indexed for fast attendance percentage calculations
- Date-range queries for trend analysis

---

### 5. Assessments Table

**Purpose**: Store exam/quiz marks

```sql
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    marks DECIMAL(10,2) NOT NULL,
    max_marks DECIMAL(10,2) NOT NULL DEFAULT 100,
    date DATE NOT NULL,
    assessment_type VARCHAR(50),  -- quiz, midterm, final, project
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessments_student_date ON assessments(student_id, date);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `student_id`: Foreign key to students
- `subject_id`: Foreign key to subjects
- `marks`: Marks obtained
- `max_marks`: Total marks
- `date`: Assessment date
- `assessment_type`: Type of assessment
- `created_at`: Record creation

**Key Features**:
- Tracks marks per subject for subject-wise analysis
- Assessment type for different weightings
- Decimal for precision (2 decimal places)

---

### 6. Assignments Table

**Purpose**: Track assignment submission and grading

```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    submission_date DATE,
    marks DECIMAL(10,2),
    max_marks DECIMAL(10,2) DEFAULT 100,
    status VARCHAR(50) DEFAULT 'pending',  -- pending, submitted, graded, overdue
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignments_student_date ON assignments(student_id, due_date);
CREATE INDEX idx_assignments_status ON assignments(status);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `student_id`: Foreign key to students
- `subject_id`: Foreign key to subjects
- `title`: Assignment title
- `due_date`: Submission deadline
- `submission_date`: Actual submission date
- `marks`: Marks received
- `max_marks`: Total marks
- `status`: pending/submitted/graded/overdue
- `created_at`: Record creation

**Key Features**:
- Status tracking for incomplete assignments
- Date comparison for overdue detection
- Subject association for subject-specific analysis

---

### 7. Academic History Table

**Purpose**: Store semester-level performance records

```sql
CREATE TABLE academic_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester VARCHAR(50) NOT NULL,
    average_marks DECIMAL(10,2),
    gpa DECIMAL(4,2),
    status VARCHAR(50),  -- pass, fail, incomplete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, semester)
);

CREATE INDEX idx_academic_history_student ON academic_history(student_id);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `student_id`: Foreign key to students
- `semester`: Semester identifier
- `average_marks`: Semester average
- `gpa`: Grade point average
- `status`: pass/fail/incomplete
- `created_at`: Record creation

**Key Features**:
- Unique constraint on (student_id, semester) for one record per student per semester
- Used for historical comparison in risk calculation
- Semester-level metrics for pattern analysis

---

### 8. Risk Scores Table

**Purpose**: Store calculated risk scores for students

```sql
CREATE TABLE risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    overall_score DECIMAL(10,2) NOT NULL,
    attendance_factor DECIMAL(10,2) DEFAULT 0,
    performance_factor DECIMAL(10,2) DEFAULT 0,
    history_factor DECIMAL(10,2) DEFAULT 0,
    assignment_factor DECIMAL(10,2) DEFAULT 0,
    trend_factor DECIMAL(10,2) DEFAULT 0,
    risk_level VARCHAR(50) NOT NULL,  -- low, medium, high
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_scores_student_date ON risk_scores(student_id, created_at DESC);
CREATE INDEX idx_risk_scores_level ON risk_scores(risk_level);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `student_id`: Foreign key to students
- `overall_score`: Calculated risk score (0-100)
- `attendance_factor`: Attendance contribution (0-25)
- `performance_factor`: Performance contribution (0-25)
- `history_factor`: Historical comparison (0-20)
- `assignment_factor`: Assignment completion (0-15)
- `trend_factor`: Trend contribution (0-15)
- `risk_level`: low/medium/high classification
- `created_at`: Calculation timestamp

**Key Features**:
- Stores individual factor contributions for transparency
- Time-series data for trend analysis
- Multiple scores per student (one per calculation cycle)

---

### 9. Risk Factors Table

**Purpose**: Store detailed explanations for each risk factor

```sql
CREATE TABLE risk_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_score_id UUID NOT NULL REFERENCES risk_scores(id) ON DELETE CASCADE,
    factor_name VARCHAR(255) NOT NULL,
    contribution_points DECIMAL(10,2) NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_factors_risk_score ON risk_factors(risk_score_id);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `risk_score_id`: Foreign key to risk_scores
- `factor_name`: Name of risk factor
- `contribution_points`: Points contributed to risk
- `explanation`: Human-readable explanation
- `created_at`: Record creation

**Key Features**:
- Provides transparency into risk calculation
- Multiple factors per risk score
- Explanation text for teacher understanding

---

### 10. Interventions Table

**Purpose**: Track intervention creation and outcomes

```sql
CREATE TABLE interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    assigned_teacher_id UUID NOT NULL REFERENCES users(id),
    problem TEXT NOT NULL,
    intervention_type VARCHAR(100),
    start_date DATE NOT NULL,
    follow_up_date DATE,
    status VARCHAR(50) DEFAULT 'planned',  -- planned, in_progress, completed, monitoring
    notes TEXT,
    outcome TEXT,
    risk_score_before DECIMAL(10,2),
    risk_score_after DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interventions_student_date ON interventions(student_id, created_at DESC);
CREATE INDEX idx_interventions_status ON interventions(status);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `student_id`: Foreign key to students
- `assigned_teacher_id`: Foreign key to users (teacher)
- `problem`: Problem description
- `intervention_type`: Type of intervention
- `start_date`: Intervention start date
- `follow_up_date`: Scheduled follow-up date
- `status`: planned/in_progress/completed/monitoring
- `notes`: Additional notes
- `outcome`: Outcome description
- `risk_score_before`: Risk score before intervention
- `risk_score_after`: Risk score after intervention
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Key Features**:
- Tracks intervention lifecycle
- Before/after risk scores for effectiveness measurement
- Status workflow for intervention tracking

---

### 11. Notifications Table

**Purpose**: Store user notifications and alerts

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium',  -- critical, high, medium, low
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_priority ON notifications(priority);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `user_id`: Foreign key to users (recipient)
- `student_id`: Foreign key to students (subject of notification)
- `type`: Notification type
- `message`: Notification message
- `priority`: critical/high/medium/low
- `read`: Read status
- `created_at`: Creation timestamp

**Key Features**:
- Targets notifications to specific users
- Priority-based sorting
- Read/unread status tracking

---

## Relationships

### Foreign Key Relationships

| Table | Foreign Key | References | On Delete |
|-------|-------------|-----------|-----------|
| Attendance | student_id | students.id | CASCADE |
| Assessment | student_id | students.id | CASCADE |
| Assessment | subject_id | subjects.id | CASCADE |
| Assignment | student_id | students.id | CASCADE |
| Assignment | subject_id | subjects.id | CASCADE |
| AcademicHistory | student_id | students.id | CASCADE |
| RiskScore | student_id | students.id | CASCADE |
| RiskFactor | risk_score_id | risk_scores.id | CASCADE |
| Intervention | student_id | students.id | CASCADE |
| Intervention | assigned_teacher_id | users.id | RESTRICT |
| Notification | user_id | users.id | CASCADE |
| Notification | student_id | students.id | CASCADE |

**Cascading Deletes**: When a student is deleted, all their related records (attendance, assessments, etc.) are automatically deleted.

---

## Indexing Strategy

### Index Design Goals

1. **Query Performance**: Speed up WHERE and JOIN clauses
2. **Selectivity**: Index high-cardinality columns
3. **Maintenance Cost**: Balance between query speed and write overhead

### Indexes by Priority

**High Priority (Created)**:
- `idx_users_email` - Login queries
- `idx_students_student_id` - Student lookup
- `idx_attendance_student_date` - Attendance calculations
- `idx_assessments_student_date` - Performance queries
- `idx_assignments_student_date` - Assignment tracking
- `idx_risk_scores_student_date` - Risk score trends
- `idx_risk_scores_level` - Filter by risk level
- `idx_interventions_student_date` - Intervention history
- `idx_interventions_status` - Status-based filtering
- `idx_notifications_user_read` - Notification queries

**Medium Priority (Recommended)**:
- `idx_academic_history_student` - Academic record lookup
- `idx_subjects_code` - Subject lookup
- `idx_assessments_type` - Assessment type filtering
- `idx_assignments_status` - Status-based queries

### Composite Indexes

Composite indexes (multiple columns) are used when:
1. Queries frequently filter on multiple columns together
2. Selectivity improves significantly
3. Read:write ratio is high

Example: `idx_attendance_student_date` speeds up queries like:
```sql
SELECT * FROM attendance 
WHERE student_id = ? AND date BETWEEN ? AND ?
```

---

## Data Types

### Column Type Mapping

| Type | Purpose | Examples |
|------|---------|----------|
| UUID | Primary keys, unique identifiers | Student ID, User ID |
| VARCHAR(n) | Text with max length | Names, emails, codes |
| TEXT | Long-form text | Descriptions, explanations |
| DATE | Date only (no time) | Attendance date, due date |
| DECIMAL(10,2) | Numeric with precision | Marks (10 digits, 2 decimal) |
| BOOLEAN | True/false values | is_active, read status |
| TIMESTAMP | Date and time with timezone | created_at, updated_at |

### Important Notes

- **DECIMAL** used for marks (not FLOAT) for precision
- **DATE** used instead of DATETIME for date-only fields
- **TIMESTAMP WITH TIME ZONE** for audit timestamps
- **UUID** for distributed system compatibility
- **VARCHAR** with length for constraint enforcement

---

## Constraints & Validation

### Unique Constraints

- `users.email` - Each user has unique email
- `students.student_id` - Each student has unique ID
- `subjects.code` - Each subject code is unique
- `(students.id, date)` in attendance - One attendance record per day per student
- `(students.id, semester)` in academic_history - One history record per semester

### NOT NULL Constraints

Applied to all fields that must have values:
- User: email, password_hash, name, role
- Student: name, student_id, class_semester
- Assessment: student_id, subject_id, marks, date
- Risk Score: student_id, overall_score, risk_level

### Default Values

- `is_active` (users) - true
- `enrollment_status` (students) - "active"
- `status` (assignments) - "pending"
- `status` (interventions) - "planned"
- `priority` (notifications) - "medium"
- `read` (notifications) - false

### Check Constraints (Recommended)

```sql
-- Marks should be 0-100 (or max_marks)
ALTER TABLE assessments ADD CONSTRAINT check_marks_range 
CHECK (marks >= 0 AND marks <= max_marks);

-- Risk score should be 0-100
ALTER TABLE risk_scores ADD CONSTRAINT check_risk_range 
CHECK (overall_score >= 0 AND overall_score <= 100);

-- Attendance percentage should be 0-100
ALTER TABLE attendance ADD CONSTRAINT check_status_valid 
CHECK (status IN ('present', 'absent', 'late'));
```

---

## Database Initialization

### SQLite (Development)

Database automatically created on first run:
```bash
python -c "from app.database import init_db; init_db()"
```

Creates `upswing.db` file in backend directory.

### PostgreSQL (Production)

#### 1. Create Database

```bash
createdb upswing
```

#### 2. Initialize Schema

```bash
# Using Alembic (migrations)
alembic upgrade head

# Or manually
psql upswing < schema.sql
```

#### 3. Create Indexes

All indexes are created automatically when models are initialized.

---

## Backup & Maintenance

### SQLite Backup

```bash
# Simple file copy
cp upswing.db eduvision.backup.db

# Using sqlite3 CLI
sqlite3 upswing.db ".dump" > upswing_dump.sql
```

### PostgreSQL Backup

```bash
# Backup database
pg_dump upswing > upswing_backup.sql

# Backup with compression
pg_dump -Fc upswing > upswing_backup.dump

# Restore from backup
psql upswing < upswing_backup.sql
```

### Maintenance Commands

```sql
-- Analyze table statistics (PostgreSQL)
ANALYZE;

-- Rebuild indexes (PostgreSQL)
REINDEX DATABASE upswing;

-- Vacuum database (PostgreSQL)
VACUUM ANALYZE;

-- SQLite integrity check
PRAGMA integrity_check;
```

---

## Query Patterns

### Common Queries

**Get student risk status**:
```sql
SELECT rs.* FROM risk_scores rs
WHERE rs.student_id = ? 
ORDER BY rs.created_at DESC 
LIMIT 1;
```

**Get attendance percentage**:
```sql
SELECT 
  COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*) as attendance_pct
FROM attendance
WHERE student_id = ? AND date >= DATE('now', '-90 days');
```

**Get average marks**:
```sql
SELECT AVG(marks * 100.0 / max_marks) as avg_percentage
FROM assessments
WHERE student_id = ?;
```

**Get students at risk**:
```sql
SELECT s.*, rs.overall_score, rs.risk_level
FROM students s
JOIN (
  SELECT DISTINCT ON (student_id) * 
  FROM risk_scores 
  ORDER BY student_id, created_at DESC
) rs ON s.id = rs.student_id
WHERE rs.risk_level = 'high'
ORDER BY rs.overall_score DESC;
```

---

## Document Version
- Version: 1.0
- Date: 2026-10-04
- Status: Complete Database Schema Documentation
