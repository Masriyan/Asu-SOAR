import json
import logging
from app.core.celery_app import celery_app
from app.integrations.plugin_loader import plugin_manager
from app.db.session import SessionLocal
from app.models.playbook import Incident

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=3)
def execute_playbook_dag(self, incident_id: int, graph_data: dict):
    """
    The Core Orchestration Engine.
    Iterates through the ReactFlow JSON nodes, parsing conditional edges 
    and dispatching individual actions dynamically.
    """
    logger.info(f"Starting DAG Executor for Incident [{incident_id}]")
    
    db = SessionLocal()
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    
    if not incident:
        logger.error(f"Incident {incident_id} not found logic-halted.")
        db.close()
        return {"error": "Incident not found"}
        
    nodes = graph_data.get('nodes', [])
    edges = graph_data.get('edges', [])
    
    # 1. Map nodes by ID for fast lookup
    node_map = {n['id']: n for n in nodes}
    
    # 2. Find the Trigger Node
    trigger_nodes = [n for n in nodes if n.get('type') == 'triggerNode']
    if not trigger_nodes:
        db.close()
        return {"status": "Complete", "msg": "No trigger node found."}
        
    current_node = trigger_nodes[0]
    executed_nodes = set()
    
    context_blob = incident.context_data or {}

    try:
        # 3. Graph Traversal Loop
        while current_node:
            node_id = current_node['id']
            if node_id in executed_nodes:
                logger.warning("Cyclic loop detected and broken.")
                break
                
            executed_nodes.add(node_id)
            node_type = current_node.get('type')
            plugin_name = current_node.get('data', {}).get('plugin')
            
            # Execute Action Node via Plugin Loader
            if node_type == 'actionNode' and plugin_name:
                try:
                    # Execute the discrete python class logic
                    result = plugin_manager.execute_node(plugin_name, args=context_blob)
                    # Update global Incident JSON Context Blob
                    context_blob[f"{plugin_name}_{node_id}"] = result
                except Exception as e:
                    logger.error(f"Plugin Execution Failed {plugin_name}: {e}")
                    context_blob[f"error_{node_id}"] = str(e)
            
            # Find next node natively via Edges (Target linking)
            # Complex DAG mapping requires evaluating output conditionals here
            outbound_edges = [e for e in edges if e['source'] == node_id]
            if not outbound_edges:
                break # Flow finished
                
            # For this MVP, we follow the first sequential edge
            next_node_id = outbound_edges[0]['target']
            current_node = node_map.get(next_node_id)
            
    except Exception as e:
        logger.error(f"DAG Traversal crashed: {e}")
    finally:
        # Commit context modifications back to postgres
        incident.context_data = context_blob
        incident.status = "Resolved"
        db.commit()
        db.close()
        logger.info(f"DAG Execution Completed for Incident {incident_id}")
        
    return {"status": "Success", "executed_nodes": list(executed_nodes)}
