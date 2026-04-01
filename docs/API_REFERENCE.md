# ASUSOAR API Reference

The foundational engine of **ASUSOAR** relies entirely on the dynamic REST API endpoints exposed by `FastAPI` located at `http://<host>:8000/api/v1`.

## Documentation Sandbox (Swagger UI)

Running `docker-compose up` natively serves an interactive OpenAPI standard playground.
- Browse: `http://<host>:8000/docs`
- Redoc format: `http://<host>:8000/redoc`

---

## Example Initial Flow: Base Core Routes

### `GET /api/v1/health/`
Validates that the entire backend engine is spinning, tracking both the SQLAlchemy PostgreSQL schema and the Celery broker loop parameters.

**Response `200 OK`**:
```json
{
  "status": "up",
  "service": "ASUSOAR API"
}
```

---

## Authentication Mechanism
All primary endpoints enforcing tenant protections rely on JSON Web Tokens (JWT). The frontend Axios wrapper automatically intersects API headers injecting `Bearer <token>` once authenticated. Any payload stripped of verified tokens routes forcefully into HTTP 401 traps.

## Designing Playbook Triggers
To dispatch an upstream payload targeting a DAG engine directly (from a SIEM rule like Splunk), route incoming alerts securely via webhook wrappers. Webhooks act inherently as standalone `POST` controllers translating raw XML/JSON objects from 3rd party architectures immediately into `app/engine/trigger_webhook.py` mappings.
