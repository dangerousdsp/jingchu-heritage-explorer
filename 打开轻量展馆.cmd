@echo off
cd /d "%~dp0"
node scripts/serve-node.mjs --open --page "museum.html?exhibit=chime"
if errorlevel 1 pause
