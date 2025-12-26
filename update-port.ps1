# Script to update port from 3018 to 3003 in all documentation files

Write-Host "🔧 Updating port from 3018 to 3003 in all documentation files..." -ForegroundColor Cyan

$docsPath = "Docs"
$files = Get-ChildItem -Path $docsPath -Filter "*.md" -Recurse

$totalFiles = 0
$updatedFiles = 0

foreach ($file in $files) {
    $totalFiles++
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    if ($content -match "103\.6\.234\.20:3018") {
        $newContent = $content -replace "103\.6\.234\.20:3018", "103.6.234.20:3003"
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "  ✅ Updated: $($file.Name)" -ForegroundColor Green
        $updatedFiles++
    } else {
        Write-Host "  ⏭️  Skipped: $($file.Name) (no changes needed)" -ForegroundColor Gray
    }
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "  Total files scanned: $totalFiles" -ForegroundColor White
Write-Host "  Files updated: $updatedFiles" -ForegroundColor Green
Write-Host "`n✅ Port update completed!" -ForegroundColor Green
