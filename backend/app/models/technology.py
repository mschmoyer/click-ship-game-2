from sqlalchemy import Column, String, Integer, Float, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.base_model import Base


class TechnologyType(str, enum.Enum):
    """Technology type enum."""
    
    AUTOMATION = "automation"
    EFFICIENCY = "efficiency"
    CAPACITY = "capacity"


class Technology(Base):
    """Technology model."""
    
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    type = Column(Enum(TechnologyType), nullable=False)
    base_cost = Column(Integer, nullable=False)
    effect_value = Column(Float, nullable=False)
    
    # Relationships
    business_technologies = relationship("BusinessTechnology", back_populates="technology")
    
    def __repr__(self):
        return f"<Technology {self.name}>"


class BusinessTechnology(Base):
    """Business technology model (join table with additional data)."""
    
    level = Column(Integer, default=1, nullable=False)
    
    # Foreign keys
    business_id = Column(UUID(as_uuid=True), ForeignKey("business.id"), nullable=False)
    technology_id = Column(UUID(as_uuid=True), ForeignKey("technology.id"), nullable=False)
    
    # Relationships
    business = relationship("Business", back_populates="technologies")
    technology = relationship("Technology", back_populates="business_technologies")
    
    def __repr__(self):
        return f"<BusinessTechnology {self.business_id} - {self.technology_id} (Level {self.level})>"