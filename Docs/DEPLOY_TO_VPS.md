# ⚡ HƯỚNG DẪN DEPLOY LÊN VPS

## ✅ BƯỚC 1: CODE ĐÃ PUSH LÊN GITHUB

Code đã được push thành công! ✅

---

## 🚀 BƯỚC 2: DEPLOY LÊN VPS

### **SSH vào VPS:**
```bash
ssh root@103.6.234.20
```

### **Chạy các lệnh sau:**

```bash
# 1. Di chuyển vào thư mục BE
cd /var/www/savore/BE

# 2. Pull code mới từ GitHub
git pull origin main

# 3. Install dependencies (nếu có package mới)
npm install

# 4. Chạy migrations (nếu có thay đổi database)
npx prisma migrate deploy

# 5. Generate Prisma Client
npx prisma generate

# 6. Build code
npm run build

# 7. Restart PM2
pm2 restart savore-api

# 8. Xem logs để kiểm tra
pm2 logs savore-api --lines 30
```

---

## 🎯 HOẶC DÙNG SCRIPT TỰ ĐỘNG:

### **Tạo file deploy.sh trên VPS:**

```bash
nano /var/www/savore/BE/deploy.sh
```

**Paste nội dung:**

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Pull code
echo "📥 Pulling latest code..."
git pull origin main

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

## 📋 CHECKLIST:

- [x] ✅ Git push từ Windows
- [ ] SSH vào VPS
- [ ] Git pull
- [ ] npm install
- [ ] npx prisma migrate deploy
- [ ] npx prisma generate
- [ ] npm run build
- [ ] pm2 restart savore-api
- [ ] Test API

---

## 🧪 TEST SAU KHI DEPLOY:

### **1. Test endpoint mới:**
```
PUT http://103.6.234.20:3003/admin/users/3/roles

Headers:
Authorization: Bearer {token}

Body:
{
  "roles": ["CREATOR"]
}
```

### **2. Xem Swagger:**
```
http://103.6.234.20:3003/api
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

### **Xem status:**
```bash
pm2 status
```

---

**Bây giờ SSH vào VPS và chạy lệnh deploy nhé!** 🚀
