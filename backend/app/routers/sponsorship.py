from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.sponsorship import (
    SponsorshipCreate,
    SponsorshipUpdate
)
from app.services.sponsorship_service import (
    create_sponsorship,
    get_all_sponsorships,
    get_sponsorship_by_id,
    update_sponsorship,
    delete_sponsorship,
)


router = APIRouter(
    prefix="/sponsorships",
    tags=["Sponsorships"]
)


# ==========================================
# Create Sponsorship
# ==========================================

@router.post("")
def create_sponsorship_api(
    sponsorship: SponsorshipCreate,
    db: Session = Depends(get_db)
):
    return create_sponsorship(
        db,
        sponsorship
    )


# ==========================================
# Get All Sponsorships
# ==========================================

@router.get("")
def get_sponsorships_api(
    creator_id: int = None,
    db: Session = Depends(get_db)
):
    sponsorships = get_all_sponsorships(
        db,
        creator_id
    )

    return {
        "total": len(sponsorships),
        "data": sponsorships
    }


# ==========================================
# Get Sponsorship By ID
# ==========================================

@router.get("/{sponsorship_id}")
def get_sponsorship_by_id_api(
    sponsorship_id: int,
    db: Session = Depends(get_db)
):
    sponsorship = get_sponsorship_by_id(
        db,
        sponsorship_id
    )

    if not sponsorship:
        raise HTTPException(
            status_code=404,
            detail="Sponsorship record not found"
        )

    return {
        "data": sponsorship
    }


# ==========================================
# Update Sponsorship
# ==========================================

@router.put("/{sponsorship_id}")
def update_sponsorship_api(
    sponsorship_id: int,
    sponsorship: SponsorshipUpdate,
    db: Session = Depends(get_db)
):
    updated_sponsorship = update_sponsorship(
        db,
        sponsorship_id,
        sponsorship
    )

    if not updated_sponsorship:
        raise HTTPException(
            status_code=404,
            detail="Sponsorship record not found"
        )

    return {
        "message": "Sponsorship updated successfully",
        "data": updated_sponsorship
    }


# ==========================================
# Delete Sponsorship
# ==========================================

@router.delete("/{sponsorship_id}")
def delete_sponsorship_api(
    sponsorship_id: int,
    db: Session = Depends(get_db)
):
    deleted_sponsorship = delete_sponsorship(
        db,
        sponsorship_id
    )

    if not deleted_sponsorship:
        raise HTTPException(
            status_code=404,
            detail="Sponsorship record not found"
        )

    return {
        "message": "Sponsorship deleted successfully"
    }