from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class SponsorshipCreate(BaseModel):

    creator_id: int

    brand_name: str = Field(
        ...,
        min_length=2
    )

    campaign: str = Field(
        ...,
        min_length=2
    )

    contract_value: float = Field(
        ...,
        gt=0
    )

    start_date: date

    end_date: date

    status: str = Field(
        "Active",
        min_length=2
    )

    payment_status: str = Field(
        "Pending",
        min_length=2
    )


class SponsorshipUpdate(BaseModel):

    creator_id: Optional[int] = None

    brand_name: Optional[str] = Field(
        None,
        min_length=2
    )

    campaign: Optional[str] = Field(
        None,
        min_length=2
    )

    contract_value: Optional[float] = Field(
        None,
        gt=0
    )

    start_date: Optional[date] = None

    end_date: Optional[date] = None

    status: Optional[str] = Field(
        None,
        min_length=2
    )

    payment_status: Optional[str] = Field(
        None,
        min_length=2
    )