from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.playbook import Playbook
from app.engine.dag_runner import execute_playbook_dag

router = APIRouter()

@router.get("/")
def list_playbooks(db: Session = Depends(get_db)):
    playbooks = db.query(Playbook).all()
    return playbooks

@router.post("/")
def create_playbook(name: str, graph_data: dict, db: Session = Depends(get_db)):
    new_pb = Playbook(name=name, graph_data=graph_data)
    db.add(new_pb)
    db.commit()
    db.refresh(new_pb)
    return new_pb

@router.post("/{playbook_id}/execute")
def trigger_playbook(playbook_id: int, incident_id: int, db: Session = Depends(get_db)):
    playbook = db.query(Playbook).filter(Playbook.id == playbook_id).first()
    if not playbook:
        return {"error": "Playbook mapping not found."}
    
    # Offload the visual DAG logic into background Celery worker queue
    task = execute_playbook_dag.delay(incident_id=incident_id, graph_data=playbook.graph_data)
    return {"message": "Playbook executed via Celery Orchestrator.", "task_id": task.id}
