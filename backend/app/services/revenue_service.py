from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.revenue import Revenue
from app.schemas.revenue import RevenueCreate, RevenueUpdate


# ==========================================
# Create Revenue
# ==========================================

def create_revenue(
    db: Session,
    revenue_data: RevenueCreate
):
    new_revenue = Revenue(
        creator_id=revenue_data.creator_id,
        source=revenue_data.source,
        amount=revenue_data.amount,
        description=revenue_data.description,
        revenue_date=revenue_data.revenue_date
    )

    db.add(new_revenue)
    db.commit()
    db.refresh(new_revenue)

    return new_revenue


# ==========================================
# Get All Revenue
# ==========================================

def get_all_revenue(
    db: Session,
    creator_id: int = None
):
    query = db.query(Revenue)

    if creator_id is not None:
        query = query.filter(
            Revenue.creator_id == creator_id
        )

    return query.order_by(
        Revenue.revenue_date.desc()
    ).all()


# ==========================================
# Get Revenue By ID
# ==========================================

def get_revenue_by_id(
    db: Session,
    revenue_id: int
):
    return (
        db.query(Revenue)
        .filter(Revenue.id == revenue_id)
        .first()
    )


# ==========================================
# Update Revenue
# ==========================================

def update_revenue(
    db: Session,
    revenue_id: int,
    revenue_data: RevenueUpdate
):
    revenue = get_revenue_by_id(
        db,
        revenue_id
    )

    if not revenue:
        return None

    if revenue_data.creator_id is not None:
        revenue.creator_id = revenue_data.creator_id

    if revenue_data.source is not None:
        revenue.source = revenue_data.source

    if revenue_data.amount is not None:
        revenue.amount = revenue_data.amount

    if revenue_data.description is not None:
        revenue.description = revenue_data.description

    if revenue_data.revenue_date is not None:
        revenue.revenue_date = revenue_data.revenue_date

    db.commit()
    db.refresh(revenue)

    return revenue


# ==========================================
# Delete Revenue
# ==========================================

def delete_revenue(
    db: Session,
    revenue_id: int
):
    revenue = get_revenue_by_id(
        db,
        revenue_id
    )

    if not revenue:
        return None

    db.delete(revenue)
    db.commit()

    return revenue


# ==========================================
# Sprint 6 - Total Revenue
# ==========================================

def get_total_revenue(
    db: Session,
    creator_id: int = None
):
    query = db.query(
        func.coalesce(
            func.sum(Revenue.amount),
            0
        )
    )

    if creator_id is not None:
        query = query.filter(
            Revenue.creator_id == creator_id
        )

    total = query.scalar()

    return {
        "total_revenue": float(total)
    }


# ==========================================
# Sprint 6 - Revenue By Source
# ==========================================

def get_revenue_by_source(
    db: Session,
    creator_id: int = None
):
    query = (
        db.query(
            Revenue.source,
            func.sum(Revenue.amount).label(
                "total_revenue"
            )
        )
        .group_by(Revenue.source)
        .order_by(
            func.sum(Revenue.amount).desc()
        )
    )

    if creator_id is not None:
        query = query.filter(
            Revenue.creator_id == creator_id
        )

    results = query.all()

    return [
        {
            "source": source,
            "total_revenue": float(total_revenue)
        }
        for source, total_revenue in results
    ]


# ==========================================
# Sprint 6 - Monthly Revenue
# ==========================================

def get_monthly_revenue(
    db: Session,
    creator_id: int = None
):
    query = (
        db.query(
            func.to_char(
                Revenue.revenue_date,
                "YYYY-MM"
            ).label("month"),
            func.sum(Revenue.amount).label(
                "total_revenue"
            )
        )
        .group_by(
            func.to_char(
                Revenue.revenue_date,
                "YYYY-MM"
            )
        )
        .order_by(
            func.to_char(
                Revenue.revenue_date,
                "YYYY-MM"
            )
        )
    )

    if creator_id is not None:
        query = query.filter(
            Revenue.creator_id == creator_id
        )

    results = query.all()

    return [
        {
            "month": month,
            "total_revenue": float(total_revenue)
        }
        for month, total_revenue in results
    ]


# ==========================================
# Sprint 6 - Revenue Trend
# ==========================================

def get_revenue_trend(
    db: Session,
    creator_id: int = None
):
    monthly_data = get_monthly_revenue(
        db,
        creator_id
    )

    labels = []
    values = []

    for item in monthly_data:
        labels.append(item["month"])
        values.append(item["total_revenue"])

    return {
        "labels": labels,
        "values": values
    }