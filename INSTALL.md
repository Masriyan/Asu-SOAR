# Installation Guide

This guide covers everything you need to deploy ASUSOAR on a Linux server using Docker. The entire stack — PostgreSQL, Redis, FastAPI backend, Celery workers, and Next.js frontend — spins up with a single command.

> **Repository:** [github.com/Masriyan/Asu-SOAR](https://github.com/Masriyan/Asu-SOAR)  
> **Issues:** [github.com/Masriyan/Asu-SOAR/issues](https://github.com/Masriyan/Asu-SOAR/issues)

---

## Prerequisites

Before you begin, ensure your host server meets the following requirements.

**Operating System:** Any Linux distribution with kernel ≥ 4.19. Tested on Ubuntu 20.04+, Debian 11+, CentOS 8+, and RHEL.

**Hardware minimums:**

| Resource | Minimum | Recommended |
|---|---|---|
| RAM | 8 GB | 16 GB (required for ASUBot ML module) |
| Storage | 40 GB SSD | 100 GB SSD |
| Filesystem | ext4 or ZFS | ext4 or ZFS |

**Required software:**

| Package | Minimum Version | Install Guide |
|---|---|---|
| Docker Engine | 24.0.0+ | [docs.docker.com/engine/install](https://docs.docker.com/engine/install/) |
| Docker Compose plugin | 2.20.0+ | Included with Docker Desktop or via `apt install docker-compose-plugin` |

Verify your installation before proceeding:

```bash
docker --version        # Docker version 24.x.x or higher
docker compose version  # Docker Compose version v2.x.x or higher
```

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/Masriyan/Asu-SOAR.git
cd Asu-SOAR
```

---

## Step 2 — Configure Environment Variables

ASUSOAR uses a `.env` file to configure all service credentials and connection strings. A safe template is provided in `.env.example`.

```bash
cp .env.example .env
nano .env
```

**Required fields to change before deployment:**

```env
# Database credentials — change these before any deployment
POSTGRES_USER=asusoar_admin
POSTGRES_PASSWORD=<your-strong-password-here>
POSTGRES_DB=asusoar_prod

# Backend secret key — used for JWT signing, must be unique and random
SECRET_KEY=<generate-with: openssl rand -hex 32>

# Frontend API base URL — set to your server's IP or domain in production
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Security note:** Never commit your `.env` file to version control. It is already listed in `.gitignore`.

To generate a cryptographically strong `SECRET_KEY`:

```bash
openssl rand -hex 32
```

---

## Step 3 — Deploy the Stack

The `install.sh` script handles the full build and launch sequence.

```bash
sudo chmod +x install.sh
sudo ./install.sh
```

This script will:

1. Verify Docker is running on the host.
2. Validate the `.env` file is present.
3. Run `docker compose build` to build all service images.
4. Run `docker compose up -d` to start all five containers.

**Expected output:**

```text
[*] Checking for Docker...         OK
[*] Checking for .env file...      OK
[*] Building ASUSOAR containers... (this may take a few minutes on first run)
[*] Starting services...

[+] Running 5/5
  ✔ Container asusoar-db       Started
  ✔ Container asusoar-redis    Started
  ✔ Container asusoar-backend  Started
  ✔ Container asusoar-worker   Started
  ✔ Container asusoar-frontend Started

==========================================================
  ASUSOAR is running!

  Dashboard:   http://localhost:3000
  API Docs:    http://localhost:8000/docs
==========================================================
```

---

## Step 4 — Verify the Deployment

Open a browser and navigate to the following URLs, replacing `localhost` with your server's IP address if accessing remotely.

| Endpoint | Expected Result |
|---|---|
| `http://<host>:3000` | ASUSOAR SOC Dashboard loads |
| `http://<host>:8000/docs` | FastAPI interactive Swagger UI |
| `http://<host>:8000/` | Returns `{"status": "ASUSOAR Core Engine Running"}` |

**Check container health from the CLI:**

```bash
docker compose ps
docker compose logs backend --tail=50
docker compose logs worker --tail=50
```

---

## Useful Operations

**Stop the stack:**

```bash
sudo docker compose down
```

**Stop and remove all data volumes (full reset):**

```bash
sudo docker compose down -v
```

**View live logs for a specific service:**

```bash
docker compose logs -f backend
docker compose logs -f worker
docker compose logs -f frontend
```

**Restart a single service after a code change:**

```bash
docker compose restart backend
```

---

## Production Considerations

For a hardened production deployment, the following additional steps are strongly recommended:

**TLS / HTTPS** — Place a reverse proxy (nginx or Caddy) in front of ports `3000` and `8000`. Only expose `443` externally. Never serve the API or dashboard over plain HTTP in production.

**Firewall** — Block direct external access to ports `3000` and `8000`. All traffic should pass through your reverse proxy on `443`.

**Database backups** — Set up automated `pg_dump` snapshots for the PostgreSQL volume at regular intervals.

**Secret rotation** — Rotate `SECRET_KEY` and `POSTGRES_PASSWORD` periodically and redeploy the stack after each rotation.

**Resource limits** — Add `mem_limit` and `cpus` constraints to each service in `docker-compose.yml` to prevent any single container from exhausting host resources.

---

## Troubleshooting

**Port already in use:**

```bash
# Find what's using port 3000 or 8000
sudo lsof -i :3000
sudo lsof -i :8000
```

**Backend fails to connect to the database:**

Check that `POSTGRES_PASSWORD` in your `.env` matches what PostgreSQL was initialized with. If they diverged, drop and recreate the volume:

```bash
sudo docker compose down -v
sudo ./install.sh
```

**Container exits immediately on start:**

```bash
docker compose logs <service-name>
```

Look for configuration errors or missing environment variables in the output.

**Still stuck?** Open a ticket at [github.com/Masriyan/Asu-SOAR/issues](https://github.com/Masriyan/Asu-SOAR/issues) with the output of `docker compose logs` attached.
