from sqlalchemy.orm import Session

from app.models.content import Content
from app.models.notification import Notification

from app.services.analytics_service import calculate_engagement_rate


# ==========================================
# Performance Alert
# ==========================================

def create_performance_alert(
    db: Session,
    creator_id: int,
    content_id: int,
    threshold: float = 2.0
):
    # Get content
    content = (
        db.query(Content)
        .filter(
            Content.id == content_id,
            Content.creator_id == creator_id
        )
        .first()
    )

    if not content:
        return None

    # Reuse existing analytics logic
    analytics = calculate_engagement_rate(
        db,
        content_id
    )

    if not analytics:
        return None

    engagement_rate = analytics["engagement_rate"]

    # Create alert only when performance is below threshold
    if engagement_rate >= threshold:
        return None

    notification = Notification(
        creator_id=creator_id,
        notification_type="performance",
        title="Performance Alert",
        message=(
            f"Content '{content.content_title}' has a low "
            f"engagement rate of {engagement_rate}%."
        )
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification