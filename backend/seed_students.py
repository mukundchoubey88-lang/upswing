"""
Quick seed script to add test students
"""
import uuid
import random
from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.models import Student, Subject  # noqa: F401

def seed_test_data():
    """Create 50 test students with realistic data."""
    # Initialize database
    init_db()
    
    db: Session = SessionLocal()
    try:
        # Check if students already exist
        existing = db.query(Student).count()
        if existing > 0:
            print(f"✅ Database already has {existing} students")
            return
        
        print("📊 Creating test students...")
        
        # Create some subjects first
        subjects = [
            ("CS101", "Computer Science"),
            ("MATH201", "Mathematics"),
            ("PHY101", "Physics"),
            ("ENG101", "English"),
        ]
        
        for code, name in subjects:
            subject = Subject(
                id=str(uuid.uuid4()),
                code=code,
                name=name,
                semester=1,
                department="Engineering",
                credits=3,
            )
            db.add(subject)
        
        # Create 50 test students with varying risk levels
        names = [
            "John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "David Brown",
            "Emma Davis", "Chris Miller", "Lisa Wilson", "Tom Anderson", "Amy Taylor",
            "Kevin Martinez", "Rachel Garcia", "Brian Rodriguez", "Nicole Hernandez", "Jason Lopez",
            "Michelle Gonzalez", "Daniel Wilson", "Ashley Moore", "Ryan Taylor", "Jessica Thomas",
            "James Jackson", "Lauren White", "Robert Harris", "Stephanie Martin", "Michael Thompson",
            "Jennifer Lee", "William Walker", "Amanda Hall", "Christopher Allen", "Samantha Young",
            "Matthew Hernandez", "Elizabeth King", "Joseph Wright", "Megan Lopez", "Andrew Hill",
            "Emily Scott", "Joshua Green", "Rebecca Adams", "Nicholas Baker", "Heather Nelson",
            "Brandon Carter", "Melissa Mitchell", "Tyler Perez", "Victoria Roberts", "Jonathan Turner",
            "Hannah Phillips", "Eric Campbell", "Brittany Parker", "Austin Evans", "Danielle Edwards",
        ]
        
        departments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"]
        courses = ["B.Tech", "M.Tech", "B.Sc", "M.Sc"]
        
        for i, name in enumerate(names):
            # Create varied risk profiles
            if i < 10:  # High risk (20%)
                attendance = random.uniform(45, 65)
                current_avg = random.uniform(35, 50)
                risk_level = "high"
                risk_score = random.uniform(70, 95)
                trend = random.choice(["declining", "declining", "stable"])
            elif i < 30:  # Medium risk (40%)
                attendance = random.uniform(65, 80)
                current_avg = random.uniform(50, 65)
                risk_level = "medium"
                risk_score = random.uniform(45, 69)
                trend = random.choice(["stable", "declining", "improving"])
            else:  # Low risk (40%)
                attendance = random.uniform(80, 98)
                current_avg = random.uniform(65, 95)
                risk_level = "low"
                risk_score = random.uniform(10, 39)
                trend = random.choice(["stable", "improving", "improving"])
            
            semester = random.randint(1, 8)
            student = Student(
                id=str(uuid.uuid4()),
                student_id=f"STU{i+1:03d}",
                name=name,
                email=f"student{i+1}@school.com",
                course=random.choice(courses),
                semester=semester,
                class_semester=f"SEM-{semester}",
                department=random.choice(departments),
                enrollment_status="active",
                attendance_percentage=round(attendance, 2),
                current_average=round(current_avg, 2),
                previous_average=round(current_avg + random.uniform(-5, 10), 2),
                assignment_completion=round(random.uniform(60, 100), 2),
                missing_assignments=random.randint(0, 5),
                risk_score=round(risk_score, 2),
                risk_level=risk_level,
                performance_trend=trend,
            )
            
            db.add(student)
        
        db.commit()
        
        # Count results
        total = db.query(Student).count()
        high = db.query(Student).filter(Student.risk_level == "high").count()
        medium = db.query(Student).filter(Student.risk_level == "medium").count()
        low = db.query(Student).filter(Student.risk_level == "low").count()
        
        print(f"\n✅ Created {total} students successfully!")
        print(f"   🔴 High Risk: {high}")
        print(f"   🟡 Medium Risk: {medium}")
        print(f"   🟢 Low Risk: {low}")
        print(f"\n🎓 Subjects: {len(subjects)}")
        print("\n🚀 Ready to test the app!")
        
    except Exception as e:
        print(f"❌ Error creating students: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_test_data()
