
## database run 
docker compose up -d --build 




# APP RUN 🔥

## 1 ) IN LOCAL MODE - 2 STEPS

## UPDATE dev.env , LINES 11 , 12
DATABASE_HOST=localhost
DATABASE_PORT=3300

## THEN RUN 
yarn start:dev 

### 

## 2 ) AS A DOCKER SERVICE - 2 STEPS 🐬

## UPDATE dev.env , LINES 11 , 12
DATABASE_HOST=gp_database_service
DATABASE_PORT=3306

## THEN RUN 
docker compose -f docker-compose.dev.yml --env-file dev.env up -d --build 

### 




## app running on http://localhost:4100/api

## swagger documentation

http://localhost:4100/swagger

