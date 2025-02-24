
## database run
docker compose up -d --build 

## app run

docker compose -f docker-compose.dev.yml --env-file dev.env up -d --build 

## app running on http://localhost:4100/api

## swagger documentation

http://localhost:4100/swagger

