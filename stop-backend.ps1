# =========================================================================
# Vehicle Rental Platform - Stop All Microservice Ports
# =========================================================================

$ports = @(8761, 8080, 8081, 8082, 8083, 8084, 8085, 8086)

Write-Host "Stopping all microservices on ports: $($ports -join ', ')..." -ForegroundColor Yellow

foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        $pids = $conns.OwningProcess | Select-Object -Unique
        foreach ($p in $pids) {
            try {
                Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
                Write-Host "Killed process $p on port $port" -ForegroundColor Green
            } catch {}
        }
    }
}

Write-Host "All microservices stopped." -ForegroundColor Cyan
