# 🚀 DEPLOY TO VPS - SCP COMMANDS

## 📋 **CHUẨN BỊ**

Path trên VPS: `/var/www/LINHTINH3/BE`
IP: `103.6.234.20`
User: `root`

---

## 🔧 **LỆNH SCP - CHẠY TRÊN POWERSHELL**

### **Bước 1: Copy folder src (code mới)**

```powershell
scp -r src root@103.6.234.20:/var/www/LINHTINH3/BE/
```

### **Bước 2: Copy prisma folder (schema + migrations)**

```powershell
scp -r prisma root@103.6.234.20:/var/www/LINHTINH3/BE/
```

### **Bước 3: Copy package.json**

```powershell
scp package.json root@103.6.234.20:/var/www/LINHTINH3/BE/
```

### **Bước 4: Copy package-lock.json**

```powershell
scp package-lock.json root@103.6.234.20:/var/www/LINHTINH3/BE/
```

### **Bước 5: Copy .env file**

```powershell
scp .env root@103.6.234.20:/var/www/LINHTINH3/BE/
```

---

## 🎯 **HOẶC - COPY TẤT CẢ MỘT LÚC**

### **Option 1: Copy tất cả files cần thiết**

```powershell
# Navigate to BE folder first
cd C:\Users\TNWan\Downloads\TEST_DB\Savore-feature-init-database\Savore-feature-init-database\BE

# Copy all at once (exclude node_modules and dist)
scp -r src prisma package.json package-lock.json .env tsconfig.json tsconfig.build.json nest-cli.json root@103.6.234.20:/var/www/LINHTINH3/BE/
```

### **Option 2: Tạo archive rồi copy (RECOMMENDED)**

```powershell
# 1. Tạo zip (exclude node_modules, dist)
Compress-Archive -Path src,prisma,package.json,package-lock.json,.env,tsconfig.json,tsconfig.build.json,nest-cli.json,eslint.config.mjs -DestinationPath deploy.zip -Force

# 2. Copy zip lên VPS
scp deploy.zip root@103.6.234.20:/var/www/LINHTINH3/BE/

# 3. SSH vào VPS và unzip
ssh root@103.6.234.20
cd /var/www/LINHTINH3/BE
unzip -o deploy.zip
rm deploy.zip
exit
```

---

## 🖥️ **SAU KHI COPY - CHẠY TRÊN VPS**

### **SSH vào VPS:**

```bash
ssh root@103.6.234.20
```

### **Navigate to project:**

```bash
cd /var/www/LINHTINH3/BE
```

### **Install dependencies:**

```bash
npm install
```

### **Generate Prisma Client:**

```bash
npx prisma generate
```

### **Apply migrations:**

```bash
npx prisma migrate deploy
```

### **Build project:**

```bash
npm run build
```

### **Restart server:**

```bash
# If using PM2
pm2 restart all

# Or check PM2 status first
pm2 status

# View logs
pm2 logs
```

### **If not using PM2:**

```bash
# Kill old process
pkill -f "node"

# Start new process
npm run start:prod &
```

---

## ✅ **VERIFY**

### **Check if server is running:**

```bash
# On VPS
curl http://localhost:3000

# Check processes
ps aux | grep node
```

### **From your computer:**

Open browser: **http://103.6.234.20:3000/api**

You should see:
- ✅ Products endpoints
- ✅ Calculate Ingredients endpoint
- ✅ All new documentation

---

## 🔧 **TROUBLESHOOTING**

### **If SCP asks for password:**

Enter your VPS root password

### **If permission denied:**

```bash
# On VPS, fix permissions
chmod -R 755 /var/www/LINHTINH3/BE
```

### **If port 3000 not accessible:**

```bash
# On VPS, open firewall
ufw allow 3000
ufw status
```

### **If build fails:**

```bash
# On VPS
cd /var/www/LINHTINH3/BE
rm -rf node_modules
rm -rf dist
npm install
npm run build
```

---

## 📝 **COMPLETE DEPLOYMENT SCRIPT**

Save this and run in PowerShell:

```powershell
# ========================================
# SAVORE BACKEND - DEPLOY TO VPS
# ========================================

Write-Host "🚀 Starting deployment..." -ForegroundColor Green

# Navigate to BE folder
cd C:\Users\TNWan\Downloads\TEST_DB\Savore-feature-init-database\Savore-feature-init-database\BE

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
Compress-Archive -Path src,prisma,package.json,package-lock.json,.env,tsconfig.json,tsconfig.build.json,nest-cli.json,eslint.config.mjs -DestinationPath deploy.zip -Force

# Copy to VPS
Write-Host "📤 Uploading to VPS..." -ForegroundColor Yellow
scp deploy.zip root@103.6.234.20:/var/www/LINHTINH3/BE/

# Execute commands on VPS
Write-Host "🔧 Installing on VPS..." -ForegroundColor Yellow
ssh root@103.6.234.20 "cd /var/www/LINHTINH3/BE && unzip -o deploy.zip && rm deploy.zip && npm install && npx prisma generate && npx prisma migrate deploy && npm run build && pm2 restart all"

# Clean up local
Remove-Item deploy.zip

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Server: http://103.6.234.20:3000" -ForegroundColor Cyan
Write-Host "📚 Swagger: http://103.6.234.20:3000/api" -ForegroundColor Cyan
```

---

## 🎯 **QUICK COMMANDS**

### **Just copy src folder:**
```powershell
scp -r src root@103.6.234.20:/var/www/LINHTINH3/BE/
```

### **Just copy prisma folder:**
```powershell
scp -r prisma root@103.6.234.20:/var/www/LINHTINH3/BE/
```

### **Copy and deploy in one command:**
```powershell
scp -r src prisma package.json root@103.6.234.20:/var/www/LINHTINH3/BE/ && ssh root@103.6.234.20 "cd /var/www/LINHTINH3/BE && npm install && npx prisma generate && npm run build && pm2 restart all"
```

---

**🎉 After deployment, check: http://103.6.234.20:3000/api**
