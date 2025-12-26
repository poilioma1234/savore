# 📹 HƯỚNG DẪN SỬ DỤNG API POSTS

**Base URL:** `http://103.6.234.20:3003`  
**Swagger UI:** `http://103.6.234.20:3003/api`

---

## 📋 MỤC LỤC

1. [Xem danh sách posts (Public)](#1-xem-danh-sách-posts-public)
2. [Xem chi tiết 1 post (Public)](#2-xem-chi-tiết-1-post-public)
3. [Lấy post ngẫu nhiên (Public)](#3-lấy-post-ngẫu-nhiên-public)
4. [Lấy posts theo tag (Public)](#4-lấy-posts-theo-tag-public)
5. [Lấy posts của user (Public)](#5-lấy-posts-của-user-public)
6. [Tính tổng nguyên liệu (Public)](#6-tính-tổng-nguyên-liệu-public)
7. [Tạo post mới (CREATOR only)](#7-tạo-post-mới-creator-only)
8. [Cập nhật post (CREATOR only)](#8-cập-nhật-post-creator-only)
9. [Xóa post (CREATOR only)](#9-xóa-post-creator-only)

---

## 1. XEM DANH SÁCH POSTS (Public)

✅ **Không cần token** - Ai cũng có thể xem

### **Endpoint:**
```
GET /posts?page=1&limit=10
```

### **Query Parameters:**
| Tham số | Bắt buộc | Mô tả | Mặc định |
|---------|----------|-------|----------|
| `page` | ❌ | Số trang | 1 |
| `limit` | ❌ | Số posts mỗi trang | 10 |
| `tagId` | ❌ | Lọc theo tag ID | - |

### **Ví dụ:**

```bash
# Lấy 10 posts đầu tiên
GET http://103.6.234.20:3003/posts?page=1&limit=10

# Lấy 20 posts trang 2
GET http://103.6.234.20:3003/posts?page=2&limit=20

# Lọc posts có tag "Gà" (tagId=1)
GET http://103.6.234.20:3003/posts?tagId=1
```

### **Response:**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": 2,
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
      "status": "PUBLISHED",
      "rating": "0.0",
      "view": 0,
      "createdAt": "2025-12-26T04:00:00.000Z",
      "user": {
        "id": 2,
        "email": "creator1@savore.com",
        "fullName": "Chef Minh Nhật",
        "avatar": "https://ui-avatars.com/api/?name=Chef+Minh+Nhật&background=random"
      },
      "recipeItems": [
        {
          "id": "uuid-recipe-1",
          "quantity": "500.00",
          "unit": "gram",
          "ingredient": {
            "id": "uuid-ing-1",
            "name": "Thịt gà ta",
            "tag": "gà",
            "pricePerKg": "150000.00"
          }
        },
        {
          "id": "uuid-recipe-2",
          "quantity": "50.00",
          "unit": "gram",
          "ingredient": {
            "id": "uuid-ing-2",
            "name": "Sả",
            "tag": "gia vị",
            "pricePerKg": "20000.00"
          }
        }
      ],
      "_count": {
        "likes": 0,
        "comments": 0
      }
    }
  ],
  "meta": {
    "total": 17,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

## 2. XEM CHI TIẾT 1 POST (Public)

✅ **Không cần token** - Ai cũng có thể xem

### **Endpoint:**
```
GET /posts/:id
```

### **Ví dụ:**

```bash
GET http://103.6.234.20:3003/posts/550e8400-e29b-41d4-a716-446655440000
```

### **Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": 2,
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
  "status": "PUBLISHED",
  "rating": "4.5",
  "view": 125,
  "createdAt": "2025-12-26T04:00:00.000Z",
  "user": {
    "id": 2,
    "email": "creator1@savore.com",
    "fullName": "Chef Minh Nhật",
    "avatar": "https://ui-avatars.com/api/?name=Chef+Minh+Nhật&background=random"
  },
  "recipeItems": [
    {
      "id": "uuid-recipe-1",
      "quantity": "500.00",
      "unit": "gram",
      "ingredient": {
        "id": "uuid-ing-1",
        "name": "Thịt gà ta",
        "tag": "gà",
        "pricePerKg": "150000.00",
        "provider": {
          "id": 5,
          "email": "supplier1@savore.com",
          "fullName": "Chợ Nông Sản Organic",
          "address": "555 Điện Biên Phủ, Bình Thạnh, TP.HCM"
        }
      }
    },
    {
      "id": "uuid-recipe-2",
      "quantity": "50.00",
      "unit": "gram",
      "ingredient": {
        "id": "uuid-ing-2",
        "name": "Sả",
        "tag": "gia vị",
        "pricePerKg": "20000.00",
        "provider": {
          "id": 5,
          "email": "supplier1@savore.com",
          "fullName": "Chợ Nông Sản Organic",
          "address": "555 Điện Biên Phủ, Bình Thạnh, TP.HCM"
        }
      }
    }
  ],
  "_count": {
    "likes": 45,
    "comments": 12
  }
}
```

**Lưu ý:** Response có thêm thông tin `provider` của từng ingredient.

---

## 3. LẤY POST NGẪU NHIÊN (Public)

✅ **Không cần token** - Ai cũng có thể xem

### **Endpoint:**
```
GET /posts/random
```

### **Ví dụ:**

```bash
GET http://103.6.234.20:3003/posts/random
```

### **Response:**

Trả về 1 post object (format giống như GET /posts/:id)

**Đặc điểm:**
- ✅ Ưu tiên posts có rating cao
- ✅ Ưu tiên posts có nhiều likes
- ✅ Ưu tiên posts có nhiều views
- ✅ Tự động tăng view count

---

## 4. LẤY POSTS THEO TAG (Public)

✅ **Không cần token** - Ai cũng có thể xem

### **Endpoint:**
```
GET /tags/search?tagIds=1,3&page=1&limit=10
```

### **Query Parameters:**
| Tham số | Bắt buộc | Mô tả |
|---------|----------|-------|
| `tagIds` | ✅ | Danh sách tag IDs (phân cách bằng dấu phẩy) |
| `page` | ❌ | Số trang (default: 1) |
| `limit` | ❌ | Số posts mỗi trang (default: 10) |

### **Ví dụ:**

```bash
# Tìm posts có tag "Gà" (ID: 1)
GET http://103.6.234.20:3003/tags/search?tagIds=1

# Tìm posts có tag "Gà" HOẶC "Xào" (ID: 1,3)
GET http://103.6.234.20:3003/tags/search?tagIds=1,3

# Tìm posts có tag "Bò" với pagination
GET http://103.6.234.20:3003/tags/search?tagIds=2&page=1&limit=5
```

### **Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-post-1",
      "name": "Gà xào sả ớt",
      "thumbnail": "https://i.ytimg.com/vi/gUyUHPTDaTA/hqdefault.jpg",
      "tagIds": [1, 3],
      "rating": "4.5",
      "view": 125,
      "user": {
        "id": 2,
        "fullName": "Chef Minh Nhật",
        "avatar": "..."
      },
      "_count": {
        "likes": 45,
        "comments": 12
      }
    }
  ],
  "meta": {
    "total": 8,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## 5. LẤY POSTS CỦA USER (Public)

✅ **Không cần token** - Ai cũng có thể xem

### **Endpoint:**
```
GET /posts/user/:userId?sortType=1&page=1&limit=10
```

### **Query Parameters:**
| Tham số | Bắt buộc | Mô tả |
|---------|----------|-------|
| `sortType` | ❌ | Kiểu sắp xếp (xem bảng dưới) |
| `page` | ❌ | Số trang (default: 1) |
| `limit` | ❌ | Số posts mỗi trang (default: 10) |

**Sort Types:**
| Value | Sắp xếp theo |
|-------|--------------|
| `1` | Mới nhất (createdAt desc) - **Mặc định** |
| `2` | Nhiều view nhất |
| `3` | Nhiều like nhất |
| `4` | Rating cao nhất |

### **Ví dụ:**

```bash
# Lấy posts mới nhất của user ID 2
GET http://103.6.234.20:3003/posts/user/2?sortType=1

# Lấy posts có nhiều view nhất của user ID 2
GET http://103.6.234.20:3003/posts/user/2?sortType=2

# Lấy posts có rating cao nhất
GET http://103.6.234.20:3003/posts/user/2?sortType=4&page=1&limit=5
```

### **Response:**

Format giống như GET /posts

---

## 6. TÍNH TỔNG NGUYÊN LIỆU (Public)

✅ **Không cần token** - Ai cũng có thể dùng

### **Endpoint:**
```
POST /posts/calculate-ingredients
```

### **Body:**

```json
{
  "postIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ]
}
```

### **Ví dụ:**

```bash
POST http://103.6.234.20:3003/posts/calculate-ingredients
Content-Type: application/json

{
  "postIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ]
}
```

### **Response:**

```json
{
  "postIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ],
  "totalPosts": 2,
  "totalIngredients": 5,
  "ingredients": [
    {
      "ingredientId": "uuid-ing-1",
      "ingredientName": "Thịt gà ta",
      "tag": "gà",
      "pricePerKg": "150000.00",
      "totalQuantity": 1000,
      "unit": "gram",
      "estimatedCost": 150000,
      "provider": {
        "id": 5,
        "email": "supplier1@savore.com",
        "fullName": "Chợ Nông Sản Organic",
        "address": "555 Điện Biên Phủ, Bình Thạnh, TP.HCM",
        "latitude": "10.80120000",
        "longitude": "106.71450000"
      },
      "usedInPosts": [
        {
          "postId": "550e8400-e29b-41d4-a716-446655440000",
          "postName": "Gà xào sả ớt",
          "quantity": 500
        },
        {
          "postId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          "postName": "Gà chiên nước mắm",
          "quantity": 500
        }
      ]
    },
    {
      "ingredientId": "uuid-ing-2",
      "ingredientName": "Sả",
      "tag": "gia vị",
      "pricePerKg": "20000.00",
      "totalQuantity": 50,
      "unit": "gram",
      "estimatedCost": 1000,
      "provider": {
        "id": 5,
        "email": "supplier1@savore.com",
        "fullName": "Chợ Nông Sản Organic"
      },
      "usedInPosts": [
        {
          "postId": "550e8400-e29b-41d4-a716-446655440000",
          "postName": "Gà xào sả ớt",
          "quantity": 50
        }
      ]
    }
  ],
  "totalEstimatedCost": 151000
}
```

**Use case:** User chọn nhiều món để nấu, API tính tổng nguyên liệu cần mua và chi phí ước tính.

---

## 7. TẠO POST MỚI (CREATOR only)

🔐 **Cần token** - Chỉ CREATOR mới tạo được

### **Endpoint:**
```
POST /posts
```

### **Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### **Body:**

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
      "ingredientId": "550e8400-e29b-41d4-a716-446655440000",
      "quantity": 500,
      "unit": "gram"
    },
    {
      "ingredientId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "quantity": 50,
      "unit": "gram"
    }
  ]
}
```

### **Validation:**
- ✅ `linkVideo`: Bắt buộc, phải là URL
- ✅ `name`: Bắt buộc
- ✅ `tagIds`: Bắt buộc, array không rỗng
- ✅ `recipeItems`: Bắt buộc, array không rỗng
  - `ingredientId`: UUID hợp lệ, phải tồn tại
  - `quantity`: Số dương
  - `unit`: String (optional)

### **Ví dụ:**

```bash
# 1. Login để lấy token
POST http://103.6.234.20:3003/auth/login
Content-Type: application/json

{
  "email": "creator1@savore.com",
  "password": "creator123"
}

# Response: { "accessToken": "eyJhbG..." }

# 2. Tạo post
POST http://103.6.234.20:3003/posts
Authorization: Bearer eyJhbG...
Content-Type: application/json

{
  "linkVideo": "https://www.youtube.com/watch?v=abc123",
  "name": "Món mới",
  "tagIds": [1],
  "recipeItems": [...]
}
```

### **Response:**

Trả về post object vừa tạo (format giống GET /posts/:id)

---

## 8. CẬP NHẬT POST (CREATOR only)

🔐 **Cần token** - Chỉ creator sở hữu post mới cập nhật được

### **Endpoint:**
```
PATCH /posts/:id
```

### **Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### **Body (tất cả fields đều optional):**

```json
{
  "name": "Gà xào sả ớt cay",
  "description": "Thêm ớt cho cay hơn",
  "tagIds": [1, 3, 28],
  "recipeItems": [
    {
      "ingredientId": "uuid-ing-1",
      "quantity": 600,
      "unit": "gram"
    }
  ]
}
```

### **Lưu ý:**
- ⚠️ Nếu update `recipeItems`, tất cả items cũ sẽ bị xóa và thay bằng items mới
- ⚠️ Chỉ creator sở hữu post mới có quyền update

### **Ví dụ:**

```bash
PATCH http://103.6.234.20:3003/posts/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Gà xào sả ớt cay đậm đà",
  "tagIds": [1, 3, 28]
}
```

---

## 9. XÓA POST (CREATOR only)

🔐 **Cần token** - Chỉ creator sở hữu post mới xóa được

### **Endpoint:**
```
DELETE /posts/:id
```

### **Headers:**
```
Authorization: Bearer {accessToken}
```

### **Ví dụ:**

```bash
DELETE http://103.6.234.20:3003/posts/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer {token}
```

### **Response:**

```json
{
  "message": "Post deleted successfully"
}
```

---

## 📊 TỔNG HỢP ENDPOINTS

| Endpoint | Method | Public | Mô tả |
|----------|--------|--------|-------|
| `/posts` | GET | ✅ | Danh sách posts |
| `/posts/:id` | GET | ✅ | Chi tiết 1 post |
| `/posts/random` | GET | ✅ | Post ngẫu nhiên |
| `/posts/user/:userId` | GET | ✅ | Posts của user |
| `/tags/search` | GET | ✅ | Tìm posts theo tags |
| `/posts/calculate-ingredients` | POST | ✅ | Tính tổng nguyên liệu |
| `/posts` | POST | 🔐 | Tạo post mới |
| `/posts/:id` | PATCH | 🔐 | Cập nhật post |
| `/posts/:id` | DELETE | 🔐 | Xóa post |

---

## 🎯 USE CASES THỰC TẾ

### **1. Xem tất cả posts:**
```bash
GET /posts?page=1&limit=20
```

### **2. Xem posts về món gà:**
```bash
GET /tags/search?tagIds=1
```

### **3. Xem posts của Chef Minh Nhật:**
```bash
GET /posts/user/2?sortType=4
```

### **4. Tính nguyên liệu cho 3 món:**
```bash
POST /posts/calculate-ingredients
Body: { "postIds": ["uuid1", "uuid2", "uuid3"] }
```

### **5. Tạo post mới:**
```bash
1. Login: POST /auth/login
2. Tạo: POST /posts (với token)
```

---

## 💡 TIPS & TRICKS

### **Tối ưu performance:**
- ✅ Dùng pagination (`page`, `limit`) để tránh load quá nhiều data
- ✅ Chỉ lấy fields cần thiết
- ✅ Cache kết quả ở client

### **Tính chi phí món ăn:**
```javascript
// Từ response của GET /posts/:id
const totalCost = post.recipeItems.reduce((sum, item) => {
  const pricePerKg = parseFloat(item.ingredient.pricePerKg);
  const quantity = parseFloat(item.quantity);
  const costPerGram = pricePerKg / 1000;
  return sum + (costPerGram * quantity);
}, 0);

console.log(`Chi phí ước tính: ${totalCost.toLocaleString('vi-VN')} VND`);
```

### **Lọc posts theo nhiều tags:**
```bash
# Posts có tag "Gà" HOẶC "Xào" HOẶC "Chiên"
GET /tags/search?tagIds=1,3,4
```

---

## 🐛 XỬ LÝ LỖI

### **401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Giải pháp:** Login lại để lấy token mới

### **403 Forbidden:**
```json
{
  "statusCode": 403,
  "message": "You can only update your own posts"
}
```
**Giải pháp:** Chỉ update/delete posts của chính mình

### **404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Post not found"
}
```
**Giải pháp:** Kiểm tra lại post ID

---

**Last Updated:** 2025-12-26  
**API Version:** 1.2.0  
**Base URL:** http://103.6.234.20:3003
