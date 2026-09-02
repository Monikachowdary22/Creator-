from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    users,
    auth,
    content,
    audience,
    growth,
    revenue,
    sponsorship,
    notifications,
    reports,
    analytics,
    social,
)

app = FastAPI(
    title="CreatorIQ - Content Creator Analytics API",
    description="Backend API for content creator performance and monetization analytics",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(content.router, prefix="/content", tags=["Content"])
app.include_router(audience.router, prefix="/audience", tags=["Audience"])
app.include_router(revenue.router, prefix="/revenue", tags=["Revenue"])
app.include_router(sponsorship.router, prefix="/sponsorships", tags=["Sponsorships"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(social.router, prefix="/social", tags=["Social"])

@app.get("/")
def root():
    return {"message": "CreatorIQ API is running"}
