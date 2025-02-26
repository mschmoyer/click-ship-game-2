from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.base_model import Base


class Statistics(Base):
    """Statistics model."""
    
    orders_received = Column(Integer, default=0, nullable=False)
    products_created = Column(Integer, default=0, nullable=False)
    orders_shipped = Column(Integer, default=0, nullable=False)
    orders_expired = Column(Integer, default=0, nullable=False)
    total_revenue = Column(Integer, default=0, nullable=False)
    total_spent = Column(Integer, default=0, nullable=False)
    
    # Foreign keys
    business_id = Column(UUID(as_uuid=True), ForeignKey("business.id"), nullable=False, unique=True)
    
    # Relationships
    business = relationship("Business", back_populates="statistics")
    
    def __repr__(self):
        return f"<Statistics for Business {self.business_id}>"