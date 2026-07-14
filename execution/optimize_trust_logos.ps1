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

    if (-not (Test-Path -LiteralPath $SourcePath)) {
        $RecoveredPngPath = [System.IO.Path]::ChangeExtension($SourcePath, ".png")
        if (-not (Test-Path -LiteralPath $RecoveredPngPath)) {
            throw "Missing trust-logo source and normalized fallback: $SourcePath"
        }
        $SourcePath = $RecoveredPngPath
        $Asset.file = ($Asset.file -replace '\.[^.]+$', '.png')
    }

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

        $MinX = $Source.Width
        $MinY = $Source.Height
        $MaxX = -1
        $MaxY = -1
        for ($Y = 0; $Y -lt $Source.Height; $Y++) {
            for ($X = 0; $X -lt $Source.Width; $X++) {
                $Pixel = $Source.GetPixel($X, $Y)
                $IsContent = $Pixel.A -gt 24
                if ($RemoveSolidBackground) {
                    $IsContent = $IsContent -and (Get-ColorDistance $Pixel $Background) -ge 36
                }
                if ($IsContent) {
                    $MinX = [Math]::Min($MinX, $X)
                    $MinY = [Math]::Min($MinY, $Y)
                    $MaxX = [Math]::Max($MaxX, $X)
                    $MaxY = [Math]::Max($MaxY, $Y)
                }
            }
        }

        if ($MaxX -lt $MinX -or $MaxY -lt $MinY) {
            $MinX = 0
            $MinY = 0
            $MaxX = $Source.Width - 1
            $MaxY = $Source.Height - 1
        }

        $ContentWidth = $MaxX - $MinX + 1
        $ContentHeight = $MaxY - $MinY + 1
        $TargetArea = 9000
        $Scale = [Math]::Sqrt($TargetArea / ($ContentWidth * $ContentHeight))
        $Scale = [Math]::Min($Scale, 220 / $ContentWidth)
        $Scale = [Math]::Min($Scale, 68 / $ContentHeight)
        $Width = [Math]::Max(1, [int][Math]::Round($ContentWidth * $Scale))
        $Height = [Math]::Max(1, [int][Math]::Round($ContentHeight * $Scale))
        $DestinationX = [int][Math]::Round((256 - $Width) / 2)
        $DestinationY = [int][Math]::Round((96 - $Height) / 2)

        $Canvas = New-Object System.Drawing.Bitmap 256, 96, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        try {
            $Graphics = [System.Drawing.Graphics]::FromImage($Canvas)
            try {
                $Graphics.Clear([System.Drawing.Color]::Transparent)
                $Graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $Graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $Destination = New-Object System.Drawing.Rectangle $DestinationX, $DestinationY, $Width, $Height
                $SourceBounds = New-Object System.Drawing.Rectangle $MinX, $MinY, $ContentWidth, $ContentHeight
                $Graphics.DrawImage($Source, $Destination, $SourceBounds, [System.Drawing.GraphicsUnit]::Pixel)
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
    $Asset | Add-Member -NotePropertyName source_content_bounds -NotePropertyValue "$ContentWidth`x$ContentHeight" -Force
    $Asset | Add-Member -NotePropertyName normalized_visible_bounds -NotePropertyValue "$Width`x$Height" -Force
}

$Report.total_bytes = ($Report.assets | Measure-Object -Property bytes -Sum).Sum
$Report | Add-Member -NotePropertyName optimized_at -NotePropertyValue ([DateTime]::UtcNow.ToString("o")) -Force
[System.IO.File]::WriteAllText($HomepagePath, $Homepage, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText($ReportPath, (($Report | ConvertTo-Json -Depth 8) + "`n"), [System.Text.UTF8Encoding]::new($false))

Write-Host "Optimized $($Report.assets.Count) trust-logo records to $($Report.total_bytes) bytes." -ForegroundColor Green
