# ASUSOAR Installation Guide

Welcome to the comprehensive installation manual for **ASUSOAR** (Security Orchestration, Automation, and Response). Designed using an agnostic Docker containerization model, ASUSOAR installs globally on **any flavor of Linux** supporting the Docker engine.

> **Source Repository**: Keep track of the latest updates via the master branch at [https://github.com/Masriyan/Asu-SOAR](https://github.com/Masriyan/Asu-SOAR)

---

## Prerequisites

Ensure your host Linux server meets the following base requirements:
- **Operating System:** Ubuntu 20.04+, Debian 11+, CentOS 8+, RHEL, or any kernel >= 4.19
- **Memory (RAM):** 8GB minimum (16GB recommended for ML / ASUBot modules).
- **Storage:** 40GB SSD (Ext4 or ZFS).
- **Dependencies:** `docker` (v24.0.0+) and `docker-compose` plugin.

## 1. Initial Setup

ASUSOAR is intentionally designed to be cloned and spun up from CLI without the need for manual library dependency builds on the host level.

```bash
# Clone the repository
git clone https://github.com/Masriyan/Asu-SOAR.git

# Enter the orchestration manifest directory
cd Asu-SOAR
```

## 2. Environment Variables Configuration

The `.env` file serves as the core binding for your database passkeys, Redis clusters, and secure APIs.

We provide a secure template out-of-the-box. If the `install.sh` script is run directly, it will gracefully construct a `.env` automatically via `.env.example`. Wait, **for production**, you must manually modify this logic.

```bash
# Clone the example to an active env file
cp .env.example .env

# Edit passwords (Use nano, vim, etc.)
nano .env

# Mandatory fields to change:
# -> POSTGRES_PASSWORD=...
# -> SECRET_KEY=...
```

## 3. Deployment

We have abstracted all Docker Daemon build networks inside a simple shell wrapper. Since ASUSOAR spins up PostgreSQL, Python backend orchestrators, Redis caches, Celery task schedulers, and a Next.js UI container simultaneously, you must run this daemon using `sudo`.

```bash
sudo chmod +x install.sh
sudo ./install.sh
```

### Installation Output Log
During installation, `docker compose` will download the required Alpine layers. Let it process:
```text
[*] Checking for Docker...
[*] Initializing environment variables...
[*] Building and starting ASUSOAR containers...
...
[+] Running 5/5
  ✔ Container asusoar-redis    Started
  ✔ Container asusoar-db       Started
  ✔ Container asusoar-backend  Started
  ✔ Container asusoar-worker   Started
  ✔ Container asusoar-frontend Started
==========================================================
ASUSOAR has been successfully installed and started!
Frontend: http://localhost:3000
Backend (API): http://localhost:8000
==========================================================
```

## 4. Verification

Navigate to a web browser on your network pointing to the host machine IP.

- **Web Dashboard (UI)**: `http://<your-ip>:3000`
- **FastAPI Core Docs**: `http://<your-ip>:8000/docs`

> **Note**: For support or to file installation bugs, open a ticket at [https://github.com/Masriyan/Asu-SOAR/issues](https://github.com/Masriyan/Asu-SOAR/issues).
