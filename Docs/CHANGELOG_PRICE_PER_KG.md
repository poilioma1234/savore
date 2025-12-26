# 📝 CẬP NHẬT: THÊM GIÁ TIỀN CHO NGUYÊN LIỆU

**Ngày:** 2025-12-26  
**Phiên bản:** 1.1.0

---

## 🎯 MỤC ĐÍCH

Thêm trường `pricePerKg` (giá tiền 1kg) vào model `Ingredient` để:
- Tính toán chi phí món ăn tự động
- Hiển thị giá ước tính cho người dùng
- Hỗ trợ so sánh giá giữa các nhà cung cấp
- Tạo đơn hàng dễ dàng hơn

---

## ✅ CÁC THAY ĐỔI ĐÃ THỰC HIỆN

### 1. **Database Schema** (Prisma)

**File:** `BE/prisma/schema.prisma`

Thêm trường mới vào model `Ingredient`:
```prisma
model Ingredient {
  id          String       @id @default(uuid()) @db.Uuid
  name        String
  tag         String
  pricePerKg  Decimal      @map("price_per_kg") @db.Decimal(15, 2)  // ← MỚI
  providerId  Int          @map("provider_id")
  createdAt   DateTime     @default(now()) @map("created_at")
  provider    User         @relation("ProviderIngredients", fields: [providerId], references: [id], onDelete: Cascade)
  recipeItems RecipeItem[]

  @@map("ingredients")
}
```

**Migration:** `20251226105515_add_price_per_kg_to_ingredients`

---

### 2. **DTO (Data Transfer Object)**

**File:** `BE/src/ingredients/dto/create-ingredient.dto.ts`

Thêm validation cho trường `pricePerKg`:
```typescript
export class CreateIngredientDto {
    @ApiProperty({
        example: 'Thịt gà hữu cơ',
        description: 'Tên nguyên liệu'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'gà',
        description: 'Tag để phân loại nguyên liệu (dùng cho search)'
    })
    @IsString()
    @IsNotEmpty()
    tag: string;

    @ApiProperty({
        example: 150000,
        description: 'Giá tiền 1kg nguyên liệu (VND)'
    })
    @IsNumber()
    @IsNotEmpty()
    pricePerKg: number;  // ← MỚI
}
```

---

### 3. **Seed Data**

**File:** `BE/prisma/seed.mjs`

Cập nhật dữ liệu mẫu với giá thực tế:
```javascript
const ingredientsData = [
    { name: 'Thịt gà ta', tag: 'gà', providerId: supplierUser.id, pricePerKg: 150000 },
    { name: 'Thịt gà công nghiệp', tag: 'gà', providerId: supplierUser2.id, pricePerKg: 85000 },
    { name: 'Sả', tag: 'gia vị', providerId: supplierUser.id, pricePerKg: 20000 },
    { name: 'Ớt', tag: 'gia vị', providerId: supplierUser.id, pricePerKg: 30000 },
    { name: 'Tỏi', tag: 'gia vị', providerId: supplierUser2.id, pricePerKg: 40000 },
    { name: 'Hành tím', tag: 'gia vị', providerId: supplierUser2.id, pricePerKg: 25000 },
    { name: 'Nước mắm', tag: 'gia vị', providerId: supplierUser.id, pricePerKg: 50000 },
    { name: 'Đường', tag: 'gia vị', providerId: supplierUser.id, pricePerKg: 18000 },
    { name: 'Thịt bò', tag: 'bò', providerId: supplierUser.id, pricePerKg: 360000 },
    { name: 'Rau muống', tag: 'rau', providerId: supplierUser2.id, pricePerKg: 15000 },
    { name: 'Cà chua', tag: 'rau', providerId: supplierUser.id, pricePerKg: 30000 },
    { name: 'Trứng gà', tag: 'trứng', providerId: supplierUser2.id, pricePerKg: 45000 },
];
```

**Bonus:** Cũng đã sửa lỗi `tagVideo` → `tagIds` và `cookingSteps` từ string sang array.

---

### 4. **API Documentation**

**File:** `Docs/API_DOCUMENTATION.md`

Cập nhật ví dụ API:

#### GET /ingredients
```json
{
  "id": "uuid-ing-1",
  "name": "Thịt gà",
  "tag": "Thịt",
  "pricePerKg": "150000.00",  // ← MỚI
  "providerId": 5,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "provider": {
    "id": 5,
    "fullName": "Nhà cung cấp ABC",
    "email": "supplier@example.com"
  }
}
```

#### POST /ingredients
```json
{
  "name": "Thịt gà",
  "tag": "Thịt",
  "pricePerKg": 150000  // ← MỚI (bắt buộc)
}
```

---

## 🗄️ DATABASE MIGRATION

Migration đã được tạo và apply thành công:

```sql
-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN "price_per_kg" DECIMAL(15,2) NOT NULL DEFAULT 0;
```

**Lưu ý:** Database đã được reset và seed lại với dữ liệu mới.

---

## 📊 DỮ LIỆU MẪU

Sau khi seed, database có:
- ✅ 4 Roles (ADMIN, CREATOR, USER, SUPPLIER)
- ✅ 5 Users
- ✅ 12 Ingredients (với giá)
- ✅ 7 Tags
- ✅ 7 Products
- ✅ 3 Posts (recipes)

---

## 🔧 CÁCH SỬ DỤNG

### Tạo ingredient mới với giá:

```bash
POST http://103.6.234.20:3003/ingredients
Authorization: Bearer {token_supplier}
Content-Type: application/json

{
  "name": "Thịt heo ba chỉ",
  "tag": "heo",
  "pricePerKg": 120000
}
```

### Lấy danh sách ingredients (có giá):

```bash
GET http://103.6.234.20:3003/ingredients?page=1&limit=10
```

Response sẽ bao gồm trường `pricePerKg` cho mỗi ingredient.

---

## 🎯 TÍNH NĂNG TIẾP THEO (Đề xuất)

1. **API tính chi phí món ăn:**
   - Endpoint: `POST /posts/:id/calculate-cost`
   - Tính tổng chi phí dựa trên `quantity * pricePerKg` của từng ingredient

2. **So sánh giá nhà cung cấp:**
   - Endpoint: `GET /ingredients/compare?name=Thịt gà`
   - Trả về cùng loại nguyên liệu từ các supplier khác nhau

3. **Lọc theo khoảng giá:**
   - Endpoint: `GET /ingredients?minPrice=50000&maxPrice=200000`

---

## 📞 LIÊN HỆ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team Backend.

**Last Updated:** 2025-12-26  
**Version:** 1.1.0
