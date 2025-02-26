from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.business import Business
from app.models.statistics import Statistics
from app.schemas.business import Business as BusinessSchema, BusinessCreate, BusinessUpdate

router = APIRouter()


@router.get("/", response_model=List[BusinessSchema])
def read_businesses(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve businesses.
    """
    businesses = db.query(Business).offset(skip).limit(limit).all()
    return businesses


@router.post("/", response_model=BusinessSchema)
def create_business(
    *,
    db: Session = Depends(get_db),
    business_in: BusinessCreate,
    user_id: str,  # This would come from the auth dependency in a real app
) -> Any:
    """
    Create new business.
    """
    business = Business(
        name=business_in.name,
        product_type=business_in.product_type,
        owner_id=user_id,
    )
    db.add(business)
    db.commit()
    db.refresh(business)
    
    # Create initial statistics for the business
    statistics = Statistics(business_id=business.id)
    db.add(statistics)
    db.commit()
    
    return business


@router.get("/{business_id}", response_model=BusinessSchema)
def read_business(
    *,
    db: Session = Depends(get_db),
    business_id: str,
) -> Any:
    """
    Get business by ID.
    """
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found",
        )
    return business


@router.put("/{business_id}", response_model=BusinessSchema)
def update_business(
    *,
    db: Session = Depends(get_db),
    business_id: str,
    business_in: BusinessUpdate,
) -> Any:
    """
    Update business.
    """
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found",
        )
    
    update_data = business_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(business, field, value)
    
    db.add(business)
    db.commit()
    db.refresh(business)
    return business


@router.delete("/{business_id}", response_model=BusinessSchema)
def delete_business(
    *,
    db: Session = Depends(get_db),
    business_id: str,
) -> Any:
    """
    Delete business.
    """
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found",
        )
    
    db.delete(business)
    db.commit()
    return business