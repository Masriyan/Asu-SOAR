#!/bin/bash
# ASUSOAR Universal Linux Installer

echo "Welcome to the ASUSOAR Installation Script."
echo "This script will deploy the ASUSOAR Core stack on your Linux machine."

# Check for root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this installer as root (e.g., sudo ./install.sh)"
  exit 1
fi

echo "[*] Checking for Docker..."
if ! command -v docker &> /dev/null; then
    echo "[!] Docker not found. Please install Docker and Docker-Compose first."
    exit 1
fi

echo "[*] Initializing environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "[+] Created .env file from .env.example. Please update passwords in .env later."
fi

# Build and Start
echo "[*] Building and starting ASUSOAR containers..."
docker compose up -d --build

if [ $? -eq 0 ]; then
    echo "=========================================================="
    echo "ASUSOAR has been successfully installed and started!"
    echo "Frontend: http://localhost:3000"
    echo "Backend (API): http://localhost:8000"
    echo "=========================================================="
else
    echo "[!] An error occurred during Docker startup."
fi
