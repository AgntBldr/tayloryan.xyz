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

# 1.5. Sync Portfolio
Write-Host "Syncing Portfolio..." -ForegroundColor Yellow
Copy-Item -Path "$SourceRoot\portfolio" -Destination "$DeployRoot" -Recurse -Force
Write-Host "Portfolio Synced." -ForegroundColor Green

# 1.5.1 Sync Headers (CSP)
Copy-Item -Path "$SourceRoot\_headers" -Destination "$DeployRoot" -Force
Write-Host "Headers Synced." -ForegroundColor Green

# 1.6. Transform skills.html -> skills/index.html
Write-Host "Processing skills.html -> skills/index.html..." -ForegroundColor Yellow
$SkillsSource = "$SourceRoot\skills.html"
$SkillsDestDir = "$DeployRoot\skills"
$SkillsDest = "$SkillsDestDir\index.html"

if (-not (Test-Path $SkillsDestDir)) {
    New-Item -ItemType Directory -Force -Path $SkillsDestDir | Out-Null
}

$skillsContent = Get-Content $SkillsSource -Raw
# Fix internal links for nested depth
$skillsContent = $skillsContent -replace 'src="assets/', 'src="../assets/'
$skillsContent = $skillsContent -replace 'href="assets/', 'href="../assets/'
$skillsContent = $skillsContent -replace 'href="index.html"', 'href="../"'
$skillsContent = $skillsContent -replace 'href="work.html"', 'href="../work/"'
$skillsContent = $skillsContent -replace 'href="contact.html"', 'href="../contact/"'

[System.IO.File]::WriteAllText($SkillsDest, $skillsContent, [System.Text.Encoding]::UTF8)
Write-Host "skills.html Transported and Transformed to skills/index.html" -ForegroundColor Green

# 1.7. Transform skills_detailed.html -> skills_detailed/index.html
Write-Host "Processing skills_detailed.html -> skills_detailed/index.html..." -ForegroundColor Yellow
$SDSource = "$SourceRoot\skills_detailed.html"
$SDDestDir = "$DeployRoot\skills_detailed"
$SDDest = "$SDDestDir\index.html"
if (-not (Test-Path $SDDestDir)) { New-Item -ItemType Directory -Force -Path $SDDestDir | Out-Null }
$sdContent = Get-Content $SDSource -Raw
$sdContent = $sdContent -replace 'src="assets/', 'src="../assets/'
$sdContent = $sdContent -replace 'href="assets/', 'href="../assets/'
$sdContent = $sdContent -replace 'href="index.html"', 'href="../"'
$sdContent = $sdContent -replace 'href="work.html"', 'href="../work/"'
$sdContent = $sdContent -replace 'href="contact.html"', 'href="../contact/"'
[System.IO.File]::WriteAllText($SDDest, $sdContent, [System.Text.Encoding]::UTF8)

# 1.8. Transform work_awards.html -> work_awards/index.html
Write-Host "Processing work_awards.html -> work_awards/index.html..." -ForegroundColor Yellow
$AwardsSource = "$SourceRoot\work_awards.html"
$AwardsDestDir = "$DeployRoot\work_awards"
$AwardsDest = "$AwardsDestDir\index.html"
if (-not (Test-Path $AwardsDestDir)) { New-Item -ItemType Directory -Force -Path $AwardsDestDir | Out-Null }
$awardsContent = Get-Content $AwardsSource -Raw
$awardsContent = $awardsContent -replace 'src="assets/', 'src="../assets/'
$awardsContent = $awardsContent -replace 'href="assets/', 'href="../assets/'
$awardsContent = $awardsContent -replace 'href="index.html"', 'href="../"'
$awardsContent = $awardsContent -replace 'href="work.html"', 'href="../work/"'
$awardsContent = $awardsContent -replace 'href="contact.html"', 'href="../contact/"'
[System.IO.File]::WriteAllText($AwardsDest, $awardsContent, [System.Text.Encoding]::UTF8)

# 1.9. Transform testimonials.html -> testimonials/index.html
Write-Host "Processing testimonials.html -> testimonials/index.html..." -ForegroundColor Yellow
$TestSource = "$SourceRoot\testimonials.html"
$TestDestDir = "$DeployRoot\testimonials"
$TestDest = "$TestDestDir\index.html"
if (-not (Test-Path $TestDestDir)) { New-Item -ItemType Directory -Force -Path $TestDestDir | Out-Null }
$testContent = Get-Content $TestSource -Raw
$testContent = $testContent -replace 'src="assets/', 'src="../assets/'
$testContent = $testContent -replace 'href="assets/', 'href="../assets/'
$testContent = $testContent -replace 'href="index.html"', 'href="../"'
$testContent = $testContent -replace 'href="work.html"', 'href="../work/"'
$testContent = $testContent -replace 'href="contact.html"', 'href="../contact/"'
[System.IO.File]::WriteAllText($TestDest, $testContent, [System.Text.Encoding]::UTF8)

# 1.10. Transform work_podcasts.html -> work_podcasts/index.html
Write-Host "Processing work_podcasts.html -> work_podcasts/index.html..." -ForegroundColor Yellow
$PodSource = "$SourceRoot\work_podcasts.html"
$PodDestDir = "$DeployRoot\work_podcasts"
$PodDest = "$PodDestDir\index.html"
if (-not (Test-Path $PodDestDir)) { New-Item -ItemType Directory -Force -Path $PodDestDir | Out-Null }
$podContent = Get-Content $PodSource -Raw
$podContent = $podContent -replace 'src="assets/', 'src="../assets/'
$podContent = $podContent -replace 'href="assets/', 'href="../assets/'
$podContent = $podContent -replace 'href="index.html"', 'href="../"'
$podContent = $podContent -replace 'href="work.html"', 'href="../work/"'
[System.IO.File]::WriteAllText($PodDest, $podContent, [System.Text.Encoding]::UTF8)

