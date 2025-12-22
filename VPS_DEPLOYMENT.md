# 🚀 DEPLOYMENT VỚI VPS - HƯỚNG DẪN CHI TIẾT

## 🎯 Tổng quan

Bạn đã có:
- ✅ VPS với IP Public
- ✅ Backend API đã code xong
- ✅ Database PostgreSQL

Bây giờ cần:
- 🎯 Deploy Backend lên VPS
- 🎯 Setup PostgreSQL trên VPS
- 🎯 Cho FE/Mobile gọi API qua IP Public

---

## 🌐 CÁC CÁCH TRUY CẬP API

### 1. Localhost (Development)
```
http://localhost:3000/api/products
```
- Chỉ dùng khi code trên máy local
- FE/Mobile không gọi được (nếu khác máy)

### 2. IP Public (Production - BẠN SẼ DÙNG)
```
http://123.45.67.89:3000/api/products
```
- ✅ **Bạn đã có VPS → Dùng cách này!**
- ✅ Ai cũng truy cập được
- ✅ FE/Mobile gọi được
- ❌ Khó nhớ
- ❌ Chưa có HTTPS

### 3. Domain (Optional - Nâng cao)
```
https://api.savore.com/api/products
```
- ✅ Dễ nhớ
- ✅ Có HTTPS (bảo mật)
- ✅ Professional
- ❌ Tốn tiền mua domain (~$10/năm)
- ❌ Phải config DNS

**Kết luận:** Bắt đầu với **IP Public**, sau này có thể thêm Domain.

---

## 📋 CHECKLIST DEPLOYMENT

### Phần 1: Chuẩn bị VPS
- [ ] SSH vào VPS
- [ ] Cài Node.js
- [ ] Cài PostgreSQL
- [ ] Cài PM2 (process manager)

### Phần 2: Setup Database
- [ ] Tạo database trên VPS
- [ ] Run migrations
- [ ] Seed dữ liệu

### Phần 3: Deploy Backend
- [ ] Upload code lên VPS
- [ ] Install dependencies
- [ ] Build production
- [ ] Chạy với PM2

### Phần 4: Config
- [ ] Mở port 3000
- [ ] Setup environment variables
- [ ] Test API

---

## 🔧 BƯỚC 1: CHUẨN BỊ VPS

### SSH vào VPS
```bash
ssh root@123.45.67.89
# Hoặc
ssh username@123.45.67.89
```

### Cài Node.js (v18+)
```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Cài Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra
node --version  # v18.x.x
npm --version   # 9.x.x
```

### Cài PostgreSQL
```bash
# Cài PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Kiểm tra
sudo systemctl status postgresql

# Đăng nhập PostgreSQL
sudo -u postgres psql
```

### Cài PM2 (Process Manager)
```bash
# Cài PM2 global
sudo npm install -g pm2

# Kiểm tra
pm2 --version
```

---

## 🗄️ BƯỚC 2: SETUP DATABASE

### Tạo Database và User

```bash
# Đăng nhập PostgreSQL
sudo -u postgres psql

# Trong PostgreSQL console:
CREATE DATABASE savore_db;
CREATE USER savore_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE savore_db TO savore_user;
\q
```

### Config PostgreSQL cho remote access (Optional)

Nếu muốn connect từ máy local:

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Tìm và sửa:
listen_addresses = '*'

# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Thêm dòng này:
host    all             all             0.0.0.0/0               md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 📦 BƯỚC 3: UPLOAD CODE LÊN VPS

### Cách 1: Git (Khuyên dùng)

**Trên VPS:**
```bash
# Tạo folder
mkdir -p /var/www/savore
cd /var/www/savore

# Clone repo
git clone https://github.com/your-username/savore.git .

# Hoặc nếu chưa có Git repo:
# Tạo repo trên GitHub trước
# Push code từ máy local
# Rồi clone về VPS
```

**Trên máy local (nếu chưa có Git repo):**
```bash
cd BE
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/savore.git
git push -u origin main
```

### Cách 2: SCP (Upload trực tiếp)

