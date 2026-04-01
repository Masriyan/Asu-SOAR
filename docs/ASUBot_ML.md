# ASUBot (AI/ML Module) Architecture

One of the largest selling points of the ASUSOAR platform is the **ASUBot**, our dedicated Intelligence module engineered to slash Mean Time To Respond (MTTR) by acting as a Co-Pilot for the Human Analyst.

This document details the intended integration path when **Phase 5 (Machine Learning Execution)** begins.

## 1. Natural Language Threat Parsing (NLP)
SIEM alerts are notoriously noisy. When a raw Event Log arrives, the standard approach relies heavily on exact REGEX matching (e.g., matching IPv4).
*   **The Problem:** Evasive malware hashes and phishing subjects change dynamically.
*   **The AI Solution:** ASUSOAR will embed `spaCy` or `Transformers` (like a localized BERT implementation). When unstructured data enters the DAG engine (like an email body), the ML node parses "Intent" from "Entities" natively, highlighting new IOCs that Regex might have missed, and injecting them immediately into the Playbook Graph for automatic Sandbox isolation.

## 2. Dynamic Severity Prediction (Random Forest)
A tier-1 SOC gets hundreds of "Low" severity alerts, but some of those are miscategorized Zero-Days.
*   ASUBot runs a passive classification model trained upon historical DB resolution data (`app/models/playbook.py -> incident.status`).
*   By clustering features (Target Hostname, Hour of Day, Triggering SIEM Rule, Associated Tactics), ASUBot can instantly predict if a generic alert statistically resembles a massive ransomware outbreak, and automatically re-score the Incident Severity to `Critical` before human eyes even open the `/incidents` dashboard.

## 3. Intelligent Analyst Routing
When 15 tickets drop on a shift floor, resolving them quickly demands expertise.
*   ASUSOAR will feature a recommendation engine. If "Analyst A" historically resolves Phishing Playbooks in 14 minutes, and "Analyst B" resolves them in 40 minutes because their specialty is Cloud Misconfigurations instead, the ML engine will automatically load-balance the Phishing case to "Analyst A", optimizing the War Room natively.

## Implementation Path
The backend will natively adopt the `scikit-learn` stack alongside `NumPy`. We will spawn a completely isolated FastAPI Docker container named `asusoar-ml` in the docker-compose file. All inference requests will route internally to prevent the main Celery orchestrator from bogging down during intensive CPU matrix operations.
