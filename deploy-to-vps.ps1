# Script deploy code lên VPS

Write-Host "🚀 Deploying to VPS..." -ForegroundColor Cyan

# 1. Push code lên GitHub
Write-Host "`n📤 Step 1: Pushing to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "feat: Add POST /orders API with wallet deduction and documentation"
git push origin master

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Pushed to GitHub successfully!" -ForegroundColor Green

# 2. Deploy trên VPS
Write-Host "`n🔄 Step 2: Deploying on VPS..." -ForegroundColor Yellow
Write-Host "Please run these commands on VPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "ssh root@103.6.234.20" -ForegroundColor White
Write-Host "cd /var/www/savore/BE" -ForegroundColor White
Write-Host "git pull origin master" -ForegroundColor White
Write-Host "npm install" -ForegroundColor White
Write-Host "npm run build" -ForegroundColor White
Write-Host "pm2 restart all" -ForegroundColor White
Write-Host "pm2 logs --lines 50" -ForegroundColor White
Write-Host ""

Write-Host "✅ Local deployment completed!" -ForegroundColor Green
Write-Host "💡 Now SSH to VPS and run the commands above" -ForegroundColor Cyan
