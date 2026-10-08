@echo off
cd /d "%~dp0"
echo Starting server...
start "" python server.py
timeout /t 2 /nobreak >nul
echo Opening browser...
start http://localhost:8000
echo.
echo Server started. Close the black window to stop.
pause
