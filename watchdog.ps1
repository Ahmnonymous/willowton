# ================================
# Watchdog for Backend + Frontend + Nginx
# ================================

# Paths (update these to your setup)
# $backendPath = "D:\WORK\LUQMAN\WillowTon_react\willowTon\backend"
# $frontendPath = "D:\WORK\LUQMAN\WillowTon_react\willowTon\frontend"
$backendPath = "C:\willowTon\backend"
$frontendPath = "C:\willowTon\frontend"
$nginxPath    = "C:\nginx"  

Write-Output "Starting watchdog... (Press Ctrl+C to stop)"

while ($true) {
    Write-Output "`n--------------------------------------------"
    Write-Output "Checking services at $(Get-Date)..."

    # -------------------
    # Backend API (Node server.js on :5000)
    try {
        Invoke-WebRequest -Uri "http://localhost:5000/api/users" -UseBasicParsing -TimeoutSec 5 | Out-Null
        Write-Output "âœ… Backend API is UP."
    } catch {
        Write-Output "âŒ Backend API is DOWN. Restarting..."
        
        # Kill only node processes that match server.js in backend
        $backendProc = Get-Process node -ErrorAction SilentlyContinue | Where-Object {
            $_.StartInfo.Arguments -match "server.js"
        }
        if ($backendProc) { $backendProc | Stop-Process -Force }

        Start-Process "node" "server.js" -WorkingDirectory $backendPath -WindowStyle Hidden
    }

    # -------------------
    # Frontend (serve -s build on :3000)
    try {
        Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5 | Out-Null
        Write-Output "âœ… Frontend is UP."
    } catch {
        Write-Output "âŒ Frontend is DOWN. Restarting..."
        
        # Kill only "serve -s build" processes
        $frontendProc = Get-Process node -ErrorAction SilentlyContinue | Where-Object {
            $_.StartInfo.Arguments -match "serve -s build"
        }
        if ($frontendProc) { $frontendProc | Stop-Process -Force }

        # Start frontend using serve -s build
        Start-Process "npx" "serve -s build" -WorkingDirectory $frontendPath -WindowStyle Hidden
    }

    # -------------------
    # Nginx
    $nginx = Get-Process nginx -ErrorAction SilentlyContinue
    if (-not $nginx) {
        Write-Output "âŒ Nginx is DOWN. Restarting..."
        Start-Process "$nginxPath\nginx.exe" -WorkingDirectory $nginxPath -WindowStyle Hidden
    } else {
        Write-Output "âœ… Nginx is UP."
    }

    # -------------------
    # Wait before rechecking
    Start-Sleep -Seconds 30

    # Stop-Process -Name node -Force    # kills all node processes (backend + frontend)
    # Stop-Process -Name nginx -Force   # kills nginx
}
