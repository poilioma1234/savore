# Script để xóa posts cũ và seed lại trên VPS

Write-Host "🚀 Deploying posts to VPS..." -ForegroundColor Cyan

# VPS credentials
$vpsHost = "103.6.234.20"
$vpsUser = "root"  # Hoặc user của bạn
$vpsPath = "/root/Savore-init-database/BE"  # Đường dẫn trên VPS

Write-Host "`n📤 Step 1: Upload seed files to VPS..." -ForegroundColor Yellow

# Upload clear-posts.mjs
scp prisma/clear-posts.mjs ${vpsUser}@${vpsHost}:${vpsPath}/prisma/

# Upload seed-posts.mjs (nếu chưa có)
scp prisma/seed-posts.mjs ${vpsUser}@${vpsHost}:${vpsPath}/prisma/

Write-Host "`n🗑️  Step 2: Clear old posts on VPS..." -ForegroundColor Yellow

# SSH vào VPS và chạy clear-posts
ssh ${vpsUser}@${vpsHost} "cd ${vpsPath} && node prisma/clear-posts.mjs"

Write-Host "`n🌱 Step 3: Seed new posts on VPS..." -ForegroundColor Yellow

# SSH vào VPS và chạy seed-posts
ssh ${vpsUser}@${vpsHost} "cd ${vpsPath} && node prisma/seed-posts.mjs"

Write-Host "`n✅ Done! Posts deployed to VPS successfully!" -ForegroundColor Green
Write-Host "🔗 Test API: http://103.6.234.20:3003/posts?page=1&limit=5" -ForegroundColor Cyan
