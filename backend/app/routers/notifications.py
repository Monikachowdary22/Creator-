from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.core.auth import get_current_user

from app.schemas.notification import (
    NotificationCreate,
    NotificationUpdate
)

from app.services.notification_service import (
    create_notification,
    get_all_notifications,
    get_notification_by_id,
    update_notification,
    delete_notification,
    mark_all_as_read,
    get_unread_count,
    generate_real_notifications
)

from app.services.alert_service import (
    create_performance_alert
)

from app.services.engagement_alert_service import (
    create_engagement_alert
)

from app.services.revenue_alert_service import (
    create_revenue_alert
)


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# ==========================================
# Create Notification
# ==========================================

@router.post("")
def create_notification_api(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification.creator_id = current_user.id

    return create_notification(
        db,
        notification
    )


# ==========================================
# Check for New Alerts
# ==========================================

@router.post("/check-alerts")
def check_alerts_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_notifs = generate_real_notifications(
        db,
        current_user.id
    )

    notifications = get_all_notifications(
        db,
        current_user.id
    )

    return {
        "message": f"Alert check completed. {len(new_notifs)} new alert(s) generated.",
        "new_count": len(new_notifs),
        "total": len(notifications),
        "data": notifications
    }


# ==========================================
# Get All Notifications
# ==========================================

@router.get("")
def get_notifications_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notifications = get_all_notifications(
        db,
        current_user.id
    )

    return {
        "total": len(notifications),
        "data": notifications
    }


# ==========================================
# Get Unread Notification Count
# ==========================================

@router.get("/unread-count")
def get_unread_count_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count = get_unread_count(
        db,
        current_user.id
    )

    return {
        "unread_count": count
    }


# ==========================================
# Mark All Notifications As Read
# ==========================================

@router.put("/mark-all-read")
def mark_all_read_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count = mark_all_as_read(
        db,
        current_user.id
    )

    return {
        "message": "All notifications marked as read",
        "updated_count": count
    }


# ==========================================
# Performance Alert
# ==========================================

@router.post("/alerts/performance/{content_id}")
def performance_alert_api(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = create_performance_alert(
        db,
        current_user.id,
        content_id
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Content not found or performance is above threshold"
        )

    return {
        "message": "Performance alert created successfully",
        "data": notification
    }


# ==========================================
# Engagement Alert
# ==========================================

@router.post("/alerts/engagement/{content_id}")
def engagement_alert_api(
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = create_engagement_alert(
        db,
        current_user.id,
        content_id
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Content not found or engagement is above threshold"
        )

    return {
        "message": "Engagement notification created successfully",
        "data": notification
    }


# ==========================================
# Revenue Alert
# ==========================================

@router.post("/alerts/revenue")
def revenue_alert_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = create_revenue_alert(
        db,
        current_user.id
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Revenue is above the alert threshold"
        )

    return {
        "message": "Revenue alert created successfully",
        "data": notification
    }


# ==========================================
# Get Notification By ID
# ==========================================

@router.get("/{notification_id}")
def get_notification_api(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = get_notification_by_id(
        db,
        notification_id,
        current_user.id
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return {
        "data": notification
    }


# ==========================================
# Update Notification
# ==========================================

@router.put("/{notification_id}")
def update_notification_api(
    notification_id: int,
    notification: NotificationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_notification = update_notification(
        db,
        notification_id,
        current_user.id,
        notification
    )

    if not updated_notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return {
        "message": "Notification updated successfully",
        "data": updated_notification
    }


# ==========================================
# Delete Notification
# ==========================================

@router.delete("/{notification_id}")
def delete_notification_api(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted_notification = delete_notification(
        db,
        notification_id,
        current_user.id
    )

    if not deleted_notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return {
        "message": "Notification deleted successfully"
    }