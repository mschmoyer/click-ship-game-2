from sqlalchemy import Boolean, Column, String
from sqlalchemy.orm import relationship

from app.core.base_model import Base


class User(Base):
    """User model."""
    
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # Relationships
    businesses = relationship("Business", back_populates="owner", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User {self.email}>"