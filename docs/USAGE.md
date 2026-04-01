# ASUSOAR Usage Guide

This document explains how to navigate and operate the ASUSOAR dashboard effectively from an Analyst's perspective.

## 1. Accessing the Dashboard
- **Web Interface**: Open `http://localhost:3000` (or the IP where ASUSOAR is hosted).
- **Default Authentication**: By default, no users are generated. Ensure your Tenant Admin has provisioned your SOC credentials via the API or internal SSO.

## 2. Navigating the Sidebar

### 📊 Dashboard
The primary landing screen. Here you will see High-Level KPIs configured for your Role:
- **Active Incidents**: Cases currently marked structurally as "In-Progress".
- **Playbooks Running**: Background Celery task tracking.
- **ASUBot Accuracy**: The machine learning threshold of correct automation categorizations.

### ⚡ Incidents (Case Management)
This is the primary workspace for SOC tracking. 
1. **Filtering**: You can filter incidents by Severity, Assigned Analyst, Status, or Playbook association.
2. **Virtual War Room**: Clicking into an Incident opens the War Room. 
    - The left panel holds structured artifacts (Malicious IPs, Hashes).
    - The right panel acts as a live ChatOps console where commands like `/reputation 8.8.8.8` can be instantly evaluated.

### 🌐 Playbooks (Visual Editor)
To build an automated workflow, follow these steps:
1. Navigate to **Playbooks** on the Sidebar.
2. Select **[+ Create New]**.
3. **Trigger Node**: Every DAG begins with a Trigger (e.g. *On New Phishing Email*). Drag it onto the canvas.
4. **Action Nodes**: Connect standard integrations like pulling a binary from an email to the VirusTotal Analysis node.
5. **Logic Routing**: Construct *If/Else* branches checking if the output from VirusTotal contains `{malicious > 5}`. If yes, link to an *Isolate Host* node on Cortex XDR.
6. Click **Save** and **Deploy**. Ensure you test in the "Playground" debugger prior to activating in production.

## 3. Creating Python Integrations
If the tool you use is missing, construct your own plugin inside `backend/app/integrations`.
1. Every integration exposes a standard YAML mapping and a `.py` script implementing a class parser.
2. The core python logic must return an atomic dictionary (JSON payload) mapped back into the DB queue.
