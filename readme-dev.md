docker compose --env-file .env -f docker-compose.yml build ai-toolkit-local
docker compose --env-file .env -f docker-compose.yml push ai-toolkit-local
docker compose --env-file .env -f docker-compose.yml up -d ai-toolkit-local