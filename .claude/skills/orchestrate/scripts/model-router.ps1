# model-router.ps1 - provider-abstracted LLM caller with ordered fallback + validation + logging.
#
# Policy this enables (V3 second-brain population): cheap models GENERATE, Opus VERIFIES.
# Dot-source it, then call Invoke-LLMRouted with an ordered provider list; it tries each in
# turn until one returns output that passes your -Validate check. Non-Anthropic providers run
# as direct HTTP here (the Workflow tool can only call Anthropic); Anthropic is included as the
# final escalation tier so a single hard doc can bump up to Sonnet without escalating the whole run.
#
# Secrets are read from .env files at call time and NEVER printed or logged. ASCII-only source.
#
# Example:
#   . C:\Users\tempv2\V3-2ndBrain\population\model-router.ps1
#   $r = Invoke-LLMRouted -Providers (Get-ProviderOrder -Kb 4) -Messages $msgs -Json `
#          -Validate { param($t) try { $o=$t|ConvertFrom-Json; @($o.nodes).Count -ge 0 } catch { $false } } `
#          -LogPath C:\...\router.log
#   if ($r.ok) { $text = $r.text; $servedBy = $r.provider }

$script:PROVIDERS = @{
  ollama = @{
    kind='ollama'; endpoint='http://localhost:11434/api/chat'; model='qwen2.5:7b-instruct';
    keyName=$null; envFiles=@()
  }
  glm = @{
    kind='openai'; endpoint='https://api.z.ai/api/paas/v4/chat/completions'; model='glm-4.6';
    keyName='GLM_API_KEY'; envFiles=@('C:\Users\tempv2\HypnoApp\.env')
  }
  openrouter = @{
    kind='openai'; endpoint='https://openrouter.ai/api/v1/chat/completions'; model='z-ai/glm-4.6';
    keyName='OPENROUTER_API_KEY'; envFiles=@('C:\Users\tempv2\HypnoApp\.env');
    extraHeaders=@{ 'HTTP-Referer'='https://localhost'; 'X-Title'='V3SecondBrain' }
  }
  deepseek = @{
    kind='openai'; endpoint='https://api.deepseek.com/chat/completions'; model='deepseek-chat';
    keyName='DEEPSEEK_API_KEY'; envFiles=@('C:\Users\tempv2\AgenticScrape\.env','C:\Users\tempv2\CryptoFundSignal\.env')
  }
  anthropic = @{
    kind='anthropic'; endpoint='https://api.anthropic.com/v1/messages'; model='claude-sonnet-4-6';
    keyName='ANTHROPIC_API_KEY'; envFiles=@('C:\Users\tempv2\HypnoApp\.env')
  }
}

function Get-EnvKey {
  param([string[]]$EnvFiles,[string]$Name)
  foreach($f in $EnvFiles){
    if(Test-Path $f){
      foreach($line in (Get-Content $f -ErrorAction SilentlyContinue)){
        if($line -match ('^\s*'+[regex]::Escape($Name)+'\s*=\s*(.+?)\s*$')){ return $matches[1].Trim('"').Trim("'") }
      }
    }
  }
  return $null
}

function Test-Provider {
  param([string]$Name)
  $cfg = $script:PROVIDERS[$Name]
  if(-not $cfg){ return $false }
  if($cfg.kind -eq 'ollama'){
    try {
      $tags = Invoke-RestMethod -Uri 'http://localhost:11434/api/tags' -TimeoutSec 4
      $have = @($tags.models | ForEach-Object { $_.name })
      if($have -and ($have -notcontains $cfg.model)){
        # accept any close match (e.g. qwen2.5:7b-instruct-q4); else pick first available
        $alt = $have | Where-Object { $_ -like ($cfg.model.Split(':')[0] + '*') } | Select-Object -First 1
        if($alt){ $cfg.model = $alt } else { $cfg.model = $have[0] }
      }
      return $true
    } catch { return $false }
  }
  $key = Get-EnvKey $cfg.envFiles $cfg.keyName
  return [bool]$key
}

function Router-Log {
  param([string]$LogPath,[string]$Msg)
  if($LogPath){ try { Add-Content -Path $LogPath -Value $Msg } catch {} }
}

