# 📝 FORM TẠO POST - PHIÊN BẢN ĐÚNG

## ✅ FORM POST ĐÚNG THEO SCHEMA

### **POST 1: Gà xào sả ớt**

```json
{
  "linkVideo": "https://www.youtube.com/watch?v=gUyUHPTDaTA",
  "thumbnail": "https://i.ytimg.com/vi/gUyUHPTDaTA/hqdefault.jpg",
  "name": "Gà xào sả ớt",
  "description": "Món gà xào sả ớt cay thơm, đậm đà, rất đưa cơm.",
  "cookingSteps": [
    "Gà rửa sạch, chặt miếng vừa ăn",
    "Ướp gà với nước mắm, tỏi, ớt trong 30 phút",
    "Phi thơm sả, cho gà vào xào",
    "Xào đến khi gà chín vàng",
    "Nêm nếm và hoàn thành"
  ],
  "tagIds": [1, 3],
  "recipeItems": [
    {
      "ingredientId": "uuid-thit-ga-ta",
      "quantity": 500,
      "unit": "gram"
    },
    {
      "ingredientId": "uuid-sa",
      "quantity": 50,
      "unit": "gram"
    },
    {
      "ingredientId": "uuid-ot",
      "quantity": 20,
      "unit": "gram"
    },
    {
      "ingredientId": "uuid-nuoc-mam",
      "quantity": 30,
      "unit": "ml"
    }
  ]
}
```

**Giải thích:**
- `tagIds: [1, 3]` = Tags "Gà" (ID: 1) và "Xào" (ID: 3)
- `recipeItems` chỉ cần `ingredientId`, `quantity`, `unit`
- **KHÔNG CẦN** `price` trong recipeItems vì giá đã có trong ingredient
- **KHÔNG CẦN** `totalPrice` - backend sẽ tính tự động

---

### **POST 2: Gà chiên nước mắm**

```json
{
  "linkVideo": "https://www.youtube.com/watch?v=ozNNdCjKQzM",
  "thumbnail": "https://i.ytimg.com/vi/ozNNdCjKQzM/hqdefault.jpg",
  "name": "Gà chiên nước mắm",
  "description": "Gà chiên giòn sốt nước mắm tỏi ớt mặn ngọt hấp dẫn.",
  "cookingSteps": [
    "Gà làm sạch, để ráo",
    "Chiên gà đến khi vàng giòn",
    "Phi thơm tỏi, cho nước mắm vào",
    "Áo sốt đều lên gà",
    "Hoàn thành"
  ],
  "tagIds": [1, 4],
  "recipeItems": [
    {
      "ingredientId": "uuid-thit-ga-ta",
      "quantity": 600,
      "unit": "gram"
    },
    {
      "ingredientId": "uuid-toi",
      "quantity": 30,
      "unit": "gram"
    },
    {
      "ingredientId": "uuid-nuoc-mam",
      "quantity": 40,
      "unit": "ml"
    }
  ]
}
```

**Giải thích:**
- `tagIds: [1, 4]` = Tags "Gà" (ID: 1) và "Chiên" (ID: 4)

---

### **POST 3: Bò xào rau muống**

```json
{
  "linkVideo": "https://www.youtube.com/watch?v=BlwNWYdM8ks",
  "thumbnail": "https://i.ytimg.com/vi/BlwNWYdM8ks/hqdefault.jpg",
  "name": "Bò xào rau muống",
  "description": "Bò mềm, rau muống giòn xanh, món xào quốc dân.",
  "cookingSteps": [
    "Thịt bò thái lát mỏng, ướp gia vị",
    "Rau muống nhặt sạch, cắt khúc",
    "Phi thơm tỏi, cho bò vào xào nhanh",
    "Cho rau muống vào xào cùng",
    "Nêm nếm và hoàn thành"
  ],
  "tagIds": [2, 3, 5],
  "recipeItems": [
    {
      "ingredientId": "uuid-thit-bo",
      "quantity": 300,
      "unit": "gram"
    },
    {
      "ingredientId": "uuid-rau-muong",
      "quantity": 200,
      "unit": "gram"
    },
    {
      "ingredientId": "uuid-toi",
      "quantity": 20,
      "unit": "gram"
    }
  ]
}
```

**Giải thích:**
- `tagIds: [2, 3, 5]` = Tags "Bò" (ID: 2), "Xào" (ID: 3), "Rau" (ID: 5)

---

## 🔍 CÁCH LẤY INGREDIENT ID

Trước khi tạo post, cần lấy danh sách ingredients để biết `ingredientId`:

```bash
GET http://103.6.234.20:3003/ingredients
```

**Response mẫu:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Thịt gà ta",
      "tag": "gà",
      "pricePerKg": "150000.00",
      "providerId": 2
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "name": "Sả",
      "tag": "gia vị",
      "pricePerKg": "20000.00",
      "providerId": 2
    }
  ]
}
```

Lấy `id` từ response và dùng làm `ingredientId` trong `recipeItems`.

---

## 🔍 CÁCH LẤY TAG ID

```bash
GET http://103.6.234.20:3003/tags
```

**Response mẫu:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Gà" },
    { "id": 2, "name": "Bò" },
    { "id": 3, "name": "Xào" },
    { "id": 4, "name": "Chiên" },
    { "id": 5, "name": "Rau" }
  ]
}
```

---

## 📊 SO SÁNH FORM CŨ VS MỚI

| Trường (Cũ) | Trường (Mới) | Ghi chú |
|-------------|--------------|---------|
| `tag` | `tagIds` | Array of tag IDs thay vì string |
| `videoUrl` | `linkVideo` | Đổi tên field |
| `ingredients[].name` | `recipeItems[].ingredientId` | Dùng UUID thay vì name |
| `ingredients[].price` | ❌ Bỏ | Giá đã có trong ingredient |
| `totalPrice` | ❌ Bỏ | Backend tự tính |

---

## ✅ VALIDATION RULES

1. **linkVideo**: Bắt buộc, phải là URL hợp lệ
2. **name**: Bắt buộc, tên món ăn
3. **tagIds**: Bắt buộc, array không rỗng, các ID phải tồn tại
4. **recipeItems**: Bắt buộc, array không rỗng
   - `ingredientId`: UUID hợp lệ, phải tồn tại trong DB
   - `quantity`: Số dương
   - `unit`: String (optional)

---

## 🎯 WORKFLOW TẠO POST

```
1. Login với CREATOR account
   POST /auth/login
   → Lấy accessToken

2. Lấy danh sách tags
   GET /tags
   → Chọn tagIds phù hợp

3. Lấy danh sách ingredients
   GET /ingredients
   → Chọn ingredientId và quantity

4. Tạo post
   POST /posts
   Headers: Authorization: Bearer {token}
   Body: Form JSON như trên

5. Kiểm tra kết quả
   GET /posts/:id
```

---

## 💡 LƯU Ý

- ✅ **Giá tiền** được tính tự động từ `ingredient.pricePerKg * quantity`
- ✅ **Provider** của ingredient tự động được gán
- ✅ Có thể dùng API `POST /posts/calculate-ingredients` để tính tổng nguyên liệu từ nhiều posts
- ❌ **KHÔNG** gửi `price` trong `recipeItems` - sẽ bị ignore
- ❌ **KHÔNG** gửi `totalPrice` - backend tự tính

---

**Last Updated:** 2025-12-26  
**API Base URL:** http://103.6.234.20:3003
