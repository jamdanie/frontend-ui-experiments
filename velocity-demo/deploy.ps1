$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Velocity Demo Deploy ===" -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

$sourceHtml = Join-Path $projectRoot "index.source.html"
$rootHtml = Join-Path $projectRoot "index.html"
$distPath = Join-Path $projectRoot "dist"
$assetsPath = Join-Path $projectRoot "assets"
$modelPath = Join-Path $projectRoot "model"

if (-not (Test-Path $sourceHtml)) {
    throw "index.source.html not found at $sourceHtml"
}

Write-Host "Step 1: Copying index.source.html -> index.html" -ForegroundColor Yellow
Copy-Item $sourceHtml $rootHtml -Force

Write-Host "Step 2: Cleaning old build output" -ForegroundColor Yellow
if (Test-Path $distPath) {
    Remove-Item $distPath -Recurse -Force
}
if (Test-Path $assetsPath) {
    Remove-Item $assetsPath -Recurse -Force
}

Write-Host "Step 3: Running Vite build" -ForegroundColor Yellow
npm run build

if (-not (Test-Path $distPath)) {
    throw "Build failed: dist folder was not created."
}

Write-Host "Step 4: Copying built files from dist -> project root" -ForegroundColor Yellow

Get-ChildItem $distPath -Force | ForEach-Object {
    $destination = Join-Path $projectRoot $_.Name

    if (Test-Path $destination) {
        Remove-Item $destination -Recurse -Force
    }

    Copy-Item $_.FullName $destination -Recurse -Force
}

Write-Host "Step 5: Verifying built root files" -ForegroundColor Yellow

if (-not (Test-Path (Join-Path $projectRoot "index.html"))) {
    throw "Deploy failed: root index.html missing after copy."
}

if (-not (Test-Path (Join-Path $projectRoot "assets"))) {
    throw "Deploy failed: root assets folder missing after copy."
}

Write-Host ""
Write-Host "Deploy complete." -ForegroundColor Green
Write-Host "Root index.html and assets are now updated for GitHub Pages." -ForegroundColor Green
Write-Host ""