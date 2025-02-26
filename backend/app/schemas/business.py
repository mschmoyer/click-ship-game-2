from datetime import datetime
from typing import Optional

from pydantic import BaseModel, UUID4


# Shared properties
class BusinessBase(BaseModel):
    """Base business schema."""
    
    name: Optional[str] = None
    product_type: Optional[str] = None
    currency: Optional[int] = None
    reputation: Optional[float] = None
    click_power: Optional[float] = None


# Properties to receive via API on creation
class BusinessCreate(BusinessBase):
    """Business creation schema."""
    
    name: str
    product_type: str


# Properties to receive via API on update
class BusinessUpdate(BusinessBase):
    """Business update schema."""
    
    pass


# Properties shared by models stored in DB
class BusinessInDBBase(BusinessBase):
    """Base business in DB schema."""
    
    id: UUID4
    owner_id: UUID4
    created_at: datetime
    last_played_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True


# Properties to return via API
class Business(BusinessInDBBase):
    """Business schema."""
    
    pass


# Properties stored in DB
class BusinessInDB(BusinessInDBBase):
    """Business in DB schema."""
    
    pass