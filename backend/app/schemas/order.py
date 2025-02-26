from datetime import datetime
from typing import Optional
from enum import Enum

from pydantic import BaseModel, UUID4


class OrderStatus(str, Enum):
    """Order status enum."""
    
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SHIPPED = "shipped"
    EXPIRED = "expired"


# Shared properties
class OrderBase(BaseModel):
    """Base order schema."""
    
    product_type: Optional[str] = None
    status: Optional[OrderStatus] = None
    value: Optional[int] = None
    complexity: Optional[int] = None
    deadline: Optional[datetime] = None


# Properties to receive via API on creation
class OrderCreate(OrderBase):
    """Order creation schema."""
    
    product_type: str
    value: int
    complexity: int
    deadline: datetime


# Properties to receive via API on update
class OrderUpdate(OrderBase):
    """Order update schema."""
    
    status: OrderStatus


# Properties shared by models stored in DB
class OrderInDBBase(OrderBase):
    """Base order in DB schema."""
    
    id: UUID4
    business_id: UUID4
    created_at: datetime
    
    class Config:
        orm_mode = True


# Properties to return via API
class Order(OrderInDBBase):
    """Order schema."""
    
    pass


# Properties stored in DB
class OrderInDB(OrderInDBBase):
    """Order in DB schema."""
    
    pass