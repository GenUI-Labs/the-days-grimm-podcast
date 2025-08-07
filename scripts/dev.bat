@echo off
echo Starting The Days Grimm Development Servers...
echo.
echo Frontend will run on: http://localhost:3000
echo Backend will run on:  http://localhost:5000
echo.
echo Press Ctrl+C to stop both servers
echo.

start "Frontend Server" cmd /k "cd frontend && npm run dev"
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Both servers are starting...
echo Close this window to stop all servers
pause
