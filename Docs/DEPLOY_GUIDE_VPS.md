# 🚀 HƯỚNG DẪN DEPLOY CODE LÊN VPS

**Version:** 1.0  
**Last Updated:** 2025-12-26

---

## 📋 WORKFLOW TỔNG QUAN

```
LOCAL (Windows)
  ↓ git push
GITHUB (poilioma1234/savore hoặc OyamaGust/Savore)
  ↓ git pull
VPS (103.6.234.20)
  ↓ npm run build
  ↓ pm2 restart
DEPLOYED ✅
```

---

## BƯỚC 1: PUSH CODE TỪ LOCAL LÊN GITHUB

### **1.1. Kiểm tra remote hiện tại:**

```bash
cd C:\Users\TNWan\Downloads\TEST_DB2\Savore-init-database\Savore-init-database

git remote -v
```

**Output:**
```
company https://github.com/OyamaGust/Savore.git (fetch)
company https://github.com/OyamaGust/Savore.git (push)
origin  https://github.com/poilioma1234/savore.git (fetch)
origin  https://github.com/poilioma1234/savore.git (push)
```

### **1.2. Chọn repo để push:**

**Option A: Push lên repo công ty (OyamaGust/Savore)**
```bash
git add .
git commit -m "feat: Add POST /orders API with wallet payment (5% commission)"
git push company master:main
```

**Option B: Push lên repo cũ (poilioma1234/savore)**
```bash
# Cần có quyền push vào repo này
git add .
git commit -m "feat: Add POST /orders API with wallet payment (5% commission)"
git push origin master
```

**Khuyến nghị:** Dùng Option A (push lên company) nếu VPS có thể pull từ đó.

---

## BƯỚC 2: SSH VÀO VPS

### **2.1. Kết nối SSH:**

```bash
ssh root@103.6.234.20
```

Hoặc nếu dùng user khác:
```bash
ssh your-username@103.6.234.20
```

### **2.2. Di chuyển vào thư mục dự án:**

```bash
cd /var/www/savore
```

Hoặc:
```bash
cd /root/Savore-init-database
```

**Kiểm tra đường dẫn:**
```bash
pwd
ls -la
```

---

## BƯỚC 3: PULL CODE MỚI TỪ GITHUB

### **3.1. Kiểm tra remote trên VPS:**

```bash
git remote -v
```

### **3.2. Pull code:**

**Nếu VPS pull từ origin (poilioma1234):**
```bash
git pull origin master
```

**Nếu VPS pull từ company (OyamaGust):**
```bash
git pull origin main
```

**Nếu có conflict:**
```bash
# Xem files conflict
git status

# Giữ code mới từ GitHub
git checkout --theirs .
git add .
git commit -m "Merge from GitHub"
```

---

## BƯỚC 4: CÀI ĐẶT DEPENDENCIES MỚI

### **4.1. Di chuyển vào thư mục BE:**

```bash
cd BE
```

### **4.2. Cài đặt packages mới:**

```bash
npm install
```

**Lưu ý:** Chỉ cần chạy nếu có thêm packages mới trong `package.json`.

---

## BƯỚC 5: BUILD CODE

### **5.1. Build production:**

```bash
npm run build
```

**Output mong đợi:**
```
> nest build

✔ Successfully compiled
```

### **5.2. Kiểm tra thư mục dist:**

```bash
ls -la dist/
```

Phải thấy các file `.js` đã được compile.

---

## BƯỚC 6: RESTART SERVER

### **6.1. Nếu dùng PM2:**

```bash
# Xem danh sách processes
pm2 list

# Restart tất cả
pm2 restart all

# Hoặc restart từng process
pm2 restart 0
pm2 restart 1
```

### **6.2. Nếu dùng systemd:**

```bash
sudo systemctl restart savore-be
sudo systemctl status savore-be
```

### **6.3. Nếu chạy thủ công:**

```bash
# Stop process hiện tại (Ctrl+C)
# Rồi chạy lại:
npm run start:prod
```

---

## BƯỚC 7: KIỂM TRA LOGS

### **7.1. Xem logs PM2:**

