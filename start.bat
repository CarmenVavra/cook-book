@echo off
set "ROOT=%~dp0"

rem DB-Zugangsdaten (nur setzen, falls nicht bereits als Umgebungsvariable vorhanden)
if not defined BL_DB_USER set "BL_DB_USER=root"
if not defined BL_DB_PASSWORD set "BL_DB_PASSWORD=1234"

rem MySQL-Dienst pruefen
sc query MySQL80 | find "RUNNING" >nul
if errorlevel 1 (
    echo MySQL80 laeuft nicht - versuche zu starten...
    net start MySQL80 >nul 2>&1
    if errorlevel 1 echo [WARNUNG] MySQL80 konnte nicht gestartet werden. Bitte als Administrator starten oder Dienst manuell starten.
)

rem Backend (nicht doppelt starten)
powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if not errorlevel 1 (
    echo Backend laeuft bereits auf Port 8080.
) else (
    echo Starte Backend ^(http://localhost:8080^)...
    start "Cookbook Backend" /D "%ROOT%backend" cmd /k .\mvnw.cmd spring-boot:run
)

rem Frontend (nicht doppelt starten)
powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 4200 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if not errorlevel 1 (
    echo Frontend laeuft bereits auf Port 4200.
) else (
    if not exist "%ROOT%frontend\node_modules" (
        echo node_modules fehlt - fuehre npm install aus...
        pushd "%ROOT%frontend"
        call npm install
        popd
    )
    echo Starte Frontend ^(http://localhost:4200^)...
    start "Cookbook Frontend" /D "%ROOT%frontend" cmd /k npm start
)

echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:4200
echo Zum Beenden: stop.bat
