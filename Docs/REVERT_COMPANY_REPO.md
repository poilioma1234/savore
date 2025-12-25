# 🚨 KHÔI PHỤC REPO CÔNG TY - URGENT

## ⚠️ VẤN ĐỀ:

Đã push nhầm code vào repo công ty: `https://github.com/OyamaGust/Savore`

Cần xóa 2 commits:
1. "Add easy role update endpoint + bug fixes" (1815faf)
2. "Test API DB" (a7f066e)

---

## ✅ CÁCH KHÔI PHỤC:

### **BƯỚC 1: Clone repo công ty về**

```bash
# Tạo thư mục mới
cd C:\Users\TNWan\Downloads
mkdir CompanyRepoFix
cd CompanyRepoFix

# Clone repo công ty
git clone https://github.com/OyamaGust/Savore.git
cd Savore
```

---

### **BƯỚC 2: Tìm commit trước khi push nhầm**

```bash
# Xem lịch sử commits
git log --oneline

# Tìm commit "Update BE: Latest backend changes" (0d005ca)
# Đây là commit cuối cùng TRƯỚC KHI push nhầm
```

---

### **BƯỚC 3: Reset về commit cũ**

```bash
# Reset về commit 0d005ca (commit trước khi push nhầm)
git reset --hard 0d005ca

# Hoặc reset về 2 commits trước
git reset --hard HEAD~2
```

---

### **BƯỚC 4: Force push để xóa commits nhầm**

```bash
git push origin main --force
```

⚠️ **LƯU Ý:** Force push sẽ XÓA VĨNH VIỄN 2 commits nhầm!

---

## 🎯 SCRIPT TỰ ĐỘNG:

```bash
# Chạy script này
cd C:\Users\TNWan\Downloads
mkdir CompanyRepoFix
cd CompanyRepoFix
git clone https://github.com/OyamaGust/Savore.git
cd Savore

# Reset về commit trước khi push nhầm
git reset --hard 0d005ca

# Force push
git push origin main --force

echo "✅ Đã khôi phục repo công ty!"
```

---

## 📋 CHECKLIST:

- [ ] Clone repo công ty
- [ ] Xác định commit cần reset (0d005ca)
- [ ] Reset về commit đó
- [ ] Force push
- [ ] Verify trên GitHub

---

## ⚠️ QUAN TRỌNG:

**SAU KHI KHÔI PHỤC:**

1. **Thông báo team** (nếu có người đang làm việc trên repo)
2. **Team cần pull lại:** `git pull origin main --force`

---

## 🔍 XÁC NHẬN COMMIT CẦN RESET:

Từ ảnh, commit trước khi push nhầm là:
- **"Update BE: Latest backend changes"** (0d005ca)
- Committed 14 hours ago

Reset về commit này là an toàn!

---

**Bạn muốn tôi tạo script PowerShell tự động không?** 😊
