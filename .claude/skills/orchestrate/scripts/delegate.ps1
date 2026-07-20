# delegate.ps1 - single front door for delegating work to cheap/$0 model lanes.
#
# Lanes:
#   codex               OpenAI Codex CLI headless (gpt-5.5, ChatGPT subscription = $0 API).
#                       A full agent: reads/edits files and runs commands inside -WorkDir.
#   qwen                Local Ollama (qwen2.5:7b-instruct). $0, no network.
#   glm|openrouter|deepseek   HTTP chat completions via bundled model-router.ps1. $0 Anthropic.
#   sonnet              Anthropic API via router - the paid escalation tier.
#   auto                Router picks by task size: ollama for small, GLM-first for big.
#
# Every prompt gets a fable-mode discipline preamble prepended (-Discipline min|full|none).
# Prompts are passed via stdin/temp file, never the command line (length + quoting safety).
#
# Examples:
#   & delegate.ps1 -Health
#   & delegate.ps1 -Lane qwen  -Task 'Classify these titles...' -Json
#   & delegate.ps1 -Lane glm   -TaskFile spec.md -Discipline full -MaxTokens 12000
#   & delegate.ps1 -Lane codex -TaskFile spec.md -WorkDir C:\proj -Sandbox workspace-write -Effort high
#
# Exit code 0 = lane returned output (and passed -Validate if the caller checks the text
# themselves); 1 = lane failed/timed out. Final model message is printed between
# ===DELEGATE-RESULT=== markers and also written to -OutFile when given.

[CmdletBinding()]
param(
  [ValidateSet('codex','qwen','glm','openrouter','deepseek','sonnet','auto')]
  [string]$Lane,
  [string]$Task,
  [string]$TaskFile,
  [ValidateSet('min','full','none')][string]$Discipline = 'min',
  # --- codex lane ---
  [string]$WorkDir,
  [ValidateSet('read-only','workspace-write')][string]$Sandbox = 'read-only',
  [ValidateSet('low','medium','high','xhigh')][string]$Effort = 'medium',
  [string]$Model,
  [string]$SchemaFile,
  [switch]$Ephemeral,
  # --- router lanes ---
  [switch]$Json,
  [int]$MaxTokens = 8000,
  [double]$Temperature = 0.2,
  # --- common ---
  [string]$OutFile,
  [int]$TimeoutSec = 1800,
  [switch]$Health
)

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Find-CodexExe {
  $bin = Join-Path $env:LOCALAPPDATA 'OpenAI\Codex\bin'
  if (Test-Path $bin) {
    $hit = Get-ChildItem $bin -Recurse -Filter codex.exe -ErrorAction SilentlyContinue |
      Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($hit) { return $hit.FullName }
  }
  $cmd = Get-Command codex -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return $null
}

function Quote-Arg([string]$a) {
  if ($a -match '[\s"]') { return '"' + ($a -replace '"','\"') + '"' }
  return $a
}

# Router lives next to this script (bundled copy; canonical source: population/model-router.ps1).
. (Join-Path $PSScriptRoot 'model-router.ps1')

if ($Health) {
  $exe = Find-CodexExe
  $codexRow = [pscustomobject]@{ provider='codex'; kind='cli-agent'; model='config-default (see ~/.codex/config.toml)'; available=[bool]$exe }
  @($codexRow) + @(Get-RouterHealth) | Format-Table -AutoSize
  if ($exe) { Write-Host "codex exe: $exe" }
  return
}

if (-not $Lane) { throw 'Provide -Lane (or -Health).' }
if ($TaskFile) {
  if (-not (Test-Path $TaskFile)) { throw "TaskFile not found: $TaskFile" }
  $Task = [System.IO.File]::ReadAllText((Resolve-Path $TaskFile), $utf8)
}
if (-not $Task -or -not $Task.Trim()) { throw 'Provide -Task or -TaskFile.' }

# --- prepend fable-mode discipline ---
$preamble = ''
if ($Discipline -ne 'none') {
  # scripts/ -> orchestrate/ -> skills/ -> fable-mode/
  $fableDir = Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) 'fable-mode'
  $pFile = Join-Path $fableDir ("preamble-" + $Discipline + ".md")
  if (Test-Path $pFile) {
    $preamble = [System.IO.File]::ReadAllText($pFile, $utf8)
  } else {
    $preamble = "Follow exactly: do only what is asked; never claim work you did not do; " +
      "label gaps UNVERIFIED or MISSING; never invent names, paths, or numbers (write UNKNOWN); " +
      "complete the whole task in one response; put the deliverable first, prose after."
    Write-Warning "fable-mode preamble not found at $pFile - using embedded fallback."
  }
}