**Trên máy local:**
```bash
# Zip code
cd BE
zip -r savore-be.zip . -x "node_modules/*" -x ".git/*"

# Upload lên VPS
scp savore-be.zip root@123.45.67.89:/var/www/

# SSH vào VPS
ssh root@123.45.67.89

# Unzip
cd /var/www
unzip savore-be.zip -d savore
cd savore
```

---

## ⚙️ BƯỚC 4: SETUP BACKEND

### Tạo .env file

```bash
cd /var/www/savore/BE
nano .env
```

**Nội dung .env:**
```env
# Database
DATABASE_URL="postgres://savore_user:your_strong_password@localhost:5432/savore_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"

# App
NODE_ENV="production"
PORT=3000
```

### Install dependencies

```bash
npm install
```

### Run Prisma migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
node prisma/seed.mjs
```

### Build production

```bash
npm run build
```

---

## 🚀 BƯỚC 5: CHẠY VỚI PM2

### Start app với PM2

```bash
# Chạy app
pm2 start dist/main.js --name savore-api

# Hoặc dùng npm script
pm2 start npm --name savore-api -- run start:prod

# Xem logs
pm2 logs savore-api

# Xem status
pm2 status
```

### PM2 startup (Auto start khi reboot)

```bash
# Generate startup script
pm2 startup

# Copy và chạy command mà PM2 suggest

# Save current process list
pm2 save
```

### PM2 Commands hữu ích

```bash
# Restart app
pm2 restart savore-api

# Stop app
pm2 stop savore-api

# Delete app
pm2 delete savore-api

# Xem logs
pm2 logs savore-api

# Monitor
pm2 monit
```

---

## 🔓 BƯỚC 6: MỞ PORT & FIREWALL

### Mở port 3000

```bash
# Ubuntu/Debian với UFW
sudo ufw allow 3000/tcp
sudo ufw status

# CentOS/RHEL với firewalld
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

### Test API

```bash
# Trên VPS
curl http://localhost:3000/api/products

# Từ máy local
curl http://123.45.67.89:3000/api/products
```

---

## 🌐 BƯỚC 7: CONFIG CHO FE/MOBILE

### Frontend config

**Development (.env.development):**
```env
VITE_API_URL=http://localhost:3000/api
# hoặc
REACT_APP_API_URL=http://localhost:3000/api
```

**Production (.env.production):**
```env
VITE_API_URL=http://123.45.67.89:3000/api
# hoặc
REACT_APP_API_URL=http://123.45.67.89:3000/api
```

**Trong code:**
```javascript
// React/Vue/Angular
const API_URL = import.meta.env.VITE_API_URL; // Vite
// hoặc
const API_URL = process.env.REACT_APP_API_URL; // Create React App

// Axios config
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Mobile config (React Native)

```javascript
// config/api.js
const API_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'http://123.45.67.89:3000/api'; // Production

export default API_URL;
```

---

## 🔒 BƯỚC 8: SETUP NGINX (Optional - Recommended)

Nginx giúp:
- ✅ Reverse proxy
- ✅ Load balancing
- ✅ SSL/HTTPS
- ✅ Serve static files

### Cài Nginx

```bash
sudo apt install nginx -y
```

### Config Nginx

```bash
sudo nano /etc/nginx/sites-available/savore
```

**Nội dung:**
```nginx
server {
    listen 80;
    server_name 123.45.67.89;  # Hoặc domain của bạn

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Enable site

```bash
# Link config
sudo ln -s /etc/nginx/sites-available/savore /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

**Bây giờ API có thể truy cập qua:**
```
http://123.45.67.89/api/products
```
(Không cần port 3000)

---

## 🔐 BƯỚC 9: SETUP SSL/HTTPS (Optional - Nếu có Domain)

### Cài Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Lấy SSL certificate

```bash
sudo certbot --nginx -d api.savore.com
```

**Bây giờ API có HTTPS:**
```
https://api.savore.com/api/products
```

---

## 📊 MONITORING & LOGS

### PM2 Monitoring

```bash
# Xem logs realtime
pm2 logs savore-api

# Xem logs cũ
pm2 logs savore-api --lines 100

# Monitor resources
pm2 monit
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### PostgreSQL Logs

```bash
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## 🔄 UPDATE CODE

### Cách 1: Git Pull

```bash
cd /var/www/savore/BE

# Pull latest code
git pull origin main

# Install new dependencies (if any)
npm install

# Run new migrations (if any)
npx prisma migrate deploy

# Rebuild
npm run build

# Restart app
pm2 restart savore-api
```

### Cách 2: Upload mới

```bash
# Trên máy local
scp -r BE/* root@123.45.67.89:/var/www/savore/BE/

# Trên VPS
cd /var/www/savore/BE
npm install
npm run build
pm2 restart savore-api
```

---

## 🐛 TROUBLESHOOTING

### API không truy cập được

**Check 1: App có chạy không?**
```bash
pm2 status
pm2 logs savore-api
```

**Check 2: Port có mở không?**
```bash
sudo ufw status
netstat -tuln | grep 3000
```

**Check 3: Database có connect được không?**
```bash
# Test connection
psql -U savore_user -d savore_db -h localhost
```

### Database connection error

**Check .env:**
```bash
cat .env
# Đảm bảo DATABASE_URL đúng
```

**Check PostgreSQL:**
```bash
sudo systemctl status postgresql
sudo systemctl restart postgresql
```

### PM2 app crash

```bash
# Xem logs
pm2 logs savore-api --err

# Restart
pm2 restart savore-api

# Delete và start lại
pm2 delete savore-api
pm2 start dist/main.js --name savore-api
```

---

## 📝 CHECKLIST HOÀN CHỈNH

### VPS Setup
- [ ] SSH vào VPS thành công
- [ ] Cài Node.js 18+
- [ ] Cài PostgreSQL
- [ ] Cài PM2

### Database
- [ ] Tạo database
- [ ] Tạo user
- [ ] Test connection

### Code
- [ ] Upload code lên VPS
- [ ] Tạo .env file
- [ ] npm install
- [ ] npx prisma generate
- [ ] npx prisma migrate deploy
- [ ] npm run build

### Deploy
- [ ] pm2 start app
- [ ] pm2 startup
- [ ] pm2 save
- [ ] Mở port 3000

### Test
- [ ] curl http://localhost:3000/api/products
- [ ] curl http://123.45.67.89:3000/api/products
- [ ] Test từ Postman
- [ ] Test từ FE/Mobile

### Optional
- [ ] Setup Nginx
- [ ] Setup SSL (nếu có domain)
- [ ] Setup monitoring

---

## 🎯 TÓM TẮT

### URLs sau khi deploy:

**Không có Nginx:**
```
http://123.45.67.89:3000/api/products
http://123.45.67.89:3000/api-docs  (Swagger)
```

**Có Nginx:**
```
http://123.45.67.89/api/products
http://123.45.67.89/api-docs
```

**Có Domain + SSL:**
```
https://api.savore.com/api/products
https://api.savore.com/api-docs
```

### Frontend/Mobile sẽ gọi:
```javascript
// Development
const API_URL = 'http://localhost:3000/api';

// Production (IP)
const API_URL = 'http://123.45.67.89:3000/api';

// Production (Domain)
const API_URL = 'https://api.savore.com/api';
```

---

## 💡 TIPS

1. **Luôn backup database trước khi update**
```bash
pg_dump -U savore_user savore_db > backup.sql
```

2. **Dùng environment variables**
- Không commit .env lên Git
- Mỗi môi trường có .env riêng

3. **Monitor logs thường xuyên**
```bash
pm2 logs savore-api
```

4. **Setup auto-restart**
```bash
pm2 startup
pm2 save
```

5. **Bắt đầu đơn giản**
- Dùng IP Public trước
- Sau này mới thêm Domain + SSL

---

**Chúc bạn deploy thành công! 🚀**

*Có VPS rồi thì việc deploy không khó, chỉ cần làm từng bước!*
