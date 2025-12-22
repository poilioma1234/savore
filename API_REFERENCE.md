# 📚 API REFERENCE - SAVORE PLATFORM

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

---

## 🔐 AUTHENTICATION

### Register
Đăng ký user mới

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "USER" // ADMIN | CREATOR | USER | SUPPLIER
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

**Errors:**
- `400 Bad Request` - Email đã tồn tại
- `400 Bad Request` - Validation error

---

### Login
Đăng nhập và nhận JWT token

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

**Errors:**
- `401 Unauthorized` - Email hoặc password sai

---

### Get Profile
Lấy thông tin user hiện tại

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "roles": ["USER", "CREATOR"],
  "wallet": {
    "balance": 100000,
    "currency": "VND"
  }
}
```

---

### Update Profile
Cập nhật thông tin user

**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "fullName": "John Updated",
  "email": "newemail@example.com"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "fullName": "John Updated"
}
```

---

## 🛍️ PRODUCTS

### Get All Products
Lấy danh sách sản phẩm (public)

**Endpoint:** `GET /products`

**Query Parameters:**
```
?page=1
&limit=10
&search=tomato
&status=ACTIVE
&minPrice=10000
&maxPrice=50000
&supplierId=5
&sortBy=price
&sortOrder=asc
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "name": "Organic Tomatoes",
      "price": 25000,
      "status": "ACTIVE",
      "supplier": {
        "id": 5,
        "fullName": "Supplier Name"
      },
      "createdAt": "2025-12-22T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

### Get Product Detail
Lấy chi tiết sản phẩm

**Endpoint:** `GET /products/:id`

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Organic Tomatoes",
  "price": 25000,
  "status": "ACTIVE",
  "supplier": {
    "id": 5,
    "email": "supplier@example.com",
    "fullName": "Supplier Name"
  },
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

**Errors:**
- `404 Not Found` - Product không tồn tại

---

### Create Product
Tạo sản phẩm mới (Supplier only)

**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "Fresh Carrots",
  "price": 15000,
  "status": "ACTIVE"
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "name": "Fresh Carrots",
  "price": 15000,
  "status": "ACTIVE",
  "supplierId": 5,
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

**Errors:**
- `401 Unauthorized` - Chưa đăng nhập
- `403 Forbidden` - Không có quyền SUPPLIER
- `400 Bad Request` - Validation error

---

### Update Product
Cập nhật sản phẩm (Owner only)

**Endpoint:** `PUT /products/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "Fresh Organic Carrots",
  "price": 18000,
  "status": "ACTIVE"
}
```

**Response:** `200 OK`
```json
{
  "id": 2,
  "name": "Fresh Organic Carrots",
  "price": 18000,
  "status": "ACTIVE"
}
```

**Errors:**
- `404 Not Found` - Product không tồn tại
- `403 Forbidden` - Không phải owner

---

### Delete Product
Xóa sản phẩm (Owner only)

**Endpoint:** `DELETE /products/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "message": "Product deleted successfully"
}
```

**Errors:**
- `404 Not Found` - Product không tồn tại
- `403 Forbidden` - Không phải owner
- `400 Bad Request` - Product đã có trong orders

---

## 📝 POSTS

### Get All Posts
Lấy danh sách posts (public)

**Endpoint:** `GET /posts`

**Query Parameters:**
```
?page=1
&limit=10
&search=recipe
&status=PUBLISHED
&creatorId=3
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "title": "Delicious Tomato Soup",
      "videoUrl": "https://youtube.com/watch?v=xxx",
      "status": "PUBLISHED",
      "creator": {
        "id": 3,
        "fullName": "Chef John"
      },
      "ingredientCount": 5,
      "createdAt": "2025-12-22T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### Get Post Detail
Lấy chi tiết post với ingredients

**Endpoint:** `GET /posts/:id`

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Delicious Tomato Soup",
  "videoUrl": "https://youtube.com/watch?v=xxx",
  "status": "PUBLISHED",
  "creator": {
    "id": 3,
    "fullName": "Chef John"
  },
  "ingredients": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Organic Tomatoes",
        "price": 25000
      },
      "quantityNeeded": 5,
      "totalCost": 125000
    }
  ],
  "totalRecipeCost": 125000,
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

---

### Create Post
Tạo post mới (Creator only)

**Endpoint:** `POST /posts`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "title": "Easy Pasta Recipe",
  "videoUrl": "https://youtube.com/watch?v=yyy",
  "status": "DRAFT"
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "title": "Easy Pasta Recipe",
  "videoUrl": "https://youtube.com/watch?v=yyy",
  "status": "DRAFT",
  "creatorId": 3,
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

---

### Add Ingredient to Post
Thêm nguyên liệu vào post

**Endpoint:** `POST /posts/:id/ingredients`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "productId": 1,
  "quantityNeeded": 3
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "postId": 2,
  "productId": 1,
  "quantityNeeded": 3
}
```

---

### Publish Post
Publish post (Creator only)

**Endpoint:** `PATCH /posts/:id/publish`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": 2,
  "status": "PUBLISHED"
}
```

---

## 🛒 ORDERS

### Get My Orders
Lấy danh sách orders của user

