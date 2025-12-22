# Database Entity Relationship Diagram (ERD)

## Savore Platform - Database Schema

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ password_hash   │
│ full_name       │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         ├──────────────────────────────────────┐
         │                                      │
         │                                      │
┌────────▼────────┐                   ┌────────▼────────┐
│   USER_ROLES    │                   │    WALLETS      │
├─────────────────┤                   ├─────────────────┤
│ user_id (FK)    │                   │ id (PK)         │
│ role_id (FK)    │                   │ user_id (FK)    │
│ created_at      │                   │ balance         │
└────────┬────────┘                   │ currency        │
         │                            │ created_at      │
         │ N:1                        └────────┬────────┘
         │                                     │
┌────────▼────────┐                           │ 1:N
│     ROLES       │                           │
├─────────────────┤                  ┌────────▼────────────┐
│ id (PK)         │                  │   TRANSACTIONS      │
│ code (UNIQUE)   │                  ├─────────────────────┤
└─────────────────┘                  │ id (PK)             │
                                     │ wallet_id (FK)      │
                                     │ amount              │
                                     │ type                │
                                     │ source_type         │
                                     │ source_id           │
                                     │ balance_after       │
                                     │ status              │
                                     │ created_at          │
                                     └─────────────────────┘

┌─────────────────┐
│    PRODUCTS     │
├─────────────────┤
│ id (PK)         │
│ supplier_id (FK)│──┐
│ name            │  │
│ price           │  │ N:1
│ status          │  │
│ created_at      │  │
└────────┬────────┘  │
         │           │
         │ 1:N       │
         │           │
┌────────▼────────┐  │
│RECIPE_INGREDIENT│  │
├─────────────────┤  │
│ id (PK)         │  │
│ post_id (FK)    │  │
│ product_id (FK) │  │
│ quantity_needed │  │
└────────┬────────┘  │
         │           │
         │ N:1       │
         │           │
┌────────▼────────┐  │
│     POSTS       │  │
├─────────────────┤  │
│ id (PK)         │  │
│ creator_id (FK) │──┼──┐
│ title           │  │  │
│ video_url       │  │  │ N:1
│ status          │  │  │
│ created_at      │  │  │
└─────────────────┘  │  │
                     │  │
                     │  │
┌─────────────────┐  │  │
│     ORDERS      │  │  │
├─────────────────┤  │  │
│ id (PK)         │  │  │
│ user_id (FK)    │──┼──┤
│ total_price     │  │  │
│ status          │  │  │
│ created_at      │  │  │
└────────┬────────┘  │  │
         │           │  │
         │ 1:N       │  │
         │           │  │
┌────────▼────────────────────────┐
│        ORDER_ITEMS              │
│      (CORE FACT TABLE)          │
├─────────────────────────────────┤
│ id (PK)                         │
│ order_id (FK)                   │
│ product_id (FK)                 │
│ supplier_id (FK)                │──┘
│ creator_id (FK, nullable)       │────┘
│ source_post_id (FK, nullable)   │
│ product_name_at_purchase        │
│ price_at_purchase               │
│ quantity                        │
│ commission_rate                 │
│ commission_amount               │
│ supplier_amount                 │
│ created_at                      │
└────────┬────────────────────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│  COMMISSIONS    │
├─────────────────┤
│ id (PK)         │
│ order_item_id   │
│ creator_id (FK) │
│ amount          │
│ status          │
│ created_at      │
└─────────────────┘
```

## Relationships Summary

### One-to-Many (1:N)
- **User → UserRoles**: Một user có nhiều roles
- **User → Wallets**: Một user có một wallet (1:1)
- **User → Products**: Một supplier có nhiều products
- **User → Posts**: Một creator có nhiều posts
- **User → Orders**: Một user có nhiều orders
- **Wallet → Transactions**: Một wallet có nhiều transactions
- **Post → RecipeIngredients**: Một post có nhiều ingredients
- **Product → RecipeIngredients**: Một product có thể trong nhiều recipes
- **Order → OrderItems**: Một order có nhiều items
- **OrderItem → Commissions**: Một order item có thể có nhiều commissions

### Many-to-One (N:1)
- **UserRoles → Role**: Nhiều user_roles thuộc một role
- **Products → User (Supplier)**: Nhiều products thuộc một supplier
- **Posts → User (Creator)**: Nhiều posts thuộc một creator
- **Orders → User**: Nhiều orders thuộc một user
- **OrderItems → Product**: Nhiều order items tham chiếu một product
- **OrderItems → User (Supplier)**: Nhiều order items thuộc một supplier
- **OrderItems → User (Creator)**: Nhiều order items có thể thuộc một creator
- **OrderItems → Post**: Nhiều order items có thể từ một post
- **Commissions → User (Creator)**: Nhiều commissions thuộc một creator

## Key Features

### Cascade Delete (ON DELETE CASCADE)
- Xóa User → Xóa UserRoles, Wallet, Products, Posts, Orders
- Xóa Order → Xóa OrderItems
- Xóa OrderItem → Xóa Commissions
- Xóa Post → Xóa RecipeIngredients

### Restrict Delete (ON DELETE RESTRICT)
- Không thể xóa Product nếu có OrderItems
- Không thể xóa User (supplier/creator) nếu có OrderItems
- Không thể xóa User (creator) nếu có Commissions

### Set Null (ON DELETE SET NULL)
- Xóa Creator → Set creator_id = NULL trong OrderItems
- Xóa Post → Set source_post_id = NULL trong OrderItems

## Indexes

### Unique Indexes
- `users.email` - Đảm bảo email duy nhất
- `roles.code` - Đảm bảo mã role duy nhất
- `user_roles(user_id, role_id)` - Đảm bảo không trùng lặp role cho user
- `wallets.user_id` - Một user chỉ có một wallet

### Primary Keys (Auto-indexed)
- Tất cả các bảng đều có `id` làm primary key với SERIAL (auto-increment)

## Data Types

### Numeric
- `SERIAL` - Auto-increment integer cho primary keys
- `INTEGER` - Foreign keys và các giá trị số nguyên
- `DECIMAL(15,2)` - Tiền tệ (balance, price, amount)
- `DECIMAL(10,2)` - Số lượng (quantity)
- `DECIMAL(5,2)` - Tỷ lệ phần trăm (commission_rate)

### Text
- `TEXT` - Strings không giới hạn (email, name, status, etc.)

### DateTime
- `TIMESTAMP(3)` - Timestamps với millisecond precision
- `DEFAULT CURRENT_TIMESTAMP` - Tự động set thời gian tạo

## Business Logic Highlights

### Snapshot Pricing
Bảng `order_items` lưu giá và hoa hồng tại thời điểm mua:
- `product_name_at_purchase` - Tên sản phẩm khi mua
- `price_at_purchase` - Giá khi mua
- `commission_rate` - Tỷ lệ hoa hồng khi mua
- `commission_amount` - Số tiền hoa hồng khi mua
- `supplier_amount` - Số tiền supplier nhận

### Multi-Role System
User có thể có nhiều vai trò đồng thời:
- Vừa là USER (mua hàng)
- Vừa là CREATOR (tạo nội dung)
- Vừa là SUPPLIER (bán hàng)

### Commission Tracking
Hệ thống theo dõi hoa hồng qua 2 bảng:
1. `order_items.commission_amount` - Số tiền hoa hồng được tính
2. `commissions` - Quản lý trạng thái thanh toán hoa hồng

---

**Generated**: 2025-12-22  
**Database**: PostgreSQL  
**ORM**: Prisma 7.2.0
