@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Wersja przenosna ma Node.js w folderze node\ - wtedy niczego nie trzeba instalowac.
set "NODE=node"
if exist "%~dp0node\node.exe" set "NODE=%~dp0node\node.exe"
if "%NODE%"=="node" (
  where node >nul 2>nul || goto :nonode
)
if not exist node_modules (
  echo Pierwsze uruchomienie: instaluje zaleznosci...
  call npm install --no-fund --no-audit || goto :err
)
echo Uruchamiam panel bota...
"%NODE%" server.mjs
goto :eof
:nonode
echo Nie znaleziono Node.js. Zainstaluj go ze strony https://nodejs.org/ albo pobierz wersje przenosna z zakladki Releases na GitHubie.
pause
exit /b 1
:err
echo Nie udalo sie zainstalowac zaleznosci. Sprawdz polaczenie z internetem.
pause
