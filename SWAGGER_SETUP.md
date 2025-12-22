# 🎨 SWAGGER UI - GIAO DIỆN TEST API TỰ ĐỘNG

## 🤔 Swagger UI là gì?

**Swagger UI** là giao diện web tự động để:
- ✅ Xem tất cả API endpoints
- ✅ Test GET, POST, PUT, DELETE ngay trên browser
- ✅ Xem Request/Response format
- ✅ Không cần Postman
- ✅ Tự động tạo documentation

**Ví dụ:**
```
http://localhost:3000/api-docs
```

![Swagger UI Example](https://swagger.io/swagger/media/Images/tools/SwaggerUI.png)

---

## 🚀 SETUP SWAGGER CHO NESTJS

### Bước 1: Cài đặt packages

```bash
cd BE
npm install @nestjs/swagger swagger-ui-express
```

---

### Bước 2: Tạo file cấu hình Swagger

Tạo file: `BE/src/swagger.config.ts`

```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Savore API')
    .setDescription('API documentation for Savore Platform - Food Commerce & Content')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Posts', 'Content & recipe posts endpoints')
    .addTag('Orders', 'Order management endpoints')
    .addTag('Wallet', 'Wallet & transaction endpoints')
    .addTag('Commissions', 'Commission management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Lưu token khi refresh
    },
  });
}
```

---

### Bước 3: Thêm Swagger vào main.ts

Mở file: `BE/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config'; // Import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Setup Swagger
  setupSwagger(app); // Thêm dòng này
  
  await app.listen(3000);
  console.log('🚀 Server is running on http://localhost:3000');
  console.log('📚 Swagger docs: http://localhost:3000/api-docs');
}
bootstrap();
```

---

### Bước 4: Decorate Controllers

Ví dụ với Products Controller:

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('Products') // Nhóm endpoints
@Controller('products')
export class ProductsController {
  
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products' })
  async findAll() {
    // Logic here
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Return product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    // Logic here
  }

  @Post()
  @ApiBearerAuth('JWT-auth') // Yêu cầu JWT token
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createProductDto: CreateProductDto) {
    // Logic here
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto
  ) {
    // Logic here
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string) {
    // Logic here
  }
}
```

---

### Bước 5: Decorate DTOs

Ví dụ với CreateProductDto:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Organic Tomatoes',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product price in VND',
    example: 25000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Product status',
    enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'],
    example: 'ACTIVE',
  })
  @IsEnum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'])
  status: string;
}
```

---

## 🎯 CÁCH SỬ DỤNG SWAGGER UI

### 1. Khởi động server
```bash
cd BE
npm run start:dev
```

### 2. Mở Swagger UI
Truy cập: http://localhost:3000/api-docs

### 3. Test API không cần authentication

**Ví dụ: Get all products**

1. Click vào endpoint `GET /products`
2. Click nút **"Try it out"**
3. Click nút **"Execute"**
4. Xem kết quả ở phần **Response**

### 4. Test API cần authentication

**Ví dụ: Create product**

**Bước 1: Login để lấy token**
1. Click endpoint `POST /auth/login`
2. Click **"Try it out"**
3. Nhập body:
```json
{
  "email": "admin@savore.com",
  "password": "admin123"
}
```
4. Click **"Execute"**
5. Copy `access_token` từ response

**Bước 2: Authorize**
1. Click nút **"Authorize"** ở góc trên bên phải
2. Paste token vào ô **"Value"**
3. Click **"Authorize"**
4. Click **"Close"**

**Bước 3: Test endpoint**
1. Click endpoint `POST /products`
2. Click **"Try it out"**
3. Nhập body:
```json
{
  "name": "Fresh Carrots",
  "price": 15000,
  "status": "ACTIVE"
}
```
4. Click **"Execute"**
5. Xem kết quả

---

## 📝 VÍ DỤ HOÀN CHỈNH - AUTH CONTROLLER

```typescript
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        fullName: 'John Doe',
        createdAt: '2025-12-22T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'user@example.com',
          fullName: 'John Doe'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return user profile',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        fullName: 'John Doe',
        roles: ['USER', 'CREATOR'],
        wallet: {
          balance: 100000,
          currency: 'VND'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }
}
```

---

## 🎨 DECORATORS SWAGGER QUAN TRỌNG

