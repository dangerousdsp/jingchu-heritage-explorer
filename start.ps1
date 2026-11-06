param([int]$Port = 8767)
$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$pythonCandidates = @((Join-Path $projectRoot '.venv\Scripts\python.exe'))
$realPython = Get-Command python.exe -ErrorAction SilentlyContinue
if ($realPython -and $realPython.Source -notmatch 'WindowsApps') { $pythonCandidates += $realPython.Source }
$chosenPython = $pythonCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
$serverArgs = @((Join-Path $projectRoot 'scripts\serve.py'), '--port', $Port, '--open')
if ($chosenPython) { & $chosenPython @serverArgs }
elseif (Get-Command py.exe -ErrorAction SilentlyContinue) { & py.exe -3 @serverArgs }
elseif (Get-Command node.exe -ErrorAction SilentlyContinue) { $nodeArgs = @((Join-Path $projectRoot 'scripts\serve-node.mjs'), '--port', $Port, '--open'); & node.exe @nodeArgs }
else { throw 'Node.js 18+ or Python 3.10+ is required.' }
if ($LASTEXITCODE) { exit $LASTEXITCODE }
