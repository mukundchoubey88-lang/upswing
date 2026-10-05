"""
Create demo users for local testing.
Run this script once after installing backend dependencies.
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.models import (  # noqa: F401 — register all tables for init_db
    User,
    Student,
    Subject,
    Attendance,
    Assessment,
    Assignment,
    AcademicHistory,
    RiskScore,
    RiskFactor,
    Intervention,
    Notification,
)
from app.utils.security import hash_password

DEMO_USERS = [
    {"email": "admin@school.com", "name": "Admin User", "role": "admin"},
    {"email": "teacher1@school.com", "name": "Prof. Rajesh Kumar", "role": "teacher"},
    {"email": "teacher2@school.com", "name": "Dr. Priya Singh", "role": "teacher"},
    {"email": "student@school.com", "name": "Demo Student", "role": "student"},
]


def create_admin():
    """Create demo users if they do not already exist."""
    init_db()
    db: Session = SessionLocal()
    try:
        created = 0
        for item in DEMO_USERS:
            existing = db.query(User).filter(User.email == item["email"]).first()
            if existing:
                print(f"✅ User already exists: {item['email']} ({existing.role})")
                continue
            user = User(
                email=item["email"],
                password_hash=hash_password("password123"),
                name=item["name"],
                role=item["role"],
                is_active=True,
            )
            db.add(user)
            created += 1
            print(f"✅ Created {item['role']}: {item['email']}")
        db.commit()
        print()
        print("Login password for all demo accounts: password123")
        if created:
            print(f"Created {created} new user(s).")
    except Exception as e:
        print(f"❌ Error creating users: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()
