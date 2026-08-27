from sqlalchemy.orm import Session

from app.models.sponsorship import Sponsorship
from app.schemas.sponsorship import (
    SponsorshipCreate,
    SponsorshipUpdate
)


def create_sponsorship(
    db: Session,
    sponsorship_data: SponsorshipCreate
):
    new_sponsorship = Sponsorship(
        creator_id=sponsorship_data.creator_id,
        brand_name=sponsorship_data.brand_name,
        campaign=sponsorship_data.campaign,
        contract_value=sponsorship_data.contract_value,
        start_date=sponsorship_data.start_date,
        end_date=sponsorship_data.end_date,
        status=sponsorship_data.status,
        payment_status=sponsorship_data.payment_status
    )

    db.add(new_sponsorship)
    db.commit()
    db.refresh(new_sponsorship)

    return new_sponsorship


def get_all_sponsorships(
    db: Session,
    creator_id: int = None
):
    query = db.query(Sponsorship)

    if creator_id is not None:
        query = query.filter(
            Sponsorship.creator_id == creator_id
        )

    return query.order_by(
        Sponsorship.start_date.desc()
    ).all()


def get_sponsorship_by_id(
    db: Session,
    sponsorship_id: int
):
    return (
        db.query(Sponsorship)
        .filter(
            Sponsorship.id == sponsorship_id
        )
        .first()
    )


def update_sponsorship(
    db: Session,
    sponsorship_id: int,
    sponsorship_data: SponsorshipUpdate
):
    sponsorship = get_sponsorship_by_id(
        db,
        sponsorship_id
    )

    if not sponsorship:
        return None

    if sponsorship_data.creator_id is not None:
        sponsorship.creator_id = sponsorship_data.creator_id

    if sponsorship_data.brand_name is not None:
        sponsorship.brand_name = sponsorship_data.brand_name

    if sponsorship_data.campaign is not None:
        sponsorship.campaign = sponsorship_data.campaign

    if sponsorship_data.contract_value is not None:
        sponsorship.contract_value = sponsorship_data.contract_value

    if sponsorship_data.start_date is not None:
        sponsorship.start_date = sponsorship_data.start_date

    if sponsorship_data.end_date is not None:
        sponsorship.end_date = sponsorship_data.end_date

    if sponsorship_data.status is not None:
        sponsorship.status = sponsorship_data.status

    if sponsorship_data.payment_status is not None:
        sponsorship.payment_status = sponsorship_data.payment_status

    db.commit()
    db.refresh(sponsorship)

    return sponsorship


def delete_sponsorship(
    db: Session,
    sponsorship_id: int
):
    sponsorship = get_sponsorship_by_id(
        db,
        sponsorship_id
    )

    if not sponsorship:
        return None

    db.delete(sponsorship)
    db.commit()

    return sponsorship