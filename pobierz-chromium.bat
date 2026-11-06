@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Potrzebne tylko bez zainstalowanego Google Chrome: pobiera Chromium dla Playwrighta (ok. 150 MB).
set "NODE=node"
if exist "%~dp0node\node.exe" set "NODE=%~dp0node\node.exe"
"%NODE%" node_modules\playwright\cli.js install chromium
pause
