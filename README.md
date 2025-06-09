clone the repoisitory.

cp .env.example .env

docker-compose up --build -d

docker-compose exec app npm run seed
