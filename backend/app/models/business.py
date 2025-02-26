from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.base_model import Base


class Business(Base):
    """Business model."""
    
    name = Column(String, nullable=False)
    product_type = Column(String, nullable=False)
    currency = Column(Integer, default=100)
    reputation = Column(Float, default=50.0)
    click_power = Column(Float, default=1.0)
    last_played_at = Column(DateTime, nullable=True)
    
    # Foreign keys
    owner_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="businesses")
    orders = relationship("Order", back_populates="business", cascade="all, delete-orphan")
    technologies = relationship("BusinessTechnology", back_populates="business", cascade="all, delete-orphan")
    statistics = relationship("Statistics", back_populates="business", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Business {self.name}>"