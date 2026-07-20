# Auto-push script with retry every 30 minutes
# After successful push, shutdown computer

$maxRetries = 20  # Try for up to 10 hours
$retryCount = 0
$retryInterval = 1800  # 30 minutes in seconds

Write-Host "=== Auto-Push Script Started ==="
Write-Host "Will attempt push every 30 minutes until successful"
Write-Host "After successful push, computer will shutdown"
Write-Host ""

while ($retryCount -lt $maxRetries) {
    $retryCount++
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Attempt $retryCount of $maxRetries..."
    
    try {
        # Change to project directory
        Set-Location "D:\TradeSite\site"
        
        # Try to push
        $result = git push origin main 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] SUCCESS! Push completed successfully."
            Write-Host ""
            Write-Host "=== Shutting down computer in 10 seconds ==="
            Start-Sleep -Seconds 10
            Stop-Computer -Force
            exit
        } else {
            Write-Host "[$timestamp] Push failed: $result"
        }
    } catch {
        Write-Host "[$timestamp] Error: $_"
    }
    
    Write-Host "[$timestamp] Will retry in 30 minutes..."
    Write-Host ""
    Start-Sleep -Seconds $retryInterval
}

Write-Host "=== Max retries reached. Manual intervention required. ==="
