# ASUSOAR Reporting Engine

A critical aspect of a SOC is demonstrating value vertically to CISOs and stakeholders. While playbooks automate the grunt work implicitly, the **Reporting Engine** aggregates historical case lifecycle data (e.g., Mean Time To Detect, Resolution Rate via ASUBot vs Analyst Manual overrides) into legible formats.

## Current Development State ❌

As of the current Phase 3 implementation, **The Reporting Engine has not yet been built**. We focused exclusively on the Orchestration infrastructure (DAG execution, Celery, and WebSockets).

## Architectural Roadmap for Reporting

When Phase 4 initiates, we will construct the `Reporting` module operating explicitly atop the existing PostgreSQL framework.

### 1. Generating KPI Metrics
The FastAPI backend will query the `incidents` schema aggressively, looking at timeline diffs.
- **Incident Open Time** vs **Incident Close Time** yields the pure SOAR metric efficiency (Average MTTR) per tenant.
- Comparing `Active incidents` vs `Resolved via Playbook` counts allows administrators to track percentage gains from Automation.

### 2. PDF & CSV Generation (Celery Reports)
Instead of forcing the Next.js frontend to freeze while computing 30 days of data, we will queue the `Report Build` as a Celery task.
1. The user clicks "Generate 30 Day Metrics PDF".
2. Next.js triggers `/api/v1/reports/pdf`.
3. Celery spins a background worker querying the DB, structuring an HTML template (using `Jinja2`), and exporting the payload via `WeasyPrint` or native browser abstractions into a `.PDF`.
4. The generated artifact is saved cleanly to an S3 Bucket (or local Volume mount), and WebSockets instantly inform the analyst "Your Report is ready to download".

### 3. Customizable Widget Dashboards
Instead of generic hardcoded reports, Phase 4 will introduce grid-layout charts directly tied into `recharts` / `chart.js` inside the `/dashboard` UI route representing real-time SOC velocity.
