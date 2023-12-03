rm -rf cd/* -y
docker compose down
docker compose build
docker compose up