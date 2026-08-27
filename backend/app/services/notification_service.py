from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.schemas.notification import (
    NotificationCreate,
    NotificationUpdate
)


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
    return (
        db.query(Notification)
        .filter(
            Notification.creator_id == creator_id
        )
        .order_by(
            Notification.created_at.desc()
        )
        .all()
    )


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