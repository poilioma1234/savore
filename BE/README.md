# 🎊 SAVORE BACKEND API

> **Hutech IT Got Talent Project** - Food Recipe & E-commerce Platform

[![NestJS](https://img.shields.io/badge/NestJS-11.0-red)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-blue)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

---

## 🚀 **QUICK START**

### 📖 **Documentation**
**START HERE:** [`INDEX.md`](./INDEX.md) - Complete documentation index

### 🌐 **Live Resources**
- **API Server:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/api ⭐ **RECOMMENDED**
- **VPS Database:** 103.6.234.20:5432

### 🔑 **Test Accounts**
```
Admin:    admin@savore.com / admin123
Creator:  creator@savore.com / creator123
User:     user@savore.com / user123
Supplier: supplier@savore.com / supplier123
```

---

## ✅ **WHAT'S NEW**

### 🎯 **Mentor Requirements - 100% COMPLETED**

1. ✅ **Provider Location** - Address + GPS coordinates for Google Maps
2. ✅ **RecipeItem Table** - Post-Ingredient relationship with quantity
3. ✅ **Calculate Ingredients API** - Aggregate ingredients from multiple posts

### 🎁 **Bonus Features**

4. ✅ **Products Module** - Complete CRUD for products
5. ✅ **Enhanced Documentation** - 10+ comprehensive guides
6. ✅ **Swagger UI** - Interactive API testing

**Details:** [`MENTOR_REQUIREMENTS_COMPLETED.md`](./MENTOR_REQUIREMENTS_COMPLETED.md)

---

## 📊 **PROJECT STATUS**

### Modules: 5/8 (62.5%)
- ✅ Authentication
- ✅ Admin
- ✅ Ingredients
- ✅ Posts
- ✅ **Products** ← NEW
- ⏳ Orders
- ⏳ Wallet/Transactions
- ⏳ Commissions

### Progress: 70% Complete
```
████████████████░░░░░░░░ 70%
```

---

## 🎯 **KEY FEATURES**

### 🔐 **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (ADMIN, CREATOR, USER, SUPPLIER)
- Secure password hashing

### 📰 **Posts & Recipes**
- Create/manage video posts
- Recipe items with ingredients
- Search by tags
- **NEW:** Calculate aggregated ingredients from multiple posts

### 🥕 **Ingredients Management**
- CRUD operations
- Provider information with location
- Tag-based search

### 🛍️ **Products Module** ✨ NEW
- Complete CRUD operations
- Supplier management
- Filtering and pagination
- Location-based provider info

### 🗺️ **Google Maps Integration**
- Provider addresses
- GPS coordinates (latitude, longitude)
- Ready for map visualization

---

## 🚀 **GETTING STARTED**

### 1. Installation
```bash
npm install
```

### 2. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

### 3. Start Server
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 4. Test APIs
Open Swagger UI: http://localhost:3000/api

---

## 📚 **DOCUMENTATION**

### 📖 **Main Guides** (Read in order)

1. **[INDEX.md](./INDEX.md)** ⭐ START HERE
   - Complete documentation index
   - Reading order guide
   - Quick links

2. **[MENTOR_REQUIREMENTS_COMPLETED.md](./MENTOR_REQUIREMENTS_COMPLETED.md)**
   - Summary of mentor requirements
   - What's been completed
   - Quick overview

3. **[SUCCESS_SUMMARY.md](./SUCCESS_SUMMARY.md)**
   - Project overview
   - Features summary
   - Testing guide

4. **[COMPLETE_API_GUIDE.md](./COMPLETE_API_GUIDE.md)**
   - All API endpoints
   - Request/Response examples
   - Use cases

5. **[VISUAL_OVERVIEW.md](./VISUAL_OVERVIEW.md)**
   - Architecture diagrams
   - Flow charts
   - Progress charts

### 🧪 **Testing & Development**

- **[TESTING_SCRIPT.md](./TESTING_SCRIPT.md)** - PowerShell test scripts
- **[CHECKLIST.md](./CHECKLIST.md)** - Verification checklist
- **[API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)** - Quick testing guide

### 🔧 **Setup & Deployment**

- **[SETUP.md](./SETUP.md)** - Project setup instructions
- **[VPS_DEPLOYMENT.md](./VPS_DEPLOYMENT.md)** - VPS deployment guide
- **[SWAGGER_SETUP.md](./SWAGGER_SETUP.md)** - Swagger configuration

---

## 🎯 **API HIGHLIGHTS**

### ⭐ **Calculate Ingredients** (NEW - Mentor Requirement)
```http
POST /posts/calculate-ingredients
Content-Type: application/json

{
  "postIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "totalPosts": 3,
  "totalIngredients": 5,
  "ingredients": [
    {
      "ingredientName": "Thịt gà",
      "totalQuantity": 1500,
      "unit": "gram",
      "provider": {
        "fullName": "Supplier User",
        "address": "123 Nguyễn Huệ, Q1, TP.HCM",
        "latitude": "10.77560000",
        "longitude": "106.70190000"
      },
      "usedInPosts": [...]
    }
  ]
}
```

### 🛍️ **Products API** (NEW)
```http
GET /products?page=1&limit=10&status=ACTIVE
POST /products (SUPPLIER only)
PATCH /products/:id (SUPPLIER only)
DELETE /products/:id (SUPPLIER only)
```

### 📰 **Posts API**
```http
GET /posts?tag=gà&page=1&limit=10
GET /posts/:id
POST /posts (CREATOR only)
```

**Full API Documentation:** http://localhost:3000/api

---

## 🗺️ **GOOGLE MAPS INTEGRATION**

### Provider Location Data
Every provider (SUPPLIER) has:
- `address` - Full address text
- `latitude` - GPS latitude (Decimal 10,8)
- `longitude` - GPS longitude (Decimal 11,8)

### Frontend Example
```javascript
// Get provider from API response
const provider = ingredient.provider;

// Create Google Maps marker
const marker = new google.maps.Marker({
  position: {
    lat: parseFloat(provider.latitude),
    lng: parseFloat(provider.longitude)
  },
  map: map,
  title: provider.fullName
});
```

---

## 🏗️ **TECH STACK**

- **Framework:** NestJS 11.0
- **ORM:** Prisma 5.22
- **Database:** PostgreSQL 16
- **Language:** TypeScript 5.7
- **Authentication:** JWT + Passport
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI

---

## 📁 **PROJECT STRUCTURE**

```
BE/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.mjs              # Seed data
├── src/
│   ├── auth/                 # Authentication module
│   ├── admin/                # Admin module
│   ├── posts/                # Posts module
│   ├── ingredients/          # Ingredients module
│   ├── products/             # Products module ✨ NEW
│   ├── prisma/               # Prisma service
│   └── main.ts               # Application entry
├── docs/                     # Documentation files
│   ├── INDEX.md              # Documentation index
│   ├── COMPLETE_API_GUIDE.md # Full API docs
│   └── ...                   # Other guides
└── README.md                 # This file
```

---

## 🧪 **TESTING**

### Option 1: Swagger UI (Recommended)
```
http://localhost:3000/api
```
- Interactive testing
- Auto-generated docs
- No scripts needed

### Option 2: PowerShell Scripts
See [`TESTING_SCRIPT.md`](./TESTING_SCRIPT.md)

### Option 3: cURL/Postman
See [`API_TESTING_GUIDE.md`](./API_TESTING_GUIDE.md)

---

## 🔒 **SECURITY**

### Current (Development)
- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- CORS enabled for all origins

### TODO (Production)
- [ ] Change JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for specific domains
- [ ] Add rate limiting
- [ ] Implement request validation
- [ ] Add logging and monitoring

---

## 📊 **DATABASE**

### VPS Database
- **Host:** 103.6.234.20
- **Port:** 5432
- **Database:** savore_db
- **User:** savore_db

### Tables (12)
- users, roles, user_roles
- wallets, transactions
- posts, ingredients, recipe_items
- products, orders, order_items
- commissions

### Migrations
```bash
# View migrations
npx prisma migrate status

# Apply migrations
npx prisma migrate deploy

# Create new migration
npx prisma migrate dev --name migration_name
```

---

## 🚀 **DEPLOYMENT**

### Local Development
```bash
npm run start:dev
```

### Production Build
```bash
npm run build
npm run start:prod
```

### VPS Deployment
See [`VPS_DEPLOYMENT.md`](./VPS_DEPLOYMENT.md)

---

## 📞 **SUPPORT**

### Documentation
- **Main Index:** [`INDEX.md`](./INDEX.md)
- **API Guide:** [`COMPLETE_API_GUIDE.md`](./COMPLETE_API_GUIDE.md)
- **Swagger UI:** http://localhost:3000/api

### Issues
- Check [`CHECKLIST.md`](./CHECKLIST.md) for verification
- Review [`TESTING_SCRIPT.md`](./TESTING_SCRIPT.md) for examples
- Test via Swagger UI

---

## 🎊 **SUMMARY**

### ✅ Completed
- 5 modules (Authentication, Admin, Ingredients, Posts, Products)
- 30+ API endpoints
- Swagger documentation
- VPS database deployment
- **100% mentor requirements**

### ⏳ In Progress
- Orders Module
- Wallet/Transaction Module
- Commission System
- File Upload Service

### 📊 Overall Progress
**70% Complete** - Ready for Frontend integration

---

## 📝 **NEXT STEPS**

1. **Read Documentation:** Start with [`INDEX.md`](./INDEX.md)
2. **Test APIs:** Open http://localhost:3000/api
3. **Integrate Frontend:** Use [`COMPLETE_API_GUIDE.md`](./COMPLETE_API_GUIDE.md)
4. **Deploy:** Follow [`VPS_DEPLOYMENT.md`](./VPS_DEPLOYMENT.md)

---

## 🎉 **ACKNOWLEDGMENTS**

- **Project:** Hutech IT Got Talent
- **Framework:** NestJS
- **Database:** PostgreSQL + Prisma
- **Team:** Savore Development Team

---

**📚 Full Documentation:** [`INDEX.md`](./INDEX.md)

**🌐 API Testing:** http://localhost:3000/api

**🎊 Happy Coding!**
