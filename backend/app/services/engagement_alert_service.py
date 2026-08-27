from sqlalchemy.orm import Session

from app.models.content import Content
from app.models.notification import Notification
from app.services.analytics_service import calculate_engagement_rate


def create_engagement_alert(
    db: Session,
    creator_id: int,
    content_id: int,
    threshold: float = 1.0
):
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

    analytics = calculate_engagement_rate(
        db,
        content_id
    )

    if not analytics:
        return None

    engagement_rate = analytics["engagement_rate"]

    if engagement_rate >= threshold:
        return None

    notification = Notification(
        creator_id=creator_id,
        notification_type="engagement",
        title="Engagement Notification",
        message=(
            f"Content '{content.content_title}' has low "
            f"engagement of {engagement_rate:.2f}%."
        )
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification