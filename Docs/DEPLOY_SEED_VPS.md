# 🚀 DEPLOY VPS - SEED 19 USERS

## ✅ ĐÃ PUSH LÊN GITHUB

Code đã được push lên: `https://github.com/poilioma1234/savore`

---

## 📋 BƯỚC 1: SSH VÀO VPS

```bash
ssh root@103.6.234.20
```

---

## 📋 BƯỚC 2: PULL CODE MỚI

```bash
cd /var/www/savore/BE

# Pull code mới
git pull origin main

# Nếu branch là master
git pull origin master
```

---

## 📋 BƯỚC 3: INSTALL DEPENDENCIES

```bash
npm install
```

---

## 📋 BƯỚC 4: RUN MIGRATIONS

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

---

## 📋 BƯỚC 5: SEED DATABASE

### **Option 1: Seed 19 users (KHUYÊN DÙNG)**

```bash
node prisma/seed-users.mjs
```

**Kết quả:**
- 1 Admin
- 5 Suppliers
- 5 Users
- 5 Creators
- 3 Multi-role users ⭐

### **Option 2: Reset database và seed lại**

```bash
npx prisma migrate reset --force
# Sau đó chạy
node prisma/seed-users.mjs
```

---

## 📋 BƯỚC 6: BUILD & RESTART

```bash
# Build
npm run build

# Restart PM2
pm2 restart savore-api

# Xem logs
pm2 logs savore-api --lines 30
```

---

## 🧪 BƯỚC 7: TEST

### **Test login với multi-role user:**

```bash
curl -X POST http://103.6.234.20:3018/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hybrid1@savore.com",
    "password": "hybrid123"
  }'
```

**Response sẽ có:**
```json
{
  "accessToken": "...",
  "user": {
    "id": 17,
    "email": "hybrid1@savore.com",
    "fullName": "Nguyễn Minh Tâm",
    "roles": ["USER", "CREATOR"]
  }
}
```

---

## 📝 SCRIPT TỰ ĐỘNG (KHUYÊN DÙNG)

### **Tạo file deploy-seed.sh:**

```bash
nano /var/www/savore/BE/deploy-seed.sh
```

**Nội dung:**

```bash
#!/bin/bash

echo "🚀 Deploying with seed..."

# Pull code
git pull origin master

# Install
npm install

# Generate Prisma
npx prisma generate

# Migrate
npx prisma migrate deploy

# Seed users
node prisma/seed-users.mjs

# Build
npm run build

# Restart
pm2 restart savore-api

# Logs
pm2 logs savore-api --lines 20

echo "✅ Done!"
```

**Chmod:**
```bash
chmod +x /var/www/savore/BE/deploy-seed.sh
```

**Chạy:**
```bash
./deploy-seed.sh
```

---

## ⚠️ LƯU Ý

### **Nếu database đã có data:**

Seed script sử dụng `upsert`, nên:
- ✅ Nếu user đã tồn tại → Không tạo lại
- ✅ Nếu user chưa tồn tại → Tạo mới

### **Nếu muốn reset hoàn toàn:**

```bash
npx prisma migrate reset --force
node prisma/seed-users.mjs
```

⚠️ **Cảnh báo:** Lệnh này sẽ **XÓA TẤT CẢ DATA** trong database!

---

## 📊 KIỂM TRA KẾT QUẢ

### **Xem tất cả users:**

```bash
curl -X POST http://103.6.234.20:3018/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@savore.com","password":"admin123"}' \
  | jq -r '.accessToken'

# Copy token, sau đó:
curl -X GET "http://103.6.234.20:3018/admin/users?limit=20" \
  -H "Authorization: Bearer {token}"
```

**Kết quả:** Sẽ thấy 19 users

---

## 🎯 TEST MULTI-ROLE

### **Test hybrid1 (USER + CREATOR):**

```bash
# 1. Login
curl -X POST http://103.6.234.20:3018/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hybrid1@savore.com","password":"hybrid123"}'

# 2. Tạo post (vì có role CREATOR)
curl -X POST http://103.6.234.20:3018/posts \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Post",
    "linkVideo": "https://youtube.com/watch?v=test",
    "cookingSteps": ["Bước 1", "Bước 2"],
    "recipeItems": []
  }'

# 3. Like post (vì có role USER)
curl -X POST http://103.6.234.20:3018/likes \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"postId": "{post_id}"}'
```

---

## 📚 TÀI LIỆU THAM KHẢO

- `Docs/ACCOUNTS_QUICK_REF.md` - Danh sách accounts
- `Docs/TEST_USERS.md` - Chi tiết 19 users
- `Docs/POST_STRUCTURE.md` - Cấu trúc Post

---

## ✅ CHECKLIST

- [ ] SSH vào VPS
- [ ] Pull code mới
- [ ] npm install
- [ ] npx prisma generate
- [ ] npx prisma migrate deploy
- [ ] node prisma/seed-users.mjs
- [ ] npm run build
- [ ] pm2 restart savore-api
- [ ] Test API

---

**Chúc deploy thành công!** 🎉
