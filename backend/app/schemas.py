from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: str
    manager_id: Optional[int] = None

class UserOut(UserBase):
    id: int
    role: str
    manager_id: Optional[int]
    class Config:
        orm_mode = True

class FeedbackBase(BaseModel):
    strengths: str
    areas_to_improve: str
    sentiment: str
    tags: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackUpdate(FeedbackBase):
    acknowledged: Optional[bool] = None
    employee_comment: Optional[str] = None

class FeedbackOut(FeedbackBase):
    id: int
    employee_id: int
    manager_id: int
    created_at: datetime
    updated_at: datetime
    acknowledged: bool
    employee_comment: Optional[str]
    class Config:
        orm_mode = True
