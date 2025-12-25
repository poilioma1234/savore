# 🎉 Savore Social Media Features - API Summary

## 📋 Tổng quan thay đổi

Hệ thống đã được chuyển đổi từ admin-only sang **mạng xã hội công khai** như Facebook, với các tính năng:

### ✅ Hoàn thành

1. **User API** - Public access (không cần auth)
2. **Post API** - Social media features (like, rating, view, comments)
3. **Comment API** - Hệ thống bình luận và đánh giá
4. **Orders/Receipts API** - Xem lịch sử đơn hàng

---

## 🔧 Database Changes

### User Model
- ✅ Thêm field `avatar` (String, optional)

### Post Model  
- ✅ Thêm `like` (Int, default: 0) - Số lượt thích
- ✅ Thêm `rating` (Decimal(3,1), default: 0) - Điểm đánh giá (0.0 - 5.0)
- ✅ Thêm `view` (Int, default: 0) - Số lượt xem
- ✅ Chuyển `tagVideo` từ `String` → `String[]` - Hỗ trợ nhiều tags

### Comment Model (MỚI)
```prisma
model Comment {
  id              String   @id @default(uuid())
  postId          String   
  userId          Int      
  description     String   
  images          String[] @default([])
  isRatingComment Boolean  @default(false)
  createdAt       DateTime @default(now())
}
```

---

## 🚀 API Endpoints

### 1. **Users API** (Public - No Auth)

#### `GET /users/:id`
Lấy thông tin công khai của user (avatar, tên)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Nguyễn Văn A",
    "avatar": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. **Posts API** (Social Features)

#### `GET /posts` (Public)
Lấy danh sách posts với filter theo tag

**Query params:**
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số items/trang (default: 10)
- `tag` (optional): Filter theo tag (VD: "gà")

**Response:**
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### `GET /posts/random` (Public) ⭐ MỚI
Lấy 1 post ngẫu nhiên (ưu tiên rating > like > view)
- Tự động tăng view count
- Dùng cho feed mạng xã hội

#### `GET /posts/user/:userId` (Public) ⭐ MỚI
Lấy danh sách posts của 1 user cụ thể

**Query params:**
- `sortType` (optional): 
  - `1` = Mới nhất (createdAt DESC)
  - `2` = Nhiều view nhất (view DESC)
  - `3` = Nhiều like nhất (like DESC)
  - `4` = Đánh giá cao nhất (rating DESC)
- `page`, `limit`: Pagination

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "sortType": 1
  }
}
```

#### `GET /posts/:id` (Public)
Lấy chi tiết 1 post

#### `POST /posts/:id/like` (Public) ⭐ MỚI
Like một post (không cần auth)

**Response:**
```json
{
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "id": "uuid",
    "like": 42
  }
}
```

---

### 3. **Comments API** (Nested under Posts)

#### `POST /posts/:postId/comments` (Auth Required)
Tạo comment mới

**Body:**
```json
{
  "description": "Món này ngon quá!",
  "images": ["url1", "url2"],
  "isRatingComment": false
}
```

**Lưu ý:** 
- Nếu `isRatingComment = true`, chỉ user đã đặt món mới được comment
- Hệ thống tự động verify order history

#### `GET /posts/:postId/comments` (Public)
Lấy tất cả comments thường của post

#### `GET /posts/:postId/ratingComments` (Public)
Lấy tất cả rating comments của post (từ người đã đặt món)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "description": "Rất ngon!",
      "images": [],
      "isRatingComment": true,
      "createdAt": "...",
      "user": {
        "id": 1,
        "fullName": "Nguyễn Văn A",
        "avatar": "..."
      }
    }
  ],
  "total": 10
}
```

#### `PATCH /posts/:postId/comments/:id` (Auth - Own Only)
Cập nhật comment của mình

#### `DELETE /posts/:postId/comments/:id` (Auth - Own Only)
Xóa comment của mình

---

### 4. **Orders/Receipts API** (Public)

#### `GET /receipts/user/:userId` (Public)
Lấy danh sách đơn hàng của user

**Query params:**
- `page`, `limit`: Pagination

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "totalPrice": "150000",
      "status": "COMPLETED",
      "createdAt": "...",
      "orderItems": [
        {
          "id": 1,
          "productNameAtPurchase": "Thịt gà",
          "priceAtPurchase": "50000",
          "quantity": "2",
          "sourcePost": {
            "id": "uuid",
            "name": "Gà xào sả ớt",
            "thumbnail": "..."
          },
          "creator": {
            "id": 2,
            "fullName": "Chef A",
            "avatar": "..."
          }
        }
      ]
    }
  ],
  "meta": {...}
}
```

#### `GET /receipts/:id` (Public)
Lấy chi tiết 1 đơn hàng

---

## 📝 DTO Changes

### CreatePostDto
```typescript
{
  linkVideo: string;
  thumbnail?: string;
  name: string;
  description?: string;
  cookingSteps?: string;
  tagVideo: string[];  // ⭐ CHANGED: Array instead of string
  recipeItems: RecipeItemDto[];
}
```

### CreateCommentDto
```typescript
{
  postId: string;
  description: string;
  images?: string[];
  isRatingComment?: boolean;
}
```

---

## 🔐 Authentication Changes

### Public Endpoints (No Auth Required)
- ✅ `GET /users/:id`
- ✅ `GET /posts` (all variants)
- ✅ `POST /posts/:id/like`
- ✅ `GET /posts/:postId/comments`
- ✅ `GET /posts/:postId/ratingComments`
- ✅ `GET /receipts/user/:userId`
- ✅ `GET /receipts/:id`

### Auth Required
- `POST /posts/:postId/comments` - Authenticated users
- `PATCH /posts/:postId/comments/:id` - Own comments only
- `DELETE /posts/:postId/comments/:id` - Own comments only

---

## 🎯 Use Cases

### 1. **Social Media Feed**
```
GET /posts/random
→ Lấy post ngẫu nhiên để hiển thị feed
→ Auto-increment view count
```

### 2. **User Profile**
```
GET /users/:id
→ Lấy thông tin user

GET /posts/user/:userId?sortType=4
→ Lấy posts của user, sắp xếp theo rating cao nhất
```

### 3. **Post Interaction**
```
GET /posts/:id
→ Xem chi tiết post

POST /posts/:id/like
→ Like post

GET /posts/:id/comments
→ Xem comments

GET /posts/:id/ratingComments
→ Xem đánh giá từ người đã mua
```

### 4. **Order History**
```
GET /receipts/user/:userId
→ Xem lịch sử đơn hàng
→ Dùng để chọn món và đặt lại
```

---

## 🧪 Testing

### Test Accounts
```
Creator:   creator@savore.com / creator123
User:      user@savore.com / user123
Supplier:  supplier@savore.com / supplier123
```

### Sample Requests

#### 1. Get random post
```bash
GET http://localhost:3000/posts/random
```

#### 2. Get user's posts (sorted by likes)
```bash
GET http://localhost:3000/posts/user/2?sortType=3&page=1&limit=10
```

#### 3. Like a post
```bash
POST http://localhost:3000/posts/{postId}/like
```

#### 4. Create comment (requires auth)
```bash
POST http://localhost:3000/posts/{postId}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Món này ngon quá!",
  "images": [],
  "isRatingComment": false
}
```

#### 5. Get user receipts
```bash
GET http://localhost:3000/receipts/user/3?page=1&limit=10
```

---

## 📊 Database Seeding

Database đã được seed với:
- ✅ 5 users (với avatar)
- ✅ 3 posts (với tagVideo là array)
- ✅ 12 ingredients
- ✅ 7 products

Run seed:
```bash
npx prisma db seed
```

---

## 🚀 Deployment

### Build
```bash
npm run build
```

### Start
```bash
npm run start:prod
```

### Migrations
```bash
npx prisma migrate deploy
npx prisma generate
```

---

## 📚 Swagger Documentation

Tất cả endpoints đã được document đầy đủ trong Swagger UI:

```
http://localhost:3000/api
```

**Swagger Groups:**
- 👥 Users - Public user info
- 📹 Posts - Social media posts
- 💬 Comments - Comment system
- 📦 Orders/Receipts - Order history

---

## ✨ Key Features

1. **Public Access** - Không cần auth để xem content
2. **Social Engagement** - Like, comment, rating system
3. **Smart Feed** - Random posts với weighted selection
4. **User Profiles** - Public user info với avatar
5. **Order History** - Xem lịch sử để đặt lại món
6. **Multi-tag Support** - Posts có thể có nhiều tags
7. **Rating Comments** - Chỉ người đã mua mới đánh giá được

---

## 🎨 Frontend Integration Tips

### Display Post
```typescript
interface Post {
  id: string;
  name: string;
  thumbnail: string;
  like: number;
  rating: number;
  view: number;
  tagVideo: string[];
  user: {
    id: number;
    fullName: string;
    avatar: string;
  };
}
```

### Like Button
```typescript
const handleLike = async (postId: string) => {
  await fetch(`/posts/${postId}/like`, { method: 'POST' });
  // Refresh post data
};
```

### Comments Section
```typescript
// Get regular comments
const comments = await fetch(`/posts/${postId}/comments`);

// Get rating comments (from buyers)
const ratings = await fetch(`/posts/${postId}/ratingComments`);
```

---

## 🔄 Migration Path

Nếu cần reset database:
```bash
npx prisma migrate reset --force
npx prisma generate
npx prisma db seed
```

---

Chúc bạn code vui vẻ! 🎉
