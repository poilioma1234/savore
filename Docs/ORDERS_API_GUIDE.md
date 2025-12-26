# 🛒 HƯỚNG DẪN SỬ DỤNG API ORDERS

**Base URL:** `http://103.6.234.20:3003`  
**Swagger UI:** `http://103.6.234.20:3003/api`

---

## 📋 MỤC LỤC

1. [Tạo order mới (Auth required)](#1-tạo-order-mới-auth-required)
2. [Lấy orders của user (Public)](#2-lấy-orders-của-user-public)
3. [Lấy chi tiết 1 order (Public)](#3-lấy-chi-tiết-1-order-public)

---

## 1. TẠO ORDER MỚI (Auth required)

🔐 **Cần token** - Chỉ USER hoặc CREATOR có token mới tạo được

### **Endpoint:**
```
POST /orders
```

### **Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### **Body:**

```json
{
  "orderItems": [
    {
      "productId": 1,
      "quantity": 2,
      "sourcePostId": "550e8400-e29b-41d4-a716-446655440000",
      "creatorId": 5
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "note": "Giao hàng trước 5h chiều"
}
```

### **Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderItems` | Array | ✅ | Danh sách sản phẩm |
| `orderItems[].productId` | Number | ✅ | ID sản phẩm |
| `orderItems[].quantity` | Number | ✅ | Số lượng |
| `orderItems[].sourcePostId` | String (UUID) | ❌ | ID post gốc (để tính commission) |
| `orderItems[].creatorId` | Number | ❌ | ID creator (để tính commission) |
| `note` | String | ❌ | Ghi chú đơn hàng |

### **Ví dụ:**

```bash
# 1. Login để lấy token
POST http://103.6.234.20:3003/auth/login
Content-Type: application/json

{
  "email": "user1@savore.com",
  "password": "user123"
}

# Response: { "accessToken": "eyJhbG..." }

# 2. Tạo order
POST http://103.6.234.20:3003/orders
Authorization: Bearer eyJhbG...
Content-Type: application/json

{
  "orderItems": [
    {
      "productId": 1,
      "quantity": 2,
      "sourcePostId": "uuid-post-id",
      "creatorId": 5
    }
  ]
}
```

### **Response Success (201):**

```json
{
  "success": true,
  "message": "Order created successfully. Payment deducted from wallet.",
  "data": {
    "id": 1,
    "userId": 1,
    "totalPrice": "100000",
    "status": "PENDING",
    "createdAt": "2025-12-26T06:00:00.000Z",
    "walletBalance": 900000,
    "orderItems": [
      {
        "id": 1,
        "productId": 1,
        "productNameAtPurchase": "Thịt gà ta",
        "priceAtPurchase": "50000",
        "quantity": 2,
        "commissionRate": 10,
        "commissionAmount": "10000",
        "supplierAmount": "90000",
        "product": {
          "id": 1,
          "name": "Thịt gà ta",
          "price": "50000",
          "status": "ACTIVE"
        },
        "sourcePost": {
          "id": "uuid-post-id",
          "name": "Gà xào sả ớt",
          "thumbnail": "https://..."
        },
        "creator": {
          "id": 5,
          "fullName": "Chef Minh Nhật"
        }
      }
    ]
  }
}
```

### **Response Error (400 - Insufficient Balance):**

```json
{
  "statusCode": 400,
  "message": "Insufficient balance. Required: 100,000 VND, Available: 50,000 VND",
  "error": "Bad Request"
}
```

### **Response Error (400 - Product Not Found):**

```json
{
  "statusCode": 400,
  "message": "Some products not found",
  "error": "Bad Request"
}
```

### **Response Error (401 - Unauthorized):**

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## 🔍 **Workflow tạo order:**

```
1. User login → Lấy accessToken
   ↓
2. Kiểm tra wallet balance
   GET /auth/profile (xem wallet balance)
   ↓
3. Lấy danh sách products
   GET /products
   ↓
4. Tạo order với productIds
   POST /orders
   ↓
5. Hệ thống tự động:
   - Tính tổng giá
   - Kiểm tra wallet đủ tiền không
   - Trừ tiền từ wallet
   - Tạo transaction record
   - Tính commission cho creator (nếu có)
   ↓
6. Nhận response với order details
```

---

## 💰 **Commission Calculation:**

- Nếu có `sourcePostId` và `creatorId`: **10% commission** cho creator
- Nếu không có: **0% commission**

**Ví dụ:**
```
Product price: 50,000 VND
Quantity: 2
Total: 100,000 VND

Nếu có creator:
- Commission (10%): 10,000 VND → Creator nhận
- Supplier amount: 90,000 VND → Supplier nhận

Nếu không có creator:
- Commission: 0 VND
- Supplier amount: 100,000 VND → Supplier nhận
```

---

## 2. LẤY ORDERS CỦA USER (Public)

✅ **Không cần token** - Ai cũng có thể xem

### **Endpoint:**
```
GET /receipts/user/:userId?page=1&limit=10
```

### **Query Parameters:**
| Tham số | Bắt buộc | Mô tả | Mặc định |
|---------|----------|-------|----------|
| `page` | ❌ | Số trang | 1 |
| `limit` | ❌ | Số orders mỗi trang | 10 |

### **Ví dụ:**

```bash
GET http://103.6.234.20:3003/receipts/user/1?page=1&limit=10
```

### **Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "totalPrice": "150000",
      "status": "COMPLETED",
      "createdAt": "2025-12-26T06:00:00.000Z",
      "orderItems": [
        {
          "id": 1,
          "productNameAtPurchase": "Thịt gà ta",
          "priceAtPurchase": "50000",
          "quantity": 2,
          "product": {
            "id": 1,
            "name": "Thịt gà ta",
            "price": "50000"
          },
          "sourcePost": {
            "id": "uuid",
            "name": "Gà xào sả ớt",
            "thumbnail": "https://..."
          },
          "creator": {
            "id": 5,
            "fullName": "Chef Minh Nhật",
            "avatar": "https://..."
          }
        }
      ]
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

## 3. LẤY CHI TIẾT 1 ORDER (Public)

✅ **Không cần token** - Ai cũng có thể xem

### **Endpoint:**
```
GET /receipts/:id
```

### **Ví dụ:**

```bash
GET http://103.6.234.20:3003/receipts/1
```

### **Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "totalPrice": "150000",
    "status": "COMPLETED",
    "createdAt": "2025-12-26T06:00:00.000Z",
    "user": {
      "id": 1,
      "fullName": "Trần Thị Mai",
      "email": "user1@savore.com"
    },
    "orderItems": [
      {
        "id": 1,
        "productNameAtPurchase": "Thịt gà ta",
        "priceAtPurchase": "50000",
        "quantity": 2,
        "commissionRate": 10,
        "commissionAmount": "10000",
        "supplierAmount": "90000",
        "product": {
          "id": 1,
          "name": "Thịt gà ta",
          "price": "50000"
        },
        "sourcePost": {
          "id": "uuid",
          "name": "Gà xào sả ớt",
          "thumbnail": "https://..."
        },
        "creator": {
          "id": 5,
          "fullName": "Chef Minh Nhật",
          "avatar": "https://..."
        }
      }
    ]
  }
}
```

---

## 📊 TỔNG HỢP ENDPOINTS

| Endpoint | Method | Auth | Mô tả |
|----------|--------|------|-------|
| `/orders` | POST | 🔐 | Tạo order mới (trừ tiền wallet) |
| `/receipts/user/:userId` | GET | ✅ | Lấy orders của user |
| `/receipts/:id` | GET | ✅ | Lấy chi tiết 1 order |

---

## 💡 USE CASES THỰC TẾ

### **1. User mua nguyên liệu từ post:**

```bash
# User xem post "Gà xào sả ớt"
GET /posts/uuid-post-id

# User thấy ingredients cần mua
# User tạo order với sourcePostId và creatorId
POST /orders
{
  "orderItems": [
    {
      "productId": 1,  // Thịt gà
      "quantity": 1,
      "sourcePostId": "uuid-post-id",
      "creatorId": 5  // Creator của post
    }
  ]
}

# Kết quả:
# - User trả 50,000 VND
# - Creator nhận 5,000 VND commission (10%)
# - Supplier nhận 45,000 VND
```

### **2. User mua nguyên liệu trực tiếp:**

```bash
# User mua không qua post
POST /orders
{
  "orderItems": [
    {
      "productId": 1,
      "quantity": 1
      // Không có sourcePostId, creatorId
    }
  ]
}

# Kết quả:
# - User trả 50,000 VND
# - Supplier nhận 50,000 VND (không có commission)
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### **1. Wallet Balance:**
- User phải có đủ tiền trong wallet
- Tiền sẽ bị trừ **NGAY LẬP TỨC** khi tạo order
- Transaction được ghi lại với type "DEBIT"

### **2. Commission:**
- Chỉ tính commission khi có **CẢ** `sourcePostId` và `creatorId`
- Commission rate: **10%** của tổng giá trị order item
- Creator nhận commission, Supplier nhận phần còn lại

### **3. Order Status:**
- `PENDING`: Đơn hàng mới tạo
- `PROCESSING`: Đang xử lý
- `COMPLETED`: Hoàn thành
- `CANCELLED`: Đã hủy

### **4. Atomic Transaction:**
- Tạo order, trừ tiền wallet, tạo transaction đều trong 1 transaction
- Nếu 1 bước fail → tất cả đều rollback

---

## 🐛 XỬ LÝ LỖI

### **Lỗi: "Insufficient balance"**
```
Giải pháp: Nạp thêm tiền vào wallet hoặc giảm số lượng sản phẩm
```

### **Lỗi: "Wallet not found"**
```
Giải pháp: Liên hệ admin để tạo wallet
```

### **Lỗi: "Some products not found"**
```
Giải pháp: Kiểm tra lại productId có tồn tại không
```

### **Lỗi: "Unauthorized"**
```
Giải pháp: Login lại để lấy token mới
```

---

## 📝 CHECKLIST TẠO ORDER

- [ ] User đã login và có token
- [ ] Wallet có đủ tiền
- [ ] ProductIds hợp lệ và tồn tại
- [ ] Quantity > 0
- [ ] Nếu muốn commission: có cả sourcePostId và creatorId
- [ ] Test với Postman trước khi integrate FE

---

**Last Updated:** 2025-12-26  
**API Version:** 1.3.0  
**Base URL:** http://103.6.234.20:3003
