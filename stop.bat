@echo off

call :killport 8080 Backend
call :killport 4200 Frontend

rem Uebrig gebliebene Konsolenfenster schliessen
taskkill /FI "WINDOWTITLE eq Cookbook Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Cookbook Frontend*" /T /F >nul 2>&1

echo Fertig.
exit /b 0

:killport
powershell -NoProfile -Command "$c = Get-NetTCPConnection -LocalPort %1 -State Listen -ErrorAction SilentlyContinue; if (-not $c) { Write-Host '%2 laeuft nicht (Port %1).' } else { $c | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Write-Host ('Stoppe %2 (Port %1, PID ' + $_ + ')...'); taskkill /PID $_ /T /F | Out-Null } }"
exit /b 0
