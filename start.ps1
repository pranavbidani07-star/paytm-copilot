# ==========================================
# Start script for Windows (PowerShell)
# ==========================================

Write-Host "Starting Docker containers..."
docker-compose up -d

Write-Host "Running database migrations..."
if (Test-Path "backend\alembic.ini") {
    Push-Location backend
    alembic upgrade head
    Pop-Location
} else {
    Write-Host "Alembic not initialized yet, skipping migrations."
}

Write-Host "Starting FastAPI backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; uvicorn main:app --reload --port 8000"

Write-Host "Starting Next.js frontend..."
if (Test-Path "frontend\package.json") {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
} else {
    Write-Host "Frontend not initialized yet, skipping."
}

Write-Host "All services started."
