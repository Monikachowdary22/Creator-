from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class RevenueCreate(BaseModel):

    creator_id: int

    source: str = Field(..., min_length=3)

    amount: float = Field(..., gt=0)

    description: Optional[str] = None

    revenue_date: date


class RevenueUpdate(BaseModel):

    creator_id: Optional[int] = None

    source: Optional[str] = Field(
        None,
        min_length=3
    )

    amount: Optional[float] = Field(
        None,
        gt=0
    )

    description: Optional[str] = None

    revenue_date: Optional[date] = None