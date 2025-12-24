# 🚀 Hướng Dẫn Deploy Backend Lên VPS

## 📋 Thông tin VPS

- **IP:** 103.6.234.20
- **User:** root
- **Path:** /var/www/LINHTINH3/BE

---

## 🔧 Cách 1: Dùng Script Tự Động (Khuyến nghị)

### Bước 1: Chạy script deploy

```powershell
.\deploy-manual.ps1
```

Script sẽ tự động:
1. ✅ Copy code (bỏ qua node_modules, dist)
2. ✅ Upload lên VPS
3. ✅ Install dependencies
4. ✅ Reset database
5. ✅ Seed dữ liệu mẫu
6. ✅ Restart backend service

### Bước 2: Nhập password khi được yêu cầu

Script sẽ hỏi password VPS 2 lần:
- Lần 1: Khi upload code
- Lần 2: Khi chạy lệnh trên VPS

---

## 🛠️ Cách 2: Deploy Thủ Công

### Bước 1: Upload code lên VPS

```powershell
# Tạo file zip (không bao gồm node_modules)
Compress-Archive -Path .\* -DestinationPath savore-backend.zip -Force

# Upload lên VPS
scp savore-backend.zip root@103.6.234.20:/tmp/
```

### Bước 2: SSH vào VPS

```powershell
ssh root@103.6.234.20
```

### Bước 3: Giải nén và deploy

```bash
cd /var/www/LINHTINH3/BE

# Backup code cũ (optional)
cp -r /var/www/LINHTINH3/BE /var/www/LINHTINH3/BE.backup

# Giải nén code mới
unzip -o /tmp/savore-backend.zip -d /var/www/LINHTINH3/BE/

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Reset database
npx prisma migrate reset --force

# Seed dữ liệu
npm run seed

# Restart service
pm2 restart savore-backend
# Hoặc nếu chưa có:
pm2 start npm --name savore-backend -- start

# Xem status
pm2 status
pm2 logs savore-backend
```

---

## 🗄️ Chỉ Reset Database (Không Deploy Code)

Nếu chỉ muốn reset database mà không deploy code mới:

```powershell
ssh root@103.6.234.20 "cd /var/www/LINHTINH3/BE && npx prisma migrate reset --force && npm run seed && pm2 restart savore-backend"
```

---

## 🔍 Kiểm Tra Sau Deploy

### 1. Kiểm tra service đang chạy

```bash
pm2 status
```

### 2. Xem logs

```bash
pm2 logs savore-backend
```

### 3. Test API

```bash
curl http://103.6.234.20:3003
curl http://103.6.234.20:3003/api
```

### 4. Mở trình duyệt

- Backend: http://103.6.234.20:3003
- Swagger: http://103.6.234.20:3003/api

---

## ⚠️ Lưu Ý

### 1. File .env

File `.env` **KHÔNG** được upload tự động (để bảo mật).

Nếu có thay đổi trong `.env`, cần update thủ công trên VPS:

```bash
ssh root@103.6.234.20
cd /var/www/LINHTINH3/BE
nano .env
# Sửa nội dung
# Ctrl+X, Y, Enter để lưu
pm2 restart savore-backend
```

### 2. Database sẽ bị XÓA

Lệnh `prisma migrate reset --force` sẽ:
- ❌ Xóa toàn bộ dữ liệu cũ
- ✅ Tạo lại database từ đầu
- ✅ Chạy seed để tạo dữ liệu mẫu

**Nếu muốn GIỮ dữ liệu cũ**, dùng migrate thay vì reset:

```bash
npx prisma migrate deploy
```

### 3. Port 3003

Đảm bảo port 3003 đã được mở trên firewall:

```bash
sudo ufw allow 3003
sudo ufw status
```

---

## 🐛 Troubleshooting

### Lỗi: "pm2 command not found"

```bash
npm install -g pm2
```

### Lỗi: "Database connection failed"

Kiểm tra `.env` file:

```bash
cat /var/www/LINHTINH3/BE/.env
```

Đảm bảo `DATABASE_URL` đúng.

### Lỗi: "Port 3003 already in use"

```bash
pm2 stop savore-backend
pm2 delete savore-backend
pm2 start npm --name savore-backend -- start
```

### Xem logs chi tiết

```bash
pm2 logs savore-backend --lines 100
```

---

## 📝 Workflow Thông Thường

1. **Phát triển local** → Test kỹ
2. **Chạy `.\deploy-manual.ps1`** → Deploy lên VPS
3. **Test trên VPS** → http://103.6.234.20:3003/api
4. **Thông báo cho team** → Backend đã update!

---

## 🎯 Quick Commands

```powershell
# Deploy toàn bộ (code + database reset)
.\deploy-manual.ps1

# Chỉ restart service
ssh root@103.6.234.20 "pm2 restart savore-backend"

# Xem logs
ssh root@103.6.234.20 "pm2 logs savore-backend --lines 50"

# Xem status
ssh root@103.6.234.20 "pm2 status"
```

---

✅ **Hoàn thành!** Backend của bạn đã sẵn sàng trên VPS! 🚀
