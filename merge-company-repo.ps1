# Script để merge code với repo công ty

Write-Host "🔄 Merging with company repository..." -ForegroundColor Cyan

# 1. Add remote công ty
Write-Host "`n📌 Step 1: Adding company remote..." -ForegroundColor Yellow
git remote add company https://github.com/OyamaGust/Savore.git

# Kiểm tra remote
git remote -v

# 2. Fetch code từ company
Write-Host "`n📥 Step 2: Fetching from company repo..." -ForegroundColor Yellow
git fetch company

# 3. Pull và merge
Write-Host "`n🔀 Step 3: Pulling and merging..." -ForegroundColor Yellow
git pull company main --allow-unrelated-histories

# Nếu có conflict, dừng lại
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n⚠️  CONFLICT DETECTED!" -ForegroundColor Red
    Write-Host "Please resolve conflicts manually:" -ForegroundColor Yellow
    Write-Host "  1. Open conflicted files" -ForegroundColor White
    Write-Host "  2. Resolve conflicts (choose which code to keep)" -ForegroundColor White
    Write-Host "  3. Run: git add ." -ForegroundColor White
    Write-Host "  4. Run: git commit -m 'Merge company main'" -ForegroundColor White
    Write-Host "  5. Run: git push company main" -ForegroundColor White
    exit 1
}

# 4. Push lên company repo
Write-Host "`n📤 Step 4: Pushing to company repo..." -ForegroundColor Yellow
git push company main

Write-Host "`n✅ Successfully merged and pushed to company repo!" -ForegroundColor Green
Write-Host "🔗 Check: https://github.com/OyamaGust/Savore" -ForegroundColor Cyan
