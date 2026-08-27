# memory-health.ps1 - deterministic health report for a Claude Code auto-memory directory.
# $0 tokens: the script does ALL the reading; the model acts only on the flags it prints.
# Understands the Memory Ladder layout (MEMORY.md router + INDEX-*.md / ARCHIVE.md
# sub-indexes + topic files) and still works on a flat single-index memory.
#
#   & memory-health.ps1                          # derive memory dir from the current project
#   & memory-health.ps1 -MemoryDir <path>        # explicit
#   & memory-health.ps1 -StaleDays 60
#
# Exit 1 when a FAIL-class gate check fires (router over byte budget, router line over
# MaxLineChars, index pointer to a missing file, duplicate name: frontmatter).
# WARN-class flags (near-budget, dead wikilinks, stale, big, uncommitted) exit 0.
[CmdletBinding()]
param(
  [string]$MemoryDir,
  [string]$ProjectPath,
  [int]$StaleDays = 45,
  [int]$BigKB = 8,
  [int]$RouterWarnKB = 12,
  [int]$RouterFailKB = 16,
  [int]$MaxLineChars = 600
)
$ErrorActionPreference = 'Stop'

if (-not $MemoryDir) {
  if (-not $ProjectPath) { $ProjectPath = (Get-Location).Path }
  # Claude Code project-dir convention: ':' -> '-', '\' -> '-'
  $san = $ProjectPath.Replace(':','-').Replace('\','-')
  $MemoryDir = Join-Path $env:USERPROFILE (".claude\projects\" + $san + "\memory")
}
if (-not (Test-Path $MemoryDir)) { throw "memory dir not found: $MemoryDir (pass -MemoryDir)" }

$router = Join-Path $MemoryDir 'MEMORY.md'
$all = @(Get-ChildItem $MemoryDir -Filter *.md -File)
$indexLayer = @($all | Where-Object { $_.Name -eq 'MEMORY.md' -or $_.Name -like 'INDEX-*.md' -or $_.Name -eq 'ARCHIVE.md' })
$files = @($all | Where-Object { $_.Name -ne 'MEMORY.md' -and $_.Name -notlike 'INDEX-*.md' -and $_.Name -ne 'ARCHIVE.md' })
$indexText = ($indexLayer | ForEach-Object { [IO.File]::ReadAllText($_.FullName) }) -join "`n"

$flags = @()   # WARN-class: report, exit 0
$fails = @()   # FAIL-class: gate violations, exit 1

# name -> file map from frontmatter (+ duplicate name detection)
$names = @{}
foreach ($f in $files) {
  foreach ($line in (Get-Content $f.FullName -TotalCount 8 -Encoding UTF8)) {
    if ($line -match '^name:\s*(\S+)') {
      # lowercase the key: PS hashtables are case-insensitive but the wikilink regex only
      # captures lowercase, and NTFS collides names differing only by case anyway
      $n = $Matches[1].ToLowerInvariant()
      if ($names.ContainsKey($n)) { $fails += "DUP-NAME: '$n' in $($names[$n]) AND $($f.Name)" }
      else { $names[$n] = $f.Name }
      break
    }
  }
}

# router byte budget + line length (ladder gate: warn 12KB / fail 16KB, no line over ~600)
if (Test-Path $router) {
  $rKB = (Get-Item $router).Length / 1KB
  if ($rKB -gt $RouterFailKB) { $fails += ("ROUTER-OVER-BUDGET({0:N1}KB > {1}KB): move detail DOWN a layer (topic file first, then trim the line)" -f $rKB, $RouterFailKB) }
  elseif ($rKB -gt $RouterWarnKB) { $flags += ("ROUTER-NEAR-BUDGET({0:N1}KB > {1}KB): MEMORY.md" -f $rKB, $RouterWarnKB) }
  $ln = 0
  foreach ($line in [IO.File]::ReadAllLines($router)) {
    $ln++
    if ($line.Length -gt $MaxLineChars) { $fails += "ROUTER-LONG-LINE(L$ln, $($line.Length) chars): patch the topic FILE to carry every fact first, THEN cut the line to its hook" }
  }
}

# topic files not referenced from any index-layer file / index links to missing files
foreach ($f in $files) {
  if ($indexText -notmatch [regex]::Escape($f.Name)) { $flags += "NOT-IN-INDEX: $($f.Name)" }
}
foreach ($ix in $indexLayer) {
  $txt = [IO.File]::ReadAllText($ix.FullName)
  foreach ($m in ([regex]::Matches($txt, '\]\(([^)#]+\.md)\)'))) {
    $ref = $m.Groups[1].Value
    if (-not (Test-Path (Join-Path $MemoryDir $ref))) { $fails += "INDEX-POINTS-TO-MISSING: $($ix.Name) -> $ref" }
  }
}

# dead [[links]] between memories (WARN per the ladder: an unresolved wikilink marks a
# memory worth writing later, not an error)
foreach ($f in $files) {
  $body = [IO.File]::ReadAllText($f.FullName)
  foreach ($m in ([regex]::Matches($body, '\[\[([a-z0-9\-]+)\]\]'))) {
    if (-not $names.ContainsKey($m.Groups[1].Value)) { $flags += "DEAD-LINK: $($f.Name) -> [[$($m.Groups[1].Value)]]" }
  }
}

# stale + oversized. STALE is skipped for files referenced from ARCHIVE.md - archived
# history is stale by design.
$archivePath = Join-Path $MemoryDir 'ARCHIVE.md'
$archiveText = if (Test-Path $archivePath) { [IO.File]::ReadAllText($archivePath) } else { '' }
foreach ($f in $files) {
  $age = [int]((Get-Date) - $f.LastWriteTime).TotalDays
  if (($age -gt $StaleDays) -and ($archiveText -notmatch [regex]::Escape($f.Name))) { $flags += "STALE(${age}d): $($f.Name)" }
  if ($f.Length -gt ($BigKB * 1KB)) { $flags += ("BIG({0:N1}KB): {1}" -f ($f.Length/1KB), $f.Name) }
}

# git hygiene (WARN): the memory dir should be its own repo, committed at session close -
# git history IS the backup and the audit trail.
if (-not (Test-Path (Join-Path $MemoryDir '.git'))) { $flags += "NOT-GIT-REPO: git init + commit the memory dir (history is the backup)" }
else {
  $dirty = @(git -C $MemoryDir status --porcelain)
  if ($dirty.Count) { $flags += "UNCOMMITTED($($dirty.Count) change(s)): commit the memory repo at session close" }
}

# summary
$totalKB = [Math]::Round((($all | Measure-Object Length -Sum).Sum)/1KB,1)
$idxKB   = if (Test-Path $router) { [Math]::Round((Get-Item $router).Length/1KB,1) } else { 0 }
Write-Host ("memory dir : " + $MemoryDir)
Write-Host ("topics={0}  index-layer={1}  totalKB={2}  routerKB={3} (~{4} tokens loaded EVERY session; warn {5}KB / fail {6}KB)" -f $files.Count, $indexLayer.Count, $totalKB, $idxKB, [int]($idxKB*256), $RouterWarnKB, $RouterFailKB)
Write-Host ""
Write-Host "name | description (eyeball for overlap/duplicates):"
foreach ($f in ($files | Sort-Object Name)) {
  $desc = ''
  foreach ($line in (Get-Content $f.FullName -TotalCount 8 -Encoding UTF8)) { if ($line -match '^description:\s*(.+)$') { $desc = $Matches[1]; break } }
  if ($desc.Length -gt 110) { $desc = $desc.Substring(0,107) + '...' }
  Write-Host ("  {0,-42} {1}" -f $f.Name, $desc)
}
Write-Host ""
if ($fails.Count) { Write-Host "FAILS (gate - fix before writing memory):"; $fails | Sort-Object | ForEach-Object { Write-Host ("  " + $_) } }
if ($flags.Count) { Write-Host "FLAGS:"; $flags | Sort-Object | ForEach-Object { Write-Host ("  " + $_) } }
if (-not $fails.Count -and -not $flags.Count) { Write-Host "FLAGS: none - memory is healthy." }
if ($fails.Count) { exit 1 }
exit 0   # explicit: otherwise a stale $LASTEXITCODE (e.g. from git status) leaks through
