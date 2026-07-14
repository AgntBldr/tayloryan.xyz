param(
    [string]$ReportPath = (Join-Path $PSScriptRoot "..\audits\site-audit\trust-logo-assets-2026-07-14.json")
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$Root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$AssetRoot = [System.IO.Path]::GetFullPath((Join-Path $Root "assets\brand\trust"))
$HomepagePath = Join-Path $Root "index.html"
$ReportPath = [System.IO.Path]::GetFullPath($ReportPath)
$Report = Get-Content -LiteralPath $ReportPath -Raw | ConvertFrom-Json
$Homepage = Get-Content -LiteralPath $HomepagePath -Raw

function Get-ColorDistance {
    param([System.Drawing.Color]$A, [System.Drawing.Color]$B)
    return [Math]::Sqrt(
        [Math]::Pow([int]$A.R - [int]$B.R, 2) +
        [Math]::Pow([int]$A.G - [int]$B.G, 2) +
        [Math]::Pow([int]$A.B - [int]$B.B, 2)
    )
}

foreach ($Asset in $Report.assets) {
    $SourcePath = [System.IO.Path]::GetFullPath((Join-Path $Root ($Asset.file -replace '/', '\')))
    if (-not $SourcePath.StartsWith($AssetRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to process asset outside trust-logo directory: $SourcePath"
    }
    if ([System.IO.Path]::GetExtension($SourcePath) -eq ".svg") { continue }

    $Source = [System.Drawing.Bitmap]::FromFile($SourcePath)
    try {
        $Corners = @(
            $Source.GetPixel(0, 0),
            $Source.GetPixel($Source.Width - 1, 0),
            $Source.GetPixel(0, $Source.Height - 1),
            $Source.GetPixel($Source.Width - 1, $Source.Height - 1)
        )
        $Background = $Corners[0]
        $CornerSpread = ($Corners | ForEach-Object { Get-ColorDistance $_ $Background } | Measure-Object -Maximum).Maximum
        $RemoveSolidBackground = $Corners.Where({ $_.A -gt 245 }).Count -eq 4 -and $CornerSpread -lt 24

        $Canvas = New-Object System.Drawing.Bitmap 256, 96, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        try {
            $Graphics = [System.Drawing.Graphics]::FromImage($Canvas)
            try {
                $Graphics.Clear([System.Drawing.Color]::Transparent)
                $Graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $Graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $Scale = [Math]::Min(232 / $Source.Width, 72 / $Source.Height)
                $Width = [Math]::Max(1, [int][Math]::Round($Source.Width * $Scale))
                $Height = [Math]::Max(1, [int][Math]::Round($Source.Height * $Scale))
                $X = [int][Math]::Round((256 - $Width) / 2)
                $Y = [int][Math]::Round((96 - $Height) / 2)
                $Graphics.DrawImage($Source, $X, $Y, $Width, $Height)
            }
            finally {
                $Graphics.Dispose()
            }

            if ($RemoveSolidBackground) {
                for ($Y = 0; $Y -lt $Canvas.Height; $Y++) {
                    for ($X = 0; $X -lt $Canvas.Width; $X++) {
                        $Pixel = $Canvas.GetPixel($X, $Y)
                        if ($Pixel.A -gt 0 -and (Get-ColorDistance $Pixel $Background) -lt 36) {
                            $Canvas.SetPixel($X, $Y, [System.Drawing.Color]::Transparent)
                        }
                    }
                }
            }

            $TargetPath = [System.IO.Path]::ChangeExtension($SourcePath, ".png")
            $TemporaryPath = "$TargetPath.tmp.png"
            $Canvas.Save($TemporaryPath, [System.Drawing.Imaging.ImageFormat]::Png)
        }
        finally {
            $Canvas.Dispose()
        }
    }
    finally {
        $Source.Dispose()
    }

    Move-Item -LiteralPath $TemporaryPath -Destination $TargetPath -Force
    if (-not $SourcePath.Equals($TargetPath, [System.StringComparison]::OrdinalIgnoreCase)) {
        Remove-Item -LiteralPath $SourcePath -Force
    }

    $OldWebPath = $Asset.file
    $NewWebPath = $OldWebPath -replace '\.[^.]+$', '.png'
    $Homepage = $Homepage.Replace("/$OldWebPath", "/$NewWebPath")
    $Asset.file = $NewWebPath
    $Asset.bytes = (Get-Item -LiteralPath $TargetPath).Length
    $Asset.sha256 = (Get-FileHash -LiteralPath $TargetPath -Algorithm SHA256).Hash.ToLowerInvariant()
    $Asset | Add-Member -NotePropertyName optimized -NotePropertyValue $true -Force
}

$Report.total_bytes = ($Report.assets | Measure-Object -Property bytes -Sum).Sum
$Report | Add-Member -NotePropertyName optimized_at -NotePropertyValue ([DateTime]::UtcNow.ToString("o")) -Force
[System.IO.File]::WriteAllText($HomepagePath, $Homepage, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText($ReportPath, (($Report | ConvertTo-Json -Depth 8) + "`n"), [System.Text.UTF8Encoding]::new($false))

Write-Host "Optimized $($Report.assets.Count) trust-logo records to $($Report.total_bytes) bytes." -ForegroundColor Green
