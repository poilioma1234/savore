# 🚀 DEPLOY BACKEND TO VPS - STEP BY STEP

## 📋 **CHUẨN BỊ**

### **Bước 1: Commit code lên Git**

```bash
# Add all changes
git add .

# Commit
git commit -m "feat: Add Products module and Calculate Ingredients API"

# Push to GitHub
git push origin main
```

---

## 🖥️ **TRÊN VPS**

### **Bước 2: SSH vào VPS**

```bash
ssh root@103.6.234.20
```

### **Bước 3: Navigate to project folder**

```bash
cd /path/to/your/backend
# Ví dụ: cd /var/www/savore-backend/BE
```

### **Bước 4: Pull code mới**

```bash
git pull origin main
```

### **Bước 5: Install dependencies**

```bash
npm install
```

### **Bước 6: Generate Prisma Client**

```bash
npx prisma generate
```

### **Bước 7: Apply migrations (if any)**

```bash
npx prisma migrate deploy
```

### **Bước 8: Build project**

```bash
npm run build
```

### **Bước 9: Restart PM2**

```bash
# If using PM2
pm2 restart savore-api

# Or restart all
pm2 restart all

# Check status
pm2 status

# View logs
pm2 logs savore-api
```

---

## ✅ **VERIFY**

### **Check if server is running:**

```bash
# On VPS
curl http://localhost:3000

# From your computer
curl http://103.6.234.20:3000
```

### **Check Swagger UI:**

Open browser: **http://103.6.234.20:3000/api**

You should see:
- Products endpoints
- Calculate Ingredients endpoint
- All new features

---

## 🔧 **TROUBLESHOOTING**

### **If PM2 is not installed:**

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start dist/main.js --name savore-api

# Save PM2 config
pm2 save

# Setup auto-start on reboot
pm2 startup
```

### **If port 3000 is blocked:**

```bash
# Open firewall
ufw allow 3000
ufw status
```

### **If build fails:**

```bash
# Clean build
rm -rf dist
npm run build

# Check for errors
npm run build 2>&1 | tee build.log
```

---

## 📝 **QUICK DEPLOY SCRIPT**

Save this as `deploy.sh` on VPS:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project
cd /var/www/savore-backend/BE

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Apply migrations
echo "🗄️ Applying migrations..."
npx prisma migrate deploy

# Build project
echo "🏗️ Building project..."
npm run build

# Restart PM2
echo "🔄 Restarting server..."
pm2 restart savore-api

# Show status
echo "✅ Deployment complete!"
pm2 status

echo "🌐 Server is running at: http://103.6.234.20:3000"
echo "📚 Swagger UI: http://103.6.234.20:3000/api"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

---

## 🎯 **SUMMARY**

### **What you need to do:**

1. **On Local:**
   ```bash
   git add .
   git commit -m "Add new features"
   git push origin main
   ```

2. **On VPS:**
   ```bash
   ssh root@103.6.234.20
   cd /var/www/savore-backend/BE
   git pull origin main
   npm install
   npx prisma generate
   npm run build
   pm2 restart savore-api
   ```

3. **Verify:**
   - Open: http://103.6.234.20:3000/api
   - Check for new endpoints

---

## 📞 **NEED HELP?**

### **Check VPS server status:**
```bash
pm2 status
pm2 logs savore-api
```

### **Check if port is open:**
```bash
netstat -tulpn | grep 3000
```

### **Check firewall:**
```bash
ufw status
```

---

**🎉 After deployment, your VPS will have all new features!**
