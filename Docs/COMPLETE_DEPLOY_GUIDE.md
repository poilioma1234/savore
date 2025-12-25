# 🚀 HƯỚNG DẪN HOÀN CHỈNH - PUSH CODE & ĐỒNG BỘ VPS

## ✅ BƯỚC 1: PUSH CODE VÀO REPO ĐÚNG

### **Trên Windows (localhost):**

```bash
cd C:\Users\TNWan\Downloads\TEST_DB2\Savore-init-database\Savore-init-database\BE

# 1. Cancel merge đang pending (nếu có)
git merge --abort

# 2. Đảm bảo remote đúng
git remote set-url origin https://github.com/poilioma1234/savore.git

# 3. Kiểm tra remote
git remote -v

# 4. Force push vào repo mới
git push origin main --force
```

---

## ✅ BƯỚC 2: ĐỒNG BỘ VPS VỚI LOCALHOST

### **SSH vào VPS:**

```bash
ssh root@103.6.234.20
```

### **Chạy các lệnh sau:**

```bash
# 1. Di chuyển vào thư mục BE
cd /var/www/savore/BE

# 2. Đổi remote URL sang repo mới
git remote set-url origin https://github.com/poilioma1234/savore.git

# 3. Kiểm tra remote
git remote -v

# 4. Backup code hiện tại (phòng hờ)
cp -r /var/www/savore/BE /var/www/savore/BE_backup_$(date +%Y%m%d_%H%M%S)

# 5. Force pull code mới từ repo
git fetch origin
git reset --hard origin/main

# 6. Install dependencies
npm install

# 7. Run migrations
npx prisma migrate deploy

# 8. Generate Prisma Client
npx prisma generate

# 9. Build
npm run build

# 10. Restart PM2
pm2 restart savore-api

# 11. Xem logs
pm2 logs savore-api --lines 30
```

---

## 📋 SCRIPT TỰ ĐỘNG CHO VPS:

### **Tạo file deploy.sh trên VPS:**

```bash
nano /var/www/savore/BE/deploy.sh
```

**Paste nội dung:**

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Đổi remote (chỉ chạy 1 lần)
git remote set-url origin https://github.com/poilioma1234/savore.git

# Pull code mới
echo "📥 Pulling latest code..."
git fetch origin
git reset --hard origin/main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run migrations
echo "🗄️  Running migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo "⚙️  Generating Prisma Client..."
npx prisma generate

# Build
echo "🔨 Building..."
npm run build

# Restart PM2
echo "♻️  Restarting server..."
pm2 restart savore-api

# Show logs
echo "📋 Showing logs..."
pm2 logs savore-api --lines 20

echo "✅ Deployment completed!"
```

**Chmod:**
```bash
chmod +x /var/www/savore/BE/deploy.sh
```

**Chạy:**
```bash
./deploy.sh
```

---

## 🎯 WORKFLOW SAU NÀY:

### **Khi có thay đổi code:**

**1. Trên Windows (localhost):**
```bash
cd C:\Users\TNWan\Downloads\TEST_DB2\Savore-init-database\Savore-init-database\BE

git add .
git commit -m "Your message"
git push origin main
```

**2. Trên VPS:**
```bash
cd /var/www/savore/BE
./deploy.sh
```

**Xong!** 🎉

---

## 📝 CHECKLIST:

### **Windows (localhost):**
- [ ] Cancel merge pending
- [ ] Set remote URL đúng
- [ ] Force push vào repo mới
- [ ] Verify trên GitHub

### **VPS:**
- [ ] SSH vào VPS
- [ ] Đổi remote URL
- [ ] Force pull code mới
- [ ] npm install
- [ ] npx prisma migrate deploy
- [ ] npx prisma generate
- [ ] npm run build
- [ ] pm2 restart savore-api
- [ ] Test API

---

## 🧪 TEST SAU KHI DEPLOY:

### **1. Test endpoint cũ:**
```
GET http://103.6.234.20:3018/posts
```

### **2. Test endpoint mới:**
```
PUT http://103.6.234.20:3018/admin/users/3/roles

Headers:
Authorization: Bearer {token}

Body:
{
  "roles": ["CREATOR"]
}
```

### **3. Xem Swagger:**
```
http://103.6.234.20:3018/api
```

---

## ⚠️ NẾU CÓ LỖI:

### **Xem logs:**
```bash
pm2 logs savore-api --lines 50
```

### **Restart lại:**
```bash
pm2 restart savore-api
```

### **Kiểm tra database:**
```bash
npx prisma studio
```

---

## 🎁 BONUS: AUTO DEPLOY SCRIPT (Windows)

Tạo file `quick-deploy.ps1` trên Windows:

```powershell
# Quick deploy script
Write-Host "🚀 Deploying to VPS..." -ForegroundColor Yellow

# Push code
git add .
$msg = Read-Host "Commit message"
git commit -m "$msg"
git push origin main

# SSH và deploy
Write-Host "📡 Connecting to VPS..." -ForegroundColor Yellow
ssh root@103.6.234.20 "cd /var/www/savore/BE && ./deploy.sh"

Write-Host "✅ Done!" -ForegroundColor Green
```

**Sử dụng:**
```powershell
.\quick-deploy.ps1
```

---

**Bắt đầu từ BƯỚC 1 nhé!** 😊
