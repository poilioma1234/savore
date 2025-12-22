# 🗄️ WORKING WITH VPS DATABASE - GUIDE

## ⚠️ **QUAN TRỌNG**

Khi làm việc với **VPS database**, bạn **KHÔNG THỂ** dùng `prisma migrate dev` vì:
- VPS database user không có quyền tạo shadow database
- Shadow database chỉ cần cho development

## ✅ **ĐÚNG CÁCH**

### **Scenario 1: Schema KHÔNG thay đổi**

Nếu bạn chỉ sửa code (services, controllers, DTOs) mà **KHÔNG** thay đổi `schema.prisma`:

```bash
# Chỉ cần regenerate Prisma Client
npx prisma generate

# Restart server
npm run start:dev
```

**Ví dụ:**
- Sửa CreateProductDto
- Thêm validation
- Sửa logic trong service
- Thêm endpoint mới

### **Scenario 2: Schema CÓ thay đổi**

Nếu bạn thay đổi `schema.prisma` (thêm field, table, etc.):

#### **Option A: Tạo migration thủ công (RECOMMENDED)**

1. **Tạo folder migration:**
```bash
New-Item -ItemType Directory -Path "prisma\migrations\$(Get-Date -Format 'yyyyMMddHHmmss')_your_migration_name"
```

2. **Tạo file migration.sql:**
```sql
-- Ví dụ: Thêm description field cho Product
ALTER TABLE "products" ADD COLUMN "description" TEXT;
```

3. **Apply migration:**
```bash
npx prisma migrate deploy
```

4. **Generate Prisma Client:**
```bash
npx prisma generate
```

#### **Option B: Dùng local database (ADVANCED)**

1. **Tạo local PostgreSQL database**
2. **Update .env tạm thời:**
```env
DATABASE_URL="postgresql://localhost:5432/savore_local"
```

3. **Run migrate dev:**
```bash
npx prisma migrate dev --name your_migration
```

4. **Copy migration file sang VPS:**
- Copy file từ `prisma/migrations/[timestamp]_your_migration/migration.sql`

5. **Đổi lại .env về VPS:**
```env
DATABASE_URL="postgres://savore_db:savore_db@103.6.234.20:5432/savore_db"
```

6. **Apply migration lên VPS:**
```bash
npx prisma migrate deploy
```

---

## 📋 **COMMON TASKS**

### ✅ **Check migration status**
```bash
npx prisma migrate status
```

### ✅ **Apply pending migrations**
```bash
npx prisma migrate deploy
```

### ✅ **Regenerate Prisma Client**
```bash
npx prisma generate
```

### ✅ **View database**
```bash
npx prisma studio
```

### ✅ **Reset local database (DANGEROUS)**
```bash
# ONLY for local database, NEVER for VPS!
npx prisma migrate reset
```

---

## 🚫 **KHÔNG BAO GIỜ LÀM**

### ❌ **NEVER run on VPS:**
```bash
# ❌ DON'T DO THIS
npx prisma migrate dev

# ❌ DON'T DO THIS
npx prisma migrate reset

# ❌ DON'T DO THIS
npx prisma db push
```

### ✅ **ALWAYS use:**
```bash
# ✅ DO THIS
npx prisma migrate deploy

# ✅ DO THIS
npx prisma generate
```

---

## 🎯 **YOUR CURRENT SITUATION**

### **Status:**
```
✅ Database schema is up to date!
✅ 4 migrations applied
✅ No pending migrations
```

### **What you need to do:**

**NOTHING!** Database đã perfect rồi.

Nếu bạn chỉ sửa code (như CreateProductDto), chỉ cần:

```bash
# 1. Regenerate Prisma Client (nếu cần)
npx prisma generate

# 2. Restart server
npm run start:dev
```

---

## 📝 **EXAMPLE: Adding a field to Product**

### **Step 1: Update schema.prisma**
```prisma
model Product {
  id          Int      @id @default(autoincrement())
  supplierId  Int      @map("supplier_id")
  name        String
  price       Decimal  @db.Decimal(15, 2)
  description String?  @db.Text        // ← NEW FIELD
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now()) @map("created_at")
  orderItems  OrderItem[]
  supplier    User     @relation(fields: [supplierId], references: [id], onDelete: Cascade)

  @@map("products")
}
```

### **Step 2: Create migration folder**
```bash
New-Item -ItemType Directory -Path "prisma\migrations\20251222221000_add_product_description"
```

### **Step 3: Create migration.sql**
```sql
-- Add description field to products table
ALTER TABLE "products" ADD COLUMN "description" TEXT;
```

### **Step 4: Apply migration**
```bash
npx prisma migrate deploy
```

### **Step 5: Generate Prisma Client**
```bash
npx prisma generate
```

### **Step 6: Update DTO**
```typescript
export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;  // ← NEW FIELD
}
```

### **Step 7: Restart server**
```bash
npm run start:dev
```

---

## 🔍 **TROUBLESHOOTING**

### **Error: "permission denied to create database"**
**Cause:** Trying to use `prisma migrate dev` with VPS database

**Solution:** Use `prisma migrate deploy` instead

### **Error: "Schema is not in sync"**
**Cause:** Schema changed but migration not applied

**Solution:**
```bash
npx prisma migrate deploy
npx prisma generate
```

### **Error: "Prisma Client not found"**
**Cause:** Prisma Client not generated

**Solution:**
```bash
npx prisma generate
```

---

## ✅ **QUICK REFERENCE**

| Task | Command |
|------|---------|
| Check status | `npx prisma migrate status` |
| Apply migrations | `npx prisma migrate deploy` |
| Generate client | `npx prisma generate` |
| View database | `npx prisma studio` |
| Format schema | `npx prisma format` |

---

## 🎯 **SUMMARY**

### **For VPS Database:**
- ✅ Use `npx prisma migrate deploy`
- ✅ Create migrations manually
- ❌ Never use `npx prisma migrate dev`
- ❌ Never use `npx prisma migrate reset`

### **Current Status:**
- ✅ Database is up-to-date
- ✅ All migrations applied
- ✅ No action needed

### **If you only changed code (not schema):**
```bash
npx prisma generate  # Only if needed
npm run start:dev    # Restart server
```

---

**🎉 You're all set!**

**📝 Remember:** VPS database = Use `migrate deploy`, not `migrate dev`
