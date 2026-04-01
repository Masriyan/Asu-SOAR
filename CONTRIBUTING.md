# Contributing to ASUSOAR

Welcome to the ASUSOAR community. As an open-source Security Orchestration, Automation, and Response platform, we rely on developers, SOC analysts, and security engineers to make it better. Whether you're fixing a typo, adding a new integration, or rearchitecting a feature — your contributions matter.

> **Repository:** [github.com/Masriyan/Asu-SOAR](https://github.com/Masriyan/Asu-SOAR)

---

## Ways to Contribute

### Reporting Bugs

If you find a bug, please open an issue at [github.com/Masriyan/Asu-SOAR/issues](https://github.com/Masriyan/Asu-SOAR/issues). A good bug report includes:

- A clear, specific title describing the problem.
- Steps to reproduce the issue.
- The output of `docker compose logs` for any container that failed.
- Your host OS, Docker version, and browser (if the bug is UI-related).

### Requesting Features

For new feature ideas, open an issue and describe your use case in concrete terms. The most useful feature requests answer the question: *"As a SOC analyst, I need to do X because Y currently takes Z minutes of manual effort."* Implementation ideas are welcome, but the use case is what matters most.

### Code Contributions (Pull Requests)

1. **Fork** the repository at [github.com/Masriyan/Asu-SOAR](https://github.com/Masriyan/Asu-SOAR).
2. **Create a branch** from `main` using a descriptive name:
   ```bash
   git checkout -b feature/crowdstrike-ioc-upload
   git checkout -b fix/playbook-dag-race-condition
   git checkout -b docs/improve-install-guide
   ```
3. **Make your changes** following the coding standards below.
4. **Write or update tests** for any logic you add or change.
5. **Commit** with a clear, imperative message:
   ```bash
   git commit -m 'feat: add CrowdStrike IOC upload integration node'
   git commit -m 'fix: prevent race condition in Celery DAG state transitions'
   ```
6. **Push** your branch and open a Pull Request against `main`.

### Building New Integrations

The core power of any SOAR platform is the breadth of its integrations. If you're comfortable with Python and HTTP APIs, you can add a new tool connector:

1. Add a new Python module under `backend/app/integrations/<tool_name>/`.
2. Implement the integration against ASUSOAR's standard connector interface.
3. Add a YAML definition file that describes the connector's parameters and secrets.
4. Document the integration in a short `README.md` within the same directory.
5. Open a Pull Request with the integration and at minimum one example playbook YAML that uses it.

### Improving Documentation

Good documentation is as valuable as good code. If you find something confusing, out of date, or missing in `README.md`, `FEATURES.md`, `INSTALL.md`, `ARCHITECTURE.md`, or the GitHub Wiki — please open a PR to fix it.

---

## Coding Standards

### Python (Backend)

- **Formatting:** Run `black .` before committing. We enforce `black` formatting with `flake8` for linting.
- **Type hints:** Use full type annotations on all function signatures. Pydantic models must be fully typed.
- **Async:** All FastAPI endpoint functions must use `async def`. Blocking I/O (database calls, external API calls) must be awaited or offloaded to Celery.
- **Tests:** New endpoint logic should include at least one `pytest` test covering the happy path and one covering the main error condition.

### TypeScript (Frontend)

- **Components:** Break UI changes into small, reusable `<Component />` files under `frontend/src/components/`. Avoid large monolithic pages.
- **Styling:** Use TailwindCSS utility classes only. Match the existing `soc-dark` theme variables. Do not introduce inline style objects unless absolutely necessary.
- **Types:** All component props and API response shapes must be typed. Avoid `any`.

---

## Local Development Setup

To run the stack locally for development (with hot-reload):

```bash
# Start infrastructure services only
docker compose up -d db redis

# Run the backend with hot-reload
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# In a separate terminal, run the Celery worker
celery -A app.core.celery_app worker --loglevel=info

# In a separate terminal, run the frontend dev server
cd frontend
npm install
npm run dev
```

The frontend dev server runs on port `3000` and proxies API calls to `localhost:8000`.

---

## Code of Conduct

We are committed to a welcoming and respectful community. Please be kind and constructive in all interactions — in issues, pull requests, and discussions. Harassment or abusive behaviour of any kind will not be tolerated.

---

## Getting Help

If you run into problems getting your development environment running, please open an issue and paste the full output of the failing command. We actively monitor issues and will respond as quickly as we can.

Thank you for contributing to open-source security engineering.
