# 🔧 FIX: VPS không có unzip

## ✅ **FILE ĐÃ ĐƯỢC COPY LÊN VPS**

File `deploy.zip` đã ở trên VPS tại: `/var/www/LINHTINH3/BE/deploy.zip`

## 🚀 **GIẢI PHÁP**

### **Bước 1: SSH vào VPS**

```powershell
ssh root@103.6.234.20
```

### **Bước 2: Cài unzip**

```bash
apt-get update
apt-get install -y unzip
```

### **Bước 3: Unzip và deploy**

```bash
cd /var/www/LINHTINH3/BE
unzip -o deploy.zip
rm deploy.zip
npm install
npx prisma generate
npm run build
pm2 restart all
```

### **Bước 4: Verify**

```bash
pm2 status
pm2 logs
```

---

## 🎯 **HOẶC - COPY TRỰC TIẾP KHÔNG CẦN ZIP**

Nếu không muốn dùng zip, copy trực tiếp:

```powershell
# Copy src
scp -r src root@103.6.234.20:/var/www/LINHTINH3/BE/

# Copy prisma
scp -r prisma root@103.6.234.20:/var/www/LINHTINH3/BE/

# Copy package files
scp package.json package-lock.json root@103.6.234.20:/var/www/LINHTINH3/BE/
```

Sau đó SSH vào VPS:

```bash
ssh root@103.6.234.20
cd /var/www/LINHTINH3/BE
npm install
npx prisma generate
npm run build
pm2 restart all
```

---

## ✅ **RECOMMENDED: Chạy lệnh này**

```powershell
ssh root@103.6.234.20
```

Nhập password, sau đó chạy:

```bash
# Cài unzip
apt-get update && apt-get install -y unzip

# Deploy
cd /var/www/LINHTINH3/BE
unzip -o deploy.zip
rm deploy.zip
npm install
npx prisma generate
npm run build
pm2 restart all

# Check status
pm2 status
```

---

**🎉 Sau khi chạy xong, check: http://103.6.234.20:3000/api**
