$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $projectRoot

try {
  & cmd /c npm run export:pdf
  exit $LASTEXITCODE
}
finally {
  Pop-Location
}
