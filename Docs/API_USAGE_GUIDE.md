# 📋 SAVORE API - HƯỚNG DẪN SỬ DỤNG ĐẦY ĐỦ

## 🔧 CÁC THAY ĐỔI ĐÃ THỰC HIỆN

### ✅ 1. Fix Authorization Issue
**Vấn đề:** Token đã nhập vào "Available authorizations" nhưng không sử dụng được cho các endpoint cần quyền.

**Nguyên nhân:** Tất cả `@ApiBearerAuth()` không có tên scheme, trong khi ở `main.ts` đã định nghĩa scheme là `'JWT-auth'`.

**Giải pháp:** Đã sửa TẤT CẢ các endpoint protected thành `@ApiBearerAuth('JWT-auth')` trong:
- ✅ `auth.controller.ts` (2 endpoints)
- ✅ `admin.controller.ts` (toàn bộ controller)
- ✅ `ingredients.controller.ts` (3 endpoints)
- ✅ `posts.controller.ts` (3 endpoints)
- ✅ `products.controller.ts` (4 endpoints)

### ✅ 2. Thêm Examples Cho Tất Cả DTOs
Đã thêm `@ApiProperty` với examples đầy đủ cho:
- ✅ `LoginDto` - email & password examples
- ✅ `CreateIngredientDto` - name, tag, providerId examples
- ✅ `CreatePostDto` - đầy đủ examples bao gồm recipeItems array
- ✅ `RecipeItemDto` - ingredientId, quantity, unit examples
- ✅ `AssignRoleDto` - roleCode example
- ✅ `CreateProductDto` - đã có sẵn examples
- ✅ `UpdateProfileDto` - đã có sẵn examples
- ✅ `RegisterDto` - đã có sẵn examples
- ✅ `CalculateIngredientsDto` - đã có sẵn examples

### ✅ 3. Thêm Swagger Documentation Cho Admin Controller
- Thêm `@ApiTags('Admin')`
- Thêm `@ApiBearerAuth('JWT-auth')` ở controller level
- Thêm `@ApiOperation`, `@ApiResponse`, `@ApiQuery`, `@ApiParam` cho tất cả endpoints

### ✅ 4. Fix Update DTOs
Đã sửa `PartialType` import từ `@nestjs/mapped-types` sang `@nestjs/swagger` để đảm bảo Swagger documentation được kế thừa đúng cách.

---

## 🚀 HƯỚNG DẪN SỬ DỤNG API

### 📍 Swagger UI
Truy cập: `http://localhost:3000/api`

### 🔐 CÁCH SỬ DỤNG AUTHORIZATION

#### Bước 1: Đăng ký hoặc đăng nhập
```bash
POST /auth/register
POST /auth/login
```

**Example Request (Login):**
```json
{
  "email": "user@savore.com",
  "password": "password123"
}
```

**Example Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@savore.com",
    "fullName": "Nguyễn Văn A",
    "roles": ["SUPPLIER"]
  }
}
```

#### Bước 2: Copy Access Token

#### Bước 3: Click vào nút "Authorize" 🔓 ở góc trên bên phải Swagger UI

#### Bước 4: Paste token vào ô "Value" (KHÔNG cần thêm "Bearer ")
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Bước 5: Click "Authorize" rồi "Close"

#### ✅ Bây giờ bạn có thể sử dụng TẤT CẢ các endpoint cần quyền!

---

## 📚 API ENDPOINTS VỚI EXAMPLES

### 🔐 AUTHENTICATION

#### 1. Register
```http
POST /auth/register
```
**Request Body:**
```json
{
  "email": "supplier@savore.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "role": "SUPPLIER",
  "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
  "latitude": 10.7756,
  "longitude": 106.7019
}
```

#### 2. Login
```http
POST /auth/login
```
**Request Body:**
```json
{
  "email": "user@savore.com",
  "password": "password123"
}
```

#### 3. Get Profile (🔒 Requires Auth)
```http
GET /auth/profile
Authorization: Bearer {token}
```

#### 4. Update Profile (🔒 Requires Auth)
```http
PATCH /auth/profile
Authorization: Bearer {token}
```
**Request Body:**
```json
{
  "fullName": "Nguyễn Văn B",
  "address": "456 Lê Lợi, Quận 1, TP.HCM",
  "latitude": 10.7756,
  "longitude": 106.7019
}
```

---

### 🥬 INGREDIENTS

#### 1. Create Ingredient (🔒 SUPPLIER only)
```http
POST /ingredients
Authorization: Bearer {token}
```
**Request Body:**
```json
{
  "name": "Thịt gà hữu cơ",
  "tag": "gà"
}
```
**Note:** `providerId` sẽ tự động được set từ user đang đăng nhập (từ token).

#### 2. Get All Ingredients (Public)
```http
GET /ingredients?page=1&limit=10&tag=gà&providerId=4
```

#### 3. Get Ingredient By ID (Public)
```http
GET /ingredients/{id}
```

#### 4. Update Ingredient (🔒 SUPPLIER only - own ingredients)
```http
PATCH /ingredients/{id}
Authorization: Bearer {token}
```
**Request Body:**
```json
{
  "name": "Thịt gà hữu cơ cao cấp",
  "tag": "gà"
}
```

#### 5. Delete Ingredient (🔒 SUPPLIER only - own ingredients)
```http
DELETE /ingredients/{id}
Authorization: Bearer {token}
```

---

### 📹 POSTS

#### 1. Create Post (CREATOR only)
```http
POST /posts
Authorization: Bearer {token}
```
**Request Body:**
```json
{
  "linkVideo": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "name": "Gà chiên nước mắm",
  "description": "Món gà chiên nước mắm thơm ngon, giòn rụm",
  "cookingSteps": "Bước 1: Ướp gà\nBước 2: Chiên gà\nBước 3: Tưới nước mắm",
  "tagVideo": "gà",
  "recipeItems": [
    {
      "ingredientId": "71c7c427-70cc-4ff2-8f72-2b2c8ef81dc1",
      "quantity": 500,
      "unit": "gram"
    },
    {
      "ingredientId": "550e8400-e29b-41d4-a716-446655440000",
      "quantity": 50,
      "unit": "ml"
    }
  ]
}
```
**Note:** `userId` sẽ tự động được set từ user đang đăng nhập (từ token).

#### 2. Calculate Ingredients (Public - YÊU CẦU MENTOR)
```http
POST /posts/calculate-ingredients
```
**Request Body:**
```json
{
  "postIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ]
}
```

#### 3. Get All Posts (Public)
```http
GET /posts?page=1&limit=10&tag=gà
```

#### 4. Get Post By ID (Public)
```http
GET /posts/{id}
```

#### 5. Update Post (CREATOR only - own posts)
```http
PATCH /posts/{id}
Authorization: Bearer {token}
```

#### 6. Delete Post (🔒 CREATOR only - own posts)
```http
DELETE /posts/{id}
Authorization: Bearer {token}
```

---

### 📦 PRODUCTS

#### 1. Create Product (🔒 SUPPLIER only)
```http
POST /products
Authorization: Bearer {token}
```
**Request Body:**
```json
{
  "name": "Thịt gà hữu cơ",
  "price": 150000
}
```

#### 2. Get All Products (Public)
```http
GET /products?page=1&limit=10&supplierId=4&status=ACTIVE
```

#### 3. Get My Products (🔒 SUPPLIER only)
```http
GET /products/my-products?page=1&limit=10
Authorization: Bearer {token}
```

#### 4. Get Product By ID (Public)
```http
GET /products/{id}
```

#### 5. Update Product (🔒 SUPPLIER only - own products)
```http
PATCH /products/{id}
Authorization: Bearer {token}
```
**Request Body:**
```json
{
  "name": "Thịt gà hữu cơ cao cấp",
  "price": 180000,
  "status": "ACTIVE"
}
```

#### 6. Delete Product (🔒 SUPPLIER only - own products)
```http
DELETE /products/{id}
Authorization: Bearer {token}
```

---

### 👑 ADMIN (🔒 ADMIN only)

**Lưu ý:** TẤT CẢ endpoints admin đều cần ADMIN role

#### 1. Get All Users
```http
GET /admin/users?page=1&limit=10&search=john@example.com&role=SUPPLIER
Authorization: Bearer {token}
```

#### 2. Get User By ID
```http
GET /admin/users/{id}
Authorization: Bearer {token}
```

#### 3. Assign Role To User
```http
POST /admin/users/{id}/roles
Authorization: Bearer {token}
```
**Request Body:**
```json
{
  "roleCode": "SUPPLIER"
}
```

#### 4. Remove Role From User
```http
DELETE /admin/users/{id}/roles/{roleId}
Authorization: Bearer {token}
```

#### 5. Get Dashboard Stats
```http
GET /admin/dashboard/stats
Authorization: Bearer {token}
```

---

## 🎯 ROLES & PERMISSIONS

| Role | Permissions |
|------|-------------|
| **USER** | - View posts, ingredients, products<br>- Update own profile |
| **CREATOR** | - All USER permissions<br>- Create/Update/Delete own posts |
| **SUPPLIER** | - All USER permissions<br>- Create/Update/Delete own ingredients<br>- Create/Update/Delete own products |
| **ADMIN** | - All permissions<br>- Manage all users<br>- Assign/Remove roles<br>- View dashboard stats |

---

## 📝 NOTES

1. **Tất cả examples đều có thể copy trực tiếp** từ Swagger UI để test
2. **Authorization đã được fix** - token sẽ tự động được sử dụng cho tất cả endpoints cần quyền
3. **Response format** đã được chuẩn hóa theo `CHANGELOG_API_RESPONSE_FORMAT.md`
4. **Pagination** mặc định: page=1, limit=10
5. **UUID format** cho ingredients và posts IDs
6. **Integer format** cho user, product, role IDs

---

## 🐛 TROUBLESHOOTING

### Vấn đề: "Unauthorized" khi gọi API cần quyền
**Giải pháp:**
1. Kiểm tra token có hết hạn không
2. Đảm bảo đã click "Authorize" trong Swagger UI
3. Kiểm tra user có đúng role không

### Vấn đề: "Forbidden - Role required"
**Giải pháp:**
1. Kiểm tra user có role phù hợp không
2. Liên hệ ADMIN để được gán role

### Vấn đề: Token không hoạt động
**Giải pháp:**
1. Logout khỏi Swagger UI (click "Authorize" → "Logout")
2. Login lại để lấy token mới
3. Authorize lại với token mới

---

## ✅ CHECKLIST HOÀN THÀNH

- [x] Fix Authorization issue - thêm 'JWT-auth' vào tất cả @ApiBearerAuth
- [x] Thêm examples cho tất cả DTOs
- [x] Thêm Swagger documentation cho Admin controller
- [x] Fix Update DTOs để kế thừa Swagger docs đúng cách
- [x] Tạo tài liệu hướng dẫn đầy đủ với examples

**🎉 Tất cả API đã sẵn sàng để FE copy và sử dụng!**
