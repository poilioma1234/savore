# ⚡ CÁCH ĐƠN GIẢN ĐỔI ROLE CHO USER

## 🎯 ENDPOINT MỚI (DỄ DÙNG HƠN)

### **PUT /admin/users/:id/roles**

Thay thế **TẤT CẢ** roles của user bằng array mới!

---

## 📝 CÁCH DÙNG

### **1. Đổi user thành CREATOR:**

```
PUT http://103.6.234.20:3003/admin/users/3/roles

Headers:
Authorization: Bearer {adminToken}
Content-Type: application/json

Body:
{
  "roles": ["CREATOR"]
}
```

**Response:**
```json
{
  "message": "Roles updated successfully",
  "roles": ["CREATOR"]
}
```

---

### **2. Đổi user thành CREATOR + USER (nhiều roles):**

```
PUT http://103.6.234.20:3003/admin/users/3/roles

Body:
{
  "roles": ["CREATOR", "USER"]
}
```

---

### **3. Đổi user thành SUPPLIER:**

```
PUT http://103.6.234.20:3003/admin/users/3/roles

Body:
{
  "roles": ["SUPPLIER"]
}
```

---

## ✅ ƯU ĐIỂM

### **Cách cũ (phức tạp):**
```
1. POST /admin/users/3/roles { "roleCode": "CREATOR" }
2. POST /admin/users/3/roles { "roleCode": "USER" }
3. DELETE /admin/users/3/roles/2  (xóa role cũ)
```
→ 3 requests! 😫

### **Cách mới (đơn giản):**
```
PUT /admin/users/3/roles { "roles": ["CREATOR", "USER"] }
```
→ 1 request! 🎉

---

## 🎯 USE CASES

### **Nâng user lên creator:**
```json
{
  "roles": ["CREATOR"]
}
```

### **Nâng creator lên admin:**
```json
{
  "roles": ["ADMIN"]
}
```

### **User vừa là creator vừa là supplier:**
```json
{
  "roles": ["CREATOR", "SUPPLIER"]
}
```

### **Hạ creator xuống user thường:**
```json
{
  "roles": ["USER"]
}
```

---

## 📋 AVAILABLE ROLES

- `ADMIN` - Quản trị viên
- `CREATOR` - Người tạo công thức
- `USER` - Khách hàng
- `SUPPLIER` - Nhà cung cấp

---

## ⚠️ LƯU Ý

1. **Thay thế hoàn toàn:** Roles cũ sẽ bị xóa hết, chỉ giữ roles mới
2. **Validate:** Nếu role không tồn tại → Báo lỗi
3. **Admin only:** Chỉ admin mới dùng được

---

## 🚀 RESTART SERVER

```bash
# Trên VPS
pm2 restart savore-api

# Hoặc local
npm run start:dev
```

---

## 🧪 TEST NGAY

```
1. Login admin:
   POST /auth/login
   Body: { "email": "admin@savore.com", "password": "admin123" }

2. Đổi user 3 thành creator:
   PUT /admin/users/3/roles
   Body: { "roles": ["CREATOR"] }

3. Kiểm tra:
   GET /admin/users/3
   → Xem roles đã đổi chưa
```

---

**Đơn giản hơn nhiều rồi đúng không? 😊**
