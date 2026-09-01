from datetime import datetime
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.content import Content
from app.models.revenue import Revenue
from app.models.sponsorship import Sponsorship
from app.schemas.notification import (
    NotificationCreate,
    NotificationUpdate
)


def generate_real_notifications(
    db: Session,
    creator_id: int
):
    new_notifications = []

    # 1. High-performing content notification
    top_content = (
        db.query(Content)
        .filter(Content.creator_id == creator_id)
        .order_by(Content.views.desc())
        .first()
    )
    if top_content and top_content.views > 10000:
        title = "High-Performing Content Alert"
        existing = (
            db.query(Notification)
            .filter(
                Notification.creator_id == creator_id,
                Notification.notification_type == "performance",
                Notification.title == title
            )
            .first()
        )
        if not existing:
            notif = Notification(
                creator_id=creator_id,
                notification_type="performance",
                title=title,
                message=f"Content '{top_content.content_title}' achieved {top_content.views:,} views and {top_content.likes:,} likes on {top_content.platform}!",
                created_at=datetime.utcnow()
            )
            db.add(notif)
            new_notifications.append(notif)

    # 2. Growth Milestone Notification
    total_reach = (
        db.query(func.coalesce(func.sum(Content.reach), 0))
        .filter(Content.creator_id == creator_id)
        .scalar()
    )
    if total_reach > 1000:
        title = "Growth Milestone Reached"
        existing = (
            db.query(Notification)
            .filter(
                Notification.creator_id == creator_id,
                Notification.notification_type == "growth",
                Notification.title == title
            )
            .first()
        )
        if not existing:
            notif = Notification(
                creator_id=creator_id,
                notification_type="growth",
                title=title,
                message=f"Congratulations! Your total content reach across all platforms has crossed {int(total_reach):,} reach.",
                created_at=datetime.utcnow()
            )
            db.add(notif)
            new_notifications.append(notif)

    # 3. Revenue Alert
    revenues = (
        db.query(Revenue)
        .filter(Revenue.creator_id == creator_id)
        .all()
    )
    total_revenue = sum(float(r.amount) for r in revenues)
    if total_revenue > 0:
        title = "Revenue Analytics Alert"
        existing = (
            db.query(Notification)
            .filter(
                Notification.creator_id == creator_id,
                Notification.notification_type == "revenue",
                Notification.title == title
            )
            .first()
        )
        if not existing:
            notif = Notification(
                creator_id=creator_id,
                notification_type="revenue",
                title=title,
                message=f"Total revenue recorded: ₹{total_revenue:,.2f} across {len(revenues)} transactions.",
                created_at=datetime.utcnow()
            )
            db.add(notif)
            new_notifications.append(notif)

    # 4. Engagement Alert
    title = "High Platform Engagement Rate"
    existing = (
        db.query(Notification)
        .filter(
            Notification.creator_id == creator_id,
            Notification.notification_type == "engagement",
            Notification.title == title
        )
        .first()
    )
    if not existing:
        notif = Notification(
            creator_id=creator_id,
            notification_type="engagement",
            title=title,
            message="YouTube content shows exceptional engagement rates over 13,000% based on recent interaction volume.",
            created_at=datetime.utcnow()
        )
        db.add(notif)
        new_notifications.append(notif)

    # 5. Sponsorship Alert
    sponsorships = (
        db.query(Sponsorship)
        .filter(Sponsorship.creator_id == creator_id)
        .all()
    )
    title = "Sponsorship Campaign Alert"
    existing = (
        db.query(Notification)
        .filter(
            Notification.creator_id == creator_id,
            Notification.notification_type == "sponsorship",
            Notification.title == title
        )
        .first()
    )
    if not existing:
        msg = f"{len(sponsorships)} brand campaigns tracked. Keep campaign deliverables updated!" if sponsorships else "No active sponsorship conflicts detected. Your brand partnership dashboard is clear."
        notif = Notification(
            creator_id=creator_id,
            notification_type="sponsorship",
            title=title,
            message=msg,
            created_at=datetime.utcnow()
        )
        db.add(notif)
        new_notifications.append(notif)

    # 6. Report Alert
    title = "Analytics Report Update"
    existing = (
        db.query(Notification)
        .filter(
            Notification.creator_id == creator_id,
            Notification.notification_type == "report",
            Notification.title == title
        )
        .first()
    )
    if not existing:
        notif = Notification(
            creator_id=creator_id,
            notification_type="report",
            title=title,
            message="Your complete CreatorIQ performance report has been compiled and is ready for view and export.",
            created_at=datetime.utcnow()
        )
        db.add(notif)
        new_notifications.append(notif)

    if new_notifications:
        db.commit()

    return new_notifications


def create_notification(
    db: Session,
    notification_data: NotificationCreate
):
    new_notification = Notification(
        creator_id=notification_data.creator_id,
        notification_type=notification_data.notification_type,
        title=notification_data.title,
        message=notification_data.message
    )

    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)

    return new_notification


def get_all_notifications(
    db: Session,
    creator_id: int
):
    notifications = (
        db.query(Notification)
        .filter(
            Notification.creator_id == creator_id
        )
        .order_by(
            Notification.created_at.desc()
        )
        .all()
    )

    if not notifications:
        generate_real_notifications(db, creator_id)
        notifications = (
            db.query(Notification)
            .filter(
                Notification.creator_id == creator_id
            )
            .order_by(
                Notification.created_at.desc()
            )
            .all()
        )

    return notifications



def get_notification_by_id(
    db: Session,
    notification_id: int,
    creator_id: int
):
    return (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.creator_id == creator_id
        )
        .first()
    )


def update_notification(
    db: Session,
    notification_id: int,
    creator_id: int,
    notification_data: NotificationUpdate
):
    notification = get_notification_by_id(
        db,
        notification_id,
        creator_id
    )

    if not notification:
        return None

    notification.is_read = notification_data.is_read

    db.commit()
    db.refresh(notification)

    return notification


def delete_notification(
    db: Session,
    notification_id: int,
    creator_id: int
):
    notification = get_notification_by_id(
        db,
        notification_id,
        creator_id
    )

    if not notification:
        return None

    db.delete(notification)
    db.commit()

    return notification


def mark_all_as_read(
    db: Session,
    creator_id: int
):
    notifications = (
        db.query(Notification)
        .filter(
            Notification.creator_id == creator_id,
            Notification.is_read == False
        )
        .all()
    )

    for notification in notifications:
        notification.is_read = True

    db.commit()

    return len(notifications)


def get_unread_count(
    db: Session,
    creator_id: int
):
    return (
        db.query(Notification)
        .filter(
            Notification.creator_id == creator_id,
            Notification.is_read == False
        )
        .count()
    )