function Invoke-OneProvider {
  param([string]$Name,[array]$Messages,[int]$MaxTokens,[double]$Temperature,[bool]$Json)
  $cfg = $script:PROVIDERS[$Name]
  $bytesEnc = [System.Text.Encoding]::UTF8

  if($cfg.kind -eq 'ollama'){
    $body = @{ model=$cfg.model; messages=$Messages; stream=$false; options=@{ temperature=$Temperature; num_predict=$MaxTokens } }
    if($Json){ $body.format='json' }
    $reqText = $body | ConvertTo-Json -Depth 10 -Compress
    $resp = Invoke-RestMethod -Uri $cfg.endpoint -Method Post -ContentType 'application/json' -Body ($bytesEnc.GetBytes($reqText)) -TimeoutSec 300
    return [string]$resp.message.content
  }
  elseif($cfg.kind -eq 'openai'){
    $key = Get-EnvKey $cfg.envFiles $cfg.keyName
    if(-not $key){ throw "no key for $Name" }
    $body = @{ model=$cfg.model; messages=$Messages; temperature=$Temperature; max_tokens=$MaxTokens }
    if($Json){ $body.response_format=@{ type='json_object' } }
    $reqText = $body | ConvertTo-Json -Depth 10 -Compress
    $headers = @{ 'Authorization'="Bearer $key"; 'Content-Type'='application/json' }
    if($cfg.extraHeaders){ foreach($k in $cfg.extraHeaders.Keys){ $headers[$k]=$cfg.extraHeaders[$k] } }
    $resp = Invoke-RestMethod -Uri $cfg.endpoint -Method Post -Headers $headers -Body ($bytesEnc.GetBytes($reqText)) -TimeoutSec 240
    if(-not $resp.choices){ throw "no choices" }
    return [string]@($resp.choices)[0].message.content
  }
  elseif($cfg.kind -eq 'anthropic'){
    $key = Get-EnvKey $cfg.envFiles $cfg.keyName
    if(-not $key){ throw "no key for $Name" }
    # Anthropic messages API: system is a top-level param; only user/assistant go in messages.
    $sys = (@($Messages | Where-Object { $_.role -eq 'system' } | ForEach-Object { $_.content }) -join "`n`n")
    $conv = @($Messages | Where-Object { $_.role -ne 'system' } | ForEach-Object { @{ role=$_.role; content=$_.content } })
    if($Json){ $sys = ($sys + "`n`nRespond with a single valid JSON object only. No prose, no code fences.").Trim() }
    $body = @{ model=$cfg.model; max_tokens=$MaxTokens; temperature=$Temperature; messages=$conv }
    if($sys){ $body.system=$sys }
    $reqText = $body | ConvertTo-Json -Depth 10 -Compress
    $headers = @{ 'x-api-key'=$key; 'anthropic-version'='2023-06-01'; 'Content-Type'='application/json' }
    $resp = Invoke-RestMethod -Uri $cfg.endpoint -Method Post -Headers $headers -Body ($bytesEnc.GetBytes($reqText)) -TimeoutSec 240
    return [string]@($resp.content)[0].text
  }
  throw "unknown provider kind for $Name"
}

function Invoke-LLMRouted {
  param(
    [string[]]$Providers,
    [array]$Messages,
    [int]$MaxTokens=8000,
    [double]$Temperature=0.2,
    [switch]$Json,
    [scriptblock]$Validate,
    [string]$LogPath,
    [int]$Retries=3
  )
  foreach($p in $Providers){
    if(-not $script:PROVIDERS.ContainsKey($p)){ Router-Log $LogPath "  route: unknown provider '$p' - skip"; continue }
    if(-not (Test-Provider $p)){ Router-Log $LogPath "  route: $p unavailable (down or no key) - skip"; continue }
    for($try=1; $try -le $Retries; $try++){
      try {
        $text = Invoke-OneProvider $p $Messages $MaxTokens $Temperature $Json.IsPresent
        $clean = $text -replace '^\s*```(json)?\s*','' -replace '\s*```\s*$',''
        if($Validate -and -not (& $Validate $clean)){ Router-Log $LogPath "  route: $p returned output failing validation (try $try) - fallback"; break }
        Router-Log $LogPath "  route: served by $p (model $($script:PROVIDERS[$p].model))"
        return @{ ok=$true; provider=$p; model=$script:PROVIDERS[$p].model; text=$clean }
      } catch {
        $status = 0; try { $status = [int]$_.Exception.Response.StatusCode } catch {}
        if($status -eq 429 -and $try -lt $Retries){ Start-Sleep -Seconds ([Math]::Min(60, 8*$try) + (Get-Random -Minimum 0 -Maximum 6)); continue }
        Router-Log $LogPath "  route: $p error (try $try, http $status): $(($_.Exception.Message -replace '\s+',' '))"
        if($try -lt $Retries -and $status -ge 500){ Start-Sleep -Seconds (2*$try); continue }
        break
      }
    }
  }
  Router-Log $LogPath "  route: ALL providers exhausted - no result"
  return @{ ok=$false; provider=$null; model=$null; text=$null }
}

# Policy helper: GLM-first, Ollama for easy (short) docs, Sonnet as final escalation.
function Get-ProviderOrder {
  param([double]$Kb, [double]$EasyKb=6.0)
  if($Kb -le $EasyKb){ return @('ollama','glm','openrouter','anthropic') }
  else                { return @('glm','openrouter','deepseek','anthropic') }
}

function Get-RouterHealth {
  $rows = @()
  foreach($name in @('ollama','glm','openrouter','deepseek','anthropic')){
    $ok = $false; try { $ok = Test-Provider $name } catch {}
    $rows += [pscustomobject]@{ provider=$name; kind=$script:PROVIDERS[$name].kind; model=$script:PROVIDERS[$name].model; available=$ok }
  }
  return $rows
}
