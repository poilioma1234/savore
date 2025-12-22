# 📚 HƯỚNG DẪN SETUP SWAGGER TRÊN VPS

## ✅ **ĐÃ HOÀN THÀNH**
- ✅ Cài đặt `@nestjs/swagger` và `swagger-ui-express`
- ✅ Cấu hình Swagger trong `main.ts`

---

## 🚀 **TRÊN VPS - Các bước cần làm**

### **Bước 1: SSH vào VPS**
```bash
ssh root@103.6.234.20
```

### **Bước 2: Di chuyển vào thư mục BE**
```bash
cd /var/www/savore-backend/BE
```

### **Bước 3: Pull code mới nhất (nếu dùng Git)**
```bash
git pull origin main
```

### **Bước 4: Cài đặt dependencies**
```bash
npm install
```

### **Bước 5: Build lại**
```bash
npm run build
```

### **Bước 6: Restart PM2**
```bash
pm2 restart savore-api
# Hoặc nếu chưa có PM2:
pm2 start dist/main.js --name savore-api
pm2 save
```

### **Bước 7: Kiểm tra logs**
```bash
pm2 logs savore-api
```

Bạn sẽ thấy:
```
Application is running on: http://localhost:3000
Swagger UI is running on: http://localhost:3000/api
```

---

## 🌐 **TRUY CẬP SWAGGER**

### **Từ VPS (local):**
```
http://localhost:3000/api
```

### **Từ bên ngoài (Internet):**
```
http://103.6.234.20:3000/api
```

### **Nếu có domain:**
```
https://api.savore.com/api
```

---

## 🎯 **SỬ DỤNG SWAGGER UI**

### **1. Mở trình duyệt**
Truy cập: `http://103.6.234.20:3000/api`

### **2. Test API không cần authentication**

**Ví dụ: GET /posts**
1. Click vào endpoint `GET /posts`
2. Click "Try it out"
3. Nhập parameters (nếu có): `tag=gà`
4. Click "Execute"
5. Xem response

### **3. Test API cần authentication**

**Bước 1: Login để lấy token**
1. Mở endpoint `POST /auth/login`
2. Click "Try it out"
3. Nhập body:
```json
{
  "email": "admin@savore.com",
  "password": "admin123"
}
```
4. Click "Execute"
5. Copy `access_token` từ response

**Bước 2: Authorize**
1. Click nút **"Authorize"** ở góc trên bên phải
2. Paste token vào ô "Value"
3. Click "Authorize"
4. Click "Close"

**Bước 3: Test protected endpoints**
Bây giờ bạn có thể test các endpoints cần authentication như:
- `GET /auth/profile`
- `POST /ingredients`
- `POST /posts`
- `GET /admin/users`

---

## 📸 **SWAGGER UI FEATURES**

### **Tính năng chính:**
- ✅ **Interactive API Testing** - Test trực tiếp trên browser
- ✅ **Auto-generated Documentation** - Tự động từ code
- ✅ **Request/Response Examples** - Ví dụ rõ ràng
- ✅ **Authentication Support** - Hỗ trợ JWT Bearer token
- ✅ **Schema Validation** - Hiển thị data models
- ✅ **Try it out** - Test API ngay lập tức

### **Các tags:**
- 🔐 **Authentication** - Login, Register, Profile
- 👨‍💼 **Admin** - User management, Dashboard stats
- 🥕 **Ingredients** - CRUD ingredients (SUPPLIER)
- 📰 **Posts** - CRUD posts (CREATOR)

---

## 🔧 **TROUBLESHOOTING**

### **Lỗi: Cannot access Swagger UI**
```bash
# Check if app is running
pm2 status

# Check logs
pm2 logs savore-api

# Restart
pm2 restart savore-api
```

### **Lỗi: Port 3000 blocked**
```bash
# Open firewall
ufw allow 3000
ufw status
```

### **Lỗi: 404 Not Found on /api**
```bash
# Verify build
cd /var/www/savore-backend/BE
npm run build
pm2 restart savore-api
```

---

## 📝 **CHIA SẺ CHO TEAM**

### **Gửi link Swagger cho team:**
```
Swagger UI: http://103.6.234.20:3000/api
```

### **Test accounts:**
```
Admin:    admin@savore.com / admin123
Creator:  creator@savore.com / creator123
User:     user@savore.com / user123
Supplier: supplier@savore.com / supplier123
```

### **Hướng dẫn sử dụng:**
1. Mở link Swagger UI
2. Với API public (GET /posts, GET /ingredients): Click "Try it out" → Execute
3. Với API cần auth:
   - Login tại `POST /auth/login`
   - Copy access_token
   - Click "Authorize" → Paste token
   - Test các endpoints khác

---

## 🎨 **SWAGGER CUSTOMIZATION (Optional)**

Nếu muốn customize thêm, edit `src/main.ts`:

```typescript
SwaggerModule.setup('api', app, document, {
  customSiteTitle: 'Savore API Docs',
  customfavIcon: 'https://your-icon.png',
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b82f6; }
  `,
  swaggerOptions: {
    persistAuthorization: true, // Lưu token khi refresh
  },
});
```

---

## 📊 **SO SÁNH VỚI POSTMAN**

| Feature | Swagger UI | Postman |
|---------|-----------|---------|
| Setup | ✅ Tự động | ❌ Phải tạo collection |
| Documentation | ✅ Từ code | ❌ Phải viết tay |
| Sharing | ✅ Chỉ cần URL | ❌ Phải export/import |
| Testing | ✅ Trên browser | ✅ Desktop app |
| Team Collaboration | ✅ Dễ dàng | ⚠️ Cần Postman account |

---

## 🚀 **NEXT STEPS**

### **Sau khi setup Swagger:**
1. ✅ Test tất cả APIs trên Swagger UI
2. ✅ Gửi link cho team FE
3. ✅ Team FE có thể test API mà không cần Postman
4. ✅ Documentation luôn up-to-date với code

### **Nếu muốn thêm chi tiết:**
Có thể thêm Swagger decorators vào DTOs và Controllers để có documentation chi tiết hơn (tôi có thể giúp sau nếu cần).

---

## 📞 **SUPPORT**

### **Nếu gặp vấn đề:**
1. Check PM2 logs: `pm2 logs savore-api`
2. Check firewall: `ufw status`
3. Restart app: `pm2 restart savore-api`
4. Rebuild: `npm run build && pm2 restart savore-api`

---

**🎉 Swagger đã sẵn sàng! Truy cập tại: `http://103.6.234.20:3000/api`**

**💡 Tip**: Bookmark link Swagger để dễ dàng test API bất cứ lúc nào!
