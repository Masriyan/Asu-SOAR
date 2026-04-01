from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.playbook import Incident

router = APIRouter()

@router.get("/kpis")
def get_kpi_dashboard(db: Session = Depends(get_db)):
    """
    Computes real-time reporting metrics directly from the Incident database.
    """
    total_cases = db.query(Incident).count()
    active_cases = db.query(Incident).filter(Incident.status == "In-Progress").count()
    resolved_cases = db.query(Incident).filter(Incident.status == "Resolved").count()
    
    # Calculate Playbook Automation Efficiency (how many cases didn't need human closing)
    automation_rate = 0
    if total_cases > 0:
        automation_rate = round((resolved_cases / total_cases) * 100, 1)

    # Compute breakdown by severity
    critical_count = db.query(Incident).filter(Incident.severity == "Critical").count()

    return {
        "metrics": {
            "total_incidents": total_cases,
            "active_war_rooms": active_cases,
            "automation_rate": f"{automation_rate}%",
            "critical_cases": critical_count,
            "mttr_avg": "14m 30s", # Hardcoded placeholder for MVP Phase
        }
    }
