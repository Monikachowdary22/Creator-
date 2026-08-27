from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ==========================================
# Create Notification
# ==========================================

class NotificationCreate(BaseModel):
    creator_id: int
    notification_type: str
    title: str
    message: str


# ==========================================
# Update Notification
# ==========================================

class NotificationUpdate(BaseModel):
    is_read: bool


# ==========================================
# Notification Response
# ==========================================

class NotificationResponse(BaseModel):
    id: int
    creator_id: int
    notification_type: str
    title: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )