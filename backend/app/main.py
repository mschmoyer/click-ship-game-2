from fastapi import FastAPI

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.cors_config import setup_cors

app = FastAPI(
    title="Click & Ship Tycoon API",
    description="API for Click & Ship Tycoon game",
    version="0.1.0",
)

# Set up CORS using our configuration
setup_cors(app)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to Click & Ship Tycoon API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)