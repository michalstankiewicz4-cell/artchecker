# Buduje wersje przenosna dla Windows: kod + zaleznosci + node.exe w jednym ZIP-ie (dist\).
# Uruchom na Windowsie z zainstalowanym Node.js:  powershell -ExecutionPolicy Bypass -File tools\build-portable.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$ver  = (Get-Content "$root\package.json" -Raw | ConvertFrom-Json).version
$name = "webbot-$ver-windows-portable"
$dist = Join-Path $root 'dist'
$out  = Join-Path $dist $name
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
if (Test-Path "$out.zip") { Remove-Item "$out.zip" -Force }
New-Item -ItemType Directory $out -Force | Out-Null

foreach ($f in 'server.mjs','package.json','start.bat','pobierz-chromium.bat') { Copy-Item (Join-Path $root $f) $out }
Get-ChildItem $root -Filter *.md -File | Copy-Item -Destination $out   # cala dokumentacja: wszystkie .md z glownego folderu + docs\
foreach ($d in 'bot','public','docs') { Copy-Item (Join-Path $root $d) (Join-Path $out $d) -Recurse }

Push-Location $out
try { npm install --omit=dev --no-fund --no-audit --loglevel=error; if ($LASTEXITCODE) { throw "npm install: kod $LASTEXITCODE" } } finally { Pop-Location }
Remove-Item (Join-Path $out 'package-lock.json') -ErrorAction SilentlyContinue

$nodeExe = (Get-Command node).Source
New-Item -ItemType Directory (Join-Path $out 'node') | Out-Null
Copy-Item $nodeExe (Join-Path $out 'node\node.exe')
$lic = Join-Path (Split-Path $nodeExe) 'LICENSE'
if (Test-Path $lic) { Copy-Item $lic (Join-Path $out 'node\LICENSE') }
$nodeVer = & $nodeExe -v

Compress-Archive -Path $out -DestinationPath "$out.zip" -CompressionLevel Optimal
$mb = [math]::Round((Get-Item "$out.zip").Length / 1MB, 1)
Write-Host "Gotowe: dist\$name.zip ($mb MB, Node.js $nodeVer)"
