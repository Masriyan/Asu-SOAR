#!/bin/bash
# ASUSOAR Universal Linux Installer

echo ""
echo "  ╔═══════════════════════════════════════════════════╗"
echo "  ║        ASUSOAR Installation Script                ║"
echo "  ║   Security Orchestration, Automation & Response   ║"
echo "  ╚═══════════════════════════════════════════════════╝"
echo ""

# Check for root
if [ "$EUID" -ne 0 ]; then
  echo "[!] Please run this installer as root (e.g., sudo ./install.sh)"
  exit 1
fi

echo "[*] Checking for Docker..."
if ! command -v docker &> /dev/null; then
    echo "[!] Docker not found. Please install Docker and Docker-Compose first."
    echo "    Visit: https://docs.docker.com/engine/install/"
    exit 1
fi
echo "[+] Docker found: $(docker --version)"

echo "[*] Checking for Docker Compose..."
if ! docker compose version &> /dev/null; then
    echo "[!] Docker Compose plugin not found."
    echo "    Install via: apt install docker-compose-plugin"
    exit 1
fi
echo "[+] Docker Compose found: $(docker compose version)"

echo ""
echo "[*] Initializing environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    # Generate a random SECRET_KEY
    SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | xxd -p | tr -d '\n')
    sed -i "s|generate_a_random_secret_string_here_for_jwt|$SECRET|g" .env
    echo "[+] Created .env file with auto-generated SECRET_KEY."
    echo "[!] IMPORTANT: Update POSTGRES_PASSWORD in .env before production deployment."
else
    echo "[+] .env file already exists, using existing configuration."
fi

echo ""
echo "[*] Building and starting ASUSOAR containers..."
echo "    This may take 3-5 minutes on first run."
echo ""

docker compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "  ╔═══════════════════════════════════════════════════╗"
    echo "  ║          ASUSOAR Successfully Deployed!           ║"
    echo "  ╠═══════════════════════════════════════════════════╣"
    echo "  ║                                                   ║"
    echo "  ║  Dashboard:   http://localhost:3001                ║"
    echo "  ║  API Docs:    http://localhost:8000/docs           ║"
    echo "  ║                                                   ║"
    echo "  ║  Default Login:                                   ║"
    echo "  ║    Username:  admin                               ║"
    echo "  ║    Password:  asusoar2026                         ║"
    echo "  ║                                                   ║"
    echo "  ╚═══════════════════════════════════════════════════╝"
    echo ""
else
    echo "[!] An error occurred during Docker startup."
    echo "    Run 'docker compose logs' for details."
fi
