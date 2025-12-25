# ⚡ QUICK START - ADMIN API

## 🚀 CÁCH NHANH NHẤT (Import Postman Collection)

### Bước 1: Import Collection
1. Mở Postman
2. Click "Import" (góc trái trên)
3. Chọn file: `Savore_Admin_API.postman_collection.json`
4. Click "Import"

### Bước 2: Chạy thử
1. Chọn request "1. Login Admin"
2. Click "Send"
3. ✅ Token tự động lưu vào biến `adminToken`
4. Chọn request "2. Get All Users"
5. Click "Send"
6. ✅ Xem danh sách tất cả users!

---

## 📝 HOẶC TEST THỦ CÔNG

### 1. Login Admin
```
POST http://103.6.234.20:3018/auth/login

Body:
{
  "email": "admin@savore.com",
  "password": "admin123"
}

→ Copy accessToken từ response
```

### 2. Lấy tất cả users
```
GET http://103.6.234.20:3018/admin/users?page=1&limit=10

Headers:
Authorization: Bearer {accessToken}

→ Xem danh sách users
```

---

## 🎯 CÁC ENDPOINT ADMIN CHÍNH

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/admin/users` | GET | Lấy tất cả users |
| `/admin/users?search=xxx` | GET | Tìm kiếm users |
| `/admin/users?role=SUPPLIER` | GET | Lọc theo role |
| `/admin/users/:id` | GET | Chi tiết user |
| `/admin/users/:id/roles` | POST | Gán role |
| `/admin/users/:id/roles/:roleId` | DELETE | Xóa role |
| `/admin/dashboard/stats` | GET | Thống kê |

---

## 🔐 ACCOUNT ADMIN

```
Email: admin@savore.com
Password: admin123
```

---

## 📚 TÀI LIỆU CHI TIẾT

Xem file: `ADMIN_API_GUIDE.md`

---

## ✅ CHECKLIST

- [x] Admin API đã có sẵn
- [x] Admin account: admin@savore.com / admin123
- [x] Postman Collection: `Savore_Admin_API.postman_collection.json`
- [x] Hướng dẫn chi tiết: `ADMIN_API_GUIDE.md`

---

**Chúc test vui vẻ!** 🎉
