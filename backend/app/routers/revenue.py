from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

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
    db: Session = Depends(get_db)
):
    return create_revenue(
        db,
        revenue
    )


# ==========================================
# Get All Revenue
# ==========================================

@router.get("")
def get_revenue_api(
    creator_id: int = None,
    db: Session = Depends(get_db)
):
    revenues = get_all_revenue(
        db,
        creator_id
    )

    return {
        "total": len(revenues),
        "data": revenues
    }


# ==========================================
# Total Revenue
# ==========================================

@router.get("/analytics/summary")
def revenue_summary_api(
    creator_id: int = None,
    db: Session = Depends(get_db)
):
    return get_total_revenue(
        db,
        creator_id
    )


# ==========================================
# Revenue By Source
# ==========================================

@router.get("/analytics/by-source")
def revenue_by_source_api(
    creator_id: int = None,
    db: Session = Depends(get_db)
):
    data = get_revenue_by_source(
        db,
        creator_id
    )

    return {
        "data": data
    }


# ==========================================
# Monthly Revenue
# ==========================================

@router.get("/analytics/monthly")
def monthly_revenue_api(
    creator_id: int = None,
    db: Session = Depends(get_db)
):
    data = get_monthly_revenue(
        db,
        creator_id
    )

    return {
        "data": data
    }


# ==========================================
# Revenue Trend
# ==========================================

@router.get("/analytics/trend")
def revenue_trend_api(
    creator_id: int = None,
    db: Session = Depends(get_db)
):
    return get_revenue_trend(
        db,
        creator_id
    )


# ==========================================
# Get Revenue By ID
# ==========================================

@router.get("/{revenue_id}")
def get_revenue_by_id_api(
    revenue_id: int,
    db: Session = Depends(get_db)
):
    revenue = get_revenue_by_id(
        db,
        revenue_id
    )

    if not revenue:
        raise HTTPException(
            status_code=404,
            detail="Revenue record not found"
        )

    return {
        "data": revenue
    }


# ==========================================
# Update Revenue
# ==========================================

@router.put("/{revenue_id}")
def update_revenue_api(
    revenue_id: int,
    revenue: RevenueUpdate,
    db: Session = Depends(get_db)
):
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
# Delete Revenue
# ==========================================

@router.delete("/{revenue_id}")
def delete_revenue_api(
    revenue_id: int,
    db: Session = Depends(get_db)
):
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