from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.content import Content
from app.services.social_media import (
    get_available_platforms,
    get_platform_data
)
from app.services.youtube_service import fetch_youtube_videos


router = APIRouter(
    prefix="/social",
    tags=["Social Media"]
)


# Temporary in-memory connected platforms
connected_platforms = {}


# =========================================================
# Connect Platform
# =========================================================

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


# =========================================================
# Get Connected Platforms
# =========================================================

@router.get("/platforms")
def get_connected_platforms():

    return {
        "platforms": list(
            connected_platforms.keys()
        )
    }


# =========================================================
# Mock Platform Synchronization
# =========================================================

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
            published_date=datetime.now().date()
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


# =========================================================
# REAL YOUTUBE SYNCHRONIZATION
# =========================================================

@router.post("/youtube/sync")
def synchronize_youtube(
    channel_id: str,
    db: Session = Depends(get_db)
):

    try:

        # -------------------------------------------------
        # Fetch data from YouTube API
        # -------------------------------------------------

        youtube_data = fetch_youtube_videos(
            channel_id=channel_id,
            max_results=10
        )

        if not youtube_data:
            return {
                "platform": "YouTube",
                "status": "success",
                "records_synced": 0,
                "message": "No YouTube videos found"
            }

        records_synced = 0
        created_records = 0
        updated_records = 0

        # -------------------------------------------------
        # Store / Update PostgreSQL records
        # -------------------------------------------------

        for data in youtube_data:

            external_id = data.get(
                "external_content_id"
            )

            if not external_id:
                continue

            existing_content = db.query(Content).filter(
                Content.platform == "YouTube",
                Content.external_content_id == external_id
            ).first()

            if existing_content:

                # Update existing record
                existing_content.content_title = data[
                    "content_title"
                ]

                existing_content.views = data[
                    "views"
                ]

                existing_content.likes = data[
                    "likes"
                ]

                existing_content.comments = data[
                    "comments"
                ]

                existing_content.shares = data[
                    "shares"
                ]

                existing_content.reach = data[
                    "reach"
                ]

                if data.get("published_date"):
                    existing_content.published_date = (
                        datetime.strptime(
                            data["published_date"],
                            "%Y-%m-%d"
                        ).date()
                    )

                updated_records += 1

            else:

                # Create new record
                new_content = Content(
                    creator_id=1,
                    platform="YouTube",
                    external_content_id=external_id,
                    content_title=data[
                        "content_title"
                    ],
                    views=data[
                        "views"
                    ],
                    likes=data[
                        "likes"
                    ],
                    comments=data[
                        "comments"
                    ],
                    shares=data[
                        "shares"
                    ],
                    saves=0,
                    watch_time=0,
                    reach=data[
                        "reach"
                    ],
                    published_date=datetime.strptime(
                        data["published_date"],
                        "%Y-%m-%d"
                    ).date()
                )

                db.add(new_content)

                created_records += 1

            records_synced += 1

        db.commit()

        return {
            "platform": "YouTube",
            "status": "success",
            "records_synced": records_synced,
            "created_records": created_records,
            "updated_records": updated_records
        }

    except ValueError as error:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except RuntimeError as error:

        db.rollback()

        raise HTTPException(
            status_code=502,
            detail=str(error)
        )

    except Exception as error:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"YouTube synchronization failed: {error}"
        )