from datetime import datetime
from typing import Optional
from enum import Enum

from pydantic import BaseModel, UUID4


class TechnologyType(str, Enum):
    """Technology type enum."""
    
    AUTOMATION = "automation"
    EFFICIENCY = "efficiency"
    CAPACITY = "capacity"


# Shared properties
class TechnologyBase(BaseModel):
    """Base technology schema."""
    
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[TechnologyType] = None
    base_cost: Optional[int] = None
    effect_value: Optional[float] = None


# Properties to receive via API on creation
class TechnologyCreate(TechnologyBase):
    """Technology creation schema."""
    
    name: str
    description: str
    type: TechnologyType
    base_cost: int
    effect_value: float


# Properties to receive via API on update
class TechnologyUpdate(TechnologyBase):
    """Technology update schema."""
    
    pass


# Properties shared by models stored in DB
class TechnologyInDBBase(TechnologyBase):
    """Base technology in DB schema."""
    
    id: UUID4
    
    class Config:
        orm_mode = True


# Properties to return via API
class Technology(TechnologyInDBBase):
    """Technology schema."""
    
    pass


# Properties stored in DB
class TechnologyInDB(TechnologyInDBBase):
    """Technology in DB schema."""
    
    pass


# Shared properties for BusinessTechnology
class BusinessTechnologyBase(BaseModel):
    """Base business technology schema."""
    
    level: Optional[int] = None


# Properties to receive via API on creation
class BusinessTechnologyCreate(BusinessTechnologyBase):
    """Business technology creation schema."""
    
    technology_id: UUID4
    level: int = 1


# Properties to receive via API on update
class BusinessTechnologyUpdate(BusinessTechnologyBase):
    """Business technology update schema."""
    
    level: int


# Properties shared by models stored in DB
class BusinessTechnologyInDBBase(BusinessTechnologyBase):
    """Base business technology in DB schema."""
    
    id: UUID4
    business_id: UUID4
    technology_id: UUID4
    created_at: datetime
    
    class Config:
        orm_mode = True


# Properties to return via API
class BusinessTechnology(BusinessTechnologyInDBBase):
    """Business technology schema."""
    
    technology: Technology


# Properties stored in DB
class BusinessTechnologyInDB(BusinessTechnologyInDBBase):
    """Business technology in DB schema."""
    
    pass