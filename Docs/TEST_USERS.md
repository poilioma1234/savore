# 👥 DANH SÁCH 15 USERS TEST

## 📊 TỔNG QUAN

- **1 Admin**
- **5 Suppliers** (Nhà cung cấp)
- **5 Users** (Khách hàng)
- **5 Creators** (Người tạo nội dung)

**Tổng:** 16 users

---

## 🔐 ADMIN (1)

| Email | Password | Tên | Mô tả |
|-------|----------|-----|-------|
| admin@savore.com | admin123 | Admin Savore | Quản trị viên hệ thống |

---

## 🏪 SUPPLIERS (5)

| Email | Password | Tên | Chuyên môn |
|-------|----------|-----|------------|
| supplier1@savore.com | supplier123 | Chợ Nông Sản Organic | Rau củ quả hữu cơ |
| supplier2@savore.com | supplier123 | Thịt Tươi Sạch ABC | Thịt gà, bò, heo sạch |
| supplier3@savore.com | supplier123 | Hải Sản Tươi Sống 247 | Hải sản tươi sống 24/7 |
| supplier4@savore.com | supplier123 | Gia Vị Nhập Khẩu XYZ | Gia vị cao cấp Nhật, Hàn, Thái |
| supplier5@savore.com | supplier123 | Nông Trại Đà Lạt Fresh | Rau củ Đà Lạt tươi |

---

## 👥 USERS - Khách hàng (5)

| Email | Password | Tên | Profile |
|-------|----------|-----|---------|
| user1@savore.com | user123 | Trần Thị Mai | Yêu thích nấu ăn, khám phá món mới |
| user2@savore.com | user123 | Lê Văn Hùng | Thích ăn healthy, ăn sạch |
| user3@savore.com | user123 | Phạm Thị Lan | Mẹ bỉm sữa, món nhanh cho gia đình |
| user4@savore.com | user123 | Nguyễn Văn Tuấn | Sinh viên, nấu ăn tiết kiệm |
| user5@savore.com | user123 | Hoàng Thị Hoa | Food blogger, review món ngon |

---

## 👨‍🍳 CREATORS - Người tạo nội dung (5)

| Email | Password | Tên | Chuyên môn |
|-------|----------|-----|------------|
| creator1@savore.com | creator123 | Chef Minh Nhật | Món Việt truyền thống, 10 năm kinh nghiệm |
| creator2@savore.com | creator123 | Bếp Trưởng Thanh Hương | Món Âu, từng làm tại Pháp 5 năm |
| creator3@savore.com | creator123 | Anh Tuấn Cooking | YouTuber 500k subs, chuyên món Á |
| creator4@savore.com | creator123 | Chị Ngọc Healthy Kitchen | Món healthy, low-carb, ăn kiêng |
| creator5@savore.com | creator123 | Bếp Nhà Mình | Món gia đình đơn giản, dễ làm |

---

## 🚀 CÁCH CHẠY SEED

### **1. Chạy seed script:**

```bash
cd BE
node prisma/seed-users.mjs
```

### **2. Hoặc reset database và seed:**

```bash
npx prisma migrate reset
# Chọn Yes khi được hỏi
```

Sau đó chạy:
```bash
node prisma/seed-users.mjs
```

---

## 📝 CHI TIẾT TỪNG USER

### **🔐 ADMIN**

```json
{
  "email": "admin@savore.com",
  "password": "admin123",
  "fullName": "Admin Savore",
  "description": "Quản trị viên hệ thống",
  "role": "ADMIN",
  "wallet": 10000000
}
```

---

### **🏪 SUPPLIER 1 - Chợ Nông Sản Organic**

```json
{
  "email": "supplier1@savore.com",
  "password": "supplier123",
  "fullName": "Chợ Nông Sản Organic",
  "description": "Chuyên cung cấp rau củ quả hữu cơ, tươi mỗi ngày",
  "role": "SUPPLIER",
  "address": "555 Điện Biên Phủ, Bình Thạnh, TP.HCM",
  "wallet": 1000000
}
```

