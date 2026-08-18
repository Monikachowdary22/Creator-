from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.db.database import get_db
from app.models.content import Content
from app.services.social_media import (
    get_available_platforms,
    get_platform_data
)


router = APIRouter(
    prefix="/social",
    tags=["Social Media"]
)


connected_platforms = {}


@router.post("/connect")
def connect_platform(
    platform: str,
    account_name: str
):
    available_platforms = get_available_platforms()

    if platform not in available_platforms:
        raise HTTPException(
            status_code=400,
            detail="Unsupported platform"
        )

    connected_platforms[platform] = {
        "account_name": account_name
    }

    return {
        "message": f"{platform} account connected successfully",
        "platform": platform,
        "account_name": account_name
    }


@router.get("/platforms")
def get_connected_platforms():
    return {
        "platforms": list(
            connected_platforms.keys()
        )
    }


@router.post("/sync")
def synchronize_platform(
    platform: str,
    db: Session = Depends(get_db)
):
    if platform not in connected_platforms:
        raise HTTPException(
            status_code=400,
            detail="Platform is not connected"
        )

    platform_data = get_platform_data(platform)

    if not platform_data:
        raise HTTPException(
            status_code=404,
            detail="No mock data available for this platform"
        )

    synchronized_records = []

    for data in platform_data:

        new_content = Content(
            creator_id=1,
            platform=data["platform"],
            content_title=data["content_title"],
            views=data["views"],
            likes=data["likes"],
            comments=data["comments"],
            shares=data["shares"],
            saves=0,
            watch_time=0,
            reach=data["reach"],
            published_date=date.today()
        )

        db.add(new_content)
        db.commit()
        db.refresh(new_content)

        synchronized_records.append({
            "id": new_content.id,
            "platform": new_content.platform,
            "content_title": new_content.content_title,
            "views": new_content.views,
            "likes": new_content.likes,
            "comments": new_content.comments,
            "shares": new_content.shares,
            "reach": new_content.reach
        })

    return {
        "message": f"{platform} data synchronized successfully",
        "platform": platform,
        "records_added": len(synchronized_records),
        "data": synchronized_records
    }