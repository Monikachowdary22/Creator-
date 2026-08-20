from sqlalchemy.orm import Session

from app.models.content import Content
from app.models.growth import Growth


# ==========================================
# Sprint 2 - Engagement Rate
# ==========================================

def calculate_engagement_rate(db: Session, content_id: int):

    content = (
        db.query(Content)
        .filter(Content.id == content_id)
        .first()
    )

    if not content:
        return None

    total_engagement = (
        content.likes
        + content.comments
        + content.shares
        + content.saves
    )

    if content.reach == 0:
        engagement_rate = 0
    else:
        engagement_rate = (
            total_engagement / content.reach
        ) * 100

    return {
        "content_id": content.id,
        "platform": content.platform,
        "views": content.views,
        "reach": content.reach,
        "total_engagement": total_engagement,
        "engagement_rate": round(
            engagement_rate,
            2
        )
    }


# ==========================================
# Sprint 2 - Top Content
# ==========================================

def get_top_content(db: Session):

    contents = db.query(Content).all()

    results = []

    for content in contents:

        total_engagement = (
            content.likes
            + content.comments
            + content.shares
            + content.saves
        )

        if content.reach == 0:
            engagement_rate = 0
        else:
            engagement_rate = (
                total_engagement / content.reach
            ) * 100

        results.append({
            "content_title": content.content_title,
            "platform": content.platform,
            "views": content.views,
            "reach": content.reach,
            "watch_time": content.watch_time,
            "engagement_rate": round(
                engagement_rate,
                2
            )
        })

    results.sort(
        key=lambda x: x["engagement_rate"],
        reverse=True
    )

    return results[:5]


# ==========================================
# Sprint 2 - Platform Performance
# ==========================================

def get_platform_performance(db: Session):

    contents = db.query(Content).all()

    platforms = {}

    for content in contents:

        if content.platform not in platforms:
            platforms[content.platform] = {
                "total_views": 0,
                "total_likes": 0,
                "total_comments": 0,
                "total_shares": 0,
                "total_reach": 0,
                "engagement_rates": []
            }

        platforms[content.platform]["total_views"] += content.views
        platforms[content.platform]["total_likes"] += content.likes
        platforms[content.platform]["total_comments"] += content.comments
        platforms[content.platform]["total_shares"] += content.shares
        platforms[content.platform]["total_reach"] += content.reach

        total_engagement = (
            content.likes
            + content.comments
            + content.shares
            + content.saves
        )

        if content.reach == 0:
            engagement_rate = 0
        else:
            engagement_rate = (
                total_engagement / content.reach
            ) * 100

        platforms[content.platform]["engagement_rates"].append(
            engagement_rate
        )

    results = []

    for platform, data in platforms.items():

        rates = data["engagement_rates"]

        average_engagement_rate = (
            sum(rates) / len(rates)
            if rates
            else 0
        )

        results.append({
            "platform": platform,
            "total_views": data["total_views"],
            "total_likes": data["total_likes"],
            "total_comments": data["total_comments"],
            "total_shares": data["total_shares"],
            "total_reach": data["total_reach"],
            "average_engagement_rate": round(
                average_engagement_rate,
                2
            )
        })

    return results


# ==========================================
# Sprint 5 - Platform Comparison
# ==========================================

def get_platform_comparison(db: Session):

    contents = db.query(Content).all()

    platforms = {}

    for content in contents:

        if content.platform not in platforms:

            platforms[content.platform] = {
                "content_count": 0,
                "total_views": 0,
                "total_likes": 0,
                "total_comments": 0,
                "total_shares": 0,
                "total_reach": 0,
                "total_engagement": 0
            }

        platforms[content.platform]["content_count"] += 1

        platforms[content.platform]["total_views"] += content.views

        platforms[content.platform]["total_likes"] += content.likes

        platforms[content.platform]["total_comments"] += content.comments

        platforms[content.platform]["total_shares"] += content.shares

        platforms[content.platform]["total_reach"] += content.reach

        platforms[content.platform]["total_engagement"] += (
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


# ==========================================
# Sprint 4 - KPI Summary
# ==========================================

def get_kpi_summary(db: Session):

    contents = db.query(Content).all()

    if not contents:
        return {
            "total_views": 0,
            "total_likes": 0,
            "total_comments": 0,
            "total_shares": 0,
            "total_reach": 0,
            "total_followers": 0,
            "average_engagement_rate": 0
        }

    total_views = sum(
        content.views
        for content in contents
    )

    total_likes = sum(
        content.likes
        for content in contents
    )

    total_comments = sum(
        content.comments
        for content in contents
    )

    total_shares = sum(
        content.shares
        for content in contents
    )

    total_reach = sum(
        content.reach
        for content in contents
    )

    engagement_rates = []

    for content in contents:

        total_engagement = (
            content.likes
            + content.comments
            + content.shares
            + content.saves
        )

        if content.reach == 0:
            engagement_rate = 0
        else:
            engagement_rate = (
                total_engagement
                / content.reach
            ) * 100

        engagement_rates.append(
            engagement_rate
        )

    average_engagement_rate = (
        sum(engagement_rates)
        / len(engagement_rates)
    )

    return {
        "total_views": total_views,
        "total_likes": total_likes,
        "total_comments": total_comments,
        "total_shares": total_shares,
        "total_reach": total_reach,
        "total_followers": 0,
        "average_engagement_rate": round(
            average_engagement_rate,
            2
        )
    }


# ==========================================
# Sprint 4 - Engagement Chart
# ==========================================

def get_engagement_chart(db: Session):

    contents = (
        db.query(Content)
        .order_by(Content.published_date.asc())
        .all()
    )

    labels = []
    values = []

    for content in contents:

        total_engagement = (
            content.likes
            + content.comments
            + content.shares
            + content.saves
        )

        if content.reach == 0:
            engagement_rate = 0
        else:
            engagement_rate = (
                total_engagement
                / content.reach
            ) * 100

        labels.append(
            content.published_date.isoformat()
        )

        values.append(
            round(engagement_rate, 2)
        )

    return {
        "labels": labels,
        "values": values
    }


# ==========================================
# Existing Dashboard Summary
# ==========================================

def get_dashboard_summary(db: Session):

    contents = db.query(Content).all()

    if not contents:
        return {
            "total_content": 0,
            "total_views": 0,
            "total_reach": 0,
            "average_engagement_rate": 0,
            "best_platform": None,
            "top_content": None
        }

    total_views = sum(
        content.views
        for content in contents
    )

    total_reach = sum(
        content.reach
        for content in contents
    )

    engagement_rates = []

    for content in contents:

        total_engagement = (
            content.likes
            + content.comments
            + content.shares
            + content.saves
        )

        if content.reach == 0:
            engagement_rate = 0
        else:
            engagement_rate = (
                total_engagement
                / content.reach
            ) * 100

        engagement_rates.append({
            "content": content,
            "rate": engagement_rate
        })

    average_engagement_rate = (
        sum(
            item["rate"]
            for item in engagement_rates
        )
        / len(engagement_rates)
    )

    top_content = max(
        engagement_rates,
        key=lambda item: item["rate"]
    )["content"]

    platform_data = get_platform_performance(db)

    best_platform_data = max(
        platform_data,
        key=lambda item:
        item["average_engagement_rate"]
    )

    return {
        "total_content": len(contents),
        "total_views": total_views,
        "total_reach": total_reach,
        "average_engagement_rate": round(
            average_engagement_rate,
            2
        ),
        "best_platform":
            best_platform_data["platform"],
        "top_content":
            top_content.content_title
    }


# ==========================================
# Sprint 4 - Follower Growth Chart
# ==========================================

def get_follower_growth_chart(db: Session):

    growth_records = (
        db.query(Growth)
        .order_by(Growth.date.asc())
        .all()
    )

    labels = []
    values = []

    for record in growth_records:

        labels.append(
            record.date.isoformat()
        )

        values.append(
            record.followers
        )

    return {
        "labels": labels,
        "values": values
    }