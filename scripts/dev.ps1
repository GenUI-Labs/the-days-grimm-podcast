Write-Host "Starting The Days Grimm Development Servers..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend will run on:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start frontend in a new job
Start-Job -Name "Frontend" -ScriptBlock {
    Set-Location "frontend"
    npm run dev
}

# Start backend in a new job
Start-Job -Name "Backend" -ScriptBlock {
    Set-Location "backend"
    npm run dev
}

Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Use 'Get-Job' to see running jobs" -ForegroundColor Yellow
Write-Host "Use 'Stop-Job -Name Frontend' or 'Stop-Job -Name Backend' to stop individual servers" -ForegroundColor Yellow
Write-Host "Use 'Remove-Job -Name Frontend,Backend' to clean up jobs" -ForegroundColor Yellow

# Wait for user to stop
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "Stopping servers..." -ForegroundColor Red
    Stop-Job -Name "Frontend", "Backend" -ErrorAction SilentlyContinue
    Remove-Job -Name "Frontend", "Backend" -ErrorAction SilentlyContinue
}
