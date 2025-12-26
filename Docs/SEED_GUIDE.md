# 🌱 HƯỚNG DẪN SEED DATABASE

**Ngày cập nhật:** 2025-12-26  
**Version:** 1.1.0

---

## 📋 DANH SÁCH CÁC FILE SEED

Có **5 file seed** riêng biệt trong thư mục `BE/prisma/`:

1. **`seed-users.mjs`** - Seed 19 users với multi-role
2. **`seed-tags.mjs`** - Seed 41 tags phân loại món ăn
3. **`seed-ingredients.mjs`** - Seed 28 nguyên liệu với giá
4. **`seed-posts.mjs`** - Seed 17 posts (công thức nấu ăn) ⭐ MỚI
5. **`seed.mjs`** - Seed đầy đủ (cũ, chỉ dùng khi cần reset toàn bộ)

---

## ⚡ CÁCH CHẠY SEED

### **Option 1: Chạy từng file riêng lẻ (KHUYẾN NGHỊ)**

Chạy theo thứ tự sau:

```bash
# Bước 1: Seed users (19 users với multi-role)
node prisma/seed-users.mjs

# Bước 2: Seed tags (41 tags)
node prisma/seed-tags.mjs

# Bước 3: Seed ingredients (28 nguyên liệu với giá)
node prisma/seed-ingredients.mjs

# Bước 4: Seed posts (17 công thức nấu ăn)
node prisma/seed-posts.mjs
```

**Lợi ích:**
- ✅ Linh hoạt, chỉ seed phần cần thiết
- ✅ Không mất dữ liệu cũ
- ✅ Dễ debug khi có lỗi

---

### **Option 2: Reset toàn bộ database**

⚠️ **CẢNH BÁO:** Sẽ XÓA TẤT CẢ dữ liệu!

```bash
# Reset database và chạy migration
npx prisma migrate reset

# Sau đó chạy lại seed theo Option 1
```

---

## 📊 DỮ LIỆU SAU KHI SEED

### **1. Users (19 users)**

| Loại | Số lượng | Email Pattern | Password |
|------|----------|---------------|----------|
| Admin | 1 | `admin@savore.com` | `admin123` |
| Suppliers | 5 | `supplier1-5@savore.com` | `supplier123` |
| Users | 5 | `user1-5@savore.com` | `user123` |
| Creators | 5 | `creator1-5@savore.com` | `creator123` |
| Multi-role | 3 | `hybrid1-3@savore.com` | `hybrid123` |

**Multi-role users:**
- `hybrid1@savore.com` - USER + CREATOR
- `hybrid2@savore.com` - USER + SUPPLIER  
- `hybrid3@savore.com` - CREATOR + SUPPLIER

---

### **2. Ingredients (28 nguyên liệu)**

| Loại | Số lượng | Ví dụ | Giá (VND/kg) |
|------|----------|-------|--------------|
| Thịt | 6 | Thịt gà ta, Thịt bò Úc, Thịt heo ba chỉ | 85,000 - 360,000 |
| Hải sản | 3 | Tôm sú, Cá hồi, Mực ống | 180,000 - 520,000 |
| Gia vị | 8 | Sả, Ớt, Tỏi, Nước mắm | 8,000 - 50,000 |
| Rau củ | 7 | Rau muống, Cà chua, Khoai tây | 15,000 - 30,000 |
| Trứng | 2 | Trứng gà, Trứng vịt | 45,000 - 50,000 |
| Nấm | 2 | Nấm hương khô, Nấm rơm | 35,000 - 280,000 |

**Thống kê giá:**
- Giá thấp nhất: 8,000 VND/kg (Muối)
- Giá cao nhất: 520,000 VND/kg (Cá hồi Na Uy)
- Giá trung bình: ~109,500 VND/kg

---

### **3. Tags (41 tags)**

