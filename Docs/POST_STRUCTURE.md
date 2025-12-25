# 📝 CẤU TRÚC MỘT POST TRONG DỰ ÁN SAVORE

## 📊 TỔNG QUAN

Một **Post** trong Savore là một **công thức nấu ăn** (recipe) được chia sẻ bởi Creator, bao gồm:
- Video hướng dẫn
- Danh sách nguyên liệu
- Các bước nấu
- Thông tin tương tác (likes, comments, ratings)

---

## 🗂️ SCHEMA DATABASE

### **Post Model:**

```prisma
model Post {
  id                String           @id @default(uuid()) @db.Uuid
  userId            Int              @map("user_id")
  linkVideo         String           @map("link_video")
  thumbnail         String?
  name              String
  description       String?          @db.Text
  cookingSteps      String[]         @map("cooking_steps") @default([])
  tagIds            Int[]            @map("tag_ids") @default([])
  status            String           @default("DRAFT")
  rating            Decimal          @default(0) @db.Decimal(3, 1)
  view              Int              @default(0)
  createdAt         DateTime         @default(now()) @map("created_at")
  user              User             @relation(fields: [userId], references: [id])
  recipeItems       RecipeItem[]
  orderItems        OrderItem[]
  comments          Comment[]
  likes             Like[]
}
```

---

## 📋 CÁC TRƯỜNG DỮ LIỆU

### **1. Thông tin cơ bản:**

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `id` | UUID | ✅ | ID duy nhất của post |
| `userId` | Int | ✅ | ID của Creator tạo post |
| `name` | String | ✅ | Tên món ăn (VD: "Gà chiên nước mắm") |
| `description` | Text | ❌ | Mô tả chi tiết món ăn |
| `status` | String | ✅ | Trạng thái: `DRAFT`, `PUBLISHED` |
| `createdAt` | DateTime | ✅ | Thời gian tạo |

---

### **2. Media:**

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `linkVideo` | String | ✅ | Link video YouTube/TikTok |
| `thumbnail` | String | ❌ | Link ảnh thumbnail |

**Ví dụ:**
```json
{
  "linkVideo": "https://youtube.com/watch?v=abc123",
  "thumbnail": "https://img.youtube.com/vi/abc123/maxresdefault.jpg"
}
```

---

### **3. Hướng dẫn nấu:**

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `cookingSteps` | String[] | ✅ | Các bước nấu (array) |

**Ví dụ:**
```json
{
  "cookingSteps": [
    "Bước 1: Ướp gà với gia vị trong 30 phút",
    "Bước 2: Chiên gà ở lửa vừa cho vàng đều",
    "Bước 3: Tưới nước mắm pha loãng lên trên"
  ]
}
```

---

### **4. Phân loại:**

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `tagIds` | Int[] | ❌ | Danh sách tag IDs |

**Ví dụ:**
```json
{
  "tagIds": [1, 15, 28]
  // 1 = Gà
  // 15 = Chiên
  // 28 = Chay
}
```

**Lấy danh sách tags:**
```
GET /tags
```

---

### **5. Tương tác:**

| Field | Type | Default | Mô tả |
|-------|------|---------|-------|
| `rating` | Decimal(3,1) | 0 | Đánh giá trung bình (0-5 sao) |
| `view` | Int | 0 | Số lượt xem |

**Tính toán tự động:**
- `rating`: Tự động tính từ rating comments
- `view`: Tự động tăng khi gọi `GET /posts/:id`

---

### **6. Relations (Quan hệ):**

| Relation | Type | Mô tả |
|----------|------|-------|
| `user` | User | Creator của post |
| `recipeItems` | RecipeItem[] | Danh sách nguyên liệu |
| `comments` | Comment[] | Bình luận & ratings |
| `likes` | Like[] | Lượt thích |
| `orderItems` | OrderItem[] | Đơn hàng từ post này |

---

## 🍳 NGUYÊN LIỆU (RecipeItems)

Mỗi post có **danh sách nguyên liệu** qua `RecipeItem`:

```prisma
model RecipeItem {
  id           String     @id @default(uuid())
  postId       String     @map("post_id")
  ingredientId String     @map("ingredient_id")
  quantity     Decimal    @db.Decimal(10, 2)
  unit         String
  post         Post       @relation(fields: [postId], references: [id])
  ingredient   Ingredient @relation(fields: [ingredientId], references: [id])
}
```

**Ví dụ:**
```json
{
  "recipeItems": [
    {
      "ingredientId": "uuid-1",
      "quantity": 500,
      "unit": "gram"
    },
    {
      "ingredientId": "uuid-2",
      "quantity": 50,
      "unit": "ml"
    }
  ]
}
```

---

## 📝 VÍ DỤ TẠO POST HOÀN CHỈNH

### **Request:**

