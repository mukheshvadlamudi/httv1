from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import ai, auth, categories, feedback, guides, health, resources
from app.core.config import settings

app = FastAPI(title="How to Tech API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(categories.router)
app.include_router(guides.router)
app.include_router(resources.router)
app.include_router(feedback.router)
app.include_router(ai.router)
app.include_router(auth.router)

