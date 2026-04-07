$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

if (-not (Test-Path $edgePath)) {
  $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

if (-not (Test-Path $edgePath)) {
  Write-Error "Microsoft Edge was not found."
  exit 1
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$inputFile = "file:///" + (($projectRoot + "\index.html") -replace "\\", "/").Replace(" ", "%20")
$outputFile = Join-Path $projectRoot "Aditya-Kumar-Ojha-Resume.pdf"

& $edgePath `
  --headless `
  --disable-gpu `
  --allow-file-access-from-files `
  --run-all-compositor-stages-before-draw `
  --force-device-scale-factor=2 `
  --virtual-time-budget=3000 `
  --no-pdf-header-footer `
  --print-to-pdf-no-header `
  --print-to-pdf="$outputFile" `
  "$inputFile"

if (Test-Path $outputFile) {
  Write-Host "PDF exported to $outputFile"
  exit 0
}

Write-Error "PDF export failed."
exit 1
