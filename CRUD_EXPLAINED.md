# 📚 CRUD & RESTful API - GIẢI THÍCH CHO NGƯỜI MỚI

## 🤔 CRUD là gì?

**CRUD** là viết tắt của 4 thao tác cơ bản với dữ liệu:

| Chữ | Nghĩa | Làm gì | Ví dụ thực tế |
|-----|-------|--------|---------------|
| **C** | **Create** | Tạo mới | Đăng ký tài khoản, Thêm sản phẩm mới |
| **R** | **Read** | Đọc/Xem | Xem danh sách sản phẩm, Xem profile |
| **U** | **Update** | Cập nhật | Sửa thông tin profile, Cập nhật giá |
| **D** | **Delete** | Xóa | Xóa sản phẩm, Xóa tài khoản |

### Ví dụ CRUD với Sản phẩm:

```
C - Create: Thêm sản phẩm "Cà chua" giá 25,000đ
R - Read:   Xem danh sách tất cả sản phẩm
            Xem chi tiết sản phẩm "Cà chua"
U - Update: Đổi giá "Cà chua" thành 30,000đ
D - Delete: Xóa sản phẩm "Cà chua"
```

---

## 🌐 RESTful API là gì?

**API** = Application Programming Interface  
**REST** = Representational State Transfer

**Giải thích đơn giản:**
- API là cách để Frontend (Web/Mobile) nói chuyện với Backend (Server)
- RESTful là một cách tổ chức API theo chuẩn

### Ví dụ thực tế:

**Khi bạn mở Facebook:**
1. App gửi request: "Cho tôi xem newsfeed"
2. Server trả về: Danh sách bài viết (JSON)
3. App hiển thị lên màn hình

**Khi bạn like bài viết:**
1. App gửi request: "Like bài viết ID 123"
2. Server cập nhật database
3. Server trả về: "OK, đã like"

---

## 🔧 HTTP Methods (Động từ của API)

RESTful API dùng HTTP Methods để biểu thị hành động:

| Method | CRUD | Làm gì | Ví dụ |
|--------|------|--------|-------|
| **GET** | Read | Lấy dữ liệu | Xem danh sách sản phẩm |
| **POST** | Create | Tạo mới | Thêm sản phẩm mới |
| **PUT** | Update | Cập nhật toàn bộ | Sửa toàn bộ thông tin sản phẩm |
| **PATCH** | Update | Cập nhật một phần | Chỉ đổi giá sản phẩm |
| **DELETE** | Delete | Xóa | Xóa sản phẩm |

---

## 📍 Endpoint (Địa chỉ API)

**Endpoint** = URL của API

### Cấu trúc:
```
[Method] [Base URL]/[Resource]/[ID]
```

### Ví dụ với Products:

```
GET    http://localhost:3000/api/products        → Lấy tất cả sản phẩm
GET    http://localhost:3000/api/products/1      → Lấy sản phẩm ID 1
POST   http://localhost:3000/api/products        → Tạo sản phẩm mới
PUT    http://localhost:3000/api/products/1      → Cập nhật sản phẩm ID 1
DELETE http://localhost:3000/api/products/1      → Xóa sản phẩm ID 1
```

---

## 📦 Request & Response

### Request (Yêu cầu từ Client)

**Gồm 3 phần:**

#### 1. **Method** - Làm gì
```
POST
```

#### 2. **URL** - Địa chỉ
```
http://localhost:3000/api/products
```

#### 3. **Body** - Dữ liệu gửi lên (nếu có)
```json
{
  "name": "Cà chua",
  "price": 25000
}
```

### Response (Phản hồi từ Server)

**Gồm 2 phần:**

#### 1. **Status Code** - Kết quả
```
201 Created  → Tạo thành công
200 OK       → Thành công
404 Not Found → Không tìm thấy
400 Bad Request → Dữ liệu sai
500 Server Error → Lỗi server
```

#### 2. **Body** - Dữ liệu trả về
```json
{
  "id": 1,
  "name": "Cà chua",
  "price": 25000,
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

---

## 🎯 Ví dụ CRUD hoàn chỉnh với Products

### 1. CREATE - Tạo sản phẩm mới

**Request:**
```http
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Cà chua organic",
  "price": 25000
}
```

**Response:**
```http
Status: 201 Created

{
  "id": 1,
  "name": "Cà chua organic",
  "price": 25000,
  "status": "ACTIVE",
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

---

### 2. READ - Lấy danh sách sản phẩm

**Request:**
```http
GET http://localhost:3000/api/products
```

**Response:**
```http
Status: 200 OK

{
  "data": [
    {
      "id": 1,
      "name": "Cà chua organic",
      "price": 25000,
      "status": "ACTIVE"
    },
    {
      "id": 2,
      "name": "Cà rót",
      "price": 15000,
      "status": "ACTIVE"
    }
  ],
  "total": 2
}
```

---

### 3. READ - Lấy chi tiết 1 sản phẩm

**Request:**
```http
GET http://localhost:3000/api/products/1
```

**Response:**
```http
Status: 200 OK

{
  "id": 1,
  "name": "Cà chua organic",
  "price": 25000,
  "status": "ACTIVE",
  "supplier": {
    "id": 5,
    "name": "Nhà cung cấp A"
  },
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

---

### 4. UPDATE - Cập nhật sản phẩm

**Request:**
```http
PUT http://localhost:3000/api/products/1
Content-Type: application/json

{
  "name": "Cà chua organic premium",
  "price": 30000
}
```

**Response:**
```http
Status: 200 OK

{
  "id": 1,
  "name": "Cà chua organic premium",
  "price": 30000,
  "status": "ACTIVE"
}
```

---

### 5. DELETE - Xóa sản phẩm

**Request:**
```http
DELETE http://localhost:3000/api/products/1
```

**Response:**
```http
Status: 200 OK

{
  "message": "Product deleted successfully"
}
```

---

## 🔐 Authentication (Xác thực)

Nhiều API cần **token** để xác thực user:

### 1. Login để lấy token
```http
POST http://localhost:3000/api/auth/login

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Dùng token cho các request khác
```http
GET http://localhost:3000/api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🌍 Localhost vs IP Public vs Domain

### Localhost (Development)
```
http://localhost:3000/api/products
```
- ✅ Dùng khi code trên máy
- ❌ Chỉ mình bạn truy cập được
- ❌ FE/Mobile không gọi được (nếu khác máy)

### IP Public (Production - Có VPS)
```
http://123.45.67.89:3000/api/products
```
- ✅ Ai cũng truy cập được
- ✅ FE/Mobile gọi được
- ✅ **Bạn đã có VPS → Dùng được ngay!**
- ❌ Khó nhớ
- ❌ Chưa có HTTPS

### Domain (Professional)
```
https://api.savore.com/api/products
```
- ✅ Dễ nhớ
- ✅ Có HTTPS (bảo mật)
- ✅ Professional
- ❌ Tốn tiền mua domain (~$10/năm)

**Kết luận:** Bạn có VPS → Dùng IP Public được rồi! Domain là optional.

---

## 🧪 Cách test API

### Cách 1: Postman (Phổ biến nhất)
- Download: https://www.postman.com/downloads/
- Giao diện đẹp, dễ dùng
- Lưu được collection

### Cách 2: Thunder Client (VS Code Extension)
- Cài trong VS Code
- Nhẹ, tiện lợi
- Không cần mở app riêng

### Cách 3: Swagger UI (Tự động)
- Tích hợp vào NestJS
- Tự động tạo docs
- Test ngay trên browser
- **→ Xem file SWAGGER_SETUP.md để setup!**

### Cách 4: cURL (Command line)
```bash
curl http://localhost:3000/api/products
```

---

## 📊 Status Codes quan trọng

| Code | Nghĩa | Khi nào |
|------|-------|---------|
| **200** | OK | Request thành công |
| **201** | Created | Tạo mới thành công |
| **204** | No Content | Xóa thành công |
| **400** | Bad Request | Dữ liệu gửi lên sai |
| **401** | Unauthorized | Chưa đăng nhập |
| **403** | Forbidden | Không có quyền |
| **404** | Not Found | Không tìm thấy |
| **500** | Server Error | Lỗi server |

---

## 💡 Best Practices

### 1. Đặt tên endpoint rõ ràng
✅ Good:
```
GET /api/products
GET /api/products/1
POST /api/products
```

❌ Bad:
```
GET /api/getProducts
GET /api/product-detail?id=1
POST /api/createNewProduct
```

### 2. Dùng đúng HTTP Method
✅ Good:
```
GET /api/products        → Lấy danh sách
POST /api/products       → Tạo mới
PUT /api/products/1      → Cập nhật
DELETE /api/products/1   → Xóa
```

❌ Bad:
```
GET /api/products/delete/1   → Xóa bằng GET
POST /api/products/update/1  → Update bằng POST
```

### 3. Trả về đúng Status Code
```javascript
// Tạo mới thành công
return res.status(201).json(product);

// Không tìm thấy
return res.status(404).json({ message: 'Not found' });

// Lỗi validation
return res.status(400).json({ message: 'Invalid data' });
```

### 4. Consistent Response Format
```json
// Success
{
  "data": { ... },
  "message": "Success"
}

// Error
{
  "error": "Error message",
  "statusCode": 400
}
```

---

## 🎯 Tóm tắt

### CRUD
- **C**reate → POST → Tạo mới
- **R**ead → GET → Lấy dữ liệu
- **U**pdate → PUT/PATCH → Cập nhật
- **D**elete → DELETE → Xóa

### RESTful API
- Dùng HTTP Methods (GET, POST, PUT, DELETE)
- Endpoint rõ ràng (/api/products)
- Trả về JSON
- Status codes chuẩn

### Testing
- Postman - Dễ dùng nhất
- Swagger UI - Tự động docs
- Thunder Client - Trong VS Code

### Deployment
- Localhost → Development
- IP Public → Production (Bạn đã có!)
- Domain → Optional (Professional)

---

## 📚 Học tiếp

### Video tutorials (Tiếng Việt)
- YouTube: "RESTful API là gì"
- YouTube: "CRUD tutorial"
- YouTube: "Postman tutorial"

### Thực hành
1. Đọc file `API_REFERENCE.md` - Xem các endpoint
2. Setup Swagger UI - Xem file `SWAGGER_SETUP.md`
3. Bắt đầu code theo `DAILY_CHECKLIST.md`

---

**Bây giờ bạn đã hiểu CRUD & RESTful API! 🎉**

*Next step: Đọc file `SWAGGER_SETUP.md` để setup giao diện test API!*
