from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.revenue import Revenue
from app.models.notification import Notification


# ==========================================
# Revenue Alert
# ==========================================

def create_revenue_alert(
    db: Session,
    creator_id: int,
    threshold: float = 1000.0
):
    # Calculate total revenue for the logged-in creator
    total_revenue = (
        db.query(func.coalesce(func.sum(Revenue.amount), 0))
        .filter(
            Revenue.creator_id == creator_id
        )
        .scalar()
    )

    total_revenue = float(total_revenue)

    # Create alert when revenue is below threshold
    if total_revenue >= threshold:
        return None

    notification = Notification(
        creator_id=creator_id,
        notification_type="revenue",
        title="Revenue Alert",
        message=(
            f"Your total revenue is ₹{total_revenue:.2f}, "
            f"which is below the alert threshold of ₹{threshold:.2f}."
        )
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification