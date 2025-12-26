# 🔄 CHANGELOG - API IMPROVEMENTS

## Version: 2024-12-23

### 🐛 BUG FIXES

#### 1. **CRITICAL: Fixed Authorization Issue in Swagger UI**
- **Problem:** Token was entered in "Available authorizations" but couldn't be used for protected endpoints
- **Root Cause:** All `@ApiBearerAuth()` decorators were missing the scheme name, while `main.ts` defined it as `'JWT-auth'`
- **Solution:** Updated ALL protected endpoints to use `@ApiBearerAuth('JWT-auth')`
- **Files Changed:**
  - `src/auth/auth.controller.ts` - 2 endpoints
  - `src/admin/admin.controller.ts` - All endpoints (controller-level)
  - `src/ingredients/ingredients.controller.ts` - 3 endpoints
  - `src/posts/posts.controller.ts` - 3 endpoints
  - `src/products/products.controller.ts` - 4 endpoints

#### 2. **Fixed Swagger Documentation Inheritance**
- **Problem:** Update DTOs weren't showing examples in Swagger
- **Solution:** Changed `PartialType` import from `@nestjs/mapped-types` to `@nestjs/swagger`
- **Files Changed:**
  - `src/ingredients/dto/update-ingredient.dto.ts`
  - `src/posts/dto/update-post.dto.ts`

---

### ✨ ENHANCEMENTS

#### 1. **Added Complete Examples to All DTOs**
Now FE can copy examples directly from Swagger UI!

**DTOs Updated:**
- ✅ `LoginDto` - Added email & password examples
- ✅ `CreateIngredientDto` - Added name, tag, providerId examples
- ✅ `CreatePostDto` - Added complete examples including recipeItems array
- ✅ `RecipeItemDto` - Added ingredientId, quantity, unit examples
- ✅ `AssignRoleDto` - Added roleCode example with enum

**Example Before:**
```typescript
export class LoginDto {
    @IsEmail()
    email: string;
    
    @IsString()
    password: string;
}
```

**Example After:**
```typescript
export class LoginDto {
    @ApiProperty({ 
        example: 'user@savore.com',
        description: 'Email của user'
    })
    @IsEmail()
    email: string;

    @ApiProperty({ 
        example: 'password123',
        description: 'Mật khẩu (tối thiểu 6 ký tự)'
    })
    @IsString()
    password: string;
}
```

#### 2. **Enhanced Admin Controller Documentation**
- Added `@ApiTags('Admin')` for better organization
- Added `@ApiBearerAuth('JWT-auth')` at controller level
- Added comprehensive documentation for all endpoints:
  - `@ApiOperation` - Clear endpoint descriptions
  - `@ApiResponse` - All possible response codes
  - `@ApiQuery` - Query parameter examples
  - `@ApiParam` - Path parameter examples

---

### 📚 DOCUMENTATION

#### New Files Created:
1. **`API_USAGE_GUIDE.md`** - Complete API usage guide with:
   - Step-by-step authorization guide
   - All endpoints with copy-paste ready examples
   - Roles & permissions table
   - Troubleshooting section

---

### 🎯 IMPACT

#### For Frontend Developers:
- ✅ Can now use authorization in Swagger UI properly
- ✅ Can copy all examples directly without modification
- ✅ Clear understanding of all endpoints and their requirements
- ✅ Better error handling with documented response codes

#### For Backend Developers:
- ✅ Consistent Swagger documentation across all controllers
- ✅ Proper DTO inheritance for update operations
- ✅ Better code maintainability

---

### 📋 TESTING CHECKLIST

- [x] Authorization works in Swagger UI
- [x] All DTOs show examples in Swagger
- [x] All endpoints have proper documentation
- [x] Update DTOs inherit examples from Create DTOs
- [x] All protected endpoints require proper authentication
- [x] Role-based access control works correctly

---

### 🔍 TECHNICAL DETAILS

#### Authorization Flow:
1. User logs in → receives JWT token
2. User clicks "Authorize" in Swagger UI
3. Enters token (without "Bearer " prefix)
4. Swagger automatically adds "Bearer " prefix
5. Token is sent in `Authorization` header for all protected endpoints

#### Swagger Configuration (main.ts):
```typescript
.addBearerAuth(
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT token',
    in: 'header',
  },
  'JWT-auth', // ← This name MUST match in @ApiBearerAuth('JWT-auth')
)
```

---

### 🚀 NEXT STEPS

Recommended improvements for future:
1. Add response examples to `@ApiResponse` decorators
2. Add request validation error examples
3. Consider adding API versioning
4. Add rate limiting documentation
5. Add WebSocket documentation (if applicable)

---

### 👥 CONTRIBUTORS

- Fixed by: AI Assistant
- Requested by: User
- Date: 2024-12-23

---

### 📞 SUPPORT

If you encounter any issues:
1. Check `API_USAGE_GUIDE.md` for common solutions
2. Verify your token is valid and not expired
3. Ensure you have the correct role for the endpoint
4. Check the Swagger UI for detailed error messages
