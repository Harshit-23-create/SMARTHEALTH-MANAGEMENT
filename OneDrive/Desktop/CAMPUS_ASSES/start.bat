@echo off
echo Starting Campus Asset Recovery Platform...
echo ===========================================

echo Starting Backend Server (Port 5000)...
start cmd /k "cd backend && npm run dev"

echo Starting Frontend Server (Port 8080)...
start cmd /k "cd asset-hive-ai && npm run dev"

echo Starting AI Microservice (Port 8000)...
start cmd /k "cd ai-service && python -m uvicorn main:app --reload --port 8000"

echo ===========================================
echo All services are booting up in separate windows!
echo Once they are ready, you can access the platform at:
echo http://localhost:8080
echo ===========================================
pause
