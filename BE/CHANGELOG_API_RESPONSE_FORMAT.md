# API Response Format Changes - Snake_case to camelCase

## Tổng quan
Đã chuyển đổi tất cả response keys từ **snake_case** (dùng dấu gạch dưới `_`) sang **camelCase** (chữ đầu thường, chữ đầu của từ sau viết hoa) để thuận tiện hơn cho Frontend.

## Các thay đổi chính

### 1. Auth Service (`src/auth/auth.service.ts`)
**Trước:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@savore.com",
    "fullName": "Nguyễn Văn A",
    "roles": ["USER"]
  }
}
```

**Sau:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@savore.com",
    "fullName": "Nguyễn Văn A",
    "roles": ["USER"]
  }
}
```

### 2. Response DTOs (`src/auth/dto/auth-response.dto.ts`)
Đã tạo Response DTOs cho Swagger documentation:
- `UserResponseDto`: Định nghĩa cấu trúc user object
- `AuthResponseDto`: Định nghĩa cấu trúc response cho register/login

### 3. Auth Controller (`src/auth/auth.controller.ts`)
Đã thêm `type: AuthResponseDto` vào `@ApiResponse` decorator để Swagger hiển thị đúng cấu trúc response.

## Các API bị ảnh hưởng

### ✅ Đã sửa
1. **POST /auth/register** - Response key `access_token` → `accessToken`
2. **POST /auth/login** - Response key `access_token` → `accessToken`

### ✅ Đã kiểm tra (không cần sửa)
- **GET /auth/profile** - Đã dùng camelCase từ đầu
- **PATCH /auth/profile** - Đã dùng camelCase từ đầu
- Tất cả Admin APIs - Đã dùng camelCase
- Tất cả Ingredients APIs - Đã dùng camelCase
- Tất cả Posts APIs - Đã dùng camelCase

## Hướng dẫn cho Frontend

### Trước đây (cũ):
```javascript
const response = await fetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const data = await response.json();
const token = data.access_token; // ❌ Cũ
```

### Bây giờ (mới):
```javascript
const response = await fetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const data = await response.json();
const token = data.accessToken; // ✅ Mới
```

## Testing
Build thành công ✅
```bash
npm run build
```

## Lưu ý
- Tất cả DTOs (request/response) đều dùng camelCase
- Prisma models vẫn giữ nguyên naming convention (không ảnh hưởng)
- Composite keys như `userId_roleId` vẫn giữ nguyên (do Prisma yêu cầu)

## Swagger Documentation
Truy cập `http://localhost:3000/api` để xem Swagger UI với response schema mới.
