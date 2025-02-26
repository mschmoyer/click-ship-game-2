.PHONY: setup run-frontend run-backend run-all db-up db-down db-migrate db-upgrade db-downgrade docker-build docker-up docker-down heroku-deploy-backend heroku-deploy-frontend

setup:
	npm install
	cd frontend && npm install
	cd backend && pip3 install -r requirements.txt

run-frontend:
	cd frontend && npm run dev

run-backend:
	cd backend && python3 run.py

run-all:
	npm run dev

db-up:
	docker-compose up -d postgres

db-down:
	docker-compose down

db-migrate:
	cd backend && python3 -m alembic revision --autogenerate -m "$(message)"

db-upgrade:
	cd backend && python3 -m alembic upgrade head

db-downgrade:
	cd backend && python3 -m alembic downgrade -1

init-db: db-up db-upgrade
	cd backend && python3 -m app.initial_data

build:
	cd frontend && npm run build

# Docker commands
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

# Heroku deployment commands
heroku-login:
	heroku login

heroku-create:
	heroku create clickship-frontend
	heroku create clickship-backend

heroku-deploy-backend:
	cd backend && \
	heroku git:remote --app clickship-backend && \
	heroku container:push web --app clickship-backend && \
	heroku container:release web --app clickship-backend

heroku-deploy-frontend:
	cd frontend && \
	heroku git:remote --app clickship-frontend && \
	heroku container:push web --app clickship-frontend && \
	heroku container:release web --app clickship-frontend

heroku-run-migrations:
	heroku run python -m alembic upgrade head --app clickship-backend

heroku-init-db:
	heroku run python -m app.initial_data --app clickship-backend

heroku-deploy-all: heroku-deploy-backend heroku-run-migrations heroku-init-db heroku-deploy-frontend