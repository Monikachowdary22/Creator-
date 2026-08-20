from sqlalchemy import Column, Integer, String, Date, UniqueConstraint

from app.db.database import Base


class Content(Base):
    __tablename__ = "content"

    __table_args__ = (
        UniqueConstraint(
            "platform",
            "external_content_id",
            name="uq_content_platform_external_id"
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    creator_id = Column(
        Integer,
        nullable=False
    )

    platform = Column(
        String,
        nullable=False
    )

    external_content_id = Column(
        String,
        nullable=True
    )

    content_title = Column(
        String,
        nullable=False
    )

    views = Column(
        Integer,
        nullable=False,
        default=0
    )

    likes = Column(
        Integer,
        nullable=False,
        default=0
    )

    comments = Column(
        Integer,
        nullable=False,
        default=0
    )

    shares = Column(
        Integer,
        nullable=False,
        default=0
    )

    saves = Column(
        Integer,
        nullable=False,
        default=0
    )

    watch_time = Column(
        Integer,
        nullable=False,
        default=0
    )

    reach = Column(
        Integer,
        nullable=False,
        default=0
    )

    published_date = Column(
        Date,
        nullable=False
    )