# 📚 TÀI LIỆU DỰ ÁN SAVORE - HƯỚNG DẪN SỬ DỤNG

Chào mừng bạn đến với dự án Savore! Đây là tài liệu tổng hợp để giúp bạn bắt đầu học và phát triển dự án.

---

## 🎯 BẮT ĐẦU TỪ ĐÂU?

### Nếu bạn mới bắt đầu học CRUD:
1. **Đọc ngay:** [`DAILY_CHECKLIST.md`](./DAILY_CHECKLIST.md)
   - Hướng dẫn từng bước theo ngày
   - Checklist để đánh dấu tiến độ
   - Tips học tập hiệu quả

2. **Sau đó đọc:** [`DEVELOPMENT_PLAN.md`](./DEVELOPMENT_PLAN.md)
   - Kế hoạch tổng thể 12 tuần
   - Chi tiết từng module cần làm
   - Tài liệu học tập

### Nếu bạn đã biết cơ bản và muốn code:
1. **Tham khảo:** [`API_REFERENCE.md`](./API_REFERENCE.md)
   - Tất cả endpoints cần implement
   - Request/Response format
   - Authentication flow

2. **Xem ví dụ:** [`prisma-examples.ts`](./BE/prisma-examples.ts)
   - Code examples với Prisma
   - Business logic mẫu
   - Best practices

---

## 📁 CẤU TRÚC TÀI LIỆU

### 📋 Kế hoạch & Hướng dẫn
| File | Mô tả | Khi nào dùng |
|------|-------|--------------|
| [`DAILY_CHECKLIST.md`](./DAILY_CHECKLIST.md) | Checklist hàng ngày | Mỗi ngày trước khi code |
| [`DEVELOPMENT_PLAN.md`](./DEVELOPMENT_PLAN.md) | Kế hoạch 12 tuần | Xem tổng quan, lập kế hoạch |
| [`API_REFERENCE.md`](./API_REFERENCE.md) | Tài liệu API đầy đủ | Khi implement endpoints |

### 🗄️ Database
| File | Mô tả | Khi nào dùng |
|------|-------|--------------|
| [`BE/DATABASE_README.md`](./BE/DATABASE_README.md) | Hướng dẫn database chi tiết | Tìm hiểu cấu trúc DB |
| [`BE/DATABASE_ERD.md`](./BE/DATABASE_ERD.md) | Sơ đồ quan hệ database | Xem mối quan hệ giữa các bảng |
| [`BE/SETUP_COMPLETE.md`](./BE/SETUP_COMPLETE.md) | Tổng kết setup database | Kiểm tra đã setup đúng chưa |
| [`BE/EXAMPLE_QUERIES.sql`](./BE/EXAMPLE_QUERIES.sql) | Các câu query SQL mẫu | Học SQL, test database |

### 💻 Code Examples
| File | Mô tả | Khi nào dùng |
|------|-------|--------------|
| [`BE/prisma-examples.ts`](./BE/prisma-examples.ts) | Ví dụ Prisma Client | Học cách dùng Prisma |
| [`BE/prisma/seed.mjs`](./BE/prisma/seed.mjs) | Script seed dữ liệu | Tham khảo code seed |
| [`BE/prisma/schema.prisma`](./BE/prisma/schema.prisma) | Prisma schema | Xem cấu trúc models |

---

## 🚀 QUICK START

### 1. Setup Database (Đã hoàn thành ✅)
```bash
cd BE
npm install
npx prisma migrate dev
node prisma/seed.mjs
```

### 2. Xem Database
```bash
npx prisma studio
# Mở http://localhost:5555
```

### 3. Bắt đầu học theo checklist
Mở file [`DAILY_CHECKLIST.md`](./DAILY_CHECKLIST.md) và bắt đầu từ **Tuần 1 - Ngày 1**

---

## 📖 LỘ TRÌNH HỌC TẬP

### Giai đoạn 1: Chuẩn bị (Tuần 1)
- [ ] Đọc [`DAILY_CHECKLIST.md`](./DAILY_CHECKLIST.md) - Tuần 1
- [ ] Học về CRUD, RESTful API
- [ ] Tìm hiểu NestJS basics
- [ ] Setup môi trường development

