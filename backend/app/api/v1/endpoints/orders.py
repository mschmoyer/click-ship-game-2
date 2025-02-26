from typing import Any, List
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.order import Order, OrderStatus
from app.schemas.order import Order as OrderSchema, OrderCreate, OrderUpdate

router = APIRouter()


@router.get("/business/{business_id}", response_model=List[OrderSchema])
def read_business_orders(
    *,
    db: Session = Depends(get_db),
    business_id: str,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve orders for a business.
    """
    orders = db.query(Order).filter(Order.business_id == business_id).offset(skip).limit(limit).all()
    return orders


@router.post("/business/{business_id}", response_model=OrderSchema)
def create_order(
    *,
    db: Session = Depends(get_db),
    business_id: str,
    order_in: OrderCreate,
) -> Any:
    """
    Create new order for a business.
    """
    order = Order(
        business_id=business_id,
        product_type=order_in.product_type,
        value=order_in.value,
        complexity=order_in.complexity,
        deadline=order_in.deadline,
        status=OrderStatus.PENDING,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Update statistics
    from app.models.statistics import Statistics
    statistics = db.query(Statistics).filter(Statistics.business_id == business_id).first()
    if statistics:
        statistics.orders_received += 1
        db.add(statistics)
        db.commit()
    
    return order


@router.get("/{order_id}", response_model=OrderSchema)
def read_order(
    *,
    db: Session = Depends(get_db),
    order_id: str,
) -> Any:
    """
    Get order by ID.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    return order


@router.put("/{order_id}", response_model=OrderSchema)
def update_order(
    *,
    db: Session = Depends(get_db),
    order_id: str,
    order_in: OrderUpdate,
) -> Any:
    """
    Update order status.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    
    # Update order status
    old_status = order.status
    order.status = order_in.status
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Update statistics based on status change
    from app.models.statistics import Statistics
    statistics = db.query(Statistics).filter(Statistics.business_id == order.business_id).first()
    if statistics and old_status != order_in.status:
        if order_in.status == OrderStatus.COMPLETED:
            statistics.products_created += 1
        elif order_in.status == OrderStatus.SHIPPED:
            statistics.orders_shipped += 1
            # Update business money
            from app.models.business import Business
            business = db.query(Business).filter(Business.id == order.business_id).first()
            if business:
                business.currency += order.value
                business.reputation = min(100, business.reputation + 1)
                db.add(business)
                statistics.total_revenue += order.value
        elif order_in.status == OrderStatus.EXPIRED:
            statistics.orders_expired += 1
            # Update business reputation
            from app.models.business import Business
            business = db.query(Business).filter(Business.id == order.business_id).first()
            if business:
                business.reputation = max(0, business.reputation - 2)
                db.add(business)
        
        db.add(statistics)
        db.commit()
    
    return order


@router.post("/generate/{business_id}", response_model=OrderSchema)
def generate_order(
    *,
    db: Session = Depends(get_db),
    business_id: str,
) -> Any:
    """
    Generate a random order for a business.
    """
    from app.models.business import Business
    import random
    
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found",
        )
    
    # Generate random order
    value = random.randint(50, 100)
    complexity = random.randint(1, 3)
    deadline = datetime.utcnow() + timedelta(minutes=random.randint(1, 3))
    
    order = Order(
        business_id=business_id,
        product_type=business.product_type,
        value=value,
        complexity=complexity,
        deadline=deadline,
        status=OrderStatus.PENDING,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Update statistics
    from app.models.statistics import Statistics
    statistics = db.query(Statistics).filter(Statistics.business_id == business_id).first()
    if statistics:
        statistics.orders_received += 1
        db.add(statistics)
        db.commit()
    
    return order