from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

def setup_cors(app):
    """Configure CORS for the application."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )