# 📋 KẾ HOẠCH PHÁT TRIỂN SAVORE PLATFORM

## 🎯 Mục tiêu
Xây dựng hệ thống thương mại điện tử kết hợp nội dung sáng tạo với API RESTful cho cả Web và Mobile.

---

## 📚 GIAI ĐOẠN 1: HỌC VÀ CHUẨN BỊ (1-2 tuần)

### Week 1: Nắm vững CRUD cơ bản

#### 🎓 Kiến thức cần học
- [ ] **CRUD là gì?**
  - C - Create (Tạo mới)
  - R - Read (Đọc/Lấy dữ liệu)
  - U - Update (Cập nhật)
  - D - Delete (Xóa)

- [ ] **HTTP Methods**
  - GET - Lấy dữ liệu
  - POST - Tạo mới
  - PUT/PATCH - Cập nhật
  - DELETE - Xóa

- [ ] **RESTful API Basics**
  - Endpoint structure
  - Status codes (200, 201, 400, 404, 500)
  - Request/Response format (JSON)

#### 📖 Tài liệu tham khảo
- NestJS Documentation: https://docs.nestjs.com/
- Prisma Documentation: https://www.prisma.io/docs/
- REST API Tutorial: https://restfulapi.net/

---

## 🔧 GIAI ĐOẠN 2: BACKEND API (4-6 tuần)

### Module 1: Authentication & Authorization (Tuần 1-2)

#### ✅ Checklist
- [ ] **Setup Authentication**
  - [ ] Cài đặt `@nestjs/jwt` và `@nestjs/passport`
  - [ ] Tạo AuthModule, AuthService, AuthController
  - [ ] Implement JWT strategy
  
- [ ] **API Endpoints - Auth**
  ```
  POST   /api/auth/register          - Đăng ký user mới
  POST   /api/auth/login             - Đăng nhập
  POST   /api/auth/logout            - Đăng xuất
  GET    /api/auth/profile           - Lấy thông tin user hiện tại
  PUT    /api/auth/profile           - Cập nhật profile
  POST   /api/auth/change-password   - Đổi mật khẩu
  ```

- [ ] **Validation**
  - [ ] Email format validation
  - [ ] Password strength validation
  - [ ] Unique email check

- [ ] **Testing**
  - [ ] Test với Postman/Thunder Client
  - [ ] Viết unit tests cơ bản

#### 📝 Files cần tạo
```
src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── dto/
│   │   ├── register.dto.ts
│   │   ├── login.dto.ts
│   │   └── update-profile.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── strategies/
│       └── jwt.strategy.ts
```

---

### Module 2: User Management (Tuần 2-3)

#### ✅ Checklist
- [ ] **API Endpoints - Users**
  ```
  GET    /api/users                  - Lấy danh sách users (Admin only)
  GET    /api/users/:id              - Lấy thông tin user theo ID
  PUT    /api/users/:id              - Cập nhật user (Admin only)
  DELETE /api/users/:id              - Xóa user (Admin only)
  POST   /api/users/:id/roles        - Gán role cho user
  DELETE /api/users/:id/roles/:roleId - Xóa role của user
  ```

- [ ] **Features**
  - [ ] Pagination cho danh sách users
  - [ ] Search/Filter users
  - [ ] Role-based access control

#### 📝 Files cần tạo
```
src/
├── users/
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.controller.ts
│   └── dto/
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       └── query-user.dto.ts
```

---

### Module 3: Products Management (Tuần 3-4)

#### ✅ Checklist
- [ ] **API Endpoints - Products**
  ```
  GET    /api/products               - Lấy danh sách sản phẩm (public)
  GET    /api/products/:id           - Lấy chi tiết sản phẩm
  POST   /api/products               - Tạo sản phẩm mới (Supplier only)
  PUT    /api/products/:id           - Cập nhật sản phẩm (Supplier only)
  DELETE /api/products/:id           - Xóa sản phẩm (Supplier only)
  PATCH  /api/products/:id/status    - Cập nhật trạng thái
  ```

- [ ] **Features**
  - [ ] Pagination & Filtering
  - [ ] Search by name
  - [ ] Filter by supplier, status, price range
  - [ ] Sort by price, created date
  - [ ] Upload product images (optional)

- [ ] **Validation**
  - [ ] Price must be positive
  - [ ] Name required
  - [ ] Status enum validation

#### 📝 Files cần tạo
```
src/
├── products/
│   ├── products.module.ts
│   ├── products.service.ts
│   ├── products.controller.ts
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   ├── update-product.dto.ts
│   │   └── query-product.dto.ts
│   └── entities/
│       └── product.entity.ts
```

---

### Module 4: Posts & Content (Tuần 4-5)

#### ✅ Checklist
- [ ] **API Endpoints - Posts**
  ```
  GET    /api/posts                  - Lấy danh sách posts (public)
  GET    /api/posts/:id              - Lấy chi tiết post
  POST   /api/posts                  - Tạo post mới (Creator only)
  PUT    /api/posts/:id              - Cập nhật post (Creator only)
  DELETE /api/posts/:id              - Xóa post (Creator only)
  PATCH  /api/posts/:id/publish      - Publish post
  PATCH  /api/posts/:id/draft        - Chuyển về draft
  ```

- [ ] **API Endpoints - Recipe Ingredients**
  ```
  GET    /api/posts/:id/ingredients  - Lấy ingredients của post
  POST   /api/posts/:id/ingredients  - Thêm ingredient vào post
  PUT    /api/posts/:id/ingredients/:ingredientId - Cập nhật ingredient
  DELETE /api/posts/:id/ingredients/:ingredientId - Xóa ingredient
  ```

- [ ] **Features**
  - [ ] Pagination & Filtering
  - [ ] Filter by creator, status
  - [ ] Search by title
  - [ ] Include ingredients in response
  - [ ] Calculate total cost of recipe

#### 📝 Files cần tạo
```
src/
├── posts/
│   ├── posts.module.ts
│   ├── posts.service.ts
│   ├── posts.controller.ts
│   ├── dto/
│   │   ├── create-post.dto.ts
│   │   ├── update-post.dto.ts
│   │   ├── add-ingredient.dto.ts
│   │   └── query-post.dto.ts
│   └── entities/
│       └── post.entity.ts
```

---

### Module 5: Orders & Shopping Cart (Tuần 5-6)

#### ✅ Checklist
- [ ] **API Endpoints - Orders**
  ```
  GET    /api/orders                 - Lấy danh sách orders của user
  GET    /api/orders/:id             - Lấy chi tiết order
  POST   /api/orders                 - Tạo order mới
  PATCH  /api/orders/:id/pay         - Thanh toán order
  PATCH  /api/orders/:id/cancel      - Hủy order
  GET    /api/orders/:id/items       - Lấy items của order
  ```

- [ ] **Features**
  - [ ] Create order from cart
  - [ ] Create order from post (with commission)
  - [ ] Calculate total price
  - [ ] Calculate commission for creators
  - [ ] Update wallet balances on payment
  - [ ] Create transaction records

- [ ] **Business Logic**
  - [ ] Snapshot product price at purchase time
  - [ ] Calculate commission (10% default)
  - [ ] Update supplier wallet
  - [ ] Create commission records

#### 📝 Files cần tạo
```
src/
├── orders/
│   ├── orders.module.ts
│   ├── orders.service.ts
│   ├── orders.controller.ts
│   ├── dto/
│   │   ├── create-order.dto.ts
│   │   ├── order-item.dto.ts
│   │   └── query-order.dto.ts
│   └── entities/
│       ├── order.entity.ts
│       └── order-item.entity.ts
```

---

### Module 6: Wallet & Transactions (Tuần 6)

#### ✅ Checklist
- [ ] **API Endpoints - Wallet**
  ```
  GET    /api/wallet                 - Lấy thông tin ví của user
  GET    /api/wallet/transactions    - Lấy lịch sử giao dịch
  POST   /api/wallet/withdraw        - Rút tiền (optional)
  POST   /api/wallet/deposit         - Nạp tiền (optional)
  ```

- [ ] **Features**
  - [ ] View wallet balance
  - [ ] Transaction history with pagination
  - [ ] Filter by transaction type
  - [ ] Calculate total income/expense

#### 📝 Files cần tạo
```
src/
├── wallet/
│   ├── wallet.module.ts
│   ├── wallet.service.ts
│   ├── wallet.controller.ts
│   └── dto/
│       ├── transaction-query.dto.ts
│       └── withdraw.dto.ts
```

---

### Module 7: Commissions (Tuần 6)

#### ✅ Checklist
- [ ] **API Endpoints - Commissions**
  ```
  GET    /api/commissions            - Lấy commissions của creator
  GET    /api/commissions/pending    - Lấy commissions chưa thanh toán
  GET    /api/commissions/paid       - Lấy commissions đã thanh toán
  POST   /api/commissions/:id/pay    - Thanh toán commission (Admin only)
  ```

- [ ] **Features**
  - [ ] View commission statistics
  - [ ] Filter by status
  - [ ] Admin can approve and pay commissions

#### 📝 Files cần tạo
```
src/
├── commissions/
│   ├── commissions.module.ts
│   ├── commissions.service.ts
│   ├── commissions.controller.ts
│   └── dto/
│       └── query-commission.dto.ts
```

---

### Module 8: Analytics & Reports (Tuần 7 - Optional)

#### ✅ Checklist
- [ ] **API Endpoints - Analytics**
  ```
  GET    /api/analytics/dashboard    - Dashboard statistics
  GET    /api/analytics/revenue      - Revenue report
  GET    /api/analytics/top-products - Top selling products
  GET    /api/analytics/top-creators - Top creators by commission
  GET    /api/analytics/sales        - Sales report by date range
  ```

- [ ] **Features**
  - [ ] Platform statistics
  - [ ] Revenue charts data
  - [ ] Top performers
  - [ ] Date range filtering

---

## 🎨 GIAI ĐOẠN 3: FRONTEND (4-6 tuần)

### Setup Frontend (Tuần 1)

#### ✅ Checklist
- [ ] **Chọn Framework**
  - Option 1: React + Vite
  - Option 2: Next.js
  - Option 3: Angular (nếu đã có)

- [ ] **Setup Project**
  - [ ] Initialize project
  - [ ] Install dependencies (axios, react-router, etc.)
  - [ ] Setup folder structure
  - [ ] Configure API base URL

- [ ] **UI Library**
  - [ ] Tailwind CSS
  - [ ] Material-UI / Ant Design / PrimeNG
  - [ ] Icons library

#### 📁 Folder Structure
```
FE/
├── src/
│   ├── api/              # API calls
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom hooks
│   ├── context/         # Context providers
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
```

---

### Pages & Features (Tuần 2-6)

#### Week 2: Authentication Pages
- [ ] **Login Page**
  - [ ] Login form
  - [ ] Form validation
  - [ ] Error handling
  - [ ] Redirect after login

- [ ] **Register Page**
  - [ ] Registration form
  - [ ] Role selection
  - [ ] Password confirmation
  - [ ] Success message

- [ ] **Profile Page**
  - [ ] View profile
  - [ ] Edit profile
  - [ ] Change password

---

#### Week 3: Product Pages

- [ ] **Product List Page** (Public)
  - [ ] Display products in grid/list
  - [ ] Pagination
  - [ ] Search bar
  - [ ] Filters (price, supplier, status)
  - [ ] Sort options

- [ ] **Product Detail Page**
  - [ ] Product information
  - [ ] Add to cart button
  - [ ] Related products
  - [ ] Supplier information

- [ ] **Manage Products Page** (Supplier)
  - [ ] My products list
  - [ ] Add new product button
  - [ ] Edit/Delete actions
  - [ ] Status toggle

- [ ] **Add/Edit Product Form**
  - [ ] Product form
  - [ ] Image upload (optional)
  - [ ] Validation
  - [ ] Success/Error messages

---

#### Week 4: Post/Content Pages

- [ ] **Post List Page** (Public)
  - [ ] Display posts in grid
  - [ ] Filter by creator
  - [ ] Search functionality
  - [ ] Pagination

- [ ] **Post Detail Page**
  - [ ] Video/content display
  - [ ] Ingredients list with prices
  - [ ] "Buy All Ingredients" button
  - [ ] Total cost calculation
  - [ ] Creator information

- [ ] **Manage Posts Page** (Creator)
  - [ ] My posts list
  - [ ] Create new post button
  - [ ] Edit/Delete actions
  - [ ] Publish/Draft toggle

- [ ] **Create/Edit Post Form**
  - [ ] Post information form
  - [ ] Add ingredients
  - [ ] Video URL input
  - [ ] Save as draft/Publish

---

#### Week 5: Order & Cart Pages

- [ ] **Shopping Cart Page**
  - [ ] Cart items list
  - [ ] Quantity adjustment
  - [ ] Remove items
  - [ ] Total calculation
  - [ ] Checkout button

- [ ] **Checkout Page**
  - [ ] Order summary
  - [ ] Shipping information (optional)
  - [ ] Payment method selection
  - [ ] Place order button

- [ ] **Order History Page**
  - [ ] My orders list
  - [ ] Order status
  - [ ] Order details link
  - [ ] Filter by status

- [ ] **Order Detail Page**
  - [ ] Order information
  - [ ] Items list
  - [ ] Total amount
  - [ ] Status timeline
  - [ ] Cancel order (if pending)

---

#### Week 6: Wallet & Dashboard

- [ ] **Wallet Page**
  - [ ] Current balance
  - [ ] Transaction history
  - [ ] Filter transactions
  - [ ] Withdraw/Deposit (optional)

- [ ] **Creator Dashboard**
  - [ ] Commission statistics
  - [ ] Pending commissions
  - [ ] Paid commissions
  - [ ] Performance charts

- [ ] **Supplier Dashboard**
  - [ ] Revenue statistics
  - [ ] Product performance
  - [ ] Order statistics
  - [ ] Top selling products

- [ ] **Admin Dashboard**
  - [ ] Platform statistics
  - [ ] User management
  - [ ] Approve commissions
  - [ ] System reports

---

## 📱 GIAI ĐOẠN 4: MOBILE APP (Optional - 4-6 tuần)

### Setup Mobile (Tuần 1)

#### ✅ Checklist
- [ ] **Chọn Framework**
  - Option 1: React Native
  - Option 2: Flutter
  - Option 3: Ionic

- [ ] **Setup Project**
  - [ ] Initialize project
  - [ ] Configure API connection
  - [ ] Setup navigation
  - [ ] Install UI components

---

### Mobile Screens (Tuần 2-6)

#### Core Screens
- [ ] Splash Screen
- [ ] Login/Register
- [ ] Home/Feed
- [ ] Product List
- [ ] Product Detail
- [ ] Post List
- [ ] Post Detail
- [ ] Shopping Cart
- [ ] Checkout
- [ ] Order History
- [ ] Profile
- [ ] Wallet
- [ ] Settings

#### Features
- [ ] Push notifications
- [ ] Offline mode
- [ ] Image caching
- [ ] Pull to refresh
- [ ] Infinite scroll

---

## 🧪 GIAI ĐOẠN 5: TESTING & DEPLOYMENT (2-3 tuần)

### Testing (Tuần 1-2)

#### Backend Testing
- [ ] **Unit Tests**
  - [ ] Service tests
  - [ ] Controller tests
  - [ ] Utility function tests

- [ ] **Integration Tests**
  - [ ] API endpoint tests
  - [ ] Database operations
  - [ ] Authentication flow

- [ ] **E2E Tests**
  - [ ] Complete user flows
  - [ ] Order processing
  - [ ] Payment flow

#### Frontend Testing
- [ ] **Component Tests**
  - [ ] Form validation
  - [ ] Button actions
  - [ ] Data display

- [ ] **Integration Tests**
  - [ ] API integration
  - [ ] Navigation flow
  - [ ] State management

---

### Deployment (Tuần 3)

#### Backend Deployment
- [ ] **Setup Production Database**
  - [ ] PostgreSQL on cloud (AWS RDS, Heroku, etc.)
  - [ ] Run migrations
  - [ ] Seed initial data

- [ ] **Deploy Backend**
  - [ ] Choose platform (Heroku, AWS, DigitalOcean, Railway)
  - [ ] Configure environment variables
  - [ ] Setup CI/CD (optional)
  - [ ] Monitor logs

#### Frontend Deployment
- [ ] **Build & Deploy Web**
  - [ ] Build production bundle
  - [ ] Deploy to Vercel/Netlify/AWS S3
  - [ ] Configure domain (optional)

- [ ] **Deploy Mobile** (Optional)
  - [ ] Build APK/IPA
  - [ ] Test on devices
  - [ ] Submit to stores (optional)

---

## 📊 TIẾN ĐỘ THEO DÕI

### Tuần 1-2: Authentication & Users
- [ ] Backend: Auth + Users API
- [ ] Frontend: Login/Register pages
- [ ] Testing: Auth flow

### Tuần 3-4: Products
- [ ] Backend: Products API
- [ ] Frontend: Product pages
- [ ] Testing: Product CRUD

### Tuần 5-6: Posts & Content
- [ ] Backend: Posts API
- [ ] Frontend: Post pages
- [ ] Testing: Content creation

### Tuần 7-8: Orders & Cart
- [ ] Backend: Orders API
- [ ] Frontend: Cart & Checkout
- [ ] Testing: Order flow

### Tuần 9-10: Wallet & Commissions
- [ ] Backend: Wallet + Commissions API
- [ ] Frontend: Wallet & Dashboard
- [ ] Testing: Payment flow

### Tuần 11-12: Polish & Deploy
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Documentation
- [ ] Deployment

---

## 🎯 MILESTONES

### Milestone 1: MVP (Minimum Viable Product) - Week 8
- ✅ User authentication
- ✅ Product CRUD
- ✅ Basic order flow
- ✅ Simple UI

### Milestone 2: Core Features - Week 10
- ✅ Posts & Content
- ✅ Commission system
- ✅ Wallet management
- ✅ Complete UI

### Milestone 3: Production Ready - Week 12
- ✅ All features complete
- ✅ Testing done
- ✅ Deployed to production
- ✅ Documentation complete

---

## 📚 TÀI LIỆU HỌC TẬP

### Backend (NestJS + Prisma)
1. **NestJS Fundamentals**
   - Controllers, Services, Modules
   - Dependency Injection
   - Pipes, Guards, Interceptors

2. **Prisma ORM**
   - Schema definition
   - CRUD operations
   - Relations
   - Transactions

3. **Authentication**
   - JWT tokens
   - Password hashing
   - Guards & Strategies

### Frontend
1. **React/Angular Basics**
   - Components
   - State management
   - Routing
   - Forms

2. **API Integration**
   - Axios/Fetch
   - Error handling
   - Loading states

3. **UI/UX**
   - Responsive design
   - Component libraries
   - Best practices

---

## 💡 TIPS & BEST PRACTICES

### Development
- ✅ Commit code thường xuyên
- ✅ Viết code comments rõ ràng
- ✅ Follow coding conventions
- ✅ Test trước khi merge
- ✅ Review code của mình

### API Design
- ✅ Use consistent naming
- ✅ Proper HTTP status codes
- ✅ Validate input data
- ✅ Handle errors gracefully
- ✅ Document endpoints

### Security
- ✅ Never commit sensitive data
- ✅ Use environment variables
- ✅ Validate all inputs
- ✅ Implement rate limiting
- ✅ Use HTTPS in production

---

## 🆘 KHI GẶP KHÓ KHĂN

### Resources
1. **Documentation**
   - NestJS: https://docs.nestjs.com
   - Prisma: https://www.prisma.io/docs
   - React: https://react.dev

2. **Community**
   - Stack Overflow
   - GitHub Issues
   - Discord/Slack communities

3. **Learning Platforms**
   - YouTube tutorials
   - Udemy courses
   - FreeCodeCamp

### Debugging Tips
- ✅ Read error messages carefully
- ✅ Use console.log/debugger
- ✅ Check network tab in browser
- ✅ Test API with Postman
- ✅ Ask for help when stuck

---

## 📝 NOTES

### Ưu tiên làm trước
1. **Authentication** - Cơ bản nhất
2. **Products CRUD** - Dễ hiểu, dễ làm
3. **Orders** - Business logic quan trọng
4. **Posts & Commissions** - Tính năng đặc biệt

### Có thể làm sau
- Analytics & Reports
- Mobile app
- Advanced features
- Performance optimization

### Remember
- 🎯 Focus on learning, not perfection
- 🚀 Start small, iterate fast
- 💪 Practice makes perfect
- 🤝 Don't hesitate to ask for help

---

**Good luck with your development journey! 🚀**

*Last updated: 2025-12-22*
