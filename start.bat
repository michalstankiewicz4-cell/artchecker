@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist node_modules (
  echo Pierwsze uruchomienie: instaluje zaleznosci...
  call npm install || goto :err
)
echo Uruchamiam panel bota...
node server.mjs
goto :eof
:err
echo Nie udalo sie zainstalowac zaleznosci. Sprawdz, czy masz Node.js.
pause
