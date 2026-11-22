Set-Location "f:\CSE Department Website Project"
$out = npm run build --prefix frontend 2>&1
$exit = $LASTEXITCODE
$out | Select-Object -Last 6
Write-Output "BUILD_EXIT=$exit"
if ($exit -eq 0) {
  git add -A "frontend/src/app/(admin)/admin/faculty/page.tsx"
  git add -A "frontend/src/app/(public)/faculty/ex_chairman/page.tsx"
  git status --short
  git commit -m "feat: Chairman sub-filters (Running/Ex Chairman), ex_chairman public page shows only former"
  git push origin main
  Write-Output "PUSHED"
} else { Write-Output "BUILD FAILED" }