```
POST /posts

Headers:
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "linkVideo": "https://youtube.com/watch?v=abc123",
  "thumbnail": "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
  "name": "Gà chiên nước mắm",
  "description": "Món gà chiên giòn rụm, thơm ngon, dễ làm cho bữa cơm gia đình",
  "cookingSteps": [
    "Bước 1: Sơ chế gà, rửa sạch, chặt miếng vừa ăn",
    "Bước 2: Ướp gà với nước mắm, đường, tỏi băm trong 30 phút",
    "Bước 3: Đập dập sả, cắt khúc. Ớt cắt lát",
    "Bước 4: Phi thơm sả, ớt rồi cho gà vào xào",
    "Bước 5: Nêm nếm lại gia vị, xào đến khi gà chín vàng"
  ],
  "tagIds": [1, 15],
  "recipeItems": [
    {
      "ingredientId": "uuid-ingredient-1",
      "quantity": 500,
      "unit": "gram"
    },
    {
      "ingredientId": "uuid-ingredient-2",
      "quantity": 50,
      "unit": "ml"
    },
    {
      "ingredientId": "uuid-ingredient-3",
      "quantity": 30,
      "unit": "gram"
    }
  ]
}
```

---

### **Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": 2,
  "linkVideo": "https://youtube.com/watch?v=abc123",
  "thumbnail": "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
  "name": "Gà chiên nước mắm",
  "description": "Món gà chiên giòn rụm, thơm ngon, dễ làm cho bữa cơm gia đình",
  "cookingSteps": [
    "Bước 1: Sơ chế gà, rửa sạch, chặt miếng vừa ăn",
    "Bước 2: Ướp gà với nước mắm, đường, tỏi băm trong 30 phút",
    "Bước 3: Đập dập sả, cắt khúc. Ớt cắt lát",
    "Bước 4: Phi thơm sả, ớt rồi cho gà vào xào",
    "Bước 5: Nêm nếm lại gia vị, xào đến khi gà chín vàng"
  ],
  "tagIds": [1, 15],
  "status": "DRAFT",
  "rating": "0.0",
  "view": 0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "user": {
    "id": 2,
    "email": "creator@savore.com",
    "fullName": "Nguyễn Văn A"
  },
  "recipeItems": [
    {
      "id": "uuid-1",
      "quantity": "500.00",
      "unit": "gram",
      "ingredient": {
        "id": "uuid-ingredient-1",
        "name": "Thịt gà",
        "tag": "Thịt",
        "provider": {
          "id": 5,
          "fullName": "Nhà cung cấp ABC"
        }
      }
    },
    {
      "id": "uuid-2",
      "quantity": "50.00",
      "unit": "ml",
      "ingredient": {
        "id": "uuid-ingredient-2",
        "name": "Nước mắm",
        "tag": "Gia vị"
      }
    }
  ]
}
```

---

## 🔄 WORKFLOW TẠO POST

### **1. Creator tạo post:**
```
POST /posts
→ Status: DRAFT
```

### **2. Preview & chỉnh sửa:**
```
PATCH /posts/:id
→ Cập nhật thông tin
```

### **3. Publish:**
```
PATCH /posts/:id
{
  "status": "PUBLISHED"
}
```

### **4. Users tương tác:**
```
- Like: POST /likes
- Comment: POST /comments
- Rating: POST /comments (với isRatingComment: true)
- Order: POST /orders (từ liked posts)
```

---

## 📊 CÁC TRƯỜNG TÍNH TOÁN TỰ ĐỘNG

### **1. Rating:**
- Tự động tính từ rating comments
- Công thức: `AVG(rating)` từ tất cả rating comments
- Update khi có rating comment mới

### **2. View Count:**
- Tự động tăng khi gọi `GET /posts/:id`
- Không tăng khi Creator xem post của mình

### **3. Like Count:**
- Đếm từ bảng `Like`
- Truy vấn: `_count.likes`

### **4. Comment Count:**
- Đếm từ bảng `Comment`
- Truy vấn: `_count.comments`

---

## 🎯 CÁC API LIÊN QUAN

### **CRUD Posts:**
```
GET    /posts                    - Lấy danh sách posts
GET    /posts/:id                - Lấy chi tiết post
POST   /posts                    - Tạo post mới (CREATOR only)
PATCH  /posts/:id                - Cập nhật post (CREATOR only)
DELETE /posts/:id                - Xóa post (CREATOR only)
```

### **Filter & Search:**
```
GET /posts?tagId=1               - Filter theo tag
GET /posts/user/:userId          - Posts của user
GET /posts/random                - Random post (weighted)
```

### **Tính toán:**
```
POST /posts/calculate-ingredients - Tính tổng nguyên liệu
```

---

## 💡 LƯU Ý QUAN TRỌNG

### **1. Validation:**
- ✅ `linkVideo` phải là URL hợp lệ
- ✅ `cookingSteps` phải là array (không phải string)
- ✅ `tagIds` phải tồn tại trong bảng `Tag`
- ✅ `ingredientId` phải tồn tại trong bảng `Ingredient`

### **2. Permissions:**
- ✅ Chỉ CREATOR mới tạo được post
- ✅ Chỉ owner mới update/delete được post
- ✅ Admin có thể delete bất kỳ post nào

### **3. Status:**
- `DRAFT` - Bản nháp, chưa public
- `PUBLISHED` - Đã public, hiển thị cho mọi người

---

## 📚 TÀI LIỆU THAM KHẢO

- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) - Chi tiết tất cả API
- [`prisma/schema.prisma`](../BE/prisma/schema.prisma) - Database schema

---

**Last Updated:** 2025-12-25
**Version:** 1.0.0
