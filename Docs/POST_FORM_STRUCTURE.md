# 📋 TÓM TẮT: CẤU TRÚC FORM TẠO POST VÀ NGUYÊN LIỆU

**Ngày:** 2025-12-26  
**Người thực hiện:** Backend Team

---

## 1️⃣ CẤU TRÚC FORM TẠO POST

Khi tạo một post (công thức nấu ăn), form sẽ bao gồm các trường sau:

### **A. Thông tin cơ bản**

| Trường | Loại | Bắt buộc | Mô tả | Ví dụ |
|--------|------|----------|-------|-------|
| `linkVideo` | String | ✅ | Link video YouTube hướng dẫn | `https://youtube.com/watch?v=abc123` |
| `thumbnail` | String | ❌ | Link ảnh thumbnail | `https://img.youtube.com/vi/abc123/maxresdefault.jpg` |
| `name` | String | ✅ | Tên món ăn | `Gà chiên nước mắm` |
| `description` | String | ❌ | Mô tả món ăn | `Món gà chiên giòn rụm, thơm ngon` |
| `cookingSteps` | Array<String> | ❌ | Các bước nấu ăn | `["Bước 1: Ướp gà...", "Bước 2: Chiên..."]` |
| `tagIds` | Array<Number> | ✅ | Mảng ID của tags | `[1, 15, 28]` |

### **B. Danh sách nguyên liệu (recipeItems)**

Mỗi nguyên liệu trong mảng `recipeItems` gồm:

| Trường | Loại | Bắt buộc | Mô tả | Ví dụ |
|--------|------|----------|-------|-------|
| `ingredientId` | String (UUID) | ✅ | ID của nguyên liệu | `550e8400-e29b-41d4-a716-446655440000` |
| `quantity` | Number | ✅ | Số lượng cần dùng | `500` |
| `unit` | String | ❌ | Đơn vị đo | `gram`, `kg`, `ml`, `lít` |

---

## 2️⃣ VÍ DỤ REQUEST TẠO POST

```json
POST /posts
Authorization: Bearer {token_creator}
Content-Type: application/json

{
  "linkVideo": "https://youtube.com/watch?v=abc123",
  "thumbnail": "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
  "name": "Gà chiên nước mắm",
  "description": "Món gà chiên giòn rụm, thơm ngon",
  "cookingSteps": [
    "Bước 1: Ướp gà với gia vị trong 30 phút",
    "Bước 2: Chiên gà ở lửa vừa cho vàng đều",
    "Bước 3: Tưới nước mắm pha loãng lên trên"
  ],
  "tagIds": [1, 15],
  "recipeItems": [
    {
      "ingredientId": "uuid-ing-1",
      "quantity": 500,
      "unit": "gram"
    },
    {
      "ingredientId": "uuid-ing-2",
      "quantity": 50,
      "unit": "ml"
    }
  ]
}
```

---

## 3️⃣ CẤU TRÚC NGUYÊN LIỆU (INGREDIENT)

### **Thông tin nguyên liệu**

| Trường | Loại | Bắt buộc | Mô tả | Ví dụ |
|--------|------|----------|-------|-------|
| `id` | String (UUID) | Auto | ID tự động | `550e8400-e29b-41d4-a716-446655440000` |
| `name` | String | ✅ | Tên nguyên liệu | `Thịt gà ta` |
| `tag` | String | ✅ | Tag phân loại | `gà`, `bò`, `gia vị` |
| `pricePerKg` | Number | ✅ | **Giá tiền 1kg (VND)** | `150000` |
| `providerId` | Number | Auto | ID nhà cung cấp (tự động) | `5` |
| `createdAt` | DateTime | Auto | Thời gian tạo | `2024-01-01T00:00:00.000Z` |

---

## 4️⃣ VÍ DỤ REQUEST TẠO NGUYÊN LIỆU

