"""
UPSWING - Demo Data Seeding Script

Generates realistic demo data with:
- 250+ students with realistic correlations
- 5 teacher accounts
- 1 admin account
- Correlated attendance, marks, and assignments
- Different risk patterns (high, medium, low)
- Some improving students (post-intervention)
"""

import sys
import os
from pathlib import Path
from datetime import datetime, timedelta
import random
import uuid

# The FastAPI app lives in backend/, not the repo root
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))
os.chdir(backend_dir)

from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.models import (
    User, Student, Subject, Attendance, Assessment, 
    Assignment, AcademicHistory, RiskScore, RiskFactor
)
from app.utils import hash_password
from app.ml import RiskCalculator


class DemoDataGenerator:
    """Generate realistic demo data for UPSWING."""

    # Class/semester options
    CLASSES = ["BCA-1", "BCA-2", "BCA-3", "BCA-4", "CSE-1", "CSE-2", "CSE-3", "CSE-4"]
    
    # Subject definitions
    SUBJECTS_DATA = [
        {"name": "Data Structures", "code": "CS101", "semester": 1},
        {"name": "Web Development", "code": "CS102", "semester": 1},
        {"name": "Database Systems", "code": "CS201", "semester": 2},
        {"name": "Web Frameworks", "code": "CS202", "semester": 2},
        {"name": "Machine Learning", "code": "CS301", "semester": 3},
        {"name": "Cloud Computing", "code": "CS302", "semester": 3},
        {"name": "Advanced Algorithms", "code": "CS401", "semester": 4},
        {"name": "DevOps", "code": "CS402", "semester": 4},
    ]

    # Assessment types
    ASSESSMENT_TYPES = ["quiz", "midterm", "final", "project"]

    # Student profiles for realistic data
    STUDENT_PROFILES = {
        "high_risk": {
            "attendance_range": (40, 70),
            "marks_range": (20, 45),
            "assignment_completion_range": (30, 50),
            "count": 40,
        },
        "medium_risk": {
            "attendance_range": (70, 85),
            "marks_range": (50, 70),
            "assignment_completion_range": (60, 80),
            "count": 120,
        },
        "low_risk": {
            "attendance_range": (85, 98),
            "marks_range": (75, 95),
            "assignment_completion_range": (85, 98),
            "count": 80,
        },
        "improving": {
            "attendance_range": (75, 95),
            "marks_range": (60, 80),
            "assignment_completion_range": (70, 90),
            "count": 20,
        },
    }

    def __init__(self):
        self.db = SessionLocal()
        self.subjects = {}
        self.users = {}

    def generate_all(self):
        """Generate all demo data."""
        print("🌱 Seeding UPSWING Demo Data...")
        
        try:
            # Create subjects
            print("📚 Creating subjects...")
            self._create_subjects()
            
            # Create users
            print("👥 Creating users...")
            self._create_users()
            
            # Create students and related data
            print("👨‍🎓 Creating students and academic data...")
            self._create_students()
            
            self.db.commit()
            print("✅ Demo data seeding completed successfully!")
            print(f"   - {len(self.subjects)} subjects created")
            print(f"   - {len(self.users)} users created")
            print(f"   - {sum(p['count'] for p in self.STUDENT_PROFILES.values())} students created")
            
        except Exception as e:
            self.db.rollback()
            print(f"❌ Error seeding data: {e}")
            raise
        finally:
            self.db.close()

    def _create_subjects(self):
        """Create subject records."""
        for subject_data in self.SUBJECTS_DATA:
            subject = Subject(
                name=subject_data["name"],
                code=subject_data["code"],
                semester=subject_data["semester"],
            )
            self.db.add(subject)
            self.subjects[subject_data["code"]] = subject
        
        self.db.flush()

    def _create_users(self):
        """Create system users."""
        # Admin user
        admin = User(
            email="admin@school.com",
            password_hash=hash_password("password123"),
            name="Admin User",
            role="admin",
            is_active=True,
        )
        self.db.add(admin)
        self.users["admin"] = admin

        # Teacher users
        teachers = [
            {"email": "teacher1@school.com", "name": "Prof. Rajesh Kumar"},
            {"email": "teacher2@school.com", "name": "Dr. Priya Singh"},
            {"email": "teacher3@school.com", "name": "Mr. Arjun Patel"},
            {"email": "teacher4@school.com", "name": "Ms. Neha Sharma"},
            {"email": "teacher5@school.com", "name": "Dr. Vikram Gupta"},
        ]

        for teacher_data in teachers:
            teacher = User(
                email=teacher_data["email"],
                password_hash=hash_password("password123"),
                name=teacher_data["name"],
                role="teacher",
                is_active=True,
            )
            self.db.add(teacher)
            self.users[teacher_data["email"]] = teacher

        # Student user (for testing)
        student_user = User(
            email="student@school.com",
            password_hash=hash_password("password123"),
            name="Demo Student",
            role="student",
            is_active=True,
        )
        self.db.add(student_user)
        self.users["student"] = student_user

        self.db.flush()

    def _create_students(self):
        """Create student records with realistic academic data."""
        student_count = 0

        for profile_name, profile_config in self.STUDENT_PROFILES.items():
            for i in range(profile_config["count"]):
                student = self._create_single_student(
                    profile_name, 
                    profile_config,
                    student_count
                )
                student_count += 1

    def _create_single_student(self, profile_name, profile_config, count):
        """Create a single student with correlated academic data."""
        # Generate student data
        class_semester = random.choice(self.CLASSES)
        semester_num = int(class_semester.split("-")[-1]) if "-" in class_semester else 1
        department = "Computer Science" if class_semester.startswith("CSE") else "BCA"
        attendance_pct = random.randint(*profile_config["attendance_range"])
        avg_marks = random.randint(*profile_config["marks_range"])
        assignment_completion = random.randint(*profile_config["assignment_completion_range"])
        prev_avg = max(10, min(100, avg_marks + random.randint(-5, 5)))

        student = Student(
            name=self._generate_student_name(count),
            email=f"student{count}@school.com",
            student_id=f"STU{count:05d}",
            class_semester=class_semester,
            enrollment_status="active",
            course=class_semester.split("-")[0],
            semester=semester_num,
            department=department,
            attendance_percentage=float(attendance_pct),
            current_average=float(avg_marks),
            previous_average=float(prev_avg),
            assignment_completion=float(assignment_completion),
        )
        self.db.add(student)
        self.db.flush()

        # Generate academic data
        self._create_attendance(student, attendance_pct)
        assessments = self._create_assessments(student, avg_marks, profile_name)
        self._create_assignments(student, assignment_completion)
        self._create_academic_history(student, avg_marks)

        # Calculate risk score
        performance_history = [float(avg_marks) + random.randint(-10, 10) for _ in range(5)]
        risk_data = RiskCalculator.calculate_total_risk(
            attendance_pct=attendance_pct,
            current_avg=avg_marks,
            prev_avg=prev_avg,
            assignment_completion=assignment_completion,
            performance_history=performance_history,
        )

        student.risk_score = float(risk_data["overall_score"])
        student.risk_level = risk_data["risk_level"]
        if profile_name == "improving":
            student.performance_trend = "improving"
        elif profile_name == "high_risk":
            student.performance_trend = "declining"
        else:
            student.performance_trend = "stable"

        # Create risk score record
        risk_score = RiskScore(
            student_id=student.id,
            overall_score=float(risk_data["overall_score"]),
            attendance_factor=float(risk_data["attendance_factor"]),
            performance_factor=float(risk_data["performance_factor"]),
            history_factor=float(risk_data["history_factor"]),
            assignment_factor=float(risk_data["assignment_factor"]),
            trend_factor=float(risk_data["trend_factor"]),
            risk_level=risk_data["risk_level"],
        )
        self.db.add(risk_score)
        self.db.flush()

        # Create risk factors
        for factor in risk_data["factors"]:
            risk_factor = RiskFactor(
                risk_score_id=risk_score.id,
                factor_name=factor["name"],
                contribution_points=float(factor["contribution"]),
                explanation=factor["explanation"],
            )
            self.db.add(risk_factor)

        return student

    def _generate_student_name(self, count):
        """Generate realistic Indian student names."""
        first_names = [
            "Aarav", "Vivaan", "Aditya", "Arjun", "Rohit",
            "Priya", "Neha", "Anjali", "Disha", "Isha",
            "Rohan", "Aryan", "Harsh", "Vikram", "Suresh",
            "Ananya", "Pooja", "Riya", "Shreya", "Nikita",
        ]
        last_names = [
            "Sharma", "Singh", "Patel", "Kumar", "Gupta",
            "Verma", "Mishra", "Yadav", "Reddy", "Nair",
            "Joshi", "Desai", "Chopra", "Bhat", "Tiwari",
        ]
        
        first = random.choice(first_names)
        last = random.choice(last_names)
        return f"{first} {last}"

    def _create_attendance(self, student, attendance_pct):
        """Create attendance records for student."""
        # Generate attendance for last 90 days
        days = 90
        start_date = datetime.utcnow().date() - timedelta(days=days)
        
        total_days = 0
        present_count = 0
        
        for i in range(days):
            date = start_date + timedelta(days=i)
            
            # Skip weekends randomly (school days)
            if date.weekday() >= 5:  # Saturday, Sunday
                if random.random() > 0.2:  # 20% chance on weekends
                    continue
            
            total_days += 1
            
            # Determine status based on target percentage
            if present_count / max(total_days, 1) < (attendance_pct / 100):
                status = "present"
                present_count += 1
            else:
                status = random.choice(["absent", "late", "present"])
                if status == "present":
                    present_count += 1
            
            attendance = Attendance(
                student_id=student.id,
                date=date,
                status=status,
            )
            self.db.add(attendance)

    def _create_assessments(self, student, avg_marks, profile_name):
        """Create assessment records for student."""
        assessments = []
        
        # Create assessments for each subject
        for subject_code in list(self.subjects.keys())[:4]:  # 4 subjects
            subject = self.subjects[subject_code]
            
            # 3-5 assessments per subject
            num_assessments = random.randint(3, 5)
            
            for j in range(num_assessments):
                # Vary marks around average with some randomness
                variance = random.randint(-15, 15)
                marks = max(10, min(100, avg_marks + variance))
                
                # Add declining trend for high risk students
                if profile_name == "high_risk" and j > 1:
                    marks = max(10, marks - 5)
                
                # Add improving trend for improving students
                if profile_name == "improving" and j > 1:
                    marks = min(100, marks + 5)
                
                assessment = Assessment(
                    student_id=student.id,
                    subject_id=subject.id,
                    marks=float(marks),
                    max_marks=100.0,
                    date=datetime.utcnow().date() - timedelta(days=random.randint(1, 60)),
                    assessment_type=random.choice(self.ASSESSMENT_TYPES),
                )
                self.db.add(assessment)
                assessments.append(assessment)
        
        self.db.flush()
        return assessments

    def _create_assignments(self, student, completion_pct):
        """Create assignment records for student."""
        # Create assignments for each subject
        for subject_code in list(self.subjects.keys())[:4]:
            subject = self.subjects[subject_code]
            
            # 4-6 assignments per subject
            num_assignments = random.randint(4, 6)
            
            for j in range(num_assignments):
                due_date = datetime.utcnow().date() - timedelta(days=random.randint(1, 30))
                
                # Determine if submitted based on completion percentage
                is_submitted = random.random() < (completion_pct / 100)
                
                assignment = Assignment(
                    student_id=student.id,
                    subject_id=subject.id,
                    title=f"Assignment {j+1}",
                    due_date=due_date,
                    submission_date=due_date + timedelta(days=random.randint(0, 3)) if is_submitted else None,
                    marks=float(random.randint(70, 100)) if is_submitted else None,
                    max_marks=100.0,
                    status="graded" if is_submitted else "overdue" if datetime.utcnow().date() > due_date else "pending",
                )
                self.db.add(assignment)

    def _create_academic_history(self, student, avg_marks):
        """Create academic history records for student."""
        # Create history for current and previous semesters
        current_semester = "4"
        
        academic_history = AcademicHistory(
            student_id=student.id,
            semester=current_semester,
            average_marks=float(avg_marks),
            gpa=float(avg_marks / 25),  # Rough GPA conversion
            status="pass" if avg_marks > 40 else "fail",
        )
        self.db.add(academic_history)
        
        # Previous semester (slightly different marks)
        prev_marks = max(10, min(100, avg_marks + random.randint(-10, 10)))
        prev_academic_history = AcademicHistory(
            student_id=student.id,
            semester="3",
            average_marks=float(prev_marks),
            gpa=float(prev_marks / 25),
            status="pass" if prev_marks > 40 else "fail",
        )
        self.db.add(prev_academic_history)


def main():
    """Main entry point."""
    # Initialize database
    print("🔧 Initializing database...")
    init_db()
    
    # Generate demo data
    generator = DemoDataGenerator()
    generator.generate_all()


if __name__ == "__main__":
    main()
