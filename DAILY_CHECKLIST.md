# ✅ CHECKLIST HÀNG NGÀY - SAVORE PROJECT

## 🎯 Mục tiêu: Học CRUD và xây dựng API cho Web & Mobile

---

## 📅 TUẦN 1-2: AUTHENTICATION (Bắt đầu từ đây!)

### Ngày 1-2: Setup & Học cơ bản
- [ ] Đọc về CRUD là gì
- [ ] Đọc về RESTful API
- [ ] Đọc về HTTP Methods (GET, POST, PUT, DELETE)
- [ ] Tìm hiểu NestJS Controllers và Services
- [ ] Cài đặt Postman hoặc Thunder Client để test API

### Ngày 3-4: Tạo Auth Module
- [ ] Tạo folder `src/auth`
- [ ] Tạo `auth.module.ts`
- [ ] Tạo `auth.service.ts`
- [ ] Tạo `auth.controller.ts`
- [ ] Cài đặt `@nestjs/jwt` và `@nestjs/passport`

### Ngày 5-6: Implement Register API
- [ ] Tạo DTO: `register.dto.ts`
- [ ] Viết logic trong `auth.service.ts`:
  - [ ] Check email đã tồn tại chưa
  - [ ] Hash password với bcrypt
  - [ ] Tạo user mới
  - [ ] Tạo wallet cho user
- [ ] Tạo endpoint `POST /api/auth/register`
- [ ] Test với Postman

### Ngày 7-8: Implement Login API
- [ ] Tạo DTO: `login.dto.ts`
- [ ] Viết logic login:
  - [ ] Tìm user theo email
  - [ ] So sánh password
  - [ ] Tạo JWT token
  - [ ] Return token
- [ ] Tạo endpoint `POST /api/auth/login`
- [ ] Test với Postman

### Ngày 9-10: JWT Guard & Profile
- [ ] Setup JWT Strategy
- [ ] Tạo JWT Guard
- [ ] Tạo endpoint `GET /api/auth/profile` (protected)
- [ ] Test với token từ login
- [ ] Tạo endpoint `PUT /api/auth/profile`

### Ngày 11-12: Review & Document
- [ ] Test tất cả auth endpoints
- [ ] Fix bugs nếu có
- [ ] Viết documentation cho API
- [ ] Commit code lên Git

**🎉 Milestone 1: Hoàn thành Authentication!**

---

## 📅 TUẦN 3-4: PRODUCTS CRUD

### Ngày 1-2: Setup Products Module
- [ ] Tạo folder `src/products`
- [ ] Tạo `products.module.ts`
- [ ] Tạo `products.service.ts`
- [ ] Tạo `products.controller.ts`
- [ ] Tạo DTOs folder

### Ngày 3-4: CREATE - Tạo sản phẩm
- [ ] Tạo `create-product.dto.ts`
- [ ] Viết logic trong service:
  - [ ] Validate input
  - [ ] Check user là SUPPLIER
  - [ ] Tạo product mới
- [ ] Tạo endpoint `POST /api/products`
- [ ] Test với Postman (cần JWT token)

### Ngày 5-6: READ - Lấy danh sách & chi tiết
- [ ] Viết logic lấy tất cả products:
  - [ ] Pagination
  - [ ] Filter by status
  - [ ] Search by name
- [ ] Tạo endpoint `GET /api/products`
- [ ] Tạo endpoint `GET /api/products/:id`
- [ ] Test với Postman

### Ngày 7-8: UPDATE - Cập nhật sản phẩm
- [ ] Tạo `update-product.dto.ts`
- [ ] Viết logic update:
  - [ ] Check product tồn tại
  - [ ] Check user là owner
  - [ ] Update product
- [ ] Tạo endpoint `PUT /api/products/:id`
- [ ] Test với Postman

### Ngày 9-10: DELETE - Xóa sản phẩm
- [ ] Viết logic delete:
  - [ ] Check product tồn tại
  - [ ] Check user là owner
  - [ ] Check product chưa có trong order
  - [ ] Delete product
- [ ] Tạo endpoint `DELETE /api/products/:id`
- [ ] Test với Postman

### Ngày 11-12: Advanced Features
- [ ] Thêm filter by price range
- [ ] Thêm sort by price, date
- [ ] Thêm endpoint get products by supplier
- [ ] Test tất cả cases
- [ ] Fix bugs

