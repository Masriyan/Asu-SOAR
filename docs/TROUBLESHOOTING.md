# ASUSOAR Troubleshooting & Debugging

This guide compiles common initialization and operational errors you may experience when deploying the platform using Docker inside a new Linux SOC environment.

---

## 1. Installation Issues

### Error: `docker compose command not found`
*Description*: You are trying to run `install.sh` but Docker Compose doesn't exist. The newer standard relies on the docker CLI plugin `docker compose`, while older Debian builds use `docker-compose`.
**Fix**: Install the `docker-compose-plugin` or attempt `sudo docker-compose up -d --build` instead.

### Error: `getaddrinfo ENOTFOUND registry.npmjs.org`
*Description*: The Docker build for the React Frontend fails during `npm install`. This occurs frequently inside locked down, zero-trust SOC networks without an outbound connection proxy.
**Fix**: Ensure your host Linux environment can ping external DNS registries. If you must run air-gapped, you will need to push a pre-compiled docker image (`masriyan/asusoar-frontend:latest`) rather than building locally from scratch via `Dockerfile`.

## 2. PostgreSQL Connection Failures

### Error: `sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) FATAL:  password authentication failed for user`
*Description*: The FastAPI Backend container has booted, but the Postgres container was initialized with a different password than what is set in the current `.env` configuration.
**Fix**:
1. Stop all containers: `docker compose down`
2. Remove the persistent volume cache which locked the old password:
   `docker volume rm asusoar_asusoar_db_data`
3. Edit your `.env` to the correct values and re-run: `sudo ./install.sh`

## 3. Playbook Workflow (Celery) Delays

### Error: Playbooks are perpetually "Queued" but never "Executing"
*Description*: Redis has accepted the DAG JSON mapping, but the background Celery orchestrator is inactive or missing.
**Fix**:
1. Check the celery worker logs specifically:
   `docker logs asusoar-worker --tail=50`
2. Ensure the worker is properly authenticated to Redis (`REDIS_URL=redis://redis:6379/0`).
3. Ensure the Celery instance initialized correctly without python syntax errors failing the startup. Restart strictly the worker: `docker compose restart celery_worker`.

## 4. UI Dashboard (React) Errors

### Error: Dashboard returns `Network Error` or Blank Component
*Description*: The frontend loaded at `:3000` but the main API at `:8000` is inaccessible leading to Axios network failures.
**Fix**:
Check Cross-Origin Resource Sharing (CORS) exceptions in your `main.py` routing backend. Next.js accesses FastAPI via the URL mapped in `NEXT_PUBLIC_API_URL` (located in `.env`). If you navigate to `<external-ip>:3000` but the browser is trying to hit `localhost:8000`, the REST fetch will structurally fail. Keep the `NEXT_PUBLIC_API_URL` matched to your routable FQDN.
