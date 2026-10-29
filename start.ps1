param([int]$Port = 8767, [string]$RuntimeDir = '')
$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$bundledPython = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$pythonCandidates = @($bundledPython)
$realPython = Get-Command python.exe -ErrorAction SilentlyContinue
if ($realPython -and $realPython.Source -notmatch 'WindowsApps') { $pythonCandidates += $realPython.Source }
$chosenPython = $pythonCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
$serverArgs = @((Join-Path $projectRoot 'scripts\serve.py'), '--port', $Port, '--open')
if ($RuntimeDir) { $serverArgs += @('--runtime-dir', $RuntimeDir) }
if ($chosenPython) { & $chosenPython @serverArgs }
elseif (Get-Command py.exe -ErrorAction SilentlyContinue) { & py.exe -3 @serverArgs }
else { throw 'Python 3.10+ is required. This computer can use the Python bundled with Codex; Unity is not needed.' }
if ($LASTEXITCODE) { exit $LASTEXITCODE }
