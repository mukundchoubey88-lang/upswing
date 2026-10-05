# EDUVISION AI - Demo Data

**Demo data generation and seeding scripts.**

---

## Contents

### seed.py

Comprehensive demo data generation script that creates:

#### Users (6 total)
- **1 Admin**: admin@school.com / password123
- **5 Teachers**: teacher[1-5]@school.com / password123
- **1 Student**: student@school.com / password123

#### Students (260 total)
With realistic correlations between attendance, marks, and assignments:

**High Risk (40 students)**
- Attendance: 40-70%
- Average marks: 20-45%
- Assignment completion: 30-50%
- Risk level: HIGH
- Pattern: Low attendance → Low marks → Incomplete assignments

**Medium Risk (120 students)**
- Attendance: 70-85%
- Average marks: 50-70%
- Assignment completion: 60-80%
- Risk level: MEDIUM
- Pattern: Variable performance

**Low Risk (80 students)**
- Attendance: 85-98%
- Average marks: 75-95%
- Assignment completion: 85-98%
- Risk level: LOW
- Pattern: Consistent, strong performance

**Improving (20 students)**
- Attendance: 75-95%
- Average marks: 60-80%
- Assignment completion: 70-90%
- Risk level: MEDIUM (with improving trend)
- Pattern: Shows improvement trajectory

#### Subjects (8 total)
- CS101: Data Structures
- CS102: Web Development
- CS201: Database Systems
- CS202: Web Frameworks
- CS301: Machine Learning
- CS302: Cloud Computing
- CS401: Advanced Algorithms
- CS402: DevOps

#### Academic Data Per Student
- **Attendance**: 90-day history with realistic weekday/weekend patterns
- **Assessments**: 3-5 per subject (quiz, midterm, final, project)
- **Assignments**: 4-6 per subject with completion status
- **Academic History**: Current and previous semester records

#### Risk Scores
- Automatically calculated using the transparent risk engine
- Based on: attendance, performance, history, assignments, trend
- Includes individual factor breakdowns with explanations

---

## How to Use

### 1. Run the Seeding Script

```bash
cd backend

# Activate virtual environment
source venv/bin/activate  # or .\venv\Scripts\Activate.ps1 on Windows

# Run the seed script
python ../data/seed.py
```

### 2. Expected Output

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

### 3. Verify Data

Connect to database and verify:

```sql
-- Check user count
SELECT COUNT(*) FROM users;

-- Check student count
SELECT COUNT(*) FROM students;

-- Check risk scores
SELECT risk_level, COUNT(*) FROM risk_scores GROUP BY risk_level;

-- Check high-risk students
SELECT s.name, rs.overall_score, rs.risk_level
FROM students s
JOIN risk_scores rs ON s.id = rs.student_id
WHERE rs.risk_level = 'high'
LIMIT 10;
```

### 4. Login to Application

Once data is seeded, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | password123 |
| Teacher | teacher1@school.com | password123 |
| Student | student@school.com | password123 |

---

## Data Characteristics

### Realistic Correlations

The demo data includes realistic correlations between academic metrics:

1. **Attendance ↔ Marks**: Students with low attendance typically have lower marks
2. **Attendance ↔ Assignments**: Low attendance correlates with incomplete assignments
3. **Marks ↔ Assignments**: Higher marks typically accompany more complete assignments
4. **Trend Analysis**: Some students show declining trends (high-risk), others improving (improving profile)

### Risk Distribution

```
Low Risk:     30.8% (80 students)
Medium Risk:  46.2% (120 students)
High Risk:    15.4% (40 students)
Improving:     7.7% (20 students)
```

This distribution matches realistic class composition for early detection system.

### Student Name Examples

Generated realistic Indian names:
- Aarav Sharma
- Priya Singh
- Arjun Patel
- Neha Reddy
- Rohit Kumar
- etc.

### Date Ranges

- **Attendance**: Last 90 days
- **Assessments**: Last 60 days
- **Assignments**: Last 30 days
- **Academic History**: Current and previous semester

---

## Customization

To modify the demo data generation:

### Change Student Count

Edit `STUDENT_PROFILES` in seed.py:

```python
STUDENT_PROFILES = {
    "high_risk": {"count": 50},      # Changed from 40
    "medium_risk": {"count": 150},   # Changed from 120
    "low_risk": {"count": 100},      # Changed from 80
    "improving": {"count": 30},      # Changed from 20
}
```

### Add More Subjects

Edit `SUBJECTS_DATA`:

```python
SUBJECTS_DATA = [
    {"name": "Advanced Algorithms", "code": "CS403", "semester": 4},
    # ... more subjects
]
```

### Adjust Risk Ranges

Edit student profile ranges:

```python
"high_risk": {
    "attendance_range": (30, 60),  # Lower attendance
    "marks_range": (15, 35),       # Lower marks
    # ...
}
```

---

## Database Reset

To reset and re-seed the database:

```bash
# Delete old database
rm eduvision.db  # or delete eduvision.db on Windows

# Re-seed
python ../data/seed.py
```

For PostgreSQL:

```sql
-- Drop all tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Re-seed from Python script
python ../data/seed.py
```

---

## Performance

**Seeding Time**: ~10-30 seconds (depending on system and database)

**Database Size (SQLite)**:
- Initial: ~5-10 MB
- With 260 students: ~10-20 MB

**Data Volume**:
- ~2,500 attendance records (90 days × ~28 students)
- ~3,600 assessments (~14 per student)
- ~5,200 assignments (~20 per student)
- ~260 risk scores (latest for each student)
- ~1,300 risk factors (5 per risk score)

---

## Troubleshooting

### Error: "table 'users' does not exist"

Make sure database is initialized:
```bash
python -c "from app.database import init_db; init_db()"
```

### Error: "Module not found"

Ensure you're running from backend directory and virtual environment is activated:
```bash
cd backend
source venv/bin/activate
python ../data/seed.py
```

### Duplicate data created

The script will create duplicate data if run multiple times. Reset database first:
```bash
rm eduvision.db
python ../data/seed.py
```

### Slow seeding

This is normal for the first run. Subsequent data retrieval is optimized with indexes.

---

## Next Steps

After seeding:

1. Start backend: `uvicorn app.main:app --reload`
2. Start frontend: `npm run dev`
3. Login with demo credentials
4. Explore dashboard with realistic data
5. Proceed with Task 7: Authentication system

---

## Data Schema

The seeded data follows these relationships:

```
User (Admin/Teachers)
    ↓
Student
    ├→ Attendance (90-day history)
    ├→ Assessment (marks per subject)
    ├→ Assignment (completion status)
    ├→ AcademicHistory (semester records)
    └→ RiskScore (calculated with factors)
        └→ RiskFactor (detailed explanations)
```

---

Document Version: 1.0
Date: 2026-10-04
Status: Ready for Use
