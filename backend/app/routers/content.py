from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.content import Content
from app.schemas.content import ContentCreate, ContentUpdate

router = APIRouter()


# Create Content
@router.post("/content")
def create_content(
    content: ContentCreate,
    db: Session = Depends(get_db)
):
    new_content = Content(
        creator_id=content.creator_id,
        platform=content.platform,
        content_title=content.content_title,
        views=content.views,
        likes=content.likes,
        comments=content.comments,
        shares=content.shares,
        saves=content.saves,
        watch_time=content.watch_time,
        reach=content.reach,
        published_date=content.published_date
    )

    db.add(new_content)
    db.commit()
    db.refresh(new_content)

    return {
        "message": "Content created successfully",
        "data": new_content
    }


# Get All Content
@router.get("/content")
def get_all_content(
    db: Session = Depends(get_db)
):
    contents = db.query(Content).all()

    return {
        "total": len(contents),
        "data": contents
    }


# Get Content By ID
@router.get("/content/{content_id}")
def get_content(
    content_id: int,
    db: Session = Depends(get_db)
):
    content = db.query(Content).filter(
        Content.id == content_id
    ).first()

    if not content:
        raise HTTPException(
            status_code=404,
            detail="Content not found"
        )

    return {
        "data": content
    }


# Update Content
@router.put("/content/{content_id}")
def update_content(
    content_id: int,
    updated_content: ContentUpdate,
    db: Session = Depends(get_db)
):
    content = db.query(Content).filter(
        Content.id == content_id
    ).first()

    if not content:
        raise HTTPException(
            status_code=404,
            detail="Content not found"
        )

    if updated_content.creator_id is not None:
        content.creator_id = updated_content.creator_id

    if updated_content.platform is not None:
        content.platform = updated_content.platform

    if updated_content.content_title is not None:
        content.content_title = updated_content.content_title

    if updated_content.views is not None:
        content.views = updated_content.views

    if updated_content.likes is not None:
        content.likes = updated_content.likes

    if updated_content.comments is not None:
        content.comments = updated_content.comments

    if updated_content.shares is not None:
        content.shares = updated_content.shares

    if updated_content.saves is not None:
        content.saves = updated_content.saves

    if updated_content.watch_time is not None:
        content.watch_time = updated_content.watch_time

    if updated_content.reach is not None:
        content.reach = updated_content.reach

    if updated_content.published_date is not None:
        content.published_date = updated_content.published_date

    db.commit()
    db.refresh(content)

    return {
        "message": "Content updated successfully",
        "data": content
    }


# Delete Content
@router.delete("/content/{content_id}")
def delete_content(
    content_id: int,
    db: Session = Depends(get_db)
):
    content = db.query(Content).filter(
        Content.id == content_id
    ).first()

    if not content:
        raise HTTPException(
            status_code=404,
            detail="Content not found"
        )

    db.delete(content)
    db.commit()

    return {
        "message": "Content deleted successfully"
    }