# 🚀 DEPLOY SCRIPT - WINDOWS

## Chạy script này mỗi khi muốn deploy code lên VPS

# Pull changes từ remote trước
Write-Host "📥 Pulling latest changes from GitHub..." -ForegroundColor Yellow
git pull origin main --rebase

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Pull failed! Resolving conflicts..." -ForegroundColor Red
    Write-Host "Please resolve conflicts manually, then run:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor Cyan
    Write-Host "  git rebase --continue" -ForegroundColor Cyan
    Write-Host "  .\deploy.ps1" -ForegroundColor Cyan
    exit 1
}

# Add all changes
Write-Host "📦 Adding changes..." -ForegroundColor Yellow
git add .

# Commit
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host "💾 Committing: $commitMessage" -ForegroundColor Yellow
git commit -m "$commitMessage"

# Push
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code pushed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps on VPS:" -ForegroundColor Cyan
    Write-Host "  cd /var/www/savore/BE" -ForegroundColor White
    Write-Host "  git pull origin main" -ForegroundColor White
    Write-Host "  npm install" -ForegroundColor White
    Write-Host "  npm run build" -ForegroundColor White
    Write-Host "  pm2 restart savore-api" -ForegroundColor White
} else {
    Write-Host "❌ Push failed!" -ForegroundColor Red
}
