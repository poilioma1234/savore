# 🔧 FIX TYPESCRIPT ERRORS ON VPS

## ✅ **FILES DEPLOYED SUCCESSFULLY**

All files have been extracted to VPS!

## ❌ **CURRENT ERROR**

TypeScript errors because Prisma Client on VPS doesn't have the new schema types (address, latitude, longitude).

## 🚀 **SOLUTION - RUN ON VPS**

### **SSH into VPS:**

```powershell
ssh root@103.6.234.20
```

### **Run these commands:**

```bash
# Navigate to project
cd /var/www/LINHTINH3/BE

# Install dependencies (if needed)
npm install

# Generate Prisma Client with new schema
npx prisma generate

# Build project
npm run build

# Restart PM2
pm2 restart all

# Check status
pm2 status

# View logs
pm2 logs --lines 50
```

---

## 🎯 **ONE COMMAND - COPY AND PASTE**

After SSH, run this:

```bash
cd /var/www/LINHTINH3/BE && npm install && npx prisma generate && npm run build && pm2 restart all && pm2 status
```

---

## ✅ **EXPECTED OUTPUT**

After running `npx prisma generate`:
```
✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
```

After running `npm run build`:
```
[10:XX:XX PM] Found 0 errors. Watching for file changes.
```

After running `pm2 restart all`:
```
[PM2] Applying action restartProcessId on app [all]
[PM2] [savore-api](0) ✓
```

---

## 🌐 **VERIFY**

Open browser: **http://103.6.234.20:3000/api**

You should see:
- ✅ Products endpoints
- ✅ Calculate Ingredients endpoint
- ✅ All new features

---

## 📝 **TROUBLESHOOTING**

### **If npm install fails:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### **If build still has errors:**
```bash
npx prisma generate
npm run build
```

### **If PM2 not found:**
```bash
npm install -g pm2
pm2 start dist/main.js --name savore-api
pm2 save
```

---

**🎯 QUICK FIX: Just run `npx prisma generate` and `npm run build` on VPS!**
