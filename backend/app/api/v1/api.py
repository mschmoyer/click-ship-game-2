from fastapi import APIRouter

from app.api.v1.endpoints import users, auth, businesses, orders, technologies

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(businesses.router, prefix="/businesses", tags=["businesses"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(technologies.router, prefix="/technologies", tags=["technologies"])