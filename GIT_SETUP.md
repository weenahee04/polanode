# คู่มือการ Push ขึ้น Git Repository

## ✅ สิ่งที่ทำเสร็จแล้ว

- ✅ สร้าง Git repository (`git init`)
- ✅ เพิ่มไฟล์ทั้งหมด (`git add .`)
- ✅ Commit ครั้งแรก (`git commit`)
- ✅ ตรวจสอบว่า `.env.local` ถูก ignore แล้ว

---

## 🚀 ขั้นตอนการ Push ขึ้น GitHub/GitLab/Bitbucket

### วิธีที่ 1: สร้าง Repository ใหม่บน GitHub

1. **สร้าง Repository บน GitHub**
   - ไปที่ [https://github.com/new](https://github.com/new)
   - ตั้งชื่อ repository (เช่น `thailife-rewards`)
   - เลือก Public หรือ Private
   - **อย่า** check "Initialize with README" (เพราะเรามีโค้ดอยู่แล้ว)
   - คลิก "Create repository"

2. **เพิ่ม Remote และ Push**
   ```bash
   # เพิ่ม remote repository
   git remote add origin https://github.com/YOUR_USERNAME/thailife-rewards.git
   
   # เปลี่ยนชื่อ branch เป็น main (ถ้ายังไม่ใช่)
   git branch -M main
   
   # Push ขึ้น GitHub
   git push -u origin main
   ```

---

### วิธีที่ 2: สร้าง Repository ใหม่บน GitLab

1. **สร้าง Repository บน GitLab**
   - ไปที่ [https://gitlab.com/projects/new](https://gitlab.com/projects/new)
   - ตั้งชื่อ repository
   - เลือก Visibility
   - **อย่า** check "Initialize repository with a README"
   - คลิก "Create project"

2. **เพิ่ม Remote และ Push**
   ```bash
   git remote add origin https://gitlab.com/YOUR_USERNAME/thailife-rewards.git
   git branch -M main
   git push -u origin main
   ```

---

### วิธีที่ 3: สร้าง Repository ใหม่บน Bitbucket

1. **สร้าง Repository บน Bitbucket**
   - ไปที่ [https://bitbucket.org/repo/create](https://bitbucket.org/repo/create)
   - ตั้งชื่อ repository
   - เลือก Access level
   - **อย่า** check "Include a README"
   - คลิก "Create repository"

2. **เพิ่ม Remote และ Push**
   ```bash
   git remote add origin https://bitbucket.org/YOUR_USERNAME/thailife-rewards.git
   git branch -M main
   git push -u origin main
   ```

---

## 🔐 การตั้งค่า Authentication

### สำหรับ HTTPS (Username/Password)
- GitHub: ใช้ Personal Access Token แทน password
- GitLab: ใช้ Personal Access Token
- Bitbucket: ใช้ App Password

### สำหรับ SSH (แนะนำ)
1. **สร้าง SSH Key** (ถ้ายังไม่มี)
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **เพิ่ม SSH Key ไปยัง Git Provider**
   - GitHub: Settings → SSH and GPG keys → New SSH key
   - GitLab: Preferences → SSH Keys → Add new key
   - Bitbucket: Personal settings → SSH keys → Add key

3. **ใช้ SSH URL แทน HTTPS**
   ```bash
   # GitHub
   git remote add origin git@github.com:YOUR_USERNAME/thailife-rewards.git
   
   # GitLab
   git remote add origin git@gitlab.com:YOUR_USERNAME/thailife-rewards.git
   
   # Bitbucket
   git remote add origin git@bitbucket.org:YOUR_USERNAME/thailife-rewards.git
   ```

---

## 📝 คำสั่ง Git ที่ใช้บ่อย

### ตรวจสอบสถานะ
```bash
git status
```

### ดู Remote Repository
```bash
git remote -v
```

### เปลี่ยน Remote URL
```bash
git remote set-url origin NEW_URL
```

### Push ขึ้น Remote
```bash
git push -u origin main
```

### Pull จาก Remote
```bash
git pull origin main
```

### ดู Commit History
```bash
git log --oneline
```

---

## ⚠️ สิ่งสำคัญที่ต้องระวัง

### 1. อย่า Commit `.env.local`
- ✅ ตรวจสอบแล้วว่า `.env.local` อยู่ใน `.gitignore`
- ✅ ตรวจสอบแล้วว่าไฟล์ถูก ignore: `git check-ignore .env.local`

### 2. ตรวจสอบไฟล์ก่อน Commit
```bash
git status
```

### 3. ตรวจสอบว่า API Key ไม่ถูก commit
```bash
git log --all --full-history -- .env.local
# ควรไม่มีผลลัพธ์
```

---

## 🔄 Workflow สำหรับการอัพเดทโค้ด

```bash
# 1. ดูการเปลี่ยนแปลง
git status

# 2. เพิ่มไฟล์ที่เปลี่ยนแปลง
git add .

# 3. Commit
git commit -m "Description of changes"

# 4. Push ขึ้น Remote
git push origin main
```

---

## 🐛 แก้ไขปัญหา

### Error: "remote origin already exists"
```bash
# ดู remote ที่มีอยู่
git remote -v

# ลบ remote เก่า
git remote remove origin

# เพิ่ม remote ใหม่
git remote add origin NEW_URL
```

### Error: "failed to push some refs"
```bash
# Pull ก่อน push
git pull origin main --rebase

# แล้ว push อีกครั้ง
git push origin main
```

### Error: Authentication failed
- ตรวจสอบว่าใช้ Personal Access Token หรือ SSH key ถูกต้อง
- สำหรับ GitHub: ใช้ Personal Access Token แทน password

---

## 📦 ไฟล์ที่ถูก Ignore (ไม่ถูก commit)

ตาม `.gitignore`:
- `node_modules/` - Dependencies
- `dist/` - Build output
- `*.local` - Environment files (รวม `.env.local`)
- `.DS_Store` - macOS system files
- `*.log` - Log files

---

## ✅ Checklist ก่อน Push

- [ ] ตรวจสอบว่า `.env.local` ถูก ignore
- [ ] ตรวจสอบว่าไม่มี API key ในโค้ด
- [ ] ตรวจสอบว่า build ทำงานได้ (`npm run build`)
- [ ] ตั้งชื่อ commit message ที่ชัดเจน
- [ ] ตรวจสอบ remote URL ถูกต้อง

---

*อัพเดทล่าสุด: $(date)*

