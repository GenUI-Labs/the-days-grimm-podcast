@echo off
echo Starting The Days Grimm Development Servers...
echo.
echo Frontend will run on: http://localhost:3000
if not defined VITE_BACKEND_PORT set VITE_BACKEND_PORT=5000
echo Backend will run on:  http://localhost:%VITE_BACKEND_PORT%
echo.
echo Press Ctrl+C to stop both servers
echo.

start "Frontend Server" cmd /k "cd frontend && set VITE_BACKEND_PORT=%VITE_BACKEND_PORT% && npm run dev"
start "Backend Server" cmd /k "cd backend && set PORT=%VITE_BACKEND_PORT% && npm run dev"

echo Both servers are starting...
echo Close this window to stop all servers
pause
