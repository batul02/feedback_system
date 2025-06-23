from sqlalchemy.orm import Session
from . import models, schemas, auth

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=auth.get_password_hash(user.password),
        role=user.role,
        manager_id=user.manager_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_team_members(db: Session, manager_id: int):
    return db.query(models.User).filter(models.User.manager_id == manager_id).all()

def create_feedback(db: Session, manager_id: int, employee_id: int, feedback: schemas.FeedbackCreate):
    db_feedback = models.Feedback(
        employee_id=employee_id,
        manager_id=manager_id,
        strengths=feedback.strengths,
        areas_to_improve=feedback.areas_to_improve,
        sentiment=feedback.sentiment,
        tags=feedback.tags,
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def get_feedback_for_employee(db: Session, employee_id: int):
    return db.query(models.Feedback).filter(models.Feedback.employee_id == employee_id).order_by(models.Feedback.created_at.desc()).all()

def get_feedback_by_id(db: Session, feedback_id: int):
    return db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()

def update_feedback(db: Session, feedback_id: int, feedback_update: schemas.FeedbackUpdate):
    db_feedback = get_feedback_by_id(db, feedback_id)
    if not db_feedback:
        return None
    for attr, value in feedback_update.dict(exclude_unset=True).items():
        setattr(db_feedback, attr, value)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback
