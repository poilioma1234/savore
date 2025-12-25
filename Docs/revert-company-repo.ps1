# 🚨 SCRIPT KHÔI PHỤC REPO CÔNG TY

Write-Host "🚨 KHÔI PHỤC REPO CÔNG TY - OyamaGust/Savore" -ForegroundColor Red
Write-Host ""

# Tạo thư mục tạm
$tempDir = "C:\Users\TNWan\Downloads\CompanyRepoFix"
Write-Host "📁 Creating temp directory: $tempDir" -ForegroundColor Yellow

if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Clone repo công ty
Write-Host "📥 Cloning company repo..." -ForegroundColor Yellow
cd $tempDir
git clone https://github.com/OyamaGust/Savore.git

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Clone failed!" -ForegroundColor Red
    exit 1
}

cd Savore

# Xem commits hiện tại
Write-Host ""
Write-Host "📋 Current commits:" -ForegroundColor Cyan
git log --oneline -n 5

Write-Host ""
Write-Host "⚠️  Sẽ reset về commit: 0d005ca (Update BE: Latest backend changes)" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Bạn có chắc muốn XÓA 2 commits nhầm? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "❌ Cancelled!" -ForegroundColor Red
    exit 0
}

# Reset về commit trước khi push nhầm
Write-Host ""
Write-Host "🔄 Resetting to commit 0d005ca..." -ForegroundColor Yellow
git reset --hard 0d005ca

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Reset failed!" -ForegroundColor Red
    exit 1
}

# Force push
Write-Host ""
Write-Host "🚀 Force pushing to remove wrong commits..." -ForegroundColor Yellow
git push origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ KHÔI PHỤC THÀNH CÔNG!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Commits sau khi khôi phục:" -ForegroundColor Cyan
    git log --oneline -n 5
    Write-Host ""
    Write-Host "⚠️  LƯU Ý:" -ForegroundColor Yellow
    Write-Host "  - Kiểm tra lại trên GitHub: https://github.com/OyamaGust/Savore/commits/main" -ForegroundColor White
    Write-Host "  - Thông báo team pull lại: git pull origin main --force" -ForegroundColor White
}
else {
    Write-Host ""
    Write-Host "❌ Force push failed!" -ForegroundColor Red
    Write-Host "Có thể bạn không có quyền force push." -ForegroundColor Yellow
    Write-Host "Liên hệ admin repo để được hỗ trợ." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📁 Temp directory: $tempDir" -ForegroundColor Cyan
Write-Host "Bạn có thể xóa thư mục này sau khi xác nhận." -ForegroundColor Cyan