Các nhóm tags:
- **Loại thịt:** Gà, Bò, Heo, Cá, Tôm, Mực, Vịt, Dê
- **Rau củ:** Rau, Củ, Nấm, Đậu
- **Món ăn:** Canh, Xào, Chiên, Nướng, Hấp, Luộc, Kho, Rim, Gỏi, Salad
- **Món chính:** Cơm, Bún, Phở, Mì, Bánh
- **Đặc biệt:** Chay, Healthy, Ăn kiêng, Ăn vặt, Tráng miệng, Đồ uống
- **Vùng miền:** Miền Bắc, Miền Trung, Miền Nam
- **Quốc tế:** Nhật Bản, Hàn Quốc, Thái Lan, Trung Quốc, Âu Mỹ

---

## 🔄 WORKFLOW SEED ĐÚNG

```
┌─────────────────────────────────────┐
│  1. Migration (nếu cần)             │
│  npx prisma migrate dev             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  2. Seed Users                      │
│  node prisma/seed-users.mjs         │
│  → Tạo 19 users + roles + wallets  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  3. Seed Ingredients                │
│  node prisma/seed-ingredients.mjs   │
│  → Tạo 28 ingredients với giá      │
│  → Tự động lấy suppliers từ DB     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  4. Seed Tags                       │
│  node prisma/seed-tags.mjs          │
│  → Tạo 41 tags (skip nếu đã có)   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  5. Seed Posts                      │
│  node prisma/seed-posts.mjs         │
│  → Tạo 17 posts với recipeItems    │
│  → Phân phối đều cho creators      │
└─────────────────────────────────────┘
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### ❌ **KHÔNG NÊN:**
- ❌ Chạy `seed.mjs` khi đã có dữ liệu users phức tạp
- ❌ Chạy `npx prisma db push` mà không backup
- ❌ Chạy `npx prisma migrate reset` trên production

### ✅ **NÊN:**
- ✅ Chạy từng file seed riêng lẻ
- ✅ Kiểm tra dữ liệu trước khi seed
- ✅ Backup database trước khi reset
- ✅ Sử dụng `upsert` để tránh duplicate

---

## 🐛 XỬ LÝ LỖI

### **Lỗi: "Need at least 2 suppliers"**
```bash
# Chạy seed-users.mjs trước
node prisma/seed-users.mjs
```

### **Lỗi: "Unique constraint failed"**
```bash
# Ingredient hoặc tag đã tồn tại, có thể bỏ qua
# Hoặc xóa dữ liệu cũ trước khi seed lại
```

### **Lỗi: Migration pending**
```bash
# Chạy migration trước
npx prisma migrate dev
```

---

## 📝 SCRIPT SHORTCUTS (Tùy chọn)

Thêm vào `package.json`:

```json
{
  "scripts": {
    "seed:users": "node prisma/seed-users.mjs",
    "seed:tags": "node prisma/seed-tags.mjs",
    "seed:ingredients": "node prisma/seed-ingredients.mjs",
    "seed:posts": "node prisma/seed-posts.mjs",
    "seed:all": "npm run seed:users && npm run seed:tags && npm run seed:ingredients && npm run seed:posts"
  }
}
```

Sau đó chạy:
```bash
npm run seed:all
```

---

## 🎯 TỔNG KẾT

Sau khi chạy đầy đủ 4 file seed, database sẽ có:

✅ **19 users** (1 admin + 5 suppliers + 5 users + 5 creators + 3 multi-role)  
✅ **41 tags** phân loại món ăn  
✅ **28 ingredients** với giá từ 8,000 - 520,000 VND/kg  
✅ **17 posts** (công thức nấu ăn) với recipeItems  
✅ **4 roles** (ADMIN, CREATOR, USER, SUPPLIER)  
✅ **19 wallets** (mỗi user có 1 wallet)

**Tổng:** ~130+ records, sẵn sàng để test API! 🚀

---

**Last Updated:** 2025-12-26  
**Maintained by:** Backend Team
