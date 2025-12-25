# 🔐 HƯỚNG DẪN SỬ DỤNG ADMIN API - POSTMAN

## 📋 MỤC LỤC
1. [Login Admin](#1-login-admin)
2. [Lấy danh sách tất cả users](#2-lấy-danh-sách-tất-cả-users)
3. [Tìm kiếm users](#3-tìm-kiếm-users)
4. [Lọc users theo role](#4-lọc-users-theo-role)
5. [Xem chi tiết user](#5-xem-chi-tiết-user)
6. [Gán role cho user](#6-gán-role-cho-user)
7. [Xóa role của user](#7-xóa-role-của-user)
8. [Xem dashboard stats](#8-xem-dashboard-stats)

---

## 1. LOGIN ADMIN

### Request
```
POST http://103.6.234.20:3018/auth/login
```

### Body (JSON)
```json
{
  "email": "admin@savore.com",
  "password": "admin123"
}
```

### Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@savore.com",
    "fullName": "Admin User",
    "roles": ["ADMIN"]
  }
}
```

**⚠️ QUAN TRỌNG:** Copy `accessToken` để dùng cho các request tiếp theo!

---

## 2. LẤY DANH SÁCH TẤT CẢ USERS

### Request
```
GET http://103.6.234.20:3018/admin/users?page=1&limit=10
```

### Headers
```
Authorization: Bearer {accessToken}
```

### Query Parameters
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số items mỗi trang (default: 10)

### Response
```json
{
  "data": [
    {
      "id": 1,
      "email": "admin@savore.com",
      "fullName": "Admin User",
      "roles": ["ADMIN"],
      "wallet": {
        "id": 1,
        "userId": 1,
        "balance": "1000000.00",
        "currency": "VND",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "email": "creator@savore.com",
      "fullName": "Nguyễn Văn A",
      "roles": ["CREATOR"],
      "wallet": {
        "id": 2,
        "userId": 2,
        "balance": "1000000.00",
        "currency": "VND",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 3,
      "email": "user@savore.com",
      "fullName": "Trần Thị B",
      "roles": ["USER"],
      "wallet": {
        "id": 3,
        "userId": 3,
        "balance": "1000000.00",
        "currency": "VND",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 4,
      "email": "supplier@savore.com",
      "fullName": "Nhà Cung Cấp Thực Phẩm Sạch",
      "roles": ["SUPPLIER"],
      "wallet": {
        "id": 4,
        "userId": 4,
        "balance": "1000000.00",
        "currency": "VND",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 5,
      "email": "supplier2@savore.com",
      "fullName": "Chợ Nông Sản Organic",
      "roles": ["SUPPLIER"],
      "wallet": {
        "id": 5,
        "userId": 5,
        "balance": "1000000.00",
        "currency": "VND",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## 3. TÌM KIẾM USERS

### Request
```
GET http://103.6.234.20:3018/admin/users?search=creator
```

### Headers
```
Authorization: Bearer {accessToken}
```

### Query Parameters
- `search`: Tìm kiếm theo email hoặc tên (case-insensitive)

### Example Searches
```
# Tìm theo email
GET /admin/users?search=admin@savore.com

# Tìm theo tên
GET /admin/users?search=Nguyễn

# Tìm theo từ khóa
GET /admin/users?search=creator
```

### Response
```json
{
  "data": [
    {
      "id": 2,
      "email": "creator@savore.com",
      "fullName": "Nguyễn Văn A",
      "roles": ["CREATOR"],
      "wallet": {...},
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## 4. LỌC USERS THEO ROLE

### Request
```
GET http://103.6.234.20:3018/admin/users?role=SUPPLIER
```

### Headers
```
Authorization: Bearer {accessToken}
```

### Query Parameters
- `role`: Lọc theo role code

### Available Roles
- `ADMIN` - Quản trị viên
- `CREATOR` - Người tạo công thức
- `USER` - Khách hàng
- `SUPPLIER` - Nhà cung cấp

### Example Filters
```
# Lấy tất cả suppliers
GET /admin/users?role=SUPPLIER

# Lấy tất cả creators
GET /admin/users?role=CREATOR

# Lấy tất cả users thường
GET /admin/users?role=USER

# Kết hợp filter + search
GET /admin/users?role=SUPPLIER&search=organic
```

### Response
```json
{
  "data": [
    {
      "id": 4,
      "email": "supplier@savore.com",
      "fullName": "Nhà Cung Cấp Thực Phẩm Sạch",
      "roles": ["SUPPLIER"],
      "wallet": {...},
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 5,
      "email": "supplier2@savore.com",
      "fullName": "Chợ Nông Sản Organic",
      "roles": ["SUPPLIER"],
      "wallet": {...},
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## 5. XEM CHI TIẾT USER

### Request
```
GET http://103.6.234.20:3018/admin/users/2
```

### Headers
```
Authorization: Bearer {accessToken}
```

### Response
```json
{
  "id": 2,
  "email": "creator@savore.com",
  "fullName": "Nguyễn Văn A",
  "roles": ["CREATOR"],
  "wallet": {
    "id": 2,
    "userId": 2,
    "balance": "1000000.00",
    "currency": "VND",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "recentPosts": [
    {
      "id": "uuid-1",
      "name": "Gà Xào Sả Ớt Thơm Ngon",
      "linkVideo": "https://www.youtube.com/watch?v=...",
      "thumbnail": "https://images.unsplash.com/...",
      "status": "PUBLISHED",
      "rating": "0.0",
      "view": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "recentIngredients": [],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Note:** Hiển thị 5 posts và 5 ingredients gần nhất của user.

---

## 6. GÁN ROLE CHO USER

### Request
```
POST http://103.6.234.20:3018/admin/users/3/roles
```

### Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Body
```json
{
  "roleCode": "CREATOR"
}
```

### Response
```json
{
  "message": "Role CREATOR assigned successfully"
}
```

### Use Cases
```json
// Nâng user thường lên creator
POST /admin/users/3/roles
{ "roleCode": "CREATOR" }

// Gán thêm role supplier cho user
POST /admin/users/3/roles
{ "roleCode": "SUPPLIER" }

// Gán admin cho user (cẩn thận!)
POST /admin/users/3/roles
{ "roleCode": "ADMIN" }
```

**⚠️ LƯU Ý:** 
- User có thể có nhiều roles cùng lúc
- Nếu user đã có role này, sẽ báo lỗi 409 Conflict

---

## 7. XÓA ROLE CỦA USER

### Request
```
DELETE http://103.6.234.20:3018/admin/users/3/roles/2
```

### Headers
```
Authorization: Bearer {accessToken}
```

### URL Parameters
- `userId`: ID của user (3)
- `roleId`: ID của role cần xóa (2)

### Role IDs
```
1 = ADMIN
2 = CREATOR
3 = USER
4 = SUPPLIER
```

### Response
```json
{
  "message": "Role removed successfully"
}
```

### Examples
```
# Xóa role CREATOR (roleId = 2) của user 3
DELETE /admin/users/3/roles/2

# Xóa role SUPPLIER (roleId = 4) của user 5
DELETE /admin/users/5/roles/4
```

**⚠️ LƯU Ý:** Không nên xóa hết tất cả roles của user!

---

## 8. XEM DASHBOARD STATS

### Request
```
GET http://103.6.234.20:3018/admin/dashboard/stats
```

### Headers
```
Authorization: Bearer {accessToken}
```

### Response
```json
{
  "totalUsers": 5,
  "totalPosts": 3,
  "totalIngredients": 12,
  "roleStats": [
    {
      "role": "ADMIN",
      "count": 1
    },
    {
      "role": "CREATOR",
      "count": 1
    },
    {
      "role": "USER",
      "count": 1
    },
    {
      "role": "SUPPLIER",
      "count": 2
    }
  ],
  "recentUsers": [
    {
      "id": 5,
      "email": "supplier2@savore.com",
      "fullName": "Chợ Nông Sản Organic",
      "roles": ["SUPPLIER"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 4,
      "email": "supplier@savore.com",
      "fullName": "Nhà Cung Cấp Thực Phẩm Sạch",
      "roles": ["SUPPLIER"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Use Case:** Hiển thị trên admin dashboard để xem tổng quan hệ thống.

---

## 📝 POSTMAN SETUP GUIDE

### Bước 1: Tạo Collection mới
1. Mở Postman
2. Click "New" → "Collection"
3. Đặt tên: "Savore Admin API"

### Bước 2: Setup Authorization
1. Click vào Collection "Savore Admin API"
2. Tab "Authorization"
3. Type: "Bearer Token"
4. Token: `{{adminToken}}` (sẽ setup ở bước 3)

### Bước 3: Tạo Environment
1. Click biểu tượng "⚙️" (Settings) → "Manage Environments"
2. Click "Add"
3. Tên: "Savore Production"
4. Variables:
   ```
   baseUrl: http://103.6.234.20:3018
   adminToken: (để trống, sẽ tự động set sau khi login)
   ```

### Bước 4: Tạo Login Request
1. Tạo request mới: `POST {{baseUrl}}/auth/login`
2. Body → raw → JSON:
   ```json
   {
     "email": "admin@savore.com",
     "password": "admin123"
   }
   ```
3. Tab "Tests", thêm script:
   ```javascript
   var jsonData = pm.response.json();
   pm.environment.set("adminToken", jsonData.accessToken);
   ```
4. Send → Token sẽ tự động lưu vào environment

### Bước 5: Tạo các Admin Requests
Tạo các requests sau trong collection:

```
📁 Savore Admin API
  📄 Login Admin
  📄 Get All Users
  📄 Search Users
  📄 Filter Users by Role
  📄 Get User Detail
  📄 Assign Role
  📄 Remove Role
  📄 Dashboard Stats
```

### Bước 6: Test
1. Chạy "Login Admin" trước
2. Chạy các requests khác (token đã tự động set)

---

## 🔥 QUICK EXAMPLES

### Example 1: Xem tất cả suppliers
```
1. Login: POST /auth/login
2. Get suppliers: GET /admin/users?role=SUPPLIER
```

### Example 2: Tìm user và nâng lên creator
```
1. Login: POST /auth/login
2. Search: GET /admin/users?search=user@savore.com
3. Get ID từ response (ví dụ: 3)
4. Assign role: POST /admin/users/3/roles
   Body: { "roleCode": "CREATOR" }
```

### Example 3: Xem thống kê hệ thống
```
1. Login: POST /auth/login
2. Dashboard: GET /admin/dashboard/stats
```

---

## ⚠️ ERROR HANDLING

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Giải pháp:** Login lại để lấy token mới

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```
**Giải pháp:** Đảm bảo đang login với tài khoản ADMIN

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User with ID 999 not found"
}
```
**Giải pháp:** Kiểm tra lại ID

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "User already has this role"
}
```
**Giải pháp:** User đã có role này rồi

---

## 🎯 TEST ACCOUNTS

```
Admin:
  Email: admin@savore.com
  Password: admin123
  Roles: [ADMIN]

Creator:
  Email: creator@savore.com
  Password: creator123
  Roles: [CREATOR]

User:
  Email: user@savore.com
  Password: user123
  Roles: [USER]

Supplier 1:
  Email: supplier@savore.com
  Password: supplier123
  Roles: [SUPPLIER]

Supplier 2:
  Email: supplier2@savore.com
  Password: supplier123
  Roles: [SUPPLIER]
```

---

## 📊 RESPONSE FORMAT

Tất cả admin endpoints đều trả về format nhất quán:

### Success Response
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

**Last Updated:** 2025-12-25
**Version:** 1.0.0