**Kết quả:** Hiểu được CRUD là gì, biết cách setup project

---

### Giai đoạn 2: Authentication (Tuần 2)
- [ ] Follow [`DAILY_CHECKLIST.md`](./DAILY_CHECKLIST.md) - Tuần 2
- [ ] Tham khảo [`API_REFERENCE.md`](./API_REFERENCE.md) - Auth section
- [ ] Implement Register, Login, Profile APIs
- [ ] Test với Postman

**Kết quả:** Có API authentication hoạt động

---

### Giai đoạn 3: Products CRUD (Tuần 3-4)
- [ ] Follow [`DAILY_CHECKLIST.md`](./DAILY_CHECKLIST.md) - Tuần 3-4
- [ ] Tham khảo [`API_REFERENCE.md`](./API_REFERENCE.md) - Products section
- [ ] Xem [`prisma-examples.ts`](./BE/prisma-examples.ts) - Product functions
- [ ] Implement CRUD cho Products

**Kết quả:** Hiểu CRUD, có Products API hoạt động

---

### Giai đoạn 4-6: Các modules khác
Follow [`DEVELOPMENT_PLAN.md`](./DEVELOPMENT_PLAN.md) cho chi tiết

---

## 🎓 TÀI LIỆU HỌC TẬP

### NestJS
- 📖 [Official Docs](https://docs.nestjs.com/)
- 🎥 [NestJS Crash Course](https://www.youtube.com/results?search_query=nestjs+crash+course)
- 📚 [NestJS Fundamentals Course](https://learn.nestjs.com/)

### Prisma
- 📖 [Official Docs](https://www.prisma.io/docs)
- 🎥 [Prisma Tutorial](https://www.youtube.com/results?search_query=prisma+tutorial)
- 📚 [Prisma Examples](https://github.com/prisma/prisma-examples)

### RESTful API
- 📖 [REST API Tutorial](https://restfulapi.net/)
- 🎥 [REST API Explained](https://www.youtube.com/results?search_query=rest+api+explained)

### PostgreSQL
- 📖 [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- 🎥 [SQL for Beginners](https://www.youtube.com/results?search_query=sql+for+beginners)

---

## 🛠️ CÔNG CỤ CẦN THIẾT

### Development
- ✅ Node.js 18+ (đã cài)
- ✅ PostgreSQL 12+ (đã cài)
- ✅ VS Code hoặc IDE khác
- ✅ Git

### Testing API
- 📮 Postman - [Download](https://www.postman.com/downloads/)
- ⚡ Thunder Client (VS Code Extension)
- 🔧 Insomnia - [Download](https://insomnia.rest/download)

### Database Tools
- 🎨 Prisma Studio (built-in) - `npx prisma studio`
- 🐘 pgAdmin - [Download](https://www.pgadmin.org/download/)
- 💾 DBeaver - [Download](https://dbeaver.io/download/)

---

## 📊 THEO DÕI TIẾN ĐỘ

### Checklist tổng quan
- [ ] **Database Setup** ✅ (Đã hoàn thành)
- [ ] **Authentication API** (Tuần 1-2)
- [ ] **Products CRUD** (Tuần 3-4)
- [ ] **Posts & Content** (Tuần 5-6)
- [ ] **Orders & Cart** (Tuần 7-8)
- [ ] **Wallet & Commissions** (Tuần 9-10)
- [ ] **Frontend - Auth** (Tuần 11-12)
- [ ] **Frontend - Products** (Tuần 13-14)
- [ ] **Frontend - Posts** (Tuần 15-16)
- [ ] **Frontend - Orders** (Tuần 17-18)
- [ ] **Deployment** (Tuần 19-20)

### Đánh dấu tiến độ
Mở [`DAILY_CHECKLIST.md`](./DAILY_CHECKLIST.md) và check ✅ những task đã hoàn thành

---

## 💡 TIPS THÀNH CÔNG

### Học hiệu quả
1. **Học một thứ một lúc** - Đừng cố học hết mọi thứ cùng lúc
2. **Practice > Theory** - Code nhiều hơn đọc
3. **Commit thường xuyên** - Mỗi ngày commit code
4. **Test ngay** - Viết xong feature thì test luôn
5. **Hỏi khi cần** - Đừng ngại hỏi mentor

### Khi gặp lỗi
1. 🔍 Đọc error message kỹ
2. 🔍 Google error message
3. 🔍 Check documentation
4. 🔍 Xem lại code examples
5. 🔍 Hỏi mentor/cộng đồng

### Tổ chức code
1. 📁 Tạo folder rõ ràng (modules, dto, entities)
2. 📝 Đặt tên file có ý nghĩa
3. 💬 Viết comments cho code phức tạp
4. ✨ Format code trước khi commit
5. 🧪 Test trước khi merge

---

## 🎯 MỤC TIÊU TỪNG GIAI ĐOẠN

### Sau 2 tuần
- ✅ Hiểu CRUD là gì
- ✅ Biết tạo API với NestJS
- ✅ Có Authentication API hoạt động
- ✅ Biết test API với Postman

### Sau 1 tháng
- ✅ Làm được CRUD cho Products
- ✅ Hiểu Prisma ORM
- ✅ Biết handle errors
- ✅ Biết validate input

### Sau 2 tháng
- ✅ Hoàn thành Backend API
- ✅ Hiểu business logic
- ✅ Biết làm transactions
- ✅ Có thể tự implement features mới

### Sau 3 tháng
- ✅ Hoàn thành Frontend
- ✅ Deploy lên production
- ✅ Có portfolio project
- ✅ Tự tin với fullstack development

---

## 📞 HỖ TRỢ

### Khi cần giúp đỡ
1. **Check tài liệu trước:**
   - [`DAILY_CHECKLIST.md`](./DAILY_CHECKLIST.md) - Hướng dẫn từng bước
   - [`API_REFERENCE.md`](./API_REFERENCE.md) - Chi tiết API
   - [`prisma-examples.ts`](./BE/prisma-examples.ts) - Code examples

2. **Google với keywords:**
   - "NestJS [feature] example"
   - "Prisma [operation] tutorial"
   - Error message đầy đủ

3. **Hỏi mentor:**
   - Mô tả vấn đề rõ ràng
   - Show code đã thử
   - Nói đã thử những gì

### Resources
- 💬 Stack Overflow
- 💬 NestJS Discord
- 💬 Prisma Discord
- 💬 GitHub Issues

---

## 📝 NOTES QUAN TRỌNG

### Database
- ✅ Database đã setup xong
- ✅ Có 11 bảng với đầy đủ quan hệ
- ✅ Đã seed dữ liệu mẫu (admin user)
- ✅ Prisma Client đã generate

### Credentials
```
Database:
- Host: localhost
- Port: 5432
- Database: test_db
- User: postgres
- Password: database

Admin User:
- Email: admin@savore.com
- Password: admin123
```

### Prisma Commands
```bash
# Generate client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Seed database
node prisma/seed.mjs

# Open Prisma Studio
npx prisma studio

# Reset database (XÓA TẤT CẢ!)
npx prisma migrate reset
```

---

## 🎉 BẮT ĐẦU NGAY!

### Bước 1: Mở checklist
```bash
# Mở file này trong VS Code
code DAILY_CHECKLIST.md
```

### Bước 2: Bắt đầu từ Tuần 1 - Ngày 1
Đọc và làm theo từng bước trong checklist

### Bước 3: Tham khảo tài liệu khi cần
- Cần xem API format? → [`API_REFERENCE.md`](./API_REFERENCE.md)
- Cần xem code example? → [`prisma-examples.ts`](./BE/prisma-examples.ts)
- Cần hiểu database? → [`BE/DATABASE_README.md`](./BE/DATABASE_README.md)

### Bước 4: Code & Test
- Viết code
- Test với Postman
- Commit lên Git
- Đánh dấu ✅ trong checklist

---

## 🚀 CHÚC BẠN THÀNH CÔNG!

Remember:
- 💪 **Practice makes perfect** - Càng code nhiều càng giỏi
- 🎯 **Focus on progress, not perfection** - Tiến bộ từng ngày
- 🤝 **Don't hesitate to ask** - Hỏi khi cần giúp
- 🔥 **Stay consistent** - Học đều đặn mỗi ngày

**You got this! 🎉**

---

*Last updated: 2025-12-22*  
*Project: Savore Platform*  
*Version: 1.0.0*