**Endpoint:** `GET /orders`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
```
?page=1
&limit=10
&status=PAID
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "totalPrice": 150000,
      "status": "PAID",
      "itemCount": 3,
      "createdAt": "2025-12-22T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 10
  }
}
```

---

### Get Order Detail
Lấy chi tiết order

**Endpoint:** `GET /orders/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "totalPrice": 150000,
  "status": "PAID",
  "items": [
    {
      "id": 1,
      "productNameAtPurchase": "Organic Tomatoes",
      "priceAtPurchase": 25000,
      "quantity": 5,
      "subtotal": 125000,
      "supplier": {
        "fullName": "Supplier Name"
      },
      "creator": {
        "fullName": "Chef John"
      },
      "commissionAmount": 12500
    }
  ],
  "createdAt": "2025-12-22T00:00:00.000Z"
}
```

---

### Create Order
Tạo order mới

**Endpoint:** `POST /orders`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 5,
      "sourcePostId": 1
    },
    {
      "productId": 2,
      "quantity": 2
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "order": {
    "id": 1,
    "totalPrice": 150000,
    "status": "PENDING"
  },
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 5,
      "priceAtPurchase": 25000,
      "commissionAmount": 12500
    }
  ]
}
```

---

### Pay Order
Thanh toán order

**Endpoint:** `PATCH /orders/:id/pay`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "status": "PAID",
  "paidAt": "2025-12-22T00:00:00.000Z"
}
```

**Errors:**
- `400 Bad Request` - Order đã thanh toán
- `400 Bad Request` - Số dư không đủ

---

### Cancel Order
Hủy order

**Endpoint:** `PATCH /orders/:id/cancel`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "status": "CANCELLED"
}
```

**Errors:**
- `400 Bad Request` - Order đã thanh toán

---

## 💰 WALLET

### Get Wallet
Lấy thông tin ví

**Endpoint:** `GET /wallet`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "balance": 500000,
  "currency": "VND",
  "userId": 1
}
```

---

### Get Transactions
Lấy lịch sử giao dịch

**Endpoint:** `GET /wallet/transactions`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
```
?page=1
&limit=10
&type=CREDIT
&sourceType=COMMISSION
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "amount": 12500,
      "type": "CREDIT",
      "sourceType": "COMMISSION",
      "balanceAfter": 512500,
      "status": "COMPLETED",
      "createdAt": "2025-12-22T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

---

## 💸 COMMISSIONS

### Get My Commissions
Lấy commissions của creator

**Endpoint:** `GET /commissions`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
```
?status=PENDING
&page=1
&limit=10
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "amount": 12500,
      "status": "PENDING",
      "orderItem": {
        "productNameAtPurchase": "Organic Tomatoes",
        "order": {
          "id": 1,
          "createdAt": "2025-12-22T00:00:00.000Z"
        }
      },
      "createdAt": "2025-12-22T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 20,
    "page": 1,
    "limit": 10
  },
  "summary": {
    "totalPending": 125000,
    "totalPaid": 500000,
    "totalCommissions": 625000
  }
}
```

---

### Pay Commission
Thanh toán commission (Admin only)

**Endpoint:** `POST /commissions/:id/pay`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "status": "PAID",
  "paidAt": "2025-12-22T00:00:00.000Z"
}
```

---

## 📊 ANALYTICS

### Dashboard Statistics
Lấy thống kê tổng quan

**Endpoint:** `GET /analytics/dashboard`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "totalUsers": 1000,
  "totalProducts": 500,
  "totalOrders": 2000,
  "totalRevenue": 50000000,
  "pendingCommissions": 1000000,
  "activeCreators": 50,
  "activeSuppliers": 30
}
```

---

### Revenue Report
Báo cáo doanh thu

**Endpoint:** `GET /analytics/revenue`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
```
?startDate=2025-01-01
&endDate=2025-12-31
&groupBy=month
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "period": "2025-01",
      "revenue": 5000000,
      "orders": 100,
      "avgOrderValue": 50000
    }
  ],
  "total": {
    "revenue": 50000000,
    "orders": 2000
  }
}
```

---

## 🔒 AUTHORIZATION

### Roles & Permissions

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access to all endpoints |
| **CREATOR** | Create/edit posts, view commissions |
| **SUPPLIER** | Create/edit products, view revenue |
| **USER** | Create orders, view profile |

### Protected Endpoints

Endpoints yêu cầu authentication:
- Tất cả endpoints có prefix `/auth/profile`
- Tất cả POST, PUT, DELETE endpoints
- `/wallet/*`
- `/commissions/*`
- `/orders/*`

---

## 📝 COMMON RESPONSE FORMATS

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
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

### Validation Error
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## 🔢 HTTP STATUS CODES

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## 💡 TIPS

### Testing với Postman
1. Tạo environment với `baseUrl`
2. Tạo collection cho mỗi module
3. Save access_token vào environment
4. Use `{{baseUrl}}` và `{{token}}` trong requests

### Authentication Flow
1. Register user → Get user info
2. Login → Get access_token
3. Save token to localStorage/cookies
4. Add token to all protected requests
5. Refresh token when expired

### Pagination
- Default: `page=1`, `limit=10`
- Max limit: `100`
- Response includes `meta` with pagination info

---

**Last Updated:** 2025-12-22  
**API Version:** 1.0.0
