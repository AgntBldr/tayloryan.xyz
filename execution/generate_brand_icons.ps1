param(
    [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$brandDir = Join-Path $Root "assets\brand"
New-Item -ItemType Directory -Force -Path $brandDir | Out-Null

function New-BrandBitmap {
    param([int]$Size)

    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $graphics.Clear([System.Drawing.Color]::FromArgb(5, 5, 5))

    $barHeight = [Math]::Max(2, [int]($Size * 0.07))
    $barTop = [Math]::Max(2, [int]($Size * 0.09))
    $barLeft = [int]($Size * 0.1)
    $barWidth = $Size - (2 * $barLeft)
    $segments = @(
        @{ Width = [int]($barWidth * 0.42); Color = [System.Drawing.Color]::FromArgb(192, 132, 252) },
        @{ Width = [int]($barWidth * 0.32); Color = [System.Drawing.Color]::FromArgb(244, 114, 182) },
        @{ Width = $barWidth; Color = [System.Drawing.Color]::FromArgb(56, 189, 248) }
    )
    $x = $barLeft
    foreach ($segment in $segments) {
        $width = if ($segment -eq $segments[-1]) { ($barLeft + $barWidth) - $x } else { $segment.Width }
        $brush = New-Object System.Drawing.SolidBrush($segment.Color)
        $graphics.FillRectangle($brush, $x, $barTop, $width, $barHeight)
        $brush.Dispose()
        $x += $width
    }

    $font = New-Object System.Drawing.Font("Arial", ($Size * 0.34), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $textBox = New-Object System.Drawing.RectangleF(0, ($Size * 0.2), $Size, ($Size * 0.72))
    $graphics.DrawString("TR", $font, $textBrush, $textBox, $format)

    $format.Dispose()
    $textBrush.Dispose()
    $font.Dispose()
    $graphics.Dispose()
    return $bitmap
}

$icon32 = New-BrandBitmap -Size 32
$icon32.Save((Join-Path $brandDir "favicon-32x32.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$icon32.Dispose()

$appleIcon = New-BrandBitmap -Size 180
$appleIcon.Save((Join-Path $brandDir "apple-touch-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$appleIcon.Dispose()

$icoBitmap = New-BrandBitmap -Size 64
$iconHandle = $icoBitmap.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$stream = [System.IO.File]::Open((Join-Path $Root "favicon.ico"), [System.IO.FileMode]::Create)
$icon.Save($stream)
$stream.Dispose()
$icon.Dispose()
$icoBitmap.Dispose()

Write-Host "Generated favicon.ico and branded 32px/180px PNG icons." -ForegroundColor Green
