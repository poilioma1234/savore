# Script để resolve conflicts tự động

Write-Host "🔧 Resolving merge conflicts..." -ForegroundColor Cyan

# Giữ code BE của bạn (ours)
Write-Host "`n📝 Keeping your BE code..." -ForegroundColor Yellow
git checkout --ours BE/prisma/schema.prisma
git checkout --ours BE/prisma/seed.mjs
git checkout --ours BE/src/ingredients/dto/create-ingredient.dto.ts
git checkout --ours BE/src/posts/dto/create-post.dto.ts
git checkout --ours BE/src/posts/posts.controller.ts
git checkout --ours BE/src/posts/posts.service.ts
git checkout --ours BE/src/admin/admin.controller.ts
git checkout --ours BE/src/admin/admin.service.ts
git checkout --ours BE/src/app.module.ts
git checkout --ours BE/prisma/migrations/migration_lock.toml

# Giữ code FE của team (theirs)
Write-Host "`n📱 Keeping team's FE code..." -ForegroundColor Yellow
git checkout --theirs FE/frontend/src/App.tsx
git checkout --theirs FE/frontend/src/components/layout/MainHeader.tsx
git checkout --theirs FE/frontend/src/config/api.ts
git checkout --theirs FE/frontend/src/pages/HomePage.tsx
git checkout --theirs FE/frontend/src/pages/VideoPage.tsx

# Add và commit
Write-Host "`n✅ Adding and committing..." -ForegroundColor Yellow
git add .
git commit -m "Merge company repo: Keep BE updates (pricePerKg, seed files), keep FE from team"

# Push
Write-Host "`n📤 Pushing to company repo..." -ForegroundColor Yellow
git push company main

Write-Host "`n✅ Successfully merged and pushed!" -ForegroundColor Green
Write-Host "🔗 Check: https://github.com/OyamaGust/Savore" -ForegroundColor Cyan
