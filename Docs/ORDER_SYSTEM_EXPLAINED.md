# 📦 HƯỚNG DẪN CHI TIẾT: ORDER SYSTEM & PAYMENT FLOW

**Version:** 1.3.0  
**Last Updated:** 2025-12-26

---

## 📋 MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Cấu trúc dữ liệu](#2-cấu-trúc-dữ-liệu)
3. [Payment Flow chi tiết](#3-payment-flow-chi-tiết)
4. [Ví dụ thực tế](#4-ví-dụ-thực-tế)
5. [Câu hỏi thường gặp](#5-câu-hỏi-thường-gặp)

---

## 1. TỔNG QUAN HỆ THỐNG

### **Các thành phần chính:**

```
┌─────────────────────────────────────────────────────────┐
│                    ORDER SYSTEM                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  USER/CREATOR                                           │
│    ↓                                                    │
│  Tạo ORDER với PRODUCTS                                 │
│    ↓                                                    │
│  Hệ thống tự động:                                      │
│    1. Trừ tiền User Wallet                              │
│    2. Cộng tiền Supplier Wallet (95%)                   │
│    3. Cộng tiền Creator Wallet (5%) - nếu có            │
│    4. Tạo Transaction records                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### **Quyền hạn:**

| Role | POST Order | PATCH Order | GET Order |
|------|------------|-------------|-----------|
| USER | ✅ | ✅ (own) | ✅ |
| CREATOR | ✅ | ✅ (own) | ✅ |
| SUPPLIER | ❌ | ✅ (own) | ✅ |
| ADMIN | ✅ | ✅ (all) | ✅ |

---

## 2. CẤU TRÚC DỮ LIỆU

### **2.1. Suppliers (Nhà cung cấp)**

```javascript
// Suppliers là Users với role SUPPLIER
const suppliers = [
  {
    id: 5,
    email: "supplier1@savore.com",
    fullName: "Chợ Nông Sản Organic",
    address: "555 Điện Biên Phủ, Bình Thạnh, TP.HCM",
    roles: ["SUPPLIER"]
  },
  {
    id: 6,
    email: "supplier2@savore.com",
    fullName: "Thịt Tươi Sạch ABC",
    address: "666 Lý Thường Kiệt, Quận 10, TP.HCM",
    roles: ["SUPPLIER"]
  }
];
```

### **2.2. Products (Sản phẩm)**

```javascript
// Mỗi Product thuộc về 1 Supplier cụ thể
const products = [
  {
    id: 1,
    name: "Thịt gà ta",
    price: 150000,  // VND/kg
    supplierId: 5,  // Chợ Nông Sản Organic
    status: "ACTIVE"
  },
  {
    id: 2,
    name: "Thịt gà ta",  // Cùng tên nhưng khác supplier
    price: 140000,
    supplierId: 6,  // Thịt Tươi Sạch ABC
    status: "ACTIVE"
  },
  {
    id: 3,
    name: "Cà chua",
    price: 30000,
    supplierId: 5,  // Chợ Nông Sản Organic
    status: "ACTIVE"
  }
];
```

**Lưu ý quan trọng:**
- ✅ Nhiều suppliers có thể bán cùng 1 loại nguyên liệu
- ✅ Mỗi product có **supplierId** riêng
- ✅ User chọn **Product** (không phải Ingredient)
- ✅ Chỉ supplier của product đó nhận tiền

### **2.3. Order Structure**

```javascript
const order = {
  id: 1,
  userId: 1,  // User tạo order
  totalPrice: 200000,
  status: "PENDING",
  orderItems: [
    {
      id: 1,
      productId: 1,  // Thịt gà từ Chợ Nông Sản
      supplierId: 5,
      creatorId: 2,  // Creator của post gốc
      sourcePostId: "uuid-post-id",
      quantity: 1,
      priceAtPurchase: 150000,
      commissionRate: 5,
      commissionAmount: 7500,    // 5% của 150k
      supplierAmount: 142500     // 95% của 150k
    },
    {
      id: 2,
      productId: 3,  // Cà chua từ Chợ Nông Sản
      supplierId: 5,
      quantity: 1,
      priceAtPurchase: 50000,
      commissionRate: null,
      commissionAmount: null,
      supplierAmount: 50000      // 100% vì không có creator
    }
  ]
};
```

---

## 3. PAYMENT FLOW CHI TIẾT

### **3.1. Khi User tạo Order:**

```
Step 1: Validate
├─ Kiểm tra User có wallet không
├─ Kiểm tra Products có tồn tại không
└─ Kiểm tra wallet đủ tiền không

Step 2: Calculate
├─ Tính tổng giá order
├─ Tính commission cho từng item (5% nếu có creator)
└─ Nhóm payments theo supplierId và creatorId

Step 3: Execute Transaction (Atomic)
├─ Tạo Order record
├─ Trừ tiền User wallet
├─ Tạo User transaction (DEBIT)
├─ Cộng tiền Supplier wallets
├─ Tạo Supplier transactions (CREDIT)
├─ Cộng tiền Creator wallets (nếu có)
└─ Tạo Creator transactions (COMMISSION)
```

### **3.2. Commission Calculation:**

```javascript
// Với mỗi order item:
const itemTotal = product.price * quantity;

if (creatorId && sourcePostId) {
  // Có creator
  commissionRate = 5;
  commissionAmount = itemTotal * 0.05;  // 5%
  supplierAmount = itemTotal * 0.95;    // 95%
} else {
  // Không có creator
  commissionRate = 0;
  commissionAmount = 0;
  supplierAmount = itemTotal;           // 100%
}
```

### **3.3. Payment Aggregation:**

```javascript
// Nếu nhiều products từ cùng supplier
// → Cộng dồn payments

Order Items:
- Product 1: Thịt gà (Supplier A) → 142,500 VND
- Product 2: Cà chua (Supplier A) → 50,000 VND
- Product 3: Trứng (Supplier B) → 45,000 VND

Payments:
- Supplier A: 142,500 + 50,000 = 192,500 VND
- Supplier B: 45,000 VND
```

---

## 4. VÍ DỤ THỰC TẾ

### **Scenario 1: Order từ 1 Supplier, có Creator**

```javascript
// User xem post "Gà xào sả ớt" của Creator Minh Nhật
// User muốn mua nguyên liệu

POST /orders
{
  "orderItems": [
    {
      "productId": 1,        // Thịt gà từ Chợ Nông Sản
      "quantity": 1,
      "sourcePostId": "uuid-post-id",
      "creatorId": 2         // Minh Nhật
    }
  ]
}

// Kết quả:
// Product price: 150,000 VND

// User wallet: -150,000 VND
// Supplier (Chợ Nông Sản): +142,500 VND (95%)
// Creator (Minh Nhật): +7,500 VND (5%)
```

**Transactions được tạo:**

```javascript
// 1. User transaction
{
  walletId: 1,
  amount: -150000,
  type: "DEBIT",
  sourceType: "ORDER",
  sourceId: 1,
  balanceAfter: 850000
}

// 2. Supplier transaction
{
  walletId: 5,
  amount: 142500,
  type: "CREDIT",
  sourceType: "ORDER",
  sourceId: 1,
  balanceAfter: 1142500
}

// 3. Creator transaction
{
  walletId: 2,
  amount: 7500,
  type: "CREDIT",
  sourceType: "COMMISSION",
  sourceId: 1,
  balanceAfter: 507500
}
```

---

### **Scenario 2: Order từ nhiều Suppliers, không có Creator**

```javascript
POST /orders
{
  "orderItems": [
    {
      "productId": 1,    // Thịt gà từ Chợ Nông Sản
      "quantity": 1
    },
    {
      "productId": 2,    // Thịt gà từ Thịt Tươi Sạch ABC
      "quantity": 1
    }
  ]
}

// Kết quả:
// Product 1: 150,000 VND
// Product 2: 140,000 VND
// Total: 290,000 VND

// User wallet: -290,000 VND
// Supplier 1 (Chợ Nông Sản): +150,000 VND (100%)
// Supplier 2 (Thịt Tươi Sạch ABC): +140,000 VND (100%)
// Creator: 0 VND (không có)
```

---

### **Scenario 3: Order nhiều products từ cùng Supplier**

```javascript
POST /orders
{
  "orderItems": [
    {
      "productId": 1,    // Thịt gà từ Chợ Nông Sản
      "quantity": 1,
      "sourcePostId": "uuid",
      "creatorId": 2
    },
    {
      "productId": 3,    // Cà chua từ Chợ Nông Sản
      "quantity": 2
    }
  ]
}

// Kết quả:
// Product 1: 150,000 VND (có creator)
//   - Supplier: 142,500 VND
//   - Creator: 7,500 VND
// Product 3: 60,000 VND (không có creator)
//   - Supplier: 60,000 VND
// Total: 210,000 VND

// User wallet: -210,000 VND
// Supplier (Chợ Nông Sản): +202,500 VND (142,500 + 60,000)
// Creator: +7,500 VND
```

---

## 5. CÂU HỎI THƯỜNG GẶP

### **Q1: Nhiều suppliers bán cùng 1 nguyên liệu, ai nhận tiền?**

**A:** Chỉ supplier của **Product** mà user chọn nhận tiền.

**Ví dụ:**
```
Bách Hóa Xanh bán Thịt gà (Product ID: 1, 150k)
WinMart bán Thịt gà (Product ID: 2, 140k)

User chọn Product ID: 1
→ Chỉ Bách Hóa Xanh nhận tiền
```

---

### **Q2: Commission được tính như thế nào?**

**A:** 
- Nếu có `sourcePostId` và `creatorId`: **5%** cho creator, **95%** cho supplier
- Nếu không có: **100%** cho supplier

---

### **Q3: User mua nhiều products từ cùng supplier?**

**A:** Payments được **cộng dồn** cho supplier đó.

**Ví dụ:**
```
Product 1 (Supplier A): 100k → Supplier nhận 95k
Product 2 (Supplier A): 50k → Supplier nhận 47.5k
Total cho Supplier A: 142.5k
```

---

### **Q4: Nếu supplier không có wallet?**

**A:** Supplier sẽ **KHÔNG** nhận được tiền. Cần đảm bảo tất cả suppliers đều có wallet.

**Giải pháp:** Seed script tự động tạo wallet cho tất cả users.

---

### **Q5: Transaction có thể rollback không?**

**A:** Có! Tất cả operations (tạo order, trừ/cộng wallet, tạo transactions) được thực hiện trong **1 database transaction**. Nếu 1 bước fail → tất cả đều rollback.

---

### **Q6: User có thể hủy order không?**

**A:** Hiện tại chưa có API hủy order. Cần implement:
- `PATCH /orders/:id` với status "CANCELLED"
- Hoàn tiền về user wallet
- Trừ tiền từ supplier/creator wallets

---

### **Q7: Làm sao biết order từ post nào?**

**A:** Xem field `sourcePostId` trong `orderItems`. Nếu có → order từ post đó.

---

## 📊 TỔNG KẾT

### **Payment Formula:**

```
Total Order = Σ (Product Price × Quantity)

Với mỗi Order Item:
  Nếu có Creator:
    - Supplier Amount = Item Total × 95%
    - Creator Amount = Item Total × 5%
  Nếu không có Creator:
    - Supplier Amount = Item Total × 100%
    - Creator Amount = 0

User Wallet = User Wallet - Total Order
Supplier Wallet = Supplier Wallet + Σ Supplier Amounts
Creator Wallet = Creator Wallet + Σ Creator Amounts
```

### **Transaction Types:**

| Type | Description | Amount |
|------|-------------|--------|
| DEBIT | Trừ tiền (User mua hàng) | Negative |
| CREDIT | Cộng tiền (Supplier nhận tiền) | Positive |
| COMMISSION | Hoa hồng (Creator nhận) | Positive |

---

## 🔒 BẢO MẬT & VALIDATION

### **Checks trước khi tạo order:**

1. ✅ User có wallet không?
2. ✅ Products có tồn tại không?
3. ✅ Wallet đủ tiền không?
4. ✅ Quantity > 0?
5. ✅ ProductIds hợp lệ?

### **Atomic Transaction:**

```javascript
await prisma.$transaction(async (prisma) => {
  // Tất cả operations ở đây
  // Nếu 1 cái fail → tất cả rollback
});
```

---

**Last Updated:** 2025-12-26  
**Version:** 1.3.0  
**Author:** Backend Team
