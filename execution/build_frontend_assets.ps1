$ErrorActionPreference = "Stop"
$Root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$OutputDirectory = Join-Path $Root "assets\css"
$OutputPath = Join-Path $OutputDirectory "tailwind.generated.css"

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
Push-Location $Root
try {
    & npx.cmd --yes tailwindcss@3.4.17 `
        -i ".\execution\tailwind.input.css" `
        -c ".\execution\tailwind.config.cjs" `
        -o ".\assets\css\tailwind.generated.css" `
        --minify
    if ($LASTEXITCODE -ne 0) {
        throw "Tailwind asset build failed with exit code $LASTEXITCODE."
    }
}
finally {
    Pop-Location
}

$Css = [System.IO.File]::ReadAllText($OutputPath)
$Css = $Css.Replace("url(../assets/images/", "url(/assets/images/")
$Css = $Css.Replace("url(assets/images/", "url(/assets/images/")
[System.IO.File]::WriteAllText($OutputPath, $Css, [System.Text.UTF8Encoding]::new($false))

if ($Css.Contains("url(../assets/images/") -or $Css.Contains("url(assets/images/")) {
    throw "Tailwind output still contains document-relative asset URLs."
}

$Size = (Get-Item -LiteralPath $OutputPath).Length
Write-Host "Generated assets/css/tailwind.generated.css ($Size bytes)." -ForegroundColor Green