# 1.11. Transform work_writing.html -> work_writing/index.html
Write-Host "Processing work_writing.html -> work_writing/index.html..." -ForegroundColor Yellow
$WritingSource = "$SourceRoot\work_writing.html"
$WritingDestDir = "$DeployRoot\work_writing"
$WritingDest = "$WritingDestDir\index.html"
if (-not (Test-Path $WritingDestDir)) { New-Item -ItemType Directory -Force -Path $WritingDestDir | Out-Null }
$writingContent = Get-Content $WritingSource -Raw
$writingContent = $writingContent -replace 'src="assets/', 'src="../assets/'
$writingContent = $writingContent -replace 'href="assets/', 'href="../assets/'
$writingContent = $writingContent -replace 'href="index.html"', 'href="../"'
$writingContent = $writingContent -replace 'href="work.html"', 'href="../work/"'
[System.IO.File]::WriteAllText($WritingDest, $writingContent, [System.Text.Encoding]::UTF8)

# 1.12. Transform work_tutorials.html -> work_tutorials/index.html
Write-Host "Processing work_tutorials.html -> work_tutorials/index.html..." -ForegroundColor Yellow
$TutSource = "$SourceRoot\work_tutorials.html"
$TutDestDir = "$DeployRoot\work_tutorials"
$TutDest = "$TutDestDir\index.html"
if (-not (Test-Path $TutDestDir)) { New-Item -ItemType Directory -Force -Path $TutDestDir | Out-Null }
$tutContent = Get-Content $TutSource -Raw
$tutContent = $tutContent -replace 'src="assets/', 'src="../assets/'
$tutContent = $tutContent -replace 'href="assets/', 'href="../assets/'
$tutContent = $tutContent -replace 'href="index.html"', 'href="../"'
$tutContent = $tutContent -replace 'href="work.html"', 'href="../work/"'
[System.IO.File]::WriteAllText($TutDest, $tutContent, [System.Text.Encoding]::UTF8)

# 1.13. Transform work_courses.html -> work_courses/index.html
Write-Host "Processing work_courses.html -> work_courses/index.html..." -ForegroundColor Yellow
$CourseSource = "$SourceRoot\work_courses.html"
$CourseDestDir = "$DeployRoot\work_courses"
$CourseDest = "$CourseDestDir\index.html"
if (-not (Test-Path $CourseDestDir)) { New-Item -ItemType Directory -Force -Path $CourseDestDir | Out-Null }
$courseContent = Get-Content $CourseSource -Raw
$courseContent = $courseContent -replace 'src="assets/', 'src="../assets/'
$courseContent = $courseContent -replace 'href="assets/', 'href="../assets/'
$courseContent = $courseContent -replace 'href="index.html"', 'href="../"'
$courseContent = $courseContent -replace 'href="work.html"', 'href="../work/"'
[System.IO.File]::WriteAllText($CourseDest, $courseContent, [System.Text.Encoding]::UTF8)

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
$content = $content -replace 'work_scroll.js', "work_scroll.js?v=$dateStr"
$content = $content -replace 'work_sidebar.js', "work_sidebar.js?v=$dateStr"
$content = $content -replace 'marketing_sidebar.js', "marketing_sidebar.js?v=$dateStr"

[System.IO.File]::WriteAllText($WorkDest, $content, [System.Text.Encoding]::UTF8)
Write-Host "work.html Transported and Transformed to work/index.html" -ForegroundColor Green

# 3b. Also update DEPLOY_PUBLIC/work.html to match (Safety Net)
$WorkDestAlt = "$DeployRoot\work.html"
[System.IO.File]::WriteAllText($WorkDestAlt, $content, [System.Text.Encoding]::UTF8)
Write-Host "work.html Transported and Transformed to DEPLOY_PUBLIC/work.html" -ForegroundColor Green

# 4. Global Cache Busting (All HTML files in DEPLOY_PUBLIC)
Write-Host "Applying Global Cache Busting..." -ForegroundColor Yellow
$HtmlFiles = Get-ChildItem -Path "$DeployRoot" -Filter *.html -Recurse
foreach ($file in $HtmlFiles) {
    if ($file.FullName -eq $WorkDest -or $file.FullName -eq $WorkDestAlt) {
        continue # Already processed
    }
    
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    if ($content -match 'layout.js') {
        $content = $content -replace 'layout.js', "layout.js?v=$dateStr"
        $modified = $true
    }
    if ($content -match 'work_scroll.js') {
        $content = $content -replace 'work_scroll.js', "work_scroll.js?v=$dateStr"
        $modified = $true
    }
    if ($content -match 'work_sidebar.js') {
        $content = $content -replace 'work_sidebar.js', "work_sidebar.js?v=$dateStr"
        $modified = $true
    }
    if ($content -match 'marketing_sidebar.js') {
        $content = $content -replace 'marketing_sidebar.js', "marketing_sidebar.js?v=$dateStr"
        $modified = $true
    }
    
    if ($modified) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  Busted cache in: $($file.Name)" -ForegroundColor Gray
    }
}
Write-Host "Global Cache Busting Complete." -ForegroundColor Green

Write-Host "Deployment Sync Complete." -ForegroundColor Cyan
