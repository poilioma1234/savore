# 📚 HƯỚNG DẪN SỬ DỤNG API - SAVORE BACKEND

**Base URL:** `http://103.6.234.20:3018` (hoặc `http://localhost:3000` khi dev)

**Swagger UI:** `http://103.6.234.20:3018/api`

---

## 📖 MỤC LỤC

1. [Authentication](#1-authentication)
2. [Users](#2-users)
3. [Posts](#3-posts)
4. [Tags](#4-tags)
5. [Ingredients](#5-ingredients)
6. [Comments](#6-comments)
7. [Likes](#7-likes)
8. [Follow](#8-follow)
9. [Orders](#9-orders)

---

## 1. AUTHENTICATION

### 1.1. Đăng ký tài khoản

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "email": "chef@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "role": "CREATOR",
  "address": "123 Nguyễn Huệ, Q1, TP.HCM",
  "latitude": 10.7769,
  "longitude": 106.7009
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "chef@example.com",
    "fullName": "Nguyễn Văn A",
    "roles": ["CREATOR"]
  }
}
```

**Roles available:**
- `CREATOR` - Người tạo công thức (có thể đăng bài)
- `SUPPLIER` - Nhà cung cấp nguyên liệu
- `CUSTOMER` - Khách hàng (xem và đặt hàng)

---

### 1.2. Đăng nhập

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "chef@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "chef@example.com",
    "fullName": "Nguyễn Văn A",
    "roles": ["CREATOR"]
  }
}
```

---

### 1.3. Lấy thông tin profile

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "id": 1,
  "email": "chef@example.com",
  "fullName": "Nguyễn Văn A",
  "address": "123 Nguyễn Huệ, Q1, TP.HCM",
  "latitude": "10.77690000",
  "longitude": "106.70090000",
  "roles": ["CREATOR"],
  "wallet": {
    "id": 1,
    "balance": "0.00",
    "currency": "VND"
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 1.4. Cập nhật profile

**Endpoint:** `PATCH /auth/profile`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "fullName": "Nguyễn Văn B",
  "address": "456 Lê Lợi, Q1, TP.HCM",
  "latitude": 10.7750,
  "longitude": 106.7000
}
```

---

## 2. USERS

### 2.1. Lấy thông tin user theo ID

**Endpoint:** `GET /users/:id`

**Example:** `GET /users/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Nguyễn Văn A",
    "description": "Đầu bếp chuyên món Việt",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "followersCount": 150,
    "followingCount": 80,
    "postsCount": 25
  }
}
```

---

### 2.2. Lấy danh sách bài đăng của user

**Endpoint:** `GET /users/:id/posts?page=1&limit=10`

**Example:** `GET /users/1/posts?page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Gà chiên nước mắm",
      "thumbnail": "https://example.com/thumb.jpg",
      "rating": "4.5",
      "view": 1250,
      "user": {
        "id": 1,
        "fullName": "Nguyễn Văn A",
        "avatar": "https://example.com/avatar.jpg"
      },
      "_count": {
        "likes": 45,
        "comments": 12
      }
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### 2.3. Lấy danh sách followers

**Endpoint:** `GET /users/:id/followers?page=1&limit=10`

**Example:** `GET /users/1/followers?page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "fullName": "Trần Thị B",
      "avatar": "https://example.com/avatar2.jpg",
      "description": "Food lover"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

---

### 2.4. Lấy danh sách following

**Endpoint:** `GET /users/:id/following?page=1&limit=10`

**Example:** `GET /users/1/following?page=1&limit=10`

---

### 2.5. Cập nhật profile (Auth required)

**Endpoint:** `PATCH /users/profile`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "description": "Đầu bếp chuyên món Á",
  "avatar": "https://example.com/new-avatar.jpg",
  "fullName": "Nguyễn Văn C"
}
```

---

## 3. POSTS

### 3.1. Lấy danh sách posts (có filter theo tag)

**Endpoint:** `GET /posts?page=1&limit=10&tagId=1`

**Query Parameters:**
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số items mỗi trang (default: 10)
- `tagId` (optional): Filter theo tag ID

**Example:** `GET /posts?page=1&limit=10&tagId=1`

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": 1,
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
      "status": "PUBLISHED",
      "rating": "4.5",
      "view": 1250,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "user": {
        "id": 1,
        "email": "chef@example.com",
        "fullName": "Nguyễn Văn A"
      },
      "recipeItems": [
        {
          "id": "uuid-1",
          "quantity": "500.00",
          "unit": "gram",
          "ingredient": {
            "id": "uuid-ing-1",
            "name": "Thịt gà",
            "tag": "Thịt"
          }
        },
        {
          "id": "uuid-2",
          "quantity": "50.00",
          "unit": "ml",
          "ingredient": {
            "id": "uuid-ing-2",
            "name": "Nước mắm",
            "tag": "Gia vị"
          }
        }
      ]
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

### 3.2. Lấy chi tiết 1 post

**Endpoint:** `GET /posts/:id`

**Example:** `GET /posts/550e8400-e29b-41d4-a716-446655440000`

**Response:** (Giống như item trong list, nhưng có thêm thông tin provider)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": 1,
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
  "status": "PUBLISHED",
  "rating": "4.5",
  "view": 1250,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "user": {
    "id": 1,
    "email": "chef@example.com",
    "fullName": "Nguyễn Văn A"
  },
  "recipeItems": [
    {
      "id": "uuid-1",
      "quantity": "500.00",
      "unit": "gram",
      "ingredient": {
        "id": "uuid-ing-1",
        "name": "Thịt gà",
        "tag": "Thịt",
        "provider": {
          "id": 5,
          "email": "supplier@example.com",
          "fullName": "Nhà cung cấp ABC"
        }
      }
    }
  ]
}
```

---

### 3.3. Tạo post mới (CREATOR only)

**Endpoint:** `POST /posts`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
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

**Response:** (Post object vừa tạo)

---

### 3.4. Cập nhật post (CREATOR only - own posts)

**Endpoint:** `PATCH /posts/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:** (Tất cả fields đều optional)
```json
{
  "name": "Gà chiên nước mắm cay",
  "description": "Thêm ớt cho cay",
  "tagIds": [1, 15, 28],
  "recipeItems": [
    {
      "ingredientId": "uuid-ing-1",
      "quantity": 600,
      "unit": "gram"
    }
  ]
}
```

**Note:** Nếu update `recipeItems`, tất cả items cũ sẽ bị xóa và thay bằng items mới.

---

### 3.5. Xóa post (CREATOR only - own posts)

**Endpoint:** `DELETE /posts/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

---

### 3.6. Lấy posts của user (có sort)

**Endpoint:** `GET /posts/user/:userId?sortType=1&page=1&limit=10`

**Query Parameters:**
- `sortType`: 
  - `1` = Mới nhất (createdAt desc)
  - `2` = Nhiều view nhất
  - `3` = Nhiều like nhất
  - `4` = Rating cao nhất
- `page`, `limit`: Pagination

**Example:** `GET /posts/user/1?sortType=3&page=1&limit=10`

---

### 3.7. Lấy post ngẫu nhiên (weighted)

**Endpoint:** `GET /posts/random`

**Response:** (1 post object)

**Note:** 
- Ưu tiên posts có rating cao, likes nhiều, views nhiều
- Tự động tăng view count

---

### 3.8. Tính tổng nguyên liệu từ nhiều posts

**Endpoint:** `POST /posts/calculate-ingredients`

**Body:**
```json
{
  "postIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ]
}
```

**Response:**
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
      "ingredientName": "Thịt gà",
      "tag": "Thịt",
      "totalQuantity": 1000,
      "unit": "gram",
      "provider": {
        "id": 5,
        "email": "supplier@example.com",
        "fullName": "Nhà cung cấp ABC",
        "address": "123 ABC Street",
        "latitude": "10.77690000",
        "longitude": "106.70090000"
      },
      "usedInPosts": [
        {
          "postId": "550e8400-e29b-41d4-a716-446655440000",
          "postName": "Gà chiên nước mắm",
          "quantity": 500
        },
        {
          "postId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          "postName": "Gà nướng mật ong",
          "quantity": 500
        }
      ]
    }
  ]
}
```

**Use case:** User chọn nhiều món để nấu, API tính tổng nguyên liệu cần mua.

---

## 4. TAGS

### 4.1. Lấy tất cả tags

**Endpoint:** `GET /tags`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Gà",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Bò",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 41
}
```

---

### 4.2. Lấy tag theo ID

**Endpoint:** `GET /tags/:id`

**Example:** `GET /tags/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Gà",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4.3. Lấy tags phổ biến

**Endpoint:** `GET /tags/popular?limit=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Gà",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "postCount": 45
    },
    {
      "id": 15,
      "name": "Chiên",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "postCount": 38
    }
  ]
}
```

---

### 4.4. Search posts theo tags

**Endpoint:** `GET /tags/search?tagIds=1,15&page=1&limit=10`

**Query Parameters:**
- `tagIds`: Comma-separated tag IDs (tìm posts có BẤT KỲ tag nào trong list)
- `page`, `limit`: Pagination

**Example:** `GET /tags/search?tagIds=1,15&page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Gà chiên nước mắm",
      "tagIds": [1, 15],
      "user": {...},
      "_count": {
        "likes": 45,
        "comments": 12
      }
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### 4.5. Tạo tag mới

**Endpoint:** `POST /tags`

**Body:**
```json
{
  "name": "Món Huế"
}
```

---

### 4.6. Xóa tag

**Endpoint:** `DELETE /tags/:id`

---

## 5. INGREDIENTS

### 5.1. Lấy danh sách ingredients

**Endpoint:** `GET /ingredients?page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-ing-1",
      "name": "Thịt gà",
      "tag": "Thịt",
      "providerId": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "provider": {
        "id": 5,
        "fullName": "Nhà cung cấp ABC",
        "email": "supplier@example.com"
      }
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 5.2. Tạo ingredient (SUPPLIER only)

**Endpoint:** `POST /ingredients`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "name": "Thịt gà",
  "tag": "Thịt"
}
```

**Note:** `providerId` tự động lấy từ user đang login.

---

## 6. COMMENTS

### 6.1. Lấy comments của post

**Endpoint:** `GET /comments/post/:postId?isRatingComment=false`

**Query Parameters:**
- `isRatingComment`: 
  - `false` = Lấy comments thường
  - `true` = Lấy rating comments

**Example:** `GET /comments/post/550e8400-e29b-41d4-a716-446655440000?isRatingComment=false`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-comment-1",
      "postId": "550e8400-e29b-41d4-a716-446655440000",
      "userId": 2,
      "description": "Món này trông ngon quá!",
      "images": [
        "https://example.com/comment-img1.jpg"
      ],
      "isRatingComment": false,
      "rating": null,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "user": {
        "id": 2,
        "fullName": "Trần Thị B",
        "avatar": "https://example.com/avatar2.jpg"
      }
    }
  ],
  "total": 12
}
```

---

### 6.2. Tạo comment (Auth required)

**Endpoint:** `POST /comments`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body (Comment thường):**
```json
{
  "postId": "550e8400-e29b-41d4-a716-446655440000",
  "description": "Món này trông ngon quá!",
  "images": [
    "https://example.com/my-photo.jpg"
  ],
  "isRatingComment": false
}
```

**Body (Rating comment):**
```json
{
  "postId": "550e8400-e29b-41d4-a716-446655440000",
  "description": "Đã làm theo công thức, rất ngon!",
  "images": [
    "https://example.com/my-dish.jpg"
  ],
  "isRatingComment": true,
  "rating": 4.5
}
```

**Note:** 
- Rating comment chỉ cho phép user đã order món này
- Rating bắt buộc phải có khi `isRatingComment = true`
- Rating từ 1-5 sao
- Post rating sẽ tự động update

---

### 6.3. Cập nhật comment (own comments only)

**Endpoint:** `PATCH /comments/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "description": "Updated description",
  "images": ["https://example.com/new-img.jpg"]
}
```

---

### 6.4. Xóa comment (own comments only)

**Endpoint:** `DELETE /comments/:id`

**Headers:**
```
Authorization: Bearer {accessToken}
```

---

## 7. LIKES

### 7.1. Toggle like/unlike post

**Endpoint:** `POST /likes`

**Body:**
```json
{
  "userId": 1,
  "postId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (Like):**
```json
{
  "success": true,
  "message": "Post liked successfully",
  "isLiked": true
}
```

**Response (Unlike):**
```json
{
  "success": true,
  "message": "Post unliked successfully",
  "isLiked": false
}
```

---

### 7.2. Lấy posts đã like của user

**Endpoint:** `GET /likes/user/:userId?page=1&limit=10`

**Example:** `GET /likes/user/1?page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-post-1",
      "name": "Gà chiên nước mắm",
      "thumbnail": "https://example.com/thumb.jpg",
      "user": {...},
      "_count": {
        "likes": 45,
        "comments": 12
      }
    }
  ],
  "meta": {
    "total": 20,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

**Use case:** Xem danh sách món đã lưu để đặt hàng.

---

### 7.3. Lấy số lượng likes của post

**Endpoint:** `GET /likes/post/:postId/count`

**Example:** `GET /likes/post/550e8400-e29b-41d4-a716-446655440000/count`

**Response:**
```json
{
  "success": true,
  "data": {
    "postId": "550e8400-e29b-41d4-a716-446655440000",
    "likeCount": 45
  }
}
```

---

### 7.4. Check like status

**Endpoint:** `GET /likes/check?userId=1&postId=550e8400-e29b-41d4-a716-446655440000`

**Response:**
```json
{
  "success": true,
  "data": {
    "postId": "550e8400-e29b-41d4-a716-446655440000",
    "isLiked": true
  }
}
```

**Use case:** Hiển thị trạng thái nút like (đỏ/xám) trên FE.

---

## 8. FOLLOW

### 8.1. Toggle follow/unfollow user

**Endpoint:** `POST /follow`

**Body:**
```json
{
  "followerId": 1,
  "followingId": 2
}
```

**Response (Follow):**
```json
{
  "success": true,
  "message": "Followed successfully",
  "isFollowing": true
}
```

**Response (Unfollow):**
```json
{
  "success": true,
  "message": "Unfollowed successfully",
  "isFollowing": false
}
```

---

### 8.2. Check follow status

**Endpoint:** `GET /follow/check?followerId=1&followingId=2`

**Response:**
```json
{
  "success": true,
  "isFollowing": true
}
```

---

## 9. ORDERS

### 9.1. Tạo order từ liked posts

**Endpoint:** `POST /orders`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "postIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ]
}
```

**Workflow:**
1. User like các món muốn nấu
2. Vào trang "Món đã lưu" (`GET /likes/user/:userId`)
3. Chọn món để đặt hàng
4. Gọi `POST /posts/calculate-ingredients` để xem tổng nguyên liệu
5. Xác nhận và tạo order

---

## 📝 NOTES

### Authentication
- Tất cả endpoints có `(Auth required)` cần header: `Authorization: Bearer {token}`
- Token lấy từ response của `/auth/login` hoặc `/auth/register`

### Pagination
- Default: `page=1`, `limit=10`
- Max limit: 100

### Error Responses
```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 🔥 USE CASES THỰC TẾ

### Use Case 1: User tìm món ăn và đặt hàng

```javascript
// 1. Tìm món gà chiên
GET /tags/search?tagIds=1,15&page=1&limit=10

// 2. Xem chi tiết món
GET /posts/550e8400-e29b-41d4-a716-446655440000

// 3. Like món để lưu lại
POST /likes
{ "userId": 1, "postId": "550e8400-e29b-41d4-a716-446655440000" }

// 4. Xem danh sách món đã lưu
GET /likes/user/1

// 5. Tính tổng nguyên liệu
POST /posts/calculate-ingredients
{ "postIds": ["uuid1", "uuid2"] }

// 6. Tạo order
POST /orders
{ "postIds": ["uuid1", "uuid2"] }
```

---

### Use Case 2: Creator đăng công thức mới

```javascript
// 1. Login
POST /auth/login
{ "email": "chef@example.com", "password": "123" }

// 2. Lấy danh sách tags
GET /tags

// 3. Lấy danh sách ingredients
GET /ingredients

// 4. Tạo post
POST /posts
{
  "name": "Gà chiên nước mắm",
  "linkVideo": "...",
  "tagIds": [1, 15],
  "cookingSteps": ["Bước 1", "Bước 2"],
  "recipeItems": [...]
}
```

---

### Use Case 3: User đánh giá món đã order

```javascript
// 1. Xem chi tiết món
GET /posts/uuid

// 2. Tạo rating comment (chỉ được nếu đã order)
POST /comments
{
  "postId": "uuid",
  "description": "Rất ngon!",
  "isRatingComment": true,
  "rating": 4.5
}

// 3. Post rating tự động update
```

---

**Last Updated:** 2025-12-25
**Version:** 1.0.0
