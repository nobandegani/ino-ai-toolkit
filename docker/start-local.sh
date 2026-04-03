#!/bin/bash
set -e

echo "=== AI Toolkit Local Dev Mode ==="

cd /app

echo "Pulling latest changes..."
git pull

echo "Installing Python dependencies..."
pip install --break-system-packages -r requirements.txt -q

echo "Building UI..."
cd /app/ui
npm install
rm -rf .next
npm run build
npm run update_db

echo "Starting AI Toolkit UI..."
npm run start
