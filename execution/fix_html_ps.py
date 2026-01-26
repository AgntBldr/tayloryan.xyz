"""
Simple fix: Read the backup the user provided and write it correctly
"""
# Since the full backup is too large, I'll use PowerShell to extract just the HTML content
import subprocess

ps_script = r"""
$content = Get-Content 'c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html' -Raw -Encoding UTF8
# Find the pattern ```html and extract everything after it
if ($content -match '```html\s+(<!DOCTYPE html>.*)') {
    $extracted = $matches[1]
    # Remove trailing ```
    $extracted = $extracted -replace '\s*```\s*$', ''
    # Write it
    $extracted | Set-Content 'c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio_FIXED.html' -Encoding UTF8
    Write-Host "✓ Extracted clean HTML"
    Write-Host "✓ Written to quest_portfolio_FIXED.html"
} else {
    Write-Host "✗ Pattern not found"
}
"""

result = subprocess.run(['powershell', '-Command', ps_script], capture_output=True, text=True)
print(result.stdout)
print(result.stderr)