**Sản phẩm phù hợp:**
- Rau muống hữu cơ
- Cà chua Đà Lạt
- Rau cải xanh
- Củ cải trắng

---

### **🏪 SUPPLIER 2 - Thịt Tươi Sạch ABC**

```json
{
  "email": "supplier2@savore.com",
  "password": "supplier123",
  "fullName": "Thịt Tươi Sạch ABC",
  "description": "Thịt gà, bò, heo sạch, nguồn gốc rõ ràng",
  "role": "SUPPLIER",
  "wallet": 1000000
}
```

**Sản phẩm phù hợp:**
- Thịt gà ta
- Thịt bò Úc
- Thịt heo sạch
- Xương ống

---

### **🏪 SUPPLIER 3 - Hải Sản Tươi Sống 247**

```json
{
  "email": "supplier3@savore.com",
  "password": "supplier123",
  "fullName": "Hải Sản Tươi Sống 247",
  "description": "Hải sản tươi sống, giao hàng 24/7",
  "role": "SUPPLIER",
  "wallet": 1000000
}
```

**Sản phẩm phù hợp:**
- Tôm sú tươi
- Cá hồi Na Uy
- Mực ống
- Nghêu sò

---

### **🏪 SUPPLIER 4 - Gia Vị Nhập Khẩu XYZ**

```json
{
  "email": "supplier4@savore.com",
  "password": "supplier123",
  "fullName": "Gia Vị Nhập Khẩu XYZ",
  "description": "Gia vị cao cấp nhập khẩu từ Nhật, Hàn, Thái",
  "role": "SUPPLIER",
  "wallet": 1000000
}
```

**Sản phẩm phù hợp:**
- Nước tương Nhật
- Gochujang Hàn Quốc
- Nước mắm Thái
- Miso paste

---

### **🏪 SUPPLIER 5 - Nông Trại Đà Lạt Fresh**

```json
{
  "email": "supplier5@savore.com",
  "password": "supplier123",
  "fullName": "Nông Trại Đà Lạt Fresh",
  "description": "Rau củ quả Đà Lạt tươi, giao trong ngày",
  "role": "SUPPLIER",
  "wallet": 1000000
}
```

**Sản phẩm phù hợp:**
- Cà chua Đà Lạt
- Dâu tây Đà Lạt
- Atiso
- Bông cải xanh

---

### **👥 USER 1 - Trần Thị Mai**

```json
{
  "email": "user1@savore.com",
  "password": "user123",
  "fullName": "Trần Thị Mai",
  "description": "Yêu thích nấu ăn, thích khám phá món mới",
  "role": "USER",
  "wallet": 1000000
}
```

**Persona:** Nội trợ 30 tuổi, thích thử món mới, nấu ăn cho gia đình

---

### **👥 USER 2 - Lê Văn Hùng**

```json
{
  "email": "user2@savore.com",
  "password": "user123",
  "fullName": "Lê Văn Hùng",
  "description": "Thích ăn healthy, ăn sạch",
  "role": "USER",
  "wallet": 1000000
}
```

**Persona:** Dân văn phòng 28 tuổi, quan tâm sức khỏe, ăn clean

---

### **👥 USER 3 - Phạm Thị Lan**

```json
{
  "email": "user3@savore.com",
  "password": "user123",
  "fullName": "Phạm Thị Lan",
  "description": "Mẹ bỉm sữa, tìm món ăn nhanh cho gia đình",
  "role": "USER",
  "wallet": 1000000
}
```

**Persona:** Mẹ trẻ 32 tuổi, cần món nhanh, dinh dưỡng cho con

---

### **👥 USER 4 - Nguyễn Văn Tuấn**

```json
{
  "email": "user4@savore.com",
  "password": "user123",
  "fullName": "Nguyễn Văn Tuấn",
  "description": "Sinh viên, thích nấu ăn tiết kiệm",
  "role": "USER",
  "wallet": 1000000
}
```

**Persona:** Sinh viên 22 tuổi, budget thấp, tự nấu ăn

