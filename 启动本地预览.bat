@echo off
chcp 65001 >nul
title Knowledge Star - Local Preview
cd /d "%~dp0"

if not exist node_modules (
  echo [Info] First run, installing dependencies...
  call npm.cmd install --no-audit --no-fund
  if errorlevel 1 (
    echo [Error] npm install failed. Check network and retry.
    pause
    exit /b 1
  )
)

echo Starting dev server, opening http://localhost:5173 ...
timeout /t 3 /nobreak >nul
start "" http://localhost:5173
call npm.cmd run dev
echo.
echo Server stopped.
pause
