# 🔄 WORKFLOW: DEPLOY POSTS LÊN VPS QUA GITHUB

**Workflow:** Local → GitHub → VPS

---

## 📋 BƯỚC 1: PUSH CODE TỪ LOCAL LÊN GITHUB

### **1.1. Kiểm tra files đã thay đổi**

```bash
cd C:\Users\TNWan\Downloads\TEST_DB2\Savore-init-database\Savore-init-database

git status
```

**Files mới cần push:**
- ✅ `BE/prisma/seed-posts.mjs` (17 posts)
- ✅ `BE/prisma/seed-ingredients.mjs` (28 ingredients với giá)
- ✅ `BE/prisma/clear-posts.mjs` (script xóa posts cũ)
- ✅ `BE/src/ingredients/dto/create-ingredient.dto.ts` (có pricePerKg)
- ✅ `BE/prisma/schema.prisma` (có pricePerKg)
- ✅ `BE/prisma/migrations/20251226105515_add_price_per_kg_to_ingredients/`
- ✅ `Docs/*.md` (tài liệu)

---

### **1.2. Add và commit**

```bash
git add .

git commit -m "feat: Add pricePerKg to ingredients & seed 17 posts with correct schema

- Add pricePerKg field to Ingredient model
- Create seed-ingredients.mjs with 28 ingredients
- Create seed-posts.mjs with 17 posts (correct tagIds & cookingSteps)
- Create clear-posts.mjs to clean old posts
- Update all documentation to port 3003
- Fix post schema: tagVideo -> tagIds, cookingSteps as array"
```

---

### **1.3. Push lên GitHub**

```bash
git push origin main
# Hoặc
git push origin master
```

---

## 📋 BƯỚC 2: PULL CODE TRÊN VPS

### **2.1. SSH vào VPS**

```bash
ssh root@103.6.234.20
```

---

### **2.2. Di chuyển vào thư mục dự án**

```bash
cd /root/Savore-init-database
# Hoặc đường dẫn của bạn
```

---

### **2.3. Pull code mới từ GitHub**

```bash
git pull origin main
# Hoặc
git pull origin master
```

**Output mong đợi:**
```
Updating abc1234..def5678
Fast-forward
 BE/prisma/schema.prisma                    | 1 +
 BE/prisma/seed-ingredients.mjs             | 95 ++++++++++++++++++
 BE/prisma/seed-posts.mjs                   | 450 ++++++++++++++++++
 BE/prisma/clear-posts.mjs                  | 30 +++++
 ...
```

---

## 📋 BƯỚC 3: CHẠY MIGRATION (Nếu có thay đổi schema)

```bash
cd BE

# Chạy migration để thêm pricePerKg
npx prisma migrate deploy
```

**Output mong đợi:**
```
✔ Generated Prisma Client
✔ Applied migration: 20251226105515_add_price_per_kg_to_ingredients
```

---

## 📋 BƯỚC 4: XÓA POSTS CŨ

```bash
node prisma/clear-posts.mjs
```

**Output:**
```
🗑️  Deleting all old posts...
  ✅ Deleted XX recipe items
  ✅ Deleted XX posts

✅ All posts deleted successfully!
```

---

## 📋 BƯỚC 5: CHẠY SEED (Theo thứ tự)

### **5.1. Seed Users (nếu chưa có)**

```bash
node prisma/seed-users.mjs
```

**Kết quả:** 19 users

---

### **5.2. Seed Tags (nếu chưa có)**

```bash
node prisma/seed-tags.mjs
```

**Kết quả:** 41 tags

---

### **5.3. Seed Ingredients (CÓ GIÁ MỚI)**

```bash
node prisma/seed-ingredients.mjs
```

**Kết quả:** 28 ingredients với pricePerKg

**Lưu ý:** Nếu đã có ingredients cũ (không có giá), cần xóa trước:

```bash
# Xóa ingredients cũ (cẩn thận!)
node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.ingredient.deleteMany().then(() => { console.log('Deleted'); p.\$disconnect(); });"

# Rồi seed lại
node prisma/seed-ingredients.mjs
```

---

### **5.4. Seed Posts (17 POSTS MỚI)**

```bash
node prisma/seed-posts.mjs
```

