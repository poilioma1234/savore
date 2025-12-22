# 🚀 VPS DATABASE DEPLOYMENT - HOÀN TẤT

## ✅ **ĐÃ HOÀN THÀNH**

### 1. Database Migration
- ✅ Đã migrate 3 migrations lên VPS
- ✅ Tất cả tables đã được tạo thành công
- ✅ Relationships đã được thiết lập

### 2. Seed Data
- ✅ 4 roles: ADMIN, CREATOR, USER, SUPPLIER
- ✅ 4 test accounts với wallets
- ✅ Tất cả users đã sẵn sàng

---

## 🌐 **THÔNG TIN VPS**

### Database Connection:
```
Host: 103.6.234.20
Port: 5432
Database: savore_db
Username: savore_db
Password: savore_db
```

### Connection String:
```
postgres://savore_db:savore_db@103.6.234.20:5432/savore_db
```

---

## 👥 **TEST ACCOUNTS**

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@savore.com | admin123 |
| CREATOR | creator@savore.com | creator123 |
| USER | user@savore.com | user123 |
| SUPPLIER | supplier@savore.com | supplier123 |

---

## 📋 **DATABASE TABLES**

### Core Tables:
1. **users** - Người dùng (4 records)
2. **roles** - Vai trò (4 records)
3. **user_roles** - Liên kết user-role (4 records)
4. **wallets** - Ví tiền (4 records)

### Feature Tables:
5. **ingredients** - Nguyên liệu (UUID primary key)
6. **posts** - Bài đăng (UUID primary key)
7. **recipe_items** - Nguyên liệu trong công thức (UUID primary key)
8. **products** - Sản phẩm
9. **orders** - Đơn hàng
10. **order_items** - Chi tiết đơn hàng
11. **transactions** - Giao dịch
12. **commissions** - Hoa hồng

---

## 🔧 **BACKEND CONFIGURATION**

### .env File:
```env
DATABASE_URL="postgres://savore_db:savore_db@103.6.234.20:5432/savore_db"
JWT_SECRET=savore-super-secret-jwt-key-2025-change-in-production
JWT_EXPIRES_IN=7d
```

### Server Status:
- ✅ Backend running on: http://localhost:3000
- ✅ Connected to VPS database
- ✅ All APIs working

---

## 📚 **TÀI LIỆU**

### 1. CRUD_GUIDE.md
- Hướng dẫn đầy đủ tất cả APIs
- PowerShell examples
- Request/Response samples
- Error handling

### 2. API_TESTING_GUIDE.md
- Quick reference cho testing
- cURL examples (cho Linux/Mac)
- Testing flows

---

## 🧪 **VERIFY DEPLOYMENT**

### Test Connection:
```powershell
# Test login
$body = @{
    email = "admin@savore.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/auth/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body `
    -UseBasicParsing
```

**Expected**: HTTP 201 với access_token

---

## 🎯 **2 API CHÍNH THEO YÊU CẦU MENTOR**

### ⭐ API 1: GET /posts?tag=xxx
```
GET http://localhost:3000/posts?tag=gà
```
**Chức năng**: Lấy danh sách posts, tìm kiếm theo tag

### ⭐ API 2: GET /posts/:id
```
GET http://localhost:3000/posts/{uuid}
```
**Chức năng**: Lấy chi tiết 1 post bao gồm ingredients

---

## 📊 **MIGRATION HISTORY**

```
✅ 20251220161342_init
✅ 20251221233140_init_database
✅ 20251222094127_complete_backend_system
```

---

## 🔐 **SECURITY NOTES**

### ⚠️ QUAN TRỌNG - Production:
1. **Đổi JWT_SECRET** thành giá trị ngẫu nhiên mạnh
2. **Đổi passwords** của tất cả test accounts
3. **Enable SSL/TLS** cho database connection
4. **Setup firewall** cho VPS
5. **Enable CORS** chỉ cho domains cụ thể
6. **Rate limiting** cho APIs

### Current Setup (Development):
- JWT_SECRET: Sử dụng giá trị mặc định
- CORS: Enabled cho tất cả origins
- Passwords: Đơn giản cho testing

---

## 🚀 **NEXT STEPS**

### Để deploy Backend lên VPS:
1. Install Node.js trên VPS
2. Clone code lên VPS
3. Copy .env file
4. Run `npm install`
5. Run `npm run build`
6. Run `npm run start:prod`
7. Setup PM2 hoặc systemd để auto-restart

### Để tạo Admin Dashboard:
1. Tạo React app mới
2. Integrate với APIs đã có
3. Deploy frontend lên VPS hoặc Vercel

---

## 📞 **SUPPORT**

### Nếu gặp vấn đề:

**Database Connection Error:**
```
Error: connect ECONNREFUSED 103.6.234.20:5432
```
**Giải pháp**: 
- Kiểm tra VPS firewall
- Verify database credentials
- Check network connectivity

**Migration Error:**
```
Error: P3009 - migrate.lock file is present
```
**Giải pháp**:
```bash
rm prisma/migrations/migrate.lock
npx prisma migrate deploy
```

---

## ✅ **DEPLOYMENT CHECKLIST**

- [x] VPS database configured
- [x] Migrations deployed
- [x] Seed data created
- [x] Backend connected to VPS
- [x] All APIs tested
- [x] Documentation created
- [x] Test accounts ready
- [ ] Deploy backend to VPS (optional)
- [ ] Create admin dashboard (optional)
- [ ] Setup SSL/TLS (production)
- [ ] Configure domain (production)

---

**🎉 VPS Database đã sẵn sàng sử dụng!**

**📝 Đọc file `CRUD_GUIDE.md` để biết cách sử dụng tất cả APIs**
