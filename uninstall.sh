#!/bin/bash
# ASUSOAR Uninstallation Script
# Removes Docker containers, networks, volumes, and base images.

echo "========================================================="
echo "WARNING: This will completely remove ASUSOAR from your system."
echo "This includes the database, playbooks, and all historical incidents."
echo "========================================================="

read -p "Are you absolutely sure you want to proceed? [y/N]: " confirmation

if [[ "$confirmation" != "y" && "$confirmation" != "Y" ]]; then
    echo "Uninstallation aborted."
    exit 1
fi

echo "[*] Stopping and removing ASUSOAR containers..."
# If docker compose plugin is installed
if docker compose version > /dev/null 2>&1; then
    sudo docker compose down -v
# Fallback to older docker-compose
elif docker-compose version > /dev/null 2>&1; then
    sudo docker-compose down -v
else
    echo "[-] Error: docker-compose not found in system."
    exit 1
fi

echo "[*] Cleaning up orphaned Docker images built by ASUSOAR..."
sudo docker image rm asusoar-frontend:latest 2>/dev/null
sudo docker image rm asusoar-backend:latest 2>/dev/null
sudo docker image rm asusoar-worker:latest 2>/dev/null

echo "========================================================="
echo "ASUSOAR has been successfully uninstalled."
echo "If you wish to remove the source files, you may delete this directory:"
echo "rm -rf $(pwd)"
echo "========================================================="