### Controller Level
```typescript
@ApiTags('Products')           // Nhóm endpoints
@ApiBearerAuth('JWT-auth')     // Tất cả endpoints cần auth
@Controller('products')
```

### Endpoint Level
```typescript
@ApiOperation({ summary: 'Create product' })  // Mô tả ngắn
@ApiResponse({ status: 201, description: 'Created' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiBearerAuth('JWT-auth')     // Endpoint này cần auth
```

### DTO Level
```typescript
@ApiProperty({
  description: 'Product name',
  example: 'Tomatoes',
  required: true,
})
name: string;

@ApiProperty({
  description: 'Price in VND',
  example: 25000,
  minimum: 0,
  required: true,
})
price: number;

@ApiPropertyOptional({  // Optional field
  description: 'Product description',
  example: 'Fresh organic tomatoes',
})
description?: string;
```

---

## 🌐 DEPLOY VỚI VPS

### Truy cập Swagger trên VPS

Sau khi deploy lên VPS (IP: 123.45.67.89):

```
http://123.45.67.89:3000/api-docs
```

### Frontend/Mobile gọi API

```javascript
// Development
const API_URL = 'http://localhost:3000/api';

// Production (VPS)
const API_URL = 'http://123.45.67.89:3000/api';

// Production (Domain - optional)
const API_URL = 'https://api.savore.com/api';
```

---

## 💡 TIPS & TRICKS

### 1. Lưu token tự động
Trong `swagger.config.ts`:
```typescript
swaggerOptions: {
  persistAuthorization: true, // Token không mất khi refresh
}
```

### 2. Thêm examples cho Response
```typescript
@ApiResponse({ 
  status: 200,
  description: 'Success',
  schema: {
    example: {
      id: 1,
      name: 'Product name',
      price: 25000
    }
  }
})
```

### 3. Group endpoints theo module
```typescript
@ApiTags('Products')    // Tất cả products endpoints
@ApiTags('Orders')      // Tất cả orders endpoints
```

### 4. Hide endpoint khỏi Swagger
```typescript
@ApiExcludeEndpoint()  // Endpoint này không hiện trong Swagger
@Get('internal')
```

---

## 🔧 TROUBLESHOOTING

### Swagger không hiện?
1. Check `main.ts` đã import `setupSwagger`
2. Check server đã chạy: `npm run start:dev`
3. Truy cập đúng URL: `http://localhost:3000/api-docs`

### Token không work?
1. Check đã click **"Authorize"** chưa
2. Check token format: `Bearer <token>` (không cần thêm "Bearer")
3. Check token còn hạn không (JWT expires)

### Endpoint không hiện trong Swagger?
1. Check đã thêm `@ApiTags()` vào controller
2. Check đã thêm `@ApiOperation()` vào method
3. Restart server

---

## 📚 TÀI LIỆU THAM KHẢO

### Official Docs
- NestJS Swagger: https://docs.nestjs.com/openapi/introduction
- Swagger UI: https://swagger.io/tools/swagger-ui/

### Video Tutorials
- YouTube: "NestJS Swagger tutorial"
- YouTube: "Swagger UI tutorial"

---

## 🎯 CHECKLIST SETUP

- [ ] Cài đặt packages: `@nestjs/swagger` và `swagger-ui-express`
- [ ] Tạo file `swagger.config.ts`
- [ ] Thêm `setupSwagger()` vào `main.ts`
- [ ] Thêm `@ApiTags()` vào controllers
- [ ] Thêm `@ApiOperation()` vào endpoints
- [ ] Thêm `@ApiProperty()` vào DTOs
- [ ] Test truy cập: `http://localhost:3000/api-docs`
- [ ] Test login và lấy token
- [ ] Test authorize với token
- [ ] Test các endpoints

---

## 🎉 KẾT LUẬN

**Swagger UI giúp bạn:**
- ✅ Test API nhanh chóng
- ✅ Không cần Postman
- ✅ Tự động tạo documentation
- ✅ Dễ share với team/client
- ✅ Professional hơn

**Next steps:**
1. Setup Swagger theo hướng dẫn trên
2. Test tất cả endpoints
3. Share link Swagger với FE team
4. Bắt đầu code theo `DAILY_CHECKLIST.md`

---

**Chúc bạn setup thành công! 🚀**

*Có Swagger UI rồi, việc test API sẽ dễ dàng hơn rất nhiều!*
