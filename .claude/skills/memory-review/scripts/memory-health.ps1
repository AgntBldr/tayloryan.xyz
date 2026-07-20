# memory-health.ps1 - deterministic health report for a Claude Code auto-memory directory.
# $0 tokens: the script does ALL the reading; the model acts only on the flags it prints.
#
#   & memory-health.ps1                          # derive memory dir from the current project
#   & memory-health.ps1 -MemoryDir <path>        # explicit
#   & memory-health.ps1 -StaleDays 60
[CmdletBinding()]
param(
  [string]$MemoryDir,
  [string]$ProjectPath,
  [int]$StaleDays = 45,
  [int]$BigKB = 8
)
$ErrorActionPreference = 'Stop'

if (-not $MemoryDir) {
  if (-not $ProjectPath) { $ProjectPath = (Get-Location).Path }
  # Claude Code project-dir convention: ':' -> '-', '\' -> '-'
  $san = $ProjectPath.Replace(':','-').Replace('\','-')
  $MemoryDir = Join-Path $env:USERPROFILE (".claude\projects\" + $san + "\memory")
}
if (-not (Test-Path $MemoryDir)) { throw "memory dir not found: $MemoryDir (pass -MemoryDir)" }

$index = Join-Path $MemoryDir 'MEMORY.md'
$files = @(Get-ChildItem $MemoryDir -Filter *.md -File | Where-Object Name -ne 'MEMORY.md')
$indexText = if (Test-Path $index) { [IO.File]::ReadAllText($index) } else { '' }

# name -> file map from frontmatter
$names = @{}
foreach ($f in $files) {
  foreach ($line in (Get-Content $f.FullName -TotalCount 8 -Encoding UTF8)) {
    if ($line -match '^name:\s*(\S+)') { $names[$Matches[1]] = $f.Name; break }
  }
}

$flags = @()
# 1) files not referenced in the index / index links to missing files
foreach ($f in $files) {
  if ($indexText -notmatch [regex]::Escape($f.Name)) { $flags += "NOT-IN-INDEX: $($f.Name)" }
}
foreach ($m in ([regex]::Matches($indexText, '\]\(([^)#]+\.md)\)'))) {
  $ref = $m.Groups[1].Value
  if (-not (Test-Path (Join-Path $MemoryDir $ref))) { $flags += "INDEX-POINTS-TO-MISSING: $ref" }
}
# 2) dead [[links]] between memories
foreach ($f in $files) {
  $body = [IO.File]::ReadAllText($f.FullName)
  foreach ($m in ([regex]::Matches($body, '\[\[([a-z0-9\-]+)\]\]'))) {
    if (-not $names.ContainsKey($m.Groups[1].Value)) { $flags += "DEAD-LINK: $($f.Name) -> [[$($m.Groups[1].Value)]]" }
  }
}
# 3) stale + oversized
foreach ($f in $files) {
  $age = [int]((Get-Date) - $f.LastWriteTime).TotalDays
  if ($age -gt $StaleDays) { $flags += "STALE(${age}d): $($f.Name)" }
  if ($f.Length -gt ($BigKB * 1KB)) { $flags += ("BIG({0:N1}KB): {1}" -f ($f.Length/1KB), $f.Name) }
}

# summary
$totalKB = [Math]::Round((($files | Measure-Object Length -Sum).Sum)/1KB,1)
$idxKB   = if (Test-Path $index) { [Math]::Round((Get-Item $index).Length/1KB,1) } else { 0 }
Write-Host ("memory dir : " + $MemoryDir)
Write-Host ("files={0}  totalKB={1}  indexKB={2} (~{3} tokens loaded EVERY session)" -f $files.Count, $totalKB, $idxKB, [int]($idxKB*256))
Write-Host ""
Write-Host "name | description (eyeball for overlap/duplicates):"
foreach ($f in ($files | Sort-Object Name)) {
  $desc = ''
  foreach ($line in (Get-Content $f.FullName -TotalCount 8 -Encoding UTF8)) { if ($line -match '^description:\s*(.+)$') { $desc = $Matches[1]; break } }
  if ($desc.Length -gt 110) { $desc = $desc.Substring(0,107) + '...' }
  Write-Host ("  {0,-42} {1}" -f $f.Name, $desc)
}
Write-Host ""
if ($flags.Count) { Write-Host "FLAGS:"; $flags | Sort-Object | ForEach-Object { Write-Host ("  " + $_) } }
else { Write-Host "FLAGS: none - memory is healthy." }