$sw = [System.Diagnostics.Stopwatch]::StartNew()
$resultText = $null
$ok = $false
$servedBy = $Lane

if ($Lane -eq 'codex') {
  $exe = Find-CodexExe
  if (-not $exe) { Write-Error 'Codex CLI not found (Codex app bin dir or PATH).'; exit 1 }
  if (-not $WorkDir) { $WorkDir = (Get-Location).Path }

  $tmp = Join-Path $env:TEMP ("delegate-" + [guid]::NewGuid().ToString('N').Substring(0,10))
  New-Item -ItemType Directory -Path $tmp | Out-Null
  $stdinFile  = Join-Path $tmp 'prompt.txt'
  $stdoutFile = Join-Path $tmp 'stdout.txt'
  $stderrFile = Join-Path $tmp 'stderr.txt'
  $lastFile   = Join-Path $tmp 'last-message.txt'

  $full = if ($preamble) { $preamble + "`n`n---`n`n" + $Task } else { $Task }
  [System.IO.File]::WriteAllText($stdinFile, $full, $utf8)

  $cliArgs = @('exec','--skip-git-repo-check','-C',$WorkDir,'-s',$Sandbox,
               '-c',("model_reasoning_effort=" + $Effort),
               '--color','never','-o',$lastFile)
  if ($Model)      { $cliArgs += @('-m',$Model) }
  if ($SchemaFile) { $cliArgs += @('--output-schema',(Resolve-Path $SchemaFile).Path) }
  if ($Ephemeral)  { $cliArgs += '--ephemeral' }
  $cliArgs += '-'
  $argLine = ($cliArgs | ForEach-Object { Quote-Arg $_ }) -join ' '

  $p = Start-Process -FilePath $exe -ArgumentList $argLine -NoNewWindow -PassThru `
        -RedirectStandardInput $stdinFile -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile
  $null = $p.Handle  # PS 5.1: ExitCode is null after -PassThru unless the handle is cached first
  if (-not $p.WaitForExit($TimeoutSec * 1000)) {
    try { $p.Kill() } catch {}
    Write-Error "codex timed out after ${TimeoutSec}s (workdir $WorkDir). Partial stdout: $stdoutFile"
    exit 1
  }
  $exit = $p.ExitCode
  if ((Test-Path $lastFile) -and $exit -eq 0) {
    $resultText = [System.IO.File]::ReadAllText($lastFile, $utf8)
    $ok = $true
    $servedBy = 'codex (' + $(if ($Model) { $Model } else { 'config-default' }) + ", effort=$Effort)"
  } else {
    $tail = ''
    if (Test-Path $stdoutFile) { $tail = (Get-Content $stdoutFile -Encoding UTF8 | Select-Object -Last 15) -join "`n" }
    Write-Error ("codex failed (exit $exit). stdout tail:`n" + $tail)
    exit 1
  }
}
else {
  # GLM-4.6/DeepSeek spend tokens on internal reasoning before emitting content; a small
  # cap yields an EMPTY response that still reports ok. Floor it.
  if ($MaxTokens -lt 2000) { $MaxTokens = 2000 }
  # NB: do not name any script-scope variable $providers/$messages etc. - the dot-sourced
  # router owns $script:PROVIDERS and PowerShell variable names are case-insensitive.
  $laneMap = @{ qwen='ollama'; glm='glm'; openrouter='openrouter'; deepseek='deepseek'; sonnet='anthropic' }
  if ($Lane -eq 'auto') {
    $kb = [Math]::Round(([System.Text.Encoding]::UTF8.GetByteCount($Task)) / 1024.0, 1)
    $laneOrder = Get-ProviderOrder -Kb $kb
  } else {
    $laneOrder = @($laneMap[$Lane])
  }
  $msgList = @()
  if ($preamble) { $msgList += @{ role='system'; content=$preamble } }
  $msgList += @{ role='user'; content=$Task }
  $r = Invoke-LLMRouted -Providers $laneOrder -Messages $msgList -MaxTokens $MaxTokens -Temperature $Temperature -Json:$Json
  if ($r.ok) {
    $resultText = $r.text
    $ok = $true
    $servedBy = "$($r.provider) ($($r.model))"
  } else {
    Write-Error "all providers failed for lane '$Lane' (tried: $($laneOrder -join ', '))"
    exit 1
  }
}

$sw.Stop()
if ($OutFile) { [System.IO.File]::WriteAllText($OutFile, $resultText, $utf8) }
Write-Host ("===DELEGATE-RESULT=== ok=$ok servedBy=$servedBy elapsedSec=" + [Math]::Round($sw.Elapsed.TotalSeconds,1))
Write-Host $resultText
Write-Host '===END-DELEGATE-RESULT==='
exit 0
