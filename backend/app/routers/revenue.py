from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.core.auth import get_current_user

from app.schemas.revenue import (
    RevenueCreate,
    RevenueUpdate
)

from app.services.revenue_service import (
    create_revenue,
    get_all_revenue,
    get_revenue_by_id,
    update_revenue,
    delete_revenue,
    get_total_revenue,
    get_revenue_by_source,
    get_monthly_revenue,
    get_revenue_trend
)


router = APIRouter(
    prefix="/revenue",
    tags=["Revenue"]
)


# ==========================================
# Create Revenue
# ==========================================

@router.post("")
def create_revenue_api(
    revenue: RevenueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    revenue.creator_id = current_user.id

    return create_revenue(
        db,
        revenue
    )


# ==========================================
# Get All Revenue - Current User Only
# ==========================================

@router.get("")
def get_revenue_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    revenues = get_all_revenue(
        db,
        current_user.id
    )

    return {
        "total": len(revenues),
        "data": revenues
    }


# ==========================================
# Total Revenue - Current User Only
# ==========================================

@router.get("/analytics/summary")
def revenue_summary_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_total_revenue(
        db,
        current_user.id
    )


# ==========================================
# Revenue By Source - Current User Only
# ==========================================

@router.get("/analytics/by-source")
def revenue_by_source_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = get_revenue_by_source(
        db,
        current_user.id
    )

    return {
        "data": data
    }


# ==========================================
# Monthly Revenue - Current User Only
# ==========================================

@router.get("/analytics/monthly")
def monthly_revenue_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = get_monthly_revenue(
        db,
        current_user.id
    )

    return {
        "data": data
    }


# ==========================================
# Revenue Trend - Current User Only
# ==========================================

@router.get("/analytics/trend")
def revenue_trend_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_revenue_trend(
        db,
        current_user.id
    )


# ==========================================
# Get Revenue By ID - Current User Only
# ==========================================

@router.get("/{revenue_id}")
def get_revenue_by_id_api(
    revenue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    revenue = get_revenue_by_id(
        db,
        revenue_id
    )

    if not revenue or revenue.creator_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Revenue record not found"
        )

    return {
        "data": revenue
    }


# ==========================================
# Update Revenue - Current User Only
# ==========================================

@router.put("/{revenue_id}")
def update_revenue_api(
    revenue_id: int,
    revenue: RevenueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_revenue = get_revenue_by_id(
        db,
        revenue_id
    )

    if not existing_revenue or existing_revenue.creator_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Revenue record not found"
        )

    # Prevent changing ownership
    revenue.creator_id = None

    updated_revenue = update_revenue(
        db,
        revenue_id,
        revenue
    )

    if not updated_revenue:
        raise HTTPException(
            status_code=404,
            detail="Revenue record not found"
        )

    return {
        "message": "Revenue updated successfully",
        "data": updated_revenue
    }


# ==========================================
# Delete Revenue - Current User Only
# ==========================================

@router.delete("/{revenue_id}")
def delete_revenue_api(
    revenue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_revenue = get_revenue_by_id(
        db,
        revenue_id
    )

    if not existing_revenue or existing_revenue.creator_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Revenue record not found"
        )

    deleted_revenue = delete_revenue(
        db,
        revenue_id
    )

    if not deleted_revenue:
        raise HTTPException(
            status_code=404,
            detail="Revenue record not found"
        )

    return {
        "message": "Revenue deleted successfully"
    }