param(
    [string]$Root = (Split-Path -Parent $PSScriptRoot),
    [int]$JpegQuality = 82
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$targets = @(
    Get-ChildItem -LiteralPath (Join-Path $Root "assets\images\work") -File -Filter "*.png"
    Get-Item -LiteralPath (Join-Path $Root "assets\images\taylor_headshot.png")
)

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq "image/jpeg"
$qualityEncoder = [System.Drawing.Imaging.Encoder]::Quality
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($qualityEncoder, [long]$JpegQuality)
$report = @()

foreach ($source in $targets) {
    $destination = [System.IO.Path]::ChangeExtension($source.FullName, ".jpg")
    $image = [System.Drawing.Image]::FromFile($source.FullName)
    $bitmap = New-Object System.Drawing.Bitmap($image.Width, $image.Height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Black)
    $graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)
    $graphics.Dispose()
    $image.Dispose()
    $bitmap.Save($destination, $jpegCodec, $encoderParams)
    $bitmap.Dispose()

    $optimized = Get-Item -LiteralPath $destination
    if ($optimized.Length -ge $source.Length) {
        Remove-Item -LiteralPath $destination
        continue
    }
    $report += [pscustomobject]@{
        source = $source.FullName.Substring($Root.Length + 1).Replace('\', '/')
        optimized = $optimized.FullName.Substring($Root.Length + 1).Replace('\', '/')
        original_bytes = $source.Length
        optimized_bytes = $optimized.Length
        saved_bytes = $source.Length - $optimized.Length
        reduction_percent = [Math]::Round((1 - ($optimized.Length / $source.Length)) * 100, 1)
    }
}

$encoderParams.Dispose()
$reportPath = Join-Path $Root "audits\site-audit\image-compression-2026-07-14.json"
$report | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $reportPath -Encoding UTF8
$originalTotal = ($report | Measure-Object original_bytes -Sum).Sum
$optimizedTotal = ($report | Measure-Object optimized_bytes -Sum).Sum
Write-Host "Optimized $($report.Count) web images: $([Math]::Round($originalTotal / 1MB, 2)) MB -> $([Math]::Round($optimizedTotal / 1MB, 2)) MB." -ForegroundColor Green