**Kết quả:** 17 posts với cấu trúc đúng

---

## 📋 BƯỚC 6: RESTART SERVER

### **Nếu dùng PM2:**

```bash
pm2 restart savore-be
pm2 logs savore-be --lines 50
```

---

### **Nếu dùng systemd:**

```bash
sudo systemctl restart savore-be
sudo systemctl status savore-be
```

---

### **Nếu chạy thủ công:**

```bash
# Stop server hiện tại (Ctrl+C)
# Rồi chạy lại:
npm run start:prod
```

---

## 📋 BƯỚC 7: TEST API

### **7.1. Test từ VPS (curl)**

```bash
curl http://localhost:3003/posts?page=1&limit=3
```

---

### **7.2. Test từ Postman**

```
GET http://103.6.234.20:3003/posts?page=1&limit=5
```

**Response mong đợi:**
```json
{
  "data": [
    {
      "id": "uuid...",
      "name": "Gà xào sả ớt",
      "tagIds": [1, 3],
      "cookingSteps": ["Bước 1...", "Bước 2..."],
      "recipeItems": [
        {
          "ingredient": {
            "name": "Thịt gà ta",
            "pricePerKg": "150000.00"
          }
        }
      ]
    }
  ],
  "meta": {
    "total": 17,
    "page": 1,
    "limit": 5,
    "totalPages": 4
  }
}
```

---

## 🎯 TÓM TẮT WORKFLOW

```
┌─────────────────────────────────────┐
│  LOCAL (Windows)                    │
│  1. git add .                       │
│  2. git commit -m "..."             │
│  3. git push origin main            │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  GITHUB                             │
│  - Code được sync                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  VPS (103.6.234.20)                 │
│  1. ssh root@103.6.234.20           │
│  2. cd /root/Savore-init-database   │
│  3. git pull origin main            │
│  4. cd BE                           │
│  5. npx prisma migrate deploy       │
│  6. node prisma/clear-posts.mjs     │
│  7. node prisma/seed-ingredients.mjs│
│  8. node prisma/seed-posts.mjs      │
│  9. pm2 restart savore-be           │
│  10. Test API                       │
└─────────────────────────────────────┘
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### **1. Thứ tự seed phải đúng:**

```bash
1. seed-users.mjs      # Tạo users (suppliers, creators)
2. seed-tags.mjs       # Tạo tags
3. seed-ingredients.mjs # Tạo ingredients (cần suppliers)
4. seed-posts.mjs      # Tạo posts (cần creators, tags, ingredients)
```

### **2. Nếu ingredients cũ không có giá:**

Phải xóa và seed lại:

```bash
# Xóa ingredients cũ
node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.recipeItem.deleteMany().then(() => p.ingredient.deleteMany()).then(() => { console.log('Deleted'); p.\$disconnect(); });"

# Seed lại
node prisma/seed-ingredients.mjs
```

### **3. File .env trên VPS:**

Đảm bảo `.env` trên VPS có đúng config:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/savore_db"
PORT=3003
```

---

## 🐛 XỬ LÝ LỖI

### **Lỗi: "Migration failed"**

```bash
# Reset migration (cẩn thận!)
npx prisma migrate reset

# Rồi chạy lại seed từ đầu
```

### **Lỗi: "No creators found"**

```bash
# Chạy seed users trước
node prisma/seed-users.mjs
```

### **Lỗi: "Ingredient not found"**

```bash
# Xóa và seed lại ingredients
node prisma/seed-ingredients.mjs
```

---

## ✅ CHECKLIST

- [ ] Push code lên GitHub thành công
- [ ] SSH vào VPS
- [ ] Pull code từ GitHub
- [ ] Chạy migration (nếu có)
- [ ] Xóa posts cũ (`clear-posts.mjs`)
- [ ] Seed ingredients với giá (`seed-ingredients.mjs`)
- [ ] Seed posts mới (`seed-posts.mjs`)
- [ ] Restart server
- [ ] Test API - Trả về 200 OK
- [ ] Kiểm tra response có `pricePerKg` trong ingredients

---

**Last Updated:** 2025-12-26  
**VPS:** 103.6.234.20:3003  
**Workflow:** Local → GitHub → VPS
