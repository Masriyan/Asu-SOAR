# ASUSOAR Integration Developer Guide

ASUSOAR is designed to be endlessly extensible. As a SOC engineer, you do not need to modify the core FastAPI backend or Next.js frontend to add new capabilities. 

This guide provides exactly how to interconnect ASUSOAR with any 3rd-party tool (e.g., CrowdStrike, Jira, VirusTotal) or internal SIEM (e.g., Splunk, Microsoft Sentinel).

---

## 1. Outbound Integrations (3rd Party Tools)

When ASUSOAR needs to reach out and pull data (or execute an action) on another platform, it uses the **Plugin Auto-Loader**. 

### The Architecture
The folder `backend/app/integrations/` acts as our Marketplace Hot-Swapper. 
When ASUSOAR's background worker (Celery) boots up, it scans this folder for `.py` scripts. Each script represents a distinct tool. If you drop a new file named `crowdstrike.py` into this folder, it is immediately available inside the Visual Playbook Editor (React Flow).

### Writing a Custom Plugin
To build your own integration:
1. Create a `.py` file (e.g., `slack.py`).
2. Define a function exactly titled `run_integration(**kwargs)`.
3. Return a standard JSON-serializable Python dictionary. That dictionary is automatically captured by the DAG Engine and appended to the Incident context!

**Example (`backend/app/integrations/slack.py`):**
```python
import os
import requests
import logging

logger = logging.getLogger(__name__)

def run_integration(message: str = "Default Alert", channel: str = "#soc-alerts", **kwargs) -> dict:
    """ASUSOAR Slack Messaging Integration"""
    logger.info(f"[Slack Plugin] Sending msg to {channel}")
    
    webhook_url = os.environ.get("SLACK_WEBHOOK_URL")
    if not webhook_url:
        return {"error": "SLACK_WEBHOOK_URL not configured."}

    payload = {"text": message}
    
    try:
        response = requests.post(webhook_url, json=payload)
        response.raise_for_status()
        return {"status": "Message Delivered", "channel": channel}
    except Exception as e:
        return {"status": "Failed", "error": str(e)}
```

---

## 2. Inbound Integrations (Connecting a SIEM)

A SOAR is useless if it doesn't know an attack is happening. SIEMs (Security Information and Event Management) like Splunk, Elastic, or QRadar are responsible for detecting the attack. They then notify ASUSOAR to start the Playbook.

### The Architecture
Every Playbook created in the ASUSOAR database generates a unique ID (e.g., `Playbook ID: 5`). 
ASUSOAR exposes a **Webhook Listener** via its core REST API at `http://<AsuSoar_IP>:8000/api/v1/playbooks/{playbook_id}/execute`.

### Configuring your SIEM (e.g., Splunk)
To connect your SIEM to ASUSOAR, you simply configure an Action/Alert in the SIEM:

1. **Trigger Condition**: "When X failed logins occur in 5 minutes."
2. **Action**: "Send HTTP POST Webhook."
3. **Target URL**: `http://192.168.1.50:8000/api/v1/playbooks/5/execute?incident_id=101`
4. **Custom JSON Body**: 
```json
{
  "source_ip": "1.2.3.4",
  "username": "admin",
  "severity": "High"
}
```

When the SIEM fires this payload, the FastAPI router instantly catches it, spawns the Celery DAG runner, and executes the drag-and-drop playbook you assigned to ID `5`.

### Security Considerations (JWT)
Ensure that your SIEM is injecting the correct Authentication headers (`Authorization: Bearer <token>`) so the ASUSOAR API doesn't forcefully reject the webhook with an `HTTP 401 Unauthorized`.
