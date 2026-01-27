<#
.SYNOPSIS
    Standard Deployment Sync Script for Portfolio Agent
.DESCRIPTION
    Automates the sync from Root to DEPLOY_PUBLIC to ensure consistency.
    1. Syncs `assets` directory.
    2. Transforms `work.html` -> `DEPLOY_PUBLIC/work/index.html` with correct relative paths.
    3. Handles cache busting for critical scripts.
#>

$SourceRoot = "C:\Users\tempv2\Desktop\PortfolioAgent"
$DeployRoot = "$SourceRoot\DEPLOY_PUBLIC"

Write-Host "Starting Deployment Sync..." -ForegroundColor Cyan

# 1. Sync Assets
Write-Host "Syncing Assets..." -ForegroundColor Yellow
Copy-Item -Path "$SourceRoot\assets" -Destination "$DeployRoot" -Recurse -Force
Write-Host "Assets Synced." -ForegroundColor Green

# 2. Transform work.html
Write-Host "Processing work.html -> work/index.html..." -ForegroundColor Yellow
$WorkSource = "$SourceRoot\work.html"
$WorkDestDir = "$DeployRoot\work"
$WorkDest = "$WorkDestDir\index.html"

if (-not (Test-Path $WorkDestDir)) {
    New-Item -ItemType Directory -Force -Path $WorkDestDir | Out-Null
}

$content = Get-Content $WorkSource -Raw

# TRANSFORMATION RULES
# 1. Convert absolute/root assets to relative parent paths (../assets)
$content = $content -replace 'src="assets/', 'src="../assets/'
$content = $content -replace 'href="assets/', 'href="../assets/'
$content = $content -replace "url\('assets/", "url('../assets/"
$content = $content -replace 'src="/assets/', 'src="../assets/'
$content = $content -replace 'href="/assets/', 'href="../assets/'
$content = $content -replace "url\('/assets/", "url('../assets/"

# 2. Fix Internal Links (Remove .html, add ../ for directory routing)
# Project Hubs
$content = $content -replace 'href="work_projects/index.html"', 'href="../work_projects/"'
$content = $content -replace 'href="portfolio/quests/index.html"', 'href="../portfolio/quests/"'
$content = $content -replace 'href="portfolio/marketing/index.html"', 'href="../portfolio/marketing/"'

# Individual Pages
$content = $content -replace 'href="work_vibecoding.html"', 'href="../work_vibecoding/"'
$content = $content -replace 'href="work_speaker.html"', 'href="../work_speaker/"'
$content = $content -replace 'href="work_podcasts.html"', 'href="../work_podcasts/"'
$content = $content -replace 'href="work_writing.html"', 'href="../work_writing/"'
$content = $content -replace 'href="work_courses.html"', 'href="../work_courses/"'
$content = $content -replace 'href="work_tutorials.html"', 'href="../work_tutorials/"'
$content = $content -replace 'href="work_awards.html"', 'href="../work_awards/"'
$content = $content -replace 'href="skills.html"', 'href="../skills/"'
$content = $content -replace 'href="skills_detailed.html"', 'href="../skills_detailed/"'
$content = $content -replace 'href="testimonials.html"', 'href="../testimonials/"'

# Marketing Pages
$content = $content -replace 'href="portfolio/marketing/content_creator.html"', 'href="../portfolio/marketing/content_creator/"'
$content = $content -replace 'href="portfolio/marketing/email_outreach.html"', 'href="../portfolio/marketing/email_outreach/"'
$content = $content -replace 'href="portfolio/marketing/affiliates.html"', 'href="../portfolio/marketing/affiliates/"'
$content = $content -replace 'href="portfolio/marketing/case_studies.html"', 'href="../portfolio/marketing/case_studies/"'
$content = $content -replace 'href="portfolio/marketing/testimonials.html"', 'href="../portfolio/marketing/testimonials/"'

# 3. Cache Busting (Dynamic Date)
$dateStr = Get-Date -Format "yyyyMMdd-HHmm"
$content = $content -replace 'layout.js', "layout.js?v=$dateStr"

[System.IO.File]::WriteAllText($WorkDest, $content, [System.Text.Encoding]::UTF8)
Write-Host "work.html Transported and Transformed." -ForegroundColor Green

Write-Host "Deployment Sync Complete." -ForegroundColor Cyan
