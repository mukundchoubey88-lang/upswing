# EDUVISION AI - Backend Startup Script
Write-Host "🚀 Starting EDUVISION AI Backend..." -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location -Path "c:\projettttttt22222\backend"

# Check if virtual environment exists
if (-Not (Test-Path "venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ Virtual environment created!" -ForegroundColor Green
    Write-Host ""
}

# Activate virtual environment
Write-Host "🔌 Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Check if packages are installed
if (-Not (Test-Path "venv\Lib\site-packages\fastapi")) {
    Write-Host "📥 Installing dependencies (this takes 2-3 minutes)..." -ForegroundColor Yellow
    pip install --upgrade pip
    pip install -r requirements.txt
    Write-Host "✅ Dependencies installed!" -ForegroundColor Green
    Write-Host ""
}

# Check if database exists
if (-Not (Test-Path "..\data\eduvision.db")) {
    Write-Host "🗄️ Creating database and seeding demo data..." -ForegroundColor Yellow
    python ..\data\seed.py
    Write-Host "✅ Database created with 260 students!" -ForegroundColor Green
    Write-Host ""
}

# Start the server
Write-Host "🚀 Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
Write-Host "📚 API docs available at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

uvicorn app.main:app --reload --port 8000
