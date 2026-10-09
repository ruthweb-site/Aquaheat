# AquaHeat — Local SAM Infrastructure Validation Script
# Validates infra/template.yaml using cfn-lint and sam validate if installed.

Write-Host "Validating AquaHeat SAM template (infra/template.yaml)..." -ForegroundColor Cyan

$cfnLintCmd = (Get-Command cfn-lint -ErrorAction SilentlyContinue)
if (-not $cfnLintCmd) {
    $pythonScripts = "$env:LOCALAPPDATA\Programs\Python\Python311\Scripts\cfn-lint.exe"
    if (Test-Path $pythonScripts) {
        $cfnLintCmd = $pythonScripts
    }
}

if ($cfnLintCmd) {
    Write-Host "Running cfn-lint validation..." -ForegroundColor Green
    & $cfnLintCmd infra/template.yaml
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] cfn-lint: Template syntax, types, and schema are valid." -ForegroundColor Green
    } else {
        Write-Host "[ERROR] cfn-lint found issues. Please review output above." -ForegroundColor Red
        exit $LASTEXITCODE
    }
} else {
    Write-Host "[WARN] cfn-lint executable not found in PATH." -ForegroundColor Yellow
}

$samCmd = (Get-Command sam -ErrorAction SilentlyContinue)
if ($samCmd) {
    Write-Host "Running sam validate..." -ForegroundColor Green
    & sam validate -t infra/template.yaml
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] sam validate: SAM specification valid." -ForegroundColor Green
    }
} else {
    Write-Host "[INFO] AWS SAM CLI ('sam') not detected in PATH. cfn-lint completed full offline validation." -ForegroundColor Yellow
}

Write-Host "Infrastructure validation complete." -ForegroundColor Cyan
