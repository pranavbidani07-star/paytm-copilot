.PHONY: all up down backend frontend migrate

all: up migrate backend frontend

up:
	docker-compose up -d

down:
	docker-compose down

migrate:
	cd backend && alembic upgrade head

backend:
	cd backend && uvicorn main:app --reload --port 8000 &

frontend:
	cd frontend && npm run dev &
