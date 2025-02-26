from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.technology import Technology, BusinessTechnology
from app.schemas.technology import (
    Technology as TechnologySchema,
    TechnologyCreate,
    BusinessTechnology as BusinessTechnologySchema,
    BusinessTechnologyCreate,
    BusinessTechnologyUpdate,
)

router = APIRouter()


@router.get("/", response_model=List[TechnologySchema])
def read_technologies(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve technologies.
    """
    technologies = db.query(Technology).offset(skip).limit(limit).all()
    return technologies


@router.post("/", response_model=TechnologySchema)
def create_technology(
    *,
    db: Session = Depends(get_db),
    technology_in: TechnologyCreate,
) -> Any:
    """
    Create new technology.
    """
    technology = Technology(
        name=technology_in.name,
        description=technology_in.description,
        type=technology_in.type,
        base_cost=technology_in.base_cost,
        effect_value=technology_in.effect_value,
    )
    db.add(technology)
    db.commit()
    db.refresh(technology)
    return technology


@router.get("/business/{business_id}", response_model=List[BusinessTechnologySchema])
def read_business_technologies(
    *,
    db: Session = Depends(get_db),
    business_id: str,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve technologies for a business.
    """
    business_technologies = (
        db.query(BusinessTechnology)
        .filter(BusinessTechnology.business_id == business_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return business_technologies


@router.post("/business/{business_id}", response_model=BusinessTechnologySchema)
def purchase_technology(
    *,
    db: Session = Depends(get_db),
    business_id: str,
    technology_in: BusinessTechnologyCreate,
) -> Any:
    """
    Purchase a technology for a business.
    """
    # Check if business already has this technology
    existing = (
        db.query(BusinessTechnology)
        .filter(
            BusinessTechnology.business_id == business_id,
            BusinessTechnology.technology_id == technology_in.technology_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Business already has this technology",
        )
    
    # Get the technology
    technology = db.query(Technology).filter(Technology.id == technology_in.technology_id).first()
    if not technology:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Technology not found",
        )
    
    # Check if business has enough money
    from app.models.business import Business
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found",
        )
    
    if business.currency < technology.base_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough money to purchase this technology",
        )
    
    # Deduct money from business
    business.currency -= technology.base_cost
    db.add(business)
    
    # Update statistics
    from app.models.statistics import Statistics
    statistics = db.query(Statistics).filter(Statistics.business_id == business_id).first()
    if statistics:
        statistics.total_spent += technology.base_cost
        db.add(statistics)
    
    # Create business technology
    business_technology = BusinessTechnology(
        business_id=business_id,
        technology_id=technology_in.technology_id,
        level=technology_in.level,
    )
    db.add(business_technology)
    db.commit()
    db.refresh(business_technology)
    return business_technology


@router.put("/business/{business_id}/{technology_id}", response_model=BusinessTechnologySchema)
def upgrade_technology(
    *,
    db: Session = Depends(get_db),
    business_id: str,
    technology_id: str,
    upgrade_in: BusinessTechnologyUpdate,
) -> Any:
    """
    Upgrade a technology for a business.
    """
    # Get the business technology
    business_technology = (
        db.query(BusinessTechnology)
        .filter(
            BusinessTechnology.business_id == business_id,
            BusinessTechnology.technology_id == technology_id,
        )
        .first()
    )
    if not business_technology:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business technology not found",
        )
    
    # Get the technology
    technology = db.query(Technology).filter(Technology.id == technology_id).first()
    if not technology:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Technology not found",
        )
    
    # Calculate upgrade cost
    upgrade_cost = technology.base_cost * business_technology.level
    
    # Check if business has enough money
    from app.models.business import Business
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found",
        )
    
    if business.currency < upgrade_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough money to upgrade this technology",
        )
    
    # Deduct money from business
    business.currency -= upgrade_cost
    db.add(business)
    
    # Update statistics
    from app.models.statistics import Statistics
    statistics = db.query(Statistics).filter(Statistics.business_id == business_id).first()
    if statistics:
        statistics.total_spent += upgrade_cost
        db.add(statistics)
    
    # Update business technology
    business_technology.level = upgrade_in.level
    db.add(business_technology)
    db.commit()
    db.refresh(business_technology)
    return business_technology