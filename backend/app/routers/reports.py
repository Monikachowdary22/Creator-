from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.core.auth import get_current_user

from app.services.reporting_service import (
    generate_creator_report,
    get_content_performance_report,
    get_audience_report,
    get_revenue_report,
    get_growth_report,
    get_platform_report
)

from app.services.export_service import (
    generate_pdf_report,
    generate_excel_report
)


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# ==========================================
# Complete Creator Analytics Report
# ==========================================

@router.get("")
def get_creator_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return generate_creator_report(
        db,
        current_user.id
    )


# ==========================================
# Content Performance Report
# ==========================================

@router.get("/content")
def get_content_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_content_performance_report(
        db,
        current_user.id
    )


# ==========================================
# Audience Analytics Report
# ==========================================

@router.get("/audience")
def get_audience_analytics_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_audience_report(
        db,
        current_user.id
    )


# ==========================================
# Revenue Analytics Report
# ==========================================

@router.get("/revenue")
def get_revenue_analytics_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_revenue_report(
        db,
        current_user.id
    )


# ==========================================
# Growth Trends Report
# ==========================================

@router.get("/growth")
def get_growth_trends_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_growth_report(
        db,
        current_user.id
    )


# ==========================================
# Platform Comparison Report
# ==========================================

@router.get("/platforms")
def get_platform_comparison_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {
        "data": get_platform_report(
            db,
            current_user.id
        )
    }


# ==========================================
# Export PDF Report
# ==========================================

@router.get("/export/pdf")
def export_pdf_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report_data = generate_creator_report(
        db,
        current_user.id
    )

    pdf_file = generate_pdf_report(
        report_data
    )

    return StreamingResponse(
        pdf_file,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                "attachment; filename=creator_report.pdf"
        }
    )


# ==========================================
# Export Excel Report
# ==========================================

@router.get("/export/excel")
def export_excel_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report_data = generate_creator_report(
        db,
        current_user.id
    )

    excel_file = generate_excel_report(
        report_data
    )

    return StreamingResponse(
        excel_file,
        media_type=(
            "application/vnd.openxmlformats-"
            "officedocument.spreadsheetml.sheet"
        ),
        headers={
            "Content-Disposition":
                "attachment; filename=creator_report.xlsx"
        }
    )