from sqlalchemy import Column, Integer, String, Date, Numeric

from app.db.database import Base


class Revenue(Base):
    __tablename__ = "revenue"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    creator_id = Column(
        Integer,
        nullable=False
    )

    source = Column(
        String(100),
        nullable=False
    )

    amount = Column(
        Numeric(12, 2),
        nullable=False
    )

    description = Column(
        String(255),
        nullable=True
    )

    revenue_date = Column(
        Date,
        nullable=False
    )