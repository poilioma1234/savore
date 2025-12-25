# 🎉 Savore Social Media Features V2 - Implementation Summary

## ✅ Hoàn thành (Phần 2 - Theo yêu cầu Mentor)

### 📊 Database Schema Updates

#### **User Model**
- ✅ Thêm `description` (Text) - Mô tả cá nhân
- ✅ Relations: `followers`, `following`, `likes`

#### **Post Model**  
- ✅ Bỏ `like` counter (dùng Like table thay thế)
- ✅ Chuyển `cookingSteps` từ Text → String[] (array)
- ✅ Chuyển `tagVideo` (String[]) → `tagIds` (Int[])
- ✅ Relations: `likes`

#### **Tag Model** (MỚI)
```prisma
model Tag {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  createdAt DateTime @default(now())
}
```
- Tạo sẵn các tags để giới hạn lọc lại
- Posts sẽ reference tag IDs

#### **Follow Model** (MỚI)
```prisma
model Follow {
  id          Int      @id @default(autoincrement())
  followerId  Int      
  followingId Int      
  createdAt   DateTime @default(now())
  
  @@unique([followerId, followingId])
}
```
- followerId: User A
- followingId: User B
- A follow B

#### **Like Model** (MỚI)
```prisma
model Like {
  id        Int      @id @default(autoincrement())
  userId    Int      
  postId    String   @db.Uuid
  createdAt DateTime @default(now())
  
  @@unique([userId, postId])
}
```
- Thay thế counter `like` trong Post
- Track user nào đã like post nào

---

## 🚀 New API Endpoints

### **👥 Users API** (Enhanced)

#### `GET /users/:id`
Trả về profile đầy đủ:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "description": "Food lover and chef",
    "avatar": "https://...",
    "followersCount": 150,
    "followingCount": 80,
    "postsCount": 25,
    "createdAt": "..."
  }
}
```

#### `GET /users/:id/posts` ⭐ MỚI
Lấy danh sách posts của user (phân trang)
- Query: `page`, `limit`

#### `PATCH /users/profile` ⭐ MỚI (Auth required)
Update mô tả cá nhân
```json
{
  "description": "Passionate chef and food blogger"
}
```

---

### **👥 Follow API** (MỚI)

#### `POST /follow` ⭐ MỚI
Toggle follow/unfollow

**Request:**
```json
{
  "followerId": 1,
  "followingId": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Followed successfully",
  "isFollowing": true
}
```

**Logic:**
- Nếu chưa follow → Add vào DB (follow)
- Nếu đã follow → Delete khỏi DB (unfollow)

---

### **❤️ Likes API** (MỚI)

#### `POST /likes` ⭐ MỚI
Toggle like/unlike post

**Request:**
```json
{
  "userId": 1,
  "postId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post liked successfully",
  "isLiked": true
}
```

#### `GET /likes/user/:userId` ⭐ MỚI
Lấy danh sách posts user đã like (để đặt hàng)
- Query: `page`, `limit`

**Use case:** User xem lại các món đã lưu để đặt hàng

#### `GET /likes/post/:postId/count` ⭐ MỚI
Lấy số lượt like của post

---

## 🔄 DTO Changes

### CreatePostDto
```typescript
{
  linkVideo: string;
  thumbnail?: string;
  name: string;
  description?: string;
  cookingSteps?: string;  // FE gửi string dài, BE tự chặt thành array
  tagIds: number[];       // ⭐ CHANGED: Array of tag IDs
  recipeItems: RecipeItemDto[];
}
```

**Cooking Steps Processing:**
- FE gửi: `"Bước 1: Ướp gà\nBước 2: Chiên gà\nBước 3: Tưới nước mắm"`
- BE tự động split theo `\n` thành array
- Lưu vào DB: `["Bước 1: Ướp gà", "Bước 2: Chiên gà", "Bước 3: Tưới nước mắm"]`

**Tag System:**
- FE gửi tag IDs: `[1, 2, 3]`
- Search: Nếu post có tag ID trong list → trả về

---

## 📝 Tag System

### Predefined Tags (Seed Data)
```javascript
const tags = [
  { name: "Gà" },
  { name: "Bò" },
  { name: "Heo" },
  { name: "Cá" },
  { name: "Rau" },
  { name: "Ăn kiêng" },
  { name: "Gym" },
  { name: "Chiên" },
  { name: "Xào" },
  { name: "Nướng" },
  { name: "Hấp" },
  { name: "Canh" }
];
```

### Search by Tag
```
GET /posts?tagId=1
→ Lấy tất cả posts có tagIds chứa 1 (Gà)

GET /posts?tagId=6
→ Lấy tất cả posts có tagIds chứa 6 (Ăn kiêng)
```

**Example:**
- Post "Ức gà ăn kiêng" có `tagIds: [1, 6]` (Gà + Ăn kiêng)
- Search `tagId=1` → Xuất hiện
- Search `tagId=6` → Cũng xuất hiện

---

## 🎯 Use Cases

### 1. **User Profile**
```
GET /users/2
→ Xem profile với followers/following/posts count

GET /users/2/posts?page=1&limit=10
→ Xem danh sách posts của user
```

### 2. **Follow System**
```
POST /follow
Body: { "followerId": 1, "followingId": 2 }
→ User 1 follow User 2

POST /follow (lần 2)
Body: { "followerId": 1, "followingId": 2 }
→ User 1 unfollow User 2
```

### 3. **Like System**
```
POST /likes
Body: { "userId": 1, "postId": "uuid" }
→ Like post

GET /likes/user/1
→ Xem tất cả posts user đã like (để đặt hàng)

GET /likes/post/uuid/count
→ Xem số lượt like của post
```

### 4. **Tag-based Search**
```
GET /posts?tagId=1
→ Tìm tất cả món có tag "Gà"

GET /posts?tagId=6
→ Tìm tất cả món "Ăn kiêng"
```

---

## 🔧 Technical Details

### Cooking Steps Processing (BE)
```typescript
// FE gửi
{
  "cookingSteps": "Bước 1: Ướp gà\nBước 2: Chiên gà"
}

// BE xử lý
const stepsArray = cookingSteps ? cookingSteps.split('\n').filter(s => s.trim()) : [];

// Lưu DB
{
  "cooking_steps": ["Bước 1: Ướp gà", "Bước 2: Chiên gà"]
}
```

### Tag Search Query
```typescript
// Search posts by tag ID
const posts = await prisma.post.findMany({
  where: {
    tagIds: {
      has: tagId  // Check if array contains tagId
    }
  }
});
```

### Follow Toggle Logic
```typescript
const existing = await prisma.follow.findUnique({
  where: { followerId_followingId: { followerId, followingId } }
});

if (existing) {
  // Unfollow
  await prisma.follow.delete({ where: { ... } });
} else {
  // Follow
  await prisma.follow.create({ data: { ... } });
}
```

---

## 📦 Modules Created

1. **FollowModule** (`src/follow/`)
   - `follow.service.ts` - Toggle follow logic
   - `follow.controller.ts` - Follow endpoints

2. **LikesModule** (`src/likes/`)
   - `likes.service.ts` - Like/unlike, get liked posts
   - `likes.controller.ts` - Like endpoints

3. **UsersModule** (Enhanced)
   - Added profile endpoints
   - Added user posts listing
   - Added profile update

---

## 🗄️ Database Migration

Migration created: `20251225031227_add_social_features_v2`

**Changes:**
- Add `description` to users
- Add `Tag`, `Follow`, `Like` tables
- Change Post: `cookingSteps` → array, `tagVideo` → `tagIds`
- Remove `like` counter from Post

**To apply:**
```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

---

## 🎨 Frontend Integration

### Follow Button
```typescript
const handleFollow = async () => {
  const res = await fetch('/follow', {
    method: 'POST',
    body: JSON.stringify({
      followerId: currentUserId,
      followingId: profileUserId
    })
  });
  const data = await res.json();
  setIsFollowing(data.isFollowing);
};
```

### Like Button
```typescript
const handleLike = async (postId: string) => {
  const res = await fetch('/likes', {
    method: 'POST',
    body: JSON.stringify({
      userId: currentUserId,
      postId
    })
  });
  const data = await res.json();
  setIsLiked(data.isLiked);
};
```

### Tag Filter
```typescript
const filterByTag = async (tagId: number) => {
  const posts = await fetch(`/posts?tagId=${tagId}`);
  setPosts(await posts.json());
};
```

---

## ✨ Key Improvements

1. ✅ **Follow System** - User có thể follow/unfollow nhau
2. ✅ **Like Tracking** - Biết user nào đã like post nào
3. ✅ **Saved Posts** - User xem lại posts đã like để đặt hàng
4. ✅ **Tag System** - Search chính xác hơn với predefined tags
5. ✅ **Cooking Steps** - FE gửi string, BE tự xử lý thành array
6. ✅ **User Profile** - Đầy đủ thông tin followers/following/posts count

---

## 🚀 Next Steps

1. Stop server hiện tại
2. Apply migration: `npx prisma migrate deploy`
3. Generate Prisma Client: `npx prisma generate`
4. Update seed data với Tags
5. Run seed: `npx prisma db seed`
6. Start server: `npm run start:dev`
7. Test endpoints trong Swagger

---

**Status:** ✅ Code complete, ready for migration
**Migration:** Created, pending apply
**Swagger:** Will update after migration
