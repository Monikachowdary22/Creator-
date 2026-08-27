from fastapi import FastAPI

from app.db.database import engine, Base

# ==========================================
# Models
# ==========================================

from app.models.user import User
from app.models.content import Content
from app.models.audience import Audience
from app.models.growth import Growth
from app.models.revenue import Revenue
from app.models.sponsorship import Sponsorship
from app.models.notification import Notification


# ==========================================
# Routers
# ==========================================

from app.routers.users import router as user_router
from app.routers.auth import router as auth_router
from app.routers.content import router as content_router
from app.routers.analytics import router as analytics_router
from app.routers.audience import router as audience_router
from app.routers.social import router as social_router
from app.routers.revenue import router as revenue_router
from app.routers.sponsorship import router as sponsorship_router
from app.routers.notifications import router as notification_router
from app.routers.reports import router as reports_router


# ==========================================
# Create Database Tables
# ==========================================

Base.metadata.create_all(bind=engine)


# ==========================================
# FastAPI Application
# ==========================================

app = FastAPI(
    title="CreatorIQ API"
)


# ==========================================
# User APIs
# ==========================================

app.include_router(user_router)


# ==========================================
# Authentication APIs
# ==========================================

app.include_router(
    auth_router,
    prefix="/auth"
)


# ==========================================
# Content APIs
# ==========================================

app.include_router(content_router)


# ==========================================
# Analytics APIs
# ==========================================

app.include_router(analytics_router)


# ==========================================
# Audience and Growth APIs
# ==========================================

app.include_router(audience_router)


# ==========================================
# Social Media APIs
# ==========================================

app.include_router(social_router)


# ==========================================
# Revenue APIs
# ==========================================

app.include_router(revenue_router)


# ==========================================
# Sponsorship APIs
# ==========================================

app.include_router(sponsorship_router)


# ==========================================
# Notification APIs
# ==========================================

app.include_router(notification_router)


# ==========================================
# Reports APIs
# ==========================================

app.include_router(reports_router)


# ==========================================
# Home API
# ==========================================

@app.get("/")
def home():
    return {
        "message": "CreatorIQ API is running"
    }