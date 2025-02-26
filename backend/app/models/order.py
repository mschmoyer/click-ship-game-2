from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.base_model import Base


class OrderStatus(str, enum.Enum):
    """Order status enum."""
    
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SHIPPED = "shipped"
    EXPIRED = "expired"


class Order(Base):
    """Order model."""
    
    product_type = Column(String, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    value = Column(Integer, nullable=False)
    complexity = Column(Integer, nullable=False)
    deadline = Column(DateTime, nullable=False)
    
    # Foreign keys
    business_id = Column(UUID(as_uuid=True), ForeignKey("business.id"), nullable=False)
    
    # Relationships
    business = relationship("Business", back_populates="orders")
    
    def __repr__(self):
        return f"<Order {self.id} - {self.status}>"