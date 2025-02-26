from typing import Optional

from pydantic import BaseModel, EmailStr, UUID4


# Shared properties
class UserBase(BaseModel):
    """Base user schema."""
    
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False


# Properties to receive via API on creation
class UserCreate(UserBase):
    """User creation schema."""
    
    email: EmailStr
    password: str


# Properties to receive via API on update
class UserUpdate(UserBase):
    """User update schema."""
    
    password: Optional[str] = None


# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    """Base user in DB schema."""
    
    id: UUID4
    
    class Config:
        orm_mode = True


# Properties to return via API
class User(UserInDBBase):
    """User schema."""
    
    pass


# Properties stored in DB
class UserInDB(UserInDBBase):
    """User in DB schema."""
    
    hashed_password: str