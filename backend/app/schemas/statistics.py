from datetime import datetime
from typing import Optional

from pydantic import BaseModel, UUID4


# Shared properties
class StatisticsBase(BaseModel):
    """Base statistics schema."""
    
    orders_received: Optional[int] = None
    products_created: Optional[int] = None
    orders_shipped: Optional[int] = None
    orders_expired: Optional[int] = None
    total_revenue: Optional[int] = None
    total_spent: Optional[int] = None


# Properties to receive via API on creation
class StatisticsCreate(StatisticsBase):
    """Statistics creation schema."""
    
    pass


# Properties to receive via API on update
class StatisticsUpdate(StatisticsBase):
    """Statistics update schema."""
    
    pass


# Properties shared by models stored in DB
class StatisticsInDBBase(StatisticsBase):
    """Base statistics in DB schema."""
    
    id: UUID4
    business_id: UUID4
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


# Properties to return via API
class Statistics(StatisticsInDBBase):
    """Statistics schema."""
    
    pass


# Properties stored in DB
class StatisticsInDB(StatisticsInDBBase):
    """Statistics in DB schema."""
    
    pass