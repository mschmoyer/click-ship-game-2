import logging
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.technology import Technology, TechnologyType

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_db(db: Session) -> None:
    # Create initial admin user
    user = db.query(User).filter(User.email == "admin@example.com").first()
    if not user:
        user = User(
            email="admin@example.com",
            hashed_password=get_password_hash("admin"),
            is_superuser=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info("Created admin user")
    
    # Create initial technologies
    technologies = [
        {
            "name": "Faster Production",
            "description": "Increases production speed by 10%",
            "type": TechnologyType.EFFICIENCY,
            "base_cost": 100,
            "effect_value": 0.1,
        },
        {
            "name": "Faster Shipping",
            "description": "Increases shipping speed by 10%",
            "type": TechnologyType.EFFICIENCY,
            "base_cost": 100,
            "effect_value": 0.1,
        },
        {
            "name": "Auto-Production",
            "description": "Automatically produces items over time",
            "type": TechnologyType.AUTOMATION,
            "base_cost": 500,
            "effect_value": 0.05,
        },
        {
            "name": "Auto-Shipping",
            "description": "Automatically ships completed orders over time",
            "type": TechnologyType.AUTOMATION,
            "base_cost": 500,
            "effect_value": 0.05,
        },
        {
            "name": "Increased Capacity",
            "description": "Allows handling more orders at once",
            "type": TechnologyType.CAPACITY,
            "base_cost": 300,
            "effect_value": 1,
        },
    ]
    
    for tech_data in technologies:
        tech = db.query(Technology).filter(Technology.name == tech_data["name"]).first()
        if not tech:
            tech = Technology(**tech_data)
            db.add(tech)
            db.commit()
            db.refresh(tech)
            logger.info(f"Created technology: {tech.name}")


def main() -> None:
    logger.info("Creating initial data")
    db = SessionLocal()
    init_db(db)
    logger.info("Initial data created")


if __name__ == "__main__":
    main()