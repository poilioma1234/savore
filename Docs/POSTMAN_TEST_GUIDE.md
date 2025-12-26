# 🧪 HƯỚNG DẪN TEST ORDER API TRÊN POSTMAN

**Base URL:** `http://103.6.234.20:3003`  
**Version:** 1.0  
**Last Updated:** 2025-12-26

---

## 📋 MỤC LỤC

1. [Chuẩn bị](#1-chuẩn-bị)
2. [Login và lấy token](#2-login-và-lấy-token)
3. [Kiểm tra wallet hiện tại](#3-kiểm-tra-wallet-hiện-tại)
4. [Lấy danh sách products](#4-lấy-danh-sách-products)
5. [Tạo order](#5-tạo-order)
6. [Kiểm tra wallet sau khi order](#6-kiểm-tra-wallet-sau-khi-order)
7. [Kiểm tra order đã tạo](#7-kiểm-tra-order-đã-tạo)

---

## 1. CHUẨN BỊ

### **1.1. Mở Postman**

- Download Postman: https://www.postman.com/downloads/
- Hoặc dùng Postman Web

### **1.2. Tạo Collection mới**

1. Click **New** → **Collection**
2. Đặt tên: `Savore API Testing`
3. Click **Create**

### **1.3. Set Base URL**

1. Click vào Collection `Savore API Testing`
2. Tab **Variables**
3. Thêm variable:
   - Variable: `baseUrl`
   - Initial Value: `http://103.6.234.20:3003`
   - Current Value: `http://103.6.234.20:3003`
4. Click **Save**

---

## 2. LOGIN VÀ LẤY TOKEN

### **2.1. Tạo request Login**

1. Click **Add request** trong Collection
2. Đặt tên: `Login User`
3. Method: **POST**
4. URL: `{{baseUrl}}/auth/login`

### **2.2. Set Body**

1. Tab **Body**
2. Chọn **raw**
3. Chọn **JSON**
4. Nhập:

```json
{
  "email": "user1@savore.com",
  "password": "user123"
}
```

### **2.3. Send Request**

Click **Send**

### **2.4. Response mong đợi:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 6,
    "email": "user1@savore.com",
    "fullName": "Trần Thị Mai",
    "roles": ["USER"]
  }
}
```

### **2.5. Lưu token tự động**

1. Tab **Tests** (trong request Login)
2. Nhập code:

```javascript
// Lưu token vào Collection variable
const response = pm.response.json();
if (response.accessToken) {
    pm.collectionVariables.set("authToken", response.accessToken);
    console.log("✅ Token saved:", response.accessToken);
}
```

3. Click **Save**
4. Send lại request → Token sẽ được lưu tự động

---

## 3. KIỂM TRA WALLET HIỆN TẠI

### **3.1. Tạo request Get Profile**

1. Click **Add request**
2. Đặt tên: `Get My Profile`
3. Method: **GET**
4. URL: `{{baseUrl}}/auth/profile`

### **3.2. Set Authorization**

1. Tab **Authorization**
2. Type: **Bearer Token**
3. Token: `{{authToken}}`

### **3.3. Send Request**

Click **Send**

### **3.4. Response mong đợi:**

```json
{
  "id": 6,
  "email": "user1@savore.com",
  "fullName": "Trần Thị Mai",
  "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
  "avatar": "https://ui-avatars.com/api/?name=Trần+Thị+Mai&background=random",
  "roles": ["USER"],
  "wallet": {
    "id": 6,
    "balance": "1000000.00",  // ← Số dư hiện tại
    "currency": "VND"
  }
}
```

**Ghi chú:** Wallet balance = **1,000,000 VND**

---

## 4. LẤY DANH SÁCH PRODUCTS

### **4.1. Tạo request Get Products**

1. Click **Add request**
2. Đặt tên: `Get All Products`
3. Method: **GET**
4. URL: `{{baseUrl}}/products`

### **4.2. Send Request**

Click **Send** (không cần token, API public)

### **4.3. Response mong đợi:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Thịt gà ta",
      "price": "150000.00",
      "status": "ACTIVE",
      "supplierId": 1,
      "supplier": {
        "id": 1,
        "fullName": "Chợ Nông Sản Organic",
        "email": "supplier1@savore.com"
      }
    },
    {
      "id": 2,
      "name": "Thịt bò",
      "price": "200000.00",
      "status": "ACTIVE",
      "supplierId": 2,
      "supplier": {
        "id": 2,
        "fullName": "Thịt Tươi Sạch ABC"
      }
    }
  ]
}
```

**Ghi chú:** Copy `id` của products muốn mua (ví dụ: `1`, `2`)

---

## 5. TẠO ORDER

### **5.1. Tạo request Create Order**

1. Click **Add request**
2. Đặt tên: `Create Order`
3. Method: **POST**
4. URL: `{{baseUrl}}/orders`

### **5.2. Set Authorization**

1. Tab **Authorization**
2. Type: **Bearer Token**
3. Token: `{{authToken}}`

### **5.3. Set Body**

1. Tab **Body**
2. Chọn **raw**
3. Chọn **JSON**
4. Nhập:

```json
{
  "orderItems": [
    {
      "productId": 1,
      "quantity": 1
    }
  ]
}
```

**Hoặc nếu muốn order từ post (có commission):**

```json
{
  "orderItems": [
    {
      "productId": 1,
      "quantity": 1,
      "sourcePostId": "uuid-post-id",
      "creatorId": 2
    }
  ]
}
```

### **5.4. Send Request**

Click **Send**

### **5.5. Response mong đợi:**

```json
{
  "success": true,
  "message": "Order created successfully. Payment processed.",
  "data": {
    "id": 1,
    "userId": 6,
    "totalPrice": "150000",
    "status": "PENDING",
    "createdAt": "2025-12-26T06:35:00.000Z",
    "userWalletBalance": 850000,  // ← Số dư mới (1,000,000 - 150,000)
    "orderItems": [
      {
        "id": 1,
        "productId": 1,
        "productNameAtPurchase": "Thịt gà ta",
        "priceAtPurchase": "150000",
        "quantity": 1,
        "commissionRate": null,
        "commissionAmount": null,
        "supplierAmount": "150000",
        "product": {
          "id": 1,
          "name": "Thịt gà ta",
          "price": "150000"
        }
      }
    ],
    "paymentSummary": {
      "total": 150000,
      "suppliers": [
        {
          "supplierId": 1,
          "amount": 150000,
          "percentage": 95
        }
      ],
      "creators": []
    }
  }
}
```

**Ghi chú:** 
- User wallet: **850,000 VND** (đã trừ 150,000)
- Supplier nhận: **150,000 VND** (100% vì không có creator)

---

## 6. KIỂM TRA WALLET SAU KHI ORDER

### **6.1. Gọi lại Get Profile**

1. Chọn request `Get My Profile`
2. Click **Send**

### **6.2. Response:**

```json
{
  "id": 6,
  "email": "user1@savore.com",
  "fullName": "Trần Thị Mai",
  "wallet": {
    "id": 6,
    "balance": "850000.00",  // ← Đã giảm từ 1,000,000 → 850,000
    "currency": "VND"
  }
}
```

**Xác nhận:** Wallet đã bị trừ **150,000 VND** ✅

---

## 7. KIỂM TRA ORDER ĐÃ TẠO

### **7.1. Tạo request Get My Orders**

1. Click **Add request**
2. Đặt tên: `Get My Orders`
3. Method: **GET**
4. URL: `{{baseUrl}}/receipts/user/6`  (6 là userId của bạn)

### **7.2. Send Request**

Click **Send** (không cần token, API public)

### **7.3. Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 6,
      "totalPrice": "150000",
      "status": "PENDING",
      "createdAt": "2025-12-26T06:35:00.000Z",
      "orderItems": [
        {
          "id": 1,
          "productNameAtPurchase": "Thịt gà ta",
          "priceAtPurchase": "150000",
          "quantity": 1,
          "product": {
            "id": 1,
            "name": "Thịt gà ta"
          }
        }
      ]
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

## 🎯 WORKFLOW TỔNG HỢP

```
1. Login
   POST /auth/login
   → Lấy accessToken
   → Lưu vào {{authToken}}

2. Kiểm tra wallet
   GET /auth/profile
   → Xem balance: 1,000,000 VND

3. Xem products
   GET /products
   → Chọn productId: 1

4. Tạo order
   POST /orders
   Body: { "orderItems": [{ "productId": 1, "quantity": 1 }] }
   → Response: userWalletBalance: 850,000

5. Kiểm tra wallet lại
   GET /auth/profile
   → Xem balance: 850,000 VND ✅

6. Xem orders
   GET /receipts/user/6
   → Thấy order vừa tạo
```

---

## 📊 BẢNG SO SÁNH

| Bước | Wallet Balance | Thay đổi |
|------|----------------|----------|
| Ban đầu | 1,000,000 VND | - |
| Sau order (150k) | 850,000 VND | -150,000 |
| Sau order (200k) | 650,000 VND | -200,000 |

---

## 🧪 TEST CASES

### **Test Case 1: Order thành công**

```json
POST /orders
{
  "orderItems": [
    { "productId": 1, "quantity": 1 }
  ]
}

Expected:
- Status: 201
- Wallet giảm 150,000
- Order được tạo
```

### **Test Case 2: Wallet không đủ tiền**

```json
POST /orders
{
  "orderItems": [
    { "productId": 1, "quantity": 100 }  // 15,000,000 VND
  ]
}

Expected:
- Status: 400
- Message: "Insufficient balance. Required: 15,000,000 VND, Available: 850,000 VND"
```

### **Test Case 3: Product không tồn tại**

```json
POST /orders
{
  "orderItems": [
    { "productId": 999, "quantity": 1 }
  ]
}

Expected:
- Status: 400
- Message: "Some products not found"
```

### **Test Case 4: Order với commission**

```json
POST /orders
{
  "orderItems": [
    {
      "productId": 1,
      "quantity": 1,
      "sourcePostId": "uuid-post-id",
      "creatorId": 2
    }
  ]
}

Expected:
- Status: 201
- Supplier nhận: 142,500 (95%)
- Creator nhận: 7,500 (5%)
```

---

## 💡 TIPS & TRICKS

### **1. Lưu token tự động**

Thêm vào **Tests** của request Login:
```javascript
const response = pm.response.json();
pm.collectionVariables.set("authToken", response.accessToken);
```

### **2. Lưu userId tự động**

Thêm vào **Tests** của request Login:
```javascript
const response = pm.response.json();
pm.collectionVariables.set("userId", response.user.id);
```

Sau đó dùng: `{{baseUrl}}/receipts/user/{{userId}}`

### **3. Kiểm tra response nhanh**

Thêm vào **Tests**:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Wallet balance decreased", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.userWalletBalance).to.be.below(1000000);
});
```

---

## 🐛 TROUBLESHOOTING

### **Lỗi: "Unauthorized"**

**Nguyên nhân:** Token hết hạn hoặc không đúng

**Giải pháp:**
1. Login lại
2. Copy token mới
3. Paste vào Authorization

### **Lỗi: "Insufficient balance"**

**Nguyên nhân:** Wallet không đủ tiền

**Giải pháp:**
1. Kiểm tra wallet balance
2. Giảm quantity
3. Hoặc nạp thêm tiền (liên hệ admin)

### **Lỗi: "Product not found"**

**Nguyên nhân:** ProductId không tồn tại

**Giải pháp:**
1. Gọi GET /products
2. Copy productId đúng

---

## ✅ CHECKLIST

- [ ] Đã login thành công
- [ ] Đã lưu token vào {{authToken}}
- [ ] Đã kiểm tra wallet balance ban đầu
- [ ] Đã lấy danh sách products
- [ ] Đã tạo order thành công
- [ ] Wallet balance đã giảm đúng số tiền
- [ ] Order xuất hiện trong danh sách orders

---

**Last Updated:** 2025-12-26  
**Base URL:** http://103.6.234.20:3003  
**Author:** Backend Team
