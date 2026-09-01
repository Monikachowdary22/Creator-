from sqlalchemy.orm import Session

from app.models.content import Content
from app.models.revenue import Revenue
from app.models.audience import Audience
from app.models.growth import Growth

from app.services.analytics_service import (
    get_kpi_summary,
    get_platform_comparison,
    get_top_content
)


# ==========================================
# Content Performance Report
# ==========================================

def get_content_performance_report(
    db: Session,
    creator_id: int
):
    contents = (
        db.query(Content)
        .filter(Content.creator_id == creator_id)
        .all()
    )

    total_views = sum(
        content.views for content in contents
    )

    total_likes = sum(
        content.likes for content in contents
    )

    total_comments = sum(
        content.comments for content in contents
    )

    total_shares = sum(
        content.shares for content in contents
    )

    total_reach = sum(
        content.reach for content in contents
    )

    return {
        "total_content": len(contents),
        "total_views": total_views,
        "total_likes": total_likes,
        "total_comments": total_comments,
        "total_shares": total_shares,
        "total_reach": total_reach,
        "content": [
            {
                "id": content.id,
                "title": content.content_title,
                "platform": content.platform,
                "views": content.views,
                "likes": content.likes,
                "comments": content.comments,
                "shares": content.shares,
                "saves": content.saves,
                "reach": content.reach,
                "published_date": content.published_date
            }
            for content in contents
        ]
    }


# ==========================================
# Audience Analytics Report
# ==========================================

def get_audience_report(
    db: Session,
    creator_id: int
):
    audiences = (
        db.query(Audience)
        .filter(Audience.creator_id == creator_id)
        .all()
    )

    return {
        "total_records": len(audiences),
        "data": [
            {
                column.name: getattr(audience, column.name)
                for column in Audience.__table__.columns
                if column.name != "creator_id"
            }
            for audience in audiences
        ]
    }


# ==========================================
# Revenue Analytics Report
# ==========================================

def get_revenue_report(
    db: Session,
    creator_id: int
):
    revenues = (
        db.query(Revenue)
        .filter(Revenue.creator_id == creator_id)
        .all()
    )

    total_revenue = sum(
        float(revenue.amount)
        for revenue in revenues
    )

    return {
        "total_revenue": total_revenue,
        "total_records": len(revenues),
        "data": [
            {
                "id": revenue.id,
                "amount": float(revenue.amount),
                "revenue_date": revenue.revenue_date,
                "source": revenue.source,
                "description": revenue.description
            }
            for revenue in revenues
        ]
    }


# ==========================================
# Growth Trends Report
# ==========================================

def get_growth_report(
    db: Session,
    creator_id: int
):
    growth_records = (
        db.query(Growth)
        .filter(Growth.creator_id == creator_id)
        .order_by(Growth.date.asc())
        .all()
    )

    return {
        "total_records": len(growth_records),
        "data": [
            {
                column.name: getattr(growth, column.name)
                for column in Growth.__table__.columns
                if column.name != "creator_id"
            }
            for growth in growth_records
        ]
    }


# ==========================================
# Platform Comparison Report
# ==========================================

def get_platform_report(
    db: Session,
    creator_id: int
):
    contents = (
        db.query(Content)
        .filter(Content.creator_id == creator_id)
        .all()
    )

    platforms = {}

    for content in contents:

        platform = content.platform

        if platform not in platforms:
            platforms[platform] = {
                "content_count": 0,
                "total_views": 0,
                "total_likes": 0,
                "total_comments": 0,
                "total_shares": 0,
                "total_reach": 0,
                "total_engagement": 0
            }

        platforms[platform]["content_count"] += 1
        platforms[platform]["total_views"] += content.views
        platforms[platform]["total_likes"] += content.likes
        platforms[platform]["total_comments"] += content.comments
        platforms[platform]["total_shares"] += content.shares
        platforms[platform]["total_reach"] += content.reach

        platforms[platform]["total_engagement"] += (
            content.likes
            + content.comments
            + content.shares
            + content.saves
        )

    results = []

    for platform, data in platforms.items():

        if data["total_reach"] == 0:
            engagement_rate = 0
        else:
            engagement_rate = (
                data["total_engagement"]
                / data["total_reach"]
            ) * 100

        results.append({
            "platform": platform,
            "content_count": data["content_count"],
            "total_views": data["total_views"],
            "total_likes": data["total_likes"],
            "total_comments": data["total_comments"],
            "total_shares": data["total_shares"],
            "total_reach": data["total_reach"],
            "total_engagement": data["total_engagement"],
            "engagement_rate": round(
                engagement_rate,
                2
            )
        })

    results.sort(
        key=lambda x: x["engagement_rate"],
        reverse=True
    )

    return results


from app.models.sponsorship import Sponsorship


# ==========================================
# Sponsorship Report
# ==========================================

def get_sponsorship_report(
    db: Session,
    creator_id: int
):
    sponsorships = (
        db.query(Sponsorship)
        .filter(Sponsorship.creator_id == creator_id)
        .order_by(Sponsorship.start_date.desc())
        .all()
    )

    total_value = sum(
        float(s.contract_value)
        for s in sponsorships
    )

    return {
        "total_sponsorships": len(sponsorships),
        "total_contract_value": total_value,
        "data": [
            {
                "id": s.id,
                "brand_name": s.brand_name,
                "campaign": s.campaign,
                "contract_value": float(s.contract_value),
                "start_date": str(s.start_date),
                "end_date": str(s.end_date),
                "status": s.status,
                "payment_status": s.payment_status
            }
            for s in sponsorships
        ]
    }


# ==========================================
# Complete Creator Report
# ==========================================

def generate_creator_report(
    db: Session,
    creator_id: int
):
    return {
        "creator_id": creator_id,

        "content_performance":
            get_content_performance_report(
                db,
                creator_id
            ),

        "audience_analytics":
            get_audience_report(
                db,
                creator_id
            ),

        "revenue_analytics":
            get_revenue_report(
                db,
                creator_id
            ),

        "growth_trends":
            get_growth_report(
                db,
                creator_id
            ),

        "platform_comparison":
            get_platform_report(
                db,
                creator_id
            ),

        "sponsorships":
            get_sponsorship_report(
                db,
                creator_id
            )
    }