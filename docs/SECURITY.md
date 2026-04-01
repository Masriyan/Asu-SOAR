# ASUSOAR Security & RBAC Architecture

Enterprise SOCs demand rigid, zero-trust security internal boundaries. ASUSOAR is constructed with explicit mechanisms to prevent cross-tenant data spillage, API exploitation, and unauthorized workflow execution.

## 1. Multi-Tenant Row-Level Security
Our PostgreSQL schema is designed for MSSP (Managed Security Service Provider) topologies.
*   **The Structure**: Every Incident, Playbook, and Metric fundamentally ties to a `tenant_id`.
*   **The Execution**: By passing a valid JWT tied to `Tenant A`, the FastAPI `Depends(get_current_user)` router intercepts the request and permanently appends `.filter(Incident.tenant_id == user.tenant_id)` to the SQLAlchemy query. It is natively impossible for an analyst at `Tenant A` to view an Incident in `Tenant B`.

## 2. API Authentication (JSON Web Tokens)
ASUSOAR eschews persistent stateful session cookies in favor of stateless, cryptographically signed JWTs (`HS256` hashing).
*   **Expiration**: Tokens enforce a strict 60-minute TTL (Time To Live). Even if intercepted natively inside the network, prolonged access is mitigated.
*   **Refresh Strategy**: Next.js automatically stores a resilient `refresh_token` in memory, negotiating silently with the backend to acquire new Access Tokens without interrupting the analyst's War Room WebSocket connection.

## 3. Role-Based Access Control (RBAC)
Not all users are created equal. The database identifies users via an explicit ENUM: `SuperAdmin`, `TenantAdmin`, `L3_Analyst`, `L1_Analyst`.
*   `L1_Analyst`: Can converse in the ChatOps War Room and resolve standard queues.
*   `L3_Analyst`: Can edit/deploy custom ReactFlow Python playbooks (this carries implicit infrastructure risk as Playbooks can execute network commands).
*   **API Enforcement**: High-risk routes like `POST /api/v1/playbooks` require a strict `Depends(require_role(['L3_Analyst', 'SuperAdmin']))` FastAPI dependency wrapper.

## 4. Playbook execution Sandboxing
Since Python integrations can theoretically execute arbitrary code, Celery workers operate strictly with unprivileged Linux user accounts inside their Alpine container. If a malicious insider tries to execute `os.system("rm -rf /")` via a custom Integration module, it will fail due to rigid `chmod` restrictions at the Docker layer.
