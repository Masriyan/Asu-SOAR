# ASUSOAR Integrations Framework

Integrations are the backbone of any SOAR platform. While ASUSOAR's core orchestration engine (`dag_runner.py`) handles workflow mapping, the actual heavy lifting (blocking firewalls, suspending users) relies on Integrations. 

## Current Development State ✅

We have **successfully engineered the architectural backend** for the 1000+ API integrations mapping via the **Dynamic Plugin Auto-Loader** (`app/integrations/plugin_loader.py`). 

As of the current Phase 3 implementation:
- The backend natively locates and installs any valid `.py` script dropped into the `integrations/` directory at boot without needing to register URLs.
- *Upcoming Feature Gap*: We have not built the centralized "Marketplace" UI grid inside the Next.js React frontend to upload these scripts via a browser interface yet. 

## How It Works

ASUSOAR eschews monolith hard-coded dependencies. An integration is completely sandboxed.

### The Structure of an Integration Plugin
A plugin is fundamentally a simple Python script (e.g., `virustotal.py`) demanding a single top-level `run_integration(**kwargs)` constructor. 

```python
import os
import requests

def run_integration(hash_value: str = None, **kwargs) -> dict:
    """ASUSOAR VirusTotal Standard Module"""
    
    # Example logic bridging to the external VT API
    api_key = os.environ.get("VIRUSTOTAL_API_KEY")
    response = requests.get(f"https://www.virustotal.com/api/v3/files/{hash_value}", headers={"x-apikey": api_key})
    
    # Expected Return: The Playbook Engine (Celery) expects a pure JSON-friendly Dictionary
    return {"status": "success", "verdict": "malicious"}
```

## Integrating with the Playbook (ReactFlow)
When an analyst drags the "VirusTotal Module" onto the Visual Builder React Flow canvas, it natively generates a Node ID.
When `dag_runner.py` executes that node's queue, it calls:
`plugin_manager.execute_node("virustotal", args={"hash_value": "123...abc"})`
The returned `{"status": "success", "verdict": "malicious"}` is immediately appended back onto the primary PostgreSQL Incident `.context_data` blob, empowering the subsequent conditional branch nodes (e.g. *Wait, if verdict is malicious, jump to Isolate Endpoint node*).
