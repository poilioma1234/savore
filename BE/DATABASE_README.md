# Savore Database Documentation

## 📊 Tổng quan Database

Database này được thiết kế cho hệ thống thương mại điện tử kết hợp nội dung sáng tạo (Content Commerce Platform), nơi Creator có thể tạo nội dung (video nấu ăn, bài viết) và kiếm hoa hồng từ việc bán sản phẩm được giới thiệu trong nội dung.

## 🗄️ Cấu trúc Database

### 1. **users** - Quản lý người dùng
- Lưu thông tin định danh và đăng nhập
- Một user có thể có nhiều vai trò (roles)

### 2. **roles** - Định nghĩa vai trò
- 4 vai trò: `ADMIN`, `CREATOR`, `USER`, `SUPPLIER`
- Mỗi user có thể có nhiều vai trò thông qua bảng `user_roles`

### 3. **user_roles** - Gán vai trò cho user
- Bảng trung gian giữa `users` và `roles`
- Cho phép một user đóng nhiều vai trò

### 4. **wallets** - Ví điện tử
- Mỗi user có một ví
- Lưu số dư hiện tại (balance)
- Mặc định sử dụng đơn vị tiền tệ VND

### 5. **transactions** - Lịch sử giao dịch
- Ghi lại mọi biến động tiền trong ví
- Các loại giao dịch: `ORDER`, `COMMISSION`, `REFUND`, `WITHDRAW`
- Lưu snapshot số dư sau mỗi giao dịch

### 6. **products** - Sản phẩm
- Sản phẩm do Supplier đăng bán
- Trạng thái: `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`

### 7. **posts** - Nội dung sáng tạo
- Video nấu ăn, bài viết do Creator tạo
- Trạng thái: `DRAFT`, `PUBLISHED`, `BLOCKED`

### 8. **recipe_ingredients** - Nguyên liệu công thức
- Liên kết giữa bài viết và sản phẩm
- Xác định video/bài viết cần những sản phẩm nào

### 9. **orders** - Đơn hàng
- Quản lý đơn hàng tổng quan
- Trạng thái: `PENDING`, `PAID`, `COMPLETED`, `CANCELLED`

### 10. **order_items** - Chi tiết đơn hàng (CORE TABLE)
- Lưu chi tiết từng sản phẩm trong đơn hàng
- **Snapshot pricing**: Lưu giá và hoa hồng tại thời điểm mua
- Liên kết với Creator nếu mua từ bài viết của họ

### 11. **commissions** - Hoa hồng
- Quản lý hoa hồng trả cho Creator
- Trạng thái: `PENDING`, `PAID`

## 🚀 Cài đặt và Sử dụng

### Yêu cầu
- PostgreSQL 12+
- Node.js 18+
- npm hoặc yarn

### Bước 1: Cấu hình Database
Tạo file `.env` trong thư mục `BE`:
```env
DATABASE_URL="postgres://postgres:database@localhost:5432/test_db"
```

### Bước 2: Cài đặt dependencies
```bash
cd BE
npm install
```

### Bước 3: Chạy Migration
```bash
npx prisma migrate dev
```

### Bước 4: Seed dữ liệu mẫu
```bash
npx prisma db seed
# hoặc
node prisma/seed.mjs
```

Sau khi seed, bạn sẽ có:
- 4 roles: ADMIN, CREATOR, USER, SUPPLIER
- 1 admin user:
  - Email: `admin@savore.com`
  - Password: `admin123`

### Bước 5: Xem database
```bash
npx prisma studio
```

## 📝 Các lệnh hữu ích

### Generate Prisma Client
```bash
npx prisma generate
```

### Tạo migration mới
```bash
npx prisma migrate dev --name ten_migration
```

### Reset database (XÓA TẤT CẢ DỮ LIỆU)
```bash
npx prisma migrate reset
```

### Format schema
```bash
npx prisma format
```

## 🔄 Luồng hoạt động chính

### 1. Luồng đăng ký và phân quyền
1. User đăng ký → Tạo record trong `users`
2. Gán role → Tạo record trong `user_roles`
3. Tạo ví → Tạo record trong `wallets`

### 2. Luồng Creator tạo nội dung
1. Creator tạo bài viết → Tạo record trong `posts`
2. Thêm sản phẩm vào công thức → Tạo record trong `recipe_ingredients`
3. Publish bài viết → Update `status` = 'PUBLISHED'

### 3. Luồng mua hàng
1. User tạo đơn hàng → Tạo record trong `orders`
2. Thêm sản phẩm vào giỏ → Tạo record trong `order_items`
   - Lưu `price_at_purchase` (giá tại thời điểm mua)
   - Lưu `commission_rate` và `commission_amount`
   - Lưu `source_post_id` nếu mua từ bài viết
3. Thanh toán → Update `status` = 'PAID'
4. Tạo hoa hồng cho Creator → Tạo record trong `commissions`

### 4. Luồng thanh toán hoa hồng
1. Admin duyệt hoa hồng → Update `commissions.status` = 'PAID'
2. Cộng tiền vào ví Creator → Tạo record trong `transactions`
3. Update số dư ví → Update `wallets.balance`

## ⚠️ Lưu ý quan trọng

### Snapshot Pricing
Bảng `order_items` lưu **snapshot** của giá và hoa hồng tại thời điểm mua. Điều này rất quan trọng vì:
- Giá sản phẩm có thể thay đổi theo thời gian
- Tỷ lệ hoa hồng có thể thay đổi
- Cần đảm bảo tính chính xác khi đối soát tài chính

### Cascade Delete
- Xóa User → Xóa tất cả posts, products, orders của user đó
- Xóa Order → Xóa tất cả order_items
- Xóa OrderItem → Xóa tất cả commissions liên quan

### Restrict Delete
- Không thể xóa Product nếu đã có order_items
- Không thể xóa User (supplier/creator) nếu đã có order_items

## 🔐 Bảo mật

- Password được hash bằng bcrypt (salt rounds: 10)
- Không lưu password dạng plain text
- Sử dụng environment variables cho connection string

## 📚 Tài liệu tham khảo

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)

## 🤝 Đóng góp

Nếu cần thêm bảng hoặc thay đổi cấu trúc, vui lòng:
1. Cập nhật file `schema.prisma`
2. Chạy `npx prisma migrate dev --name ten_migration`
3. Cập nhật file README này

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-22
