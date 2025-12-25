# ⚡ FIX GIT REMOTE - QUICK GUIDE

## 🔧 ĐÃ ĐỔI REMOTE URL

Remote đã được đổi sang: `https://github.com/poilioma1234/savore.git`

---

## 🚨 VẤN ĐỀ HIỆN TẠI

Git đang chờ bạn nhập commit message cho merge.

---

## ✅ CÁCH SỬA NHANH:

### **Option 1: Force push (KHUYÊN DÙNG - nếu repo mới trống)**

```bash
git push origin main --force
```

⚠️ **Chỉ dùng nếu repo `poilioma1234/savore` chưa có code quan trọng!**

---

### **Option 2: Merge thủ công (nếu repo có code cũ)**

1. **Thoát khỏi editor hiện tại:**
   - Nhấn `ESC`
   - Gõ `:wq` và Enter

2. **Sau đó push:**
   ```bash
   git push origin main
   ```

---

### **Option 3: Cancel merge và làm lại**

```bash
# Cancel merge hiện tại
git merge --abort

# Force push (nếu repo mới)
git push origin main --force
```

---

## 🎯 KHUYẾN NGHỊ:

Nếu repo `https://github.com/poilioma1234/savore` là **MỚI** hoặc **TRỐNG**, dùng:

```bash
git push origin main --force
```

Nếu repo đã có code quan trọng, dùng Option 2.

---

## 📝 SAU KHI PUSH XONG:

### **Trên VPS, đổi remote URL:**

```bash
cd /var/www/savore/BE
git remote set-url origin https://github.com/poilioma1234/savore.git
git pull origin main
npm install
npm run build
pm2 restart savore-api
```

---

**Bạn muốn dùng cách nào?** 😊