```bash
pm2 logs --lines 50
```

Hoặc xem logs real-time:
```bash
pm2 logs
```

### **7.2. Kiểm tra server đã chạy:**

```bash
curl http://localhost:3003/
```

**Output mong đợi:**
```json
{"message":"Savore API is running!"}
```

---

## BƯỚC 8: TEST API

### **8.1. Test từ VPS:**

```bash
# Test GET posts
curl http://localhost:3003/posts?page=1&limit=3

# Test GET tags
curl http://localhost:3003/tags
```

### **8.2. Test từ Postman:**

```
GET http://103.6.234.20:3003/posts?page=1&limit=5
GET http://103.6.234.20:3003/tags
```

### **8.3. Test Swagger UI:**

Mở browser:
```
http://103.6.234.20:3003/api
```

Kiểm tra xem có endpoint `/orders` (POST) không.

---

## 🔧 TROUBLESHOOTING

### **Lỗi 1: "Permission denied" khi git pull**

```bash
# Giải pháp: Xin quyền hoặc dùng HTTPS với token
git remote set-url origin https://YOUR_TOKEN@github.com/poilioma1234/savore.git
git pull origin master
```

### **Lỗi 2: "npm install" failed**

```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài lại
npm install
```

### **Lỗi 3: "Build failed"**

```bash
# Xem chi tiết lỗi
npm run build

# Kiểm tra TypeScript errors
npx tsc --noEmit
```

### **Lỗi 4: PM2 không restart**

```bash
# Stop và start lại
pm2 stop all
pm2 start npm --name "savore-api" -- run start:prod

# Hoặc delete và start mới
pm2 delete all
pm2 start npm --name "savore-api" -- run start:prod
```

### **Lỗi 5: Port 3003 đã được dùng**

```bash
# Tìm process đang dùng port
lsof -i :3003

# Kill process
kill -9 <PID>

# Hoặc restart PM2
pm2 restart all
```

---

## 📝 SCRIPT TỰ ĐỘNG (Khuyến nghị)

### **Tạo file deploy.sh trên VPS:**

```bash
nano /var/www/savore/deploy.sh
```

**Nội dung:**
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Pull code
echo "📥 Pulling from GitHub..."
git pull origin master

# Install dependencies
echo "📦 Installing dependencies..."
cd BE
npm install

# Build
echo "🔨 Building..."
npm run build

# Restart PM2
echo "🔄 Restarting server..."
pm2 restart all

# Show logs
echo "📋 Server logs:"
pm2 logs --lines 20

echo "✅ Deployment completed!"
```

**Cho phép execute:**
```bash
chmod +x /var/www/savore/deploy.sh
```

**Chạy script:**
```bash
cd /var/www/savore
./deploy.sh
```

---

## ✅ CHECKLIST DEPLOY

- [ ] Local: git add, commit, push lên GitHub
- [ ] VPS: SSH vào server
- [ ] VPS: cd vào thư mục dự án
- [ ] VPS: git pull từ GitHub
- [ ] VPS: npm install (nếu có dependencies mới)
- [ ] VPS: npm run build
- [ ] VPS: pm2 restart all
- [ ] VPS: pm2 logs --lines 50 (kiểm tra logs)
- [ ] Test: curl http://localhost:3003/
- [ ] Test: Postman http://103.6.234.20:3003/api
- [ ] Verify: Swagger UI có endpoint mới

---

## 🎯 WORKFLOW NHANH

### **Trên LOCAL:**
```bash
git add .
git commit -m "Your commit message"
git push company master:main
```

### **Trên VPS:**
```bash
ssh root@103.6.234.20
cd /var/www/savore/BE
git pull origin main
npm install
npm run build
pm2 restart all
pm2 logs --lines 50
```

---

## 📞 LIÊN HỆ HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra logs: `pm2 logs`
2. Kiểm tra build errors: `npm run build`
3. Kiểm tra Git status: `git status`
4. Liên hệ Backend Team

---

**Last Updated:** 2025-12-26  
**VPS:** 103.6.234.20:3003  
**Author:** Backend Team