---

### **👥 USER 5 - Hoàng Thị Hoa**

```json
{
  "email": "user5@savore.com",
  "password": "user123",
  "fullName": "Hoàng Thị Hoa",
  "description": "Food blogger, thích review món ngon",
  "role": "USER",
  "wallet": 1000000
}
```

**Persona:** Food blogger 26 tuổi, review món ăn, có ảnh hưởng

---

### **👨‍🍳 CREATOR 1 - Chef Minh Nhật**

```json
{
  "email": "creator1@savore.com",
  "password": "creator123",
  "fullName": "Chef Minh Nhật",
  "description": "Đầu bếp chuyên món Việt truyền thống, 10 năm kinh nghiệm",
  "role": "CREATOR",
  "wallet": 1000000
}
```

**Chuyên môn:** Phở, bún, cơm, món Việt truyền thống

---

### **👨‍🍳 CREATOR 2 - Bếp Trưởng Thanh Hương**

```json
{
  "email": "creator2@savore.com",
  "password": "creator123",
  "fullName": "Bếp Trưởng Thanh Hương",
  "description": "Chuyên món Âu, từng làm việc tại Pháp 5 năm",
  "role": "CREATOR",
  "wallet": 1000000
}
```

**Chuyên môn:** Pasta, steak, món Pháp, Ý

---

### **👨‍🍳 CREATOR 3 - Anh Tuấn Cooking**

```json
{
  "email": "creator3@savore.com",
  "password": "creator123",
  "fullName": "Anh Tuấn Cooking",
  "description": "YouTuber nấu ăn 500k subscribers, chuyên món Á",
  "role": "CREATOR",
  "wallet": 1000000
}
```

**Chuyên môn:** Món Nhật, Hàn, Thái, Trung

---

### **👨‍🍳 CREATOR 4 - Chị Ngọc Healthy Kitchen**

```json
{
  "email": "creator4@savore.com",
  "password": "creator123",
  "fullName": "Chị Ngọc Healthy Kitchen",
  "description": "Chuyên món ăn healthy, low-carb, ăn kiêng",
  "role": "CREATOR",
  "wallet": 1000000
}
```

**Chuyên môn:** Salad, smoothie, món low-carb, keto

---

### **👨‍🍳 CREATOR 5 - Bếp Nhà Mình**

```json
{
  "email": "creator5@savore.com",
  "password": "creator123",
  "fullName": "Bếp Nhà Mình",
  "description": "Chia sẻ món ăn gia đình đơn giản, dễ làm",
  "role": "CREATOR",
  "wallet": 1000000
}
```

**Chuyên môn:** Món gia đình, đơn giản, tiết kiệm

---

## 🧪 TEST SCENARIOS

### **Scenario 1: Creator tạo post**
```
Login: creator1@savore.com / creator123
→ POST /posts (tạo công thức Phở Bò)
```

### **Scenario 2: User like và order**
```
Login: user1@savore.com / user123
→ POST /likes (like post Phở Bò)
→ POST /orders (đặt hàng nguyên liệu)
```

### **Scenario 3: Supplier cung cấp nguyên liệu**
```
Login: supplier2@savore.com / supplier123
→ POST /ingredients (thêm Thịt bò Úc)
```

### **Scenario 4: Admin quản lý**
```
Login: admin@savore.com / admin123
→ GET /admin/users (xem tất cả users)
→ PUT /admin/users/3/roles (đổi role)
```

---

## 📊 PHÂN BỐ ĐỊA LÝ (TP.HCM)

- **Quận 1:** Admin, Creator 1
- **Quận 3:** Supplier 2, User 1, Creator 3
- **Quận 5:** Supplier 4, Creator 2
- **Quận 10:** Supplier 3, User 2
- **Quận 11:** User 3
- **Bình Thạnh:** Supplier 1
- **Gò Vấp:** Supplier 5
- **Tân Bình:** Creator 4
- **Phú Nhuận:** Creator 5

---

**Last Updated:** 2025-12-25
**Version:** 1.0.0