```json
POST /ingredients
Authorization: Bearer {token_supplier}
Content-Type: application/json

{
  "name": "Thịt gà ta",
  "tag": "gà",
  "pricePerKg": 150000
}
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Thịt gà ta",
    "tag": "gà",
    "pricePerKg": "150000.00",
    "providerId": 5,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 5️⃣ BẢNG GIÁ NGUYÊN LIỆU MẪU

Dưới đây là danh sách nguyên liệu có sẵn trong database sau khi seed:

| STT | Tên nguyên liệu | Tag | Giá/kg (VND) | Nhà cung cấp |
|-----|-----------------|-----|--------------|--------------|
| 1 | Thịt gà ta | gà | 150,000 | supplier@savore.com |
| 2 | Thịt gà công nghiệp | gà | 85,000 | supplier2@savore.com |
| 3 | Sả | gia vị | 20,000 | supplier@savore.com |
| 4 | Ớt | gia vị | 30,000 | supplier@savore.com |
| 5 | Tỏi | gia vị | 40,000 | supplier2@savore.com |
| 6 | Hành tím | gia vị | 25,000 | supplier2@savore.com |
| 7 | Nước mắm | gia vị | 50,000 | supplier@savore.com |
| 8 | Đường | gia vị | 18,000 | supplier@savore.com |
| 9 | Thịt bò | bò | 360,000 | supplier@savore.com |
| 10 | Rau muống | rau | 15,000 | supplier2@savore.com |
| 11 | Cà chua | rau | 30,000 | supplier@savore.com |
| 12 | Trứng gà | trứng | 45,000 | supplier2@savore.com |

---

## 6️⃣ WORKFLOW TẠO POST

```
1. Creator login → Nhận token
   ↓
2. Lấy danh sách ingredients (GET /ingredients)
   ↓
3. Chọn ingredients cần dùng (lưu ingredientId)
   ↓
4. Điền form với:
   - Thông tin món ăn (name, video, description...)
   - Chọn tags (tagIds)
   - Thêm nguyên liệu (recipeItems với ingredientId, quantity, unit)
   ↓
5. Submit POST /posts
   ↓
6. Nhận response với post đã tạo
```

---

## 7️⃣ LƯU Ý QUAN TRỌNG

### ✅ **Khi tạo POST:**
- Phải có role `CREATOR`
- `tagIds` phải tồn tại trong database (check trước bằng GET /tags)
- `ingredientId` phải tồn tại (check bằng GET /ingredients)
- `cookingSteps` là **array**, không phải string

### ✅ **Khi tạo INGREDIENT:**
- Phải có role `SUPPLIER`
- `pricePerKg` là **bắt buộc** (giá tiền 1kg, đơn vị VND)
- `providerId` tự động lấy từ user đang login

### ✅ **Validation:**
- `quantity` phải là số dương
- `pricePerKg` phải là số dương
- `unit` nên chuẩn hóa: `gram`, `kg`, `ml`, `lít`, `quả`, `củ`

---

## 8️⃣ API ENDPOINTS LIÊN QUAN

| Method | Endpoint | Mô tả | Role |
|--------|----------|-------|------|
| POST | `/posts` | Tạo post mới | CREATOR |
| PATCH | `/posts/:id` | Cập nhật post | CREATOR (own) |
| DELETE | `/posts/:id` | Xóa post | CREATOR (own) |
| GET | `/posts` | Lấy danh sách posts | Public |
| GET | `/posts/:id` | Lấy chi tiết post | Public |
| POST | `/ingredients` | Tạo nguyên liệu | SUPPLIER |
| GET | `/ingredients` | Lấy danh sách nguyên liệu | Public |
| GET | `/tags` | Lấy danh sách tags | Public |

---

## 9️⃣ TEST ACCOUNTS

```
Creator:
  Email: creator@savore.com
  Password: creator123
  
Supplier 1:
  Email: supplier@savore.com
  Password: supplier123
  
Supplier 2:
  Email: supplier2@savore.com
  Password: supplier123
```

---

## 🔟 TÍNH NĂNG TIẾP THEO (Đề xuất)

1. **Tính chi phí món ăn tự động:**
   - Dựa vào `quantity` và `pricePerKg` của từng ingredient
   - Hiển thị tổng chi phí ước tính

2. **So sánh giá nhà cung cấp:**
   - Cùng 1 loại nguyên liệu, nhiều supplier khác nhau
   - User chọn supplier có giá tốt nhất

3. **Gợi ý nguyên liệu thay thế:**
   - Nếu nguyên liệu hết hàng hoặc quá đắt
   - Suggest nguyên liệu tương tự với giá rẻ hơn

---

**Last Updated:** 2025-12-26  
**Version:** 1.1.0  
**Base URL:** http://103.6.234.20:3003  
**Swagger:** http://103.6.234.20:3003/api
