# Features

ASUSOAR is an end-to-end enterprise security orchestration framework designed to augment your existing SIEM, proactively intercept IOCs, and automate response at machine speed. This document provides a comprehensive breakdown of every platform capability.

---

## 1. Visual Playbook Automation Engine

*The nervous system of the SOC.*

ASUSOAR's Playbook Editor is built on a customized React Flow canvas. Analysts string together complex logical branches by dragging, dropping, and connecting action nodes — no code required.

**Key capabilities:**

- **Drag-and-drop workspace** — Define action nodes (e.g., `Block IP on Firewall`) and conditional routing gates (e.g., `If severity = Critical`) with a visual builder, then deploy the playbook immediately.
- **Automation at scale** — Celery asynchronous workers execute up to 95% of manual response tasks (password resets, Active Directory suspensions, IOC pushes to CrowdStrike) without human intervention — in milliseconds.
- **Guaranteed DAG execution** — Node state transitions are atomic. A node will not fire until all preceding required variables have successfully resolved, preventing partial or corrupt executions.
- **Sandbox dry-run** — Test any untested Python plugin or slash command in the Playground Sandbox without touching production PostgreSQL state.

---

## 2. Dynamic Integration Marketplace

*Bridging the gap across 1,000+ API endpoints.*

Every tool connection in ASUSOAR is a loosely-coupled Python integration script. This makes the platform extensible by anyone comfortable with Python — no internal framework knowledge required.

**Out-of-the-box integrations include:**

| Category | Tools |
|---|---|
| SIEM | Splunk, Elasticsearch, Microsoft Sentinel |
| Endpoint | CrowdStrike Falcon, Palo Alto Cortex XDR |
| Ticketing | Jira, ServiceNow |
| Communication | Slack, Microsoft Teams |
| Threat Intel | VirusTotal, Shodan, AlienVault OTX |

**Building your own integration:**

Drop a new Python script into `backend/app/integrations/` with an accompanying YAML definition file. ASUSOAR's secrets management layer automatically injects `.env` credentials at execution time — no hardcoded passwords, ever.

---

## 3. Threat Intel Management (TIM)

*Automated IOC scoring, correlation, and lifecycle management.*

ASUSOAR's TIM module aggregates raw indicator feeds and distills them into actionable, scored intelligence.

- **Mass correlation** — Pull raw feed data from AlienVault OTX, Palo Alto Unit 42, MISP, and Shodan simultaneously and correlate overlapping indicators in real time.
- **Confidence scoring** — A centralized algorithm computes a risk score (0–100) across ingested IPs, domains, and file hashes, factoring in feed source reputation, indicator age, and corroboration count.
- **Auto-retraction** — If a feed marks a previously blocked IP as safe after 30 days, ASUSOAR automatically retracts the associated zero-trust firewall block — keeping your blocklists accurate without manual review.

---

## 4. Collaborative Case Management (Virtual War Room)

*Transforming reactive incidents into coordinated investigations.*

Every incident in ASUSOAR becomes a live, collaborative workspace the moment it is created.

- **Live ChatOps** — WebSocket-powered chat inside each `/incidents/{id}` view transforms the case into a real-time command terminal. Analysts can mention teammates (`@alice`), trigger slash commands (`/get_pcap`), or post evidence directly into the feed.
- **Immutable evidence timeline** — Every action — playbook outputs, sandbox results, analyst notes — is appended to a permanent, auditable timeline. The full chain of custody is preserved automatically for compliance and post-incident review.
- **Evidence linking** — Playbook artifacts (sandboxed executable results, threat scores, raw API responses) are automatically linked into the timeline, eliminating the need to manually copy findings across tools.

---

## 5. ASUBot — ML Analyst Co-Pilot

*AI-powered decision support embedded in the SOC workflow.*

ASUBot is ASUSOAR's machine learning engine, trained on historical incident data to augment analyst decision-making.

- **Intelligent analyst assignment** — Predicts which analyst is best positioned to handle an incoming case based on their historical resolution performance with similar alert signatures, distributing load efficiently across the team.
- **Severity escalation** — If an incoming SIEM alert arrives tagged `Low` but ASUBot's NLP engine detects behavioural indicators associated with high-risk malware, it automatically escalates the case to `Critical` before it hits the queue.
- **Pattern matching** — Continuously cross-references new indicators against the full historical incident database to surface correlated past events, giving analysts immediate context.

---

## 6. Multi-Tenant / MSSP Architecture

*Built from the ground up for Managed Security Service Providers.*

ASUSOAR's data model enforces strict tenant isolation, allowing a single deployment to serve multiple client organizations with zero risk of data crossover.

- **Master node / client node separation** — A top-tier MSSP console manages policy and visibility across all downstream client tenants. Each client's data is scoped by `client_id` at every database query.
- **Per-tenant dashboards** — Each client receives a tailored widget-based metrics view showing their own MTTD (Mean Time to Detect) and MTTR (Mean Time to Respond) KPIs, with no visibility into other tenants' data.
- **Infinite tenant scaling** — Because isolation is enforced at the PostgreSQL row level rather than through separate database instances, onboarding a new client tenant requires no infrastructure changes.

---

## Roadmap

The following capabilities are planned for upcoming releases:

- [ ] Native MITRE ATT&CK tactic tagging on all incident alerts
- [ ] Bi-directional Splunk SOAR migration toolkit
- [ ] Role-Based Access Control (RBAC) with per-tenant permission scopes
- [ ] REST API for external playbook triggering (inbound webhook receiver)
- [ ] Dark/light theme toggle in the SOC dashboard
