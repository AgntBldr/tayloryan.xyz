$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Push-Location $root
try {
    & node "execution/generate_trust_logos.mjs"
    if ($LASTEXITCODE -ne 0) { throw "Trust-logo generation failed." }

    & "execution/optimize_trust_logos.ps1"
    if ($LASTEXITCODE -ne 0) { throw "Trust-logo optimization failed." }

    Write-Host "Trust logos rebuilt, optimized, and recorded in the audit report."
}
finally {
    Pop-Location
}
