# API Testing Guide - Savore Backend

Server đang chạy tại: **http://localhost:3000**

## 📝 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@savore.com | admin123 |
| Creator | creator@savore.com | creator123 |
| User | user@savore.com | user123 |
| Supplier | supplier@savore.com | supplier123 |

---

## 🔐 Authentication APIs

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"admin@savore.com\", \"password\": \"admin123\"}"
```

**Response**: Lưu `access_token` để dùng cho các request tiếp theo

### 2. Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"newuser@example.com\", \"password\": \"password123\", \"fullName\": \"New User\", \"role\": \"USER\"}"
```

### 3. Get Profile
```bash
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 👨‍💼 Admin APIs (Cần ADMIN role)

### 1. Get All Users
```bash
curl "http://localhost:3000/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 2. Get Dashboard Stats
```bash
curl http://localhost:3000/admin/dashboard/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 3. Assign Role to User
```bash
curl -X POST http://localhost:3000/admin/users/2/roles \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"roleCode\": \"CREATOR\"}"
```

---

## 🥕 Ingredients APIs (YÊU CẦU MENTOR)

### 1. Create Ingredient (Cần SUPPLIER role)
```bash
curl -X POST http://localhost:3000/ingredients \
  -H "Authorization: Bearer SUPPLIER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Thịt gà\", \"tag\": \"gà\", \"providerId\": 4}"
```

### 2. Get All Ingredients (Public)
```bash
curl http://localhost:3000/ingredients
```

### 3. Get Ingredient by ID (Public)
```bash
curl http://localhost:3000/ingredients/INGREDIENT_UUID
```

### 4. Search Ingredients by Tag
```bash
curl "http://localhost:3000/ingredients?tag=gà&page=1&limit=10"
```

---

## 📰 Posts APIs (YÊU CẦU MENTOR - 2 API CHÍNH)

### ⭐ API 1: Get List Posts với Search theo Tag (YÊU CẦU MENTOR)
```bash
# Lấy tất cả posts
curl http://localhost:3000/posts

# Search theo tag
curl "http://localhost:3000/posts?tag=gà"

# Với phân trang
curl "http://localhost:3000/posts?tag=chay&page=1&limit=10"
```

### ⭐ API 2: Get Post by ID (YÊU CẦU MENTOR)
```bash
curl http://localhost:3000/posts/POST_UUID
```

**Response sẽ bao gồm:**
- Thông tin post đầy đủ
- Danh sách recipe items
- Chi tiết ingredients trong mỗi recipe item

### 3. Create Post (Cần CREATOR role)
```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer CREATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": 2,
    \"linkVideo\": \"https://youtube.com/watch?v=abc123\",
    \"thumbnail\": \"https://example.com/thumb.jpg\",
    \"name\": \"Gà xào sả ớt\",
    \"description\": \"Món gà ngon tuyệt\",
    \"cookingSteps\": \"Bước 1: Rửa gà. Bước 2: Xào sả ớt. Bước 3: Cho gà vào xào.\",
    \"tagVideo\": \"gà\",
    \"recipeItems\": [
      {
        \"ingredientId\": \"INGREDIENT_UUID_HERE\",
        \"quantity\": 500,
        \"unit\": \"gram\"
      }
    ]
  }"
```

---

## 🧪 Testing Flow

### Complete Test Flow:
1. **Login as SUPPLIER** → Lấy token
2. **Create Ingredient** → Lưu ingredient UUID
3. **Login as CREATOR** → Lấy token
4. **Create Post** với ingredient vừa tạo
5. **Test API 1**: GET /posts?tag=gà
6. **Test API 2**: GET /posts/{uuid}
7. **Login as ADMIN** → Test admin endpoints

---

## 📊 Expected Responses

### Successful Login Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@savore.com",
    "fullName": "Admin User",
    "roles": ["ADMIN"]
  }
}
```

### Get Posts Response (API 1):
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Gà xào sả ớt",
      "linkVideo": "https://...",
      "thumbnail": "https://...",
      "tagVideo": "gà",
      "user": {...},
      "recipeItems": [...]
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Get Post by ID Response (API 2):
```json
{
  "id": "uuid",
  "name": "Gà xào sả ớt",
  "linkVideo": "https://...",
  "description": "Món gà ngon tuyệt",
  "cookingSteps": "Bước 1: ...",
  "tagVideo": "gà",
  "user": {
    "id": 2,
    "email": "creator@savore.com",
    "fullName": "Creator User"
  },
  "recipeItems": [
    {
      "id": "uuid",
      "quantity": 500,
      "unit": "gram",
      "ingredient": {
        "id": "uuid",
        "name": "Thịt gà",
        "tag": "gà",
        "provider": {...}
      }
    }
  ]
}
```

---

## ✅ Checklist

- [x] Server running on port 3000
- [x] 4 test accounts created
- [x] Authentication working
- [x] Admin dashboard working
- [x] Ingredients API working
- [x] Posts API working (2 APIs theo yêu cầu mentor)
- [x] Role-based access control working
- [x] Database relationships working

---

**🎉 Tất cả API đã sẵn sàng để test!**
