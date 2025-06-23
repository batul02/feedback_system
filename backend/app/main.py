from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from . import models, schemas, database, crud, auth
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

models.Base.metadata.create_all(bind=database.engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] to allow all origins, but restrict in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/auth/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

@app.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = auth.create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# Manager: Get team members
@app.get("/team", response_model=list[schemas.UserOut])
def get_team(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can view team")
    return crud.get_team_members(db, current_user.id)

# Manager: Give feedback
@app.post("/feedback/{employee_id}", response_model=schemas.FeedbackOut)
def give_feedback(employee_id: int, feedback: schemas.FeedbackCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can give feedback")
    employee = db.query(models.User).filter(models.User.id == employee_id, models.User.manager_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found or not in your team")
    return crud.create_feedback(db, current_user.id, employee_id, feedback)

# Manager: Edit feedback
@app.put("/feedback/{feedback_id}", response_model=schemas.FeedbackOut)
def edit_feedback(feedback_id: int, feedback: schemas.FeedbackUpdate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_feedback = crud.get_feedback_by_id(db, feedback_id)
    if not db_feedback or db_feedback.manager_id != current_user.id:
        raise HTTPException(status_code=404, detail="Feedback not found or not owned by you")
    return crud.update_feedback(db, feedback_id, feedback)

# Employee: View feedback received
@app.get("/my-feedback", response_model=list[schemas.FeedbackOut])
def my_feedback(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can view their feedback")
    return crud.get_feedback_for_employee(db, current_user.id)

# Employee: Acknowledge feedback
@app.post("/feedback/{feedback_id}/acknowledge", response_model=schemas.FeedbackOut)
def acknowledge_feedback(feedback_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_feedback = crud.get_feedback_by_id(db, feedback_id)
    if not db_feedback or db_feedback.employee_id != current_user.id:
        raise HTTPException(status_code=404, detail="Feedback not found or not for you")
    update = schemas.FeedbackUpdate(acknowledged=True)
    return crud.update_feedback(db, feedback_id, update)

# Employee: Comment on feedback
@app.post("/feedback/{feedback_id}/comment", response_model=schemas.FeedbackOut)
def comment_feedback(feedback_id: int, comment: str, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_feedback = crud.get_feedback_by_id(db, feedback_id)
    if not db_feedback or db_feedback.employee_id != current_user.id:
        raise HTTPException(status_code=404, detail="Feedback not found or not for you")
    update = schemas.FeedbackUpdate(employee_comment=comment)
    return crud.update_feedback(db, feedback_id, update)