**🎉 Milestone 2: Hoàn thành Products CRUD!**

---

## 📅 TUẦN 5-6: POSTS & CONTENT

### Ngày 1-2: Setup Posts Module
- [ ] Tạo folder `src/posts`
- [ ] Tạo module, service, controller
- [ ] Tạo DTOs

### Ngày 3-5: Posts CRUD
- [ ] CREATE: `POST /api/posts`
- [ ] READ: `GET /api/posts` và `GET /api/posts/:id`
- [ ] UPDATE: `PUT /api/posts/:id`
- [ ] DELETE: `DELETE /api/posts/:id`
- [ ] Test tất cả endpoints

### Ngày 6-8: Recipe Ingredients
- [ ] Endpoint thêm ingredient: `POST /api/posts/:id/ingredients`
- [ ] Endpoint lấy ingredients: `GET /api/posts/:id/ingredients`
- [ ] Endpoint update ingredient: `PUT /api/posts/:id/ingredients/:ingredientId`
- [ ] Endpoint xóa ingredient: `DELETE /api/posts/:id/ingredients/:ingredientId`
- [ ] Test

### Ngày 9-10: Publish/Draft
- [ ] Endpoint publish: `PATCH /api/posts/:id/publish`
- [ ] Endpoint draft: `PATCH /api/posts/:id/draft`
- [ ] Logic validate trước khi publish
- [ ] Test

### Ngày 11-12: Review & Polish
- [ ] Test tất cả features
- [ ] Fix bugs
- [ ] Optimize queries
- [ ] Document API

**🎉 Milestone 3: Hoàn thành Posts!**

---

## 📅 TUẦN 7-8: ORDERS & CART

### Ngày 1-2: Setup Orders Module
- [ ] Tạo folder `src/orders`
- [ ] Tạo module, service, controller
- [ ] Tạo DTOs

### Ngày 3-5: Create Order
- [ ] Tạo DTO cho order items
- [ ] Logic tạo order:
  - [ ] Validate products tồn tại
  - [ ] Snapshot prices
  - [ ] Calculate commission
  - [ ] Create order & order items
  - [ ] Create commission records
- [ ] Endpoint `POST /api/orders`
- [ ] Test

### Ngày 6-7: Order Payment
- [ ] Logic thanh toán:
  - [ ] Update order status
  - [ ] Update supplier wallets
  - [ ] Create transactions
- [ ] Endpoint `PATCH /api/orders/:id/pay`
- [ ] Test

### Ngày 8-9: Order Management
- [ ] Endpoint lấy orders: `GET /api/orders`
- [ ] Endpoint chi tiết: `GET /api/orders/:id`
- [ ] Endpoint cancel: `PATCH /api/orders/:id/cancel`
- [ ] Filter by status
- [ ] Test

### Ngày 10-12: Review & Test
- [ ] Test complete order flow
- [ ] Test commission calculation
- [ ] Test wallet updates
- [ ] Fix bugs
- [ ] Document

**🎉 Milestone 4: Hoàn thành Orders!**

---

## 📅 TUẦN 9-10: WALLET & COMMISSIONS

### Ngày 1-3: Wallet Module
- [ ] Setup wallet module
- [ ] Endpoint xem wallet: `GET /api/wallet`
- [ ] Endpoint lịch sử: `GET /api/wallet/transactions`
- [ ] Filter transactions
- [ ] Test

### Ngày 4-6: Commissions Module
- [ ] Setup commissions module
- [ ] Endpoint lấy commissions: `GET /api/commissions`
- [ ] Endpoint pending: `GET /api/commissions/pending`
- [ ] Endpoint paid: `GET /api/commissions/paid`
- [ ] Test

### Ngày 7-9: Admin Pay Commission
- [ ] Logic thanh toán commission:
  - [ ] Update commission status
  - [ ] Update creator wallet
  - [ ] Create transaction
- [ ] Endpoint `POST /api/commissions/:id/pay`
- [ ] Test

### Ngày 10-12: Statistics
- [ ] Commission statistics
- [ ] Revenue statistics
- [ ] Test & document

**🎉 Milestone 5: Hoàn thành Backend API!**

---

## 📅 TUẦN 11-12: FRONTEND - AUTHENTICATION

### Ngày 1-2: Setup Frontend
- [ ] Tạo React/Angular project
- [ ] Cài đặt dependencies (axios, router, UI library)
- [ ] Setup folder structure
- [ ] Configure API base URL

### Ngày 3-5: Login Page
- [ ] Tạo login form
- [ ] Validation
- [ ] Call login API
- [ ] Save token to localStorage
- [ ] Redirect after login
- [ ] Error handling

### Ngày 6-8: Register Page
- [ ] Tạo register form
- [ ] Validation
- [ ] Call register API
- [ ] Success message
- [ ] Redirect to login

### Ngày 9-10: Profile Page
- [ ] Fetch user profile
- [ ] Display user info
- [ ] Edit profile form
- [ ] Update profile API call

### Ngày 11-12: Auth Context/Service
- [ ] Create auth context
- [ ] Login/logout functions
- [ ] Protected routes
- [ ] Test authentication flow

**🎉 Milestone 6: Hoàn thành Frontend Auth!**

---

## 📅 TUẦN 13-14: FRONTEND - PRODUCTS

### Ngày 1-3: Product List Page
- [ ] Fetch products from API
- [ ] Display in grid/list
- [ ] Pagination
- [ ] Search functionality
- [ ] Filters

### Ngày 4-5: Product Detail Page
- [ ] Fetch product detail
- [ ] Display information
- [ ] Add to cart button
- [ ] Related products

### Ngày 6-8: Manage Products (Supplier)
- [ ] Fetch my products
- [ ] Display list
- [ ] Add product button
- [ ] Edit/Delete actions

### Ngày 9-10: Add/Edit Product Form
- [ ] Create form
- [ ] Validation
- [ ] Submit to API
- [ ] Success/Error handling

### Ngày 11-12: Polish & Test
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Test all features

**🎉 Milestone 7: Hoàn thành Frontend Products!**

---

## 📝 TIPS ĐỂ THÀNH CÔNG

### Mỗi ngày nên làm:
1. ✅ Đọc tài liệu 30 phút
2. ✅ Code 2-3 giờ
3. ✅ Test code đã viết
4. ✅ Commit code lên Git
5. ✅ Ghi chú những gì học được

### Khi gặp lỗi:
1. 🔍 Đọc error message kỹ
2. 🔍 Google error message
3. 🔍 Check documentation
4. 🔍 Hỏi mentor/cộng đồng
5. 🔍 Debug từng bước

### Học hiệu quả:
- 📚 Học một thứ một lúc
- 💪 Practice > Theory
- 🎯 Focus on understanding, not memorizing
- 🤝 Don't be afraid to ask
- 🔄 Review code cũ thường xuyên

---

## 🎯 PROGRESS TRACKER

### Backend API
- [ ] Authentication ✅ (Week 1-2)
- [ ] Products CRUD ⏳ (Week 3-4)
- [ ] Posts & Content ⏳ (Week 5-6)
- [ ] Orders & Cart ⏳ (Week 7-8)
- [ ] Wallet & Commissions ⏳ (Week 9-10)

### Frontend
- [ ] Authentication UI ⏳ (Week 11-12)
- [ ] Products UI ⏳ (Week 13-14)
- [ ] Posts UI ⏳ (Week 15-16)
- [ ] Orders UI ⏳ (Week 17-18)
- [ ] Dashboard UI ⏳ (Week 19-20)

### Deployment
- [ ] Backend deployed ⏳
- [ ] Frontend deployed ⏳
- [ ] Database in production ⏳

---

## 📞 KHI CẦN TRỢ GIÚP

### Resources
- 📖 NestJS Docs: https://docs.nestjs.com
- 📖 Prisma Docs: https://www.prisma.io/docs
- 📖 React Docs: https://react.dev
- 💬 Stack Overflow
- 💬 GitHub Issues

### Questions to Ask Mentor
1. "Em đang làm [feature], bị lỗi [error]. Em đã thử [solutions] nhưng chưa được."
2. "Em không hiểu [concept]. Anh có thể giải thích thêm không?"
3. "Code này của em có đúng không? [show code]"
4. "Em nên học [topic] như thế nào?"

---

**Remember: Progress > Perfection! 🚀**

*Cập nhật tiến độ mỗi ngày để theo dõi!*
