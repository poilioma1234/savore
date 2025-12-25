# ⚡ QUICK REFERENCE - TEST ACCOUNTS (Updated with Multi-Role)

## 🔐 ADMIN
```
admin@savore.com / admin123
```

## 🏪 SUPPLIERS (5)
```
supplier1@savore.com / supplier123  → Chợ Nông Sản Organic
supplier2@savore.com / supplier123  → Thịt Tươi Sạch ABC
supplier3@savore.com / supplier123  → Hải Sản Tươi Sống 247
supplier4@savore.com / supplier123  → Gia Vị Nhập Khẩu XYZ
supplier5@savore.com / supplier123  → Nông Trại Đà Lạt Fresh
```

## 👥 USERS (5)
```
user1@savore.com / user123  → Trần Thị Mai (Yêu nấu ăn)
user2@savore.com / user123  → Lê Văn Hùng (Ăn healthy)
user3@savore.com / user123  → Phạm Thị Lan (Mẹ bỉm sữa)
user4@savore.com / user123  → Nguyễn Văn Tuấn (Sinh viên)
user5@savore.com / user123  → Hoàng Thị Hoa (Food blogger)
```

## 👨‍🍳 CREATORS (5)
```
creator1@savore.com / creator123  → Chef Minh Nhật (Món Việt)
creator2@savore.com / creator123  → Bếp Trưởng Thanh Hương (Món Âu)
creator3@savore.com / creator123  → Anh Tuấn Cooking (YouTuber)
creator4@savore.com / creator123  → Chị Ngọc Healthy Kitchen (Healthy)
creator5@savore.com / creator123  → Bếp Nhà Mình (Món gia đình)
```

## 🔀 MULTI-ROLE USERS (3) ⭐ NEW!
```
hybrid1@savore.com / hybrid123  → USER + CREATOR (Nguyễn Minh Tâm)
hybrid2@savore.com / hybrid123  → USER + SUPPLIER (Trần Văn Phúc)
hybrid3@savore.com / hybrid123  → CREATOR + SUPPLIER (Chef Hùng Farm)
```

---

## 🚀 CHẠY SEED

```bash
cd BE
node prisma/seed-users.mjs
```

---

## 💡 USE CASES

### **hybrid1 (USER + CREATOR):**
- Có thể tạo posts (CREATOR)
- Có thể like, comment, order (USER)
- **Real-world:** Food blogger vừa review vừa tạo content

### **hybrid2 (USER + SUPPLIER):**
- Có thể cung cấp nguyên liệu (SUPPLIER)
- Có thể mua nguyên liệu từ người khác (USER)
- **Real-world:** Nông dân vừa bán vừa mua

### **hybrid3 (CREATOR + SUPPLIER):**
- Có thể tạo posts (CREATOR)
- Có thể cung cấp nguyên liệu (SUPPLIER)
- **Real-world:** Chef có farm riêng

---

**Total: 19 users**
- 1 admin
- 5 suppliers
- 5 users
- 5 creators
- 3 multi-role ⭐
