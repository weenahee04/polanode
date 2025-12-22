# คู่มือการตั้งค่า Environment Variables

## 🔧 การแก้ไขปัญหา "API Key is missing"

### สาเหตุ
- Environment variables ไม่ถูกโหลดใน production/build
- Vite ต้องใช้ `VITE_` prefix สำหรับ environment variables ที่จะ expose ไปยัง client-side

---

## 📝 วิธีตั้งค่า

### สำหรับ Local Development

1. **สร้างไฟล์ `.env.local`** (ถ้ายังไม่มี)
   ```bash
   # .env.local
   GEMINI_API_KEY=AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc
   VITE_GEMINI_API_KEY=AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc
   ```

2. **รีสตาร์ท Dev Server**
   ```bash
   npm run dev
   ```

---

### สำหรับ Netlify (Production)

1. **เข้า Netlify Dashboard**
   - ไปที่ [https://app.netlify.com](https://app.netlify.com)
   - เลือก site ของคุณ

2. **ตั้งค่า Environment Variables**
   - ไปที่ **Site settings** → **Environment variables**
   - เพิ่ม variables ต่อไปนี้:
     - **Key:** `GEMINI_API_KEY`
     - **Value:** `AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc`
     - **Scopes:** All scopes (Production, Deploy previews, Branch deploys)
   
   - เพิ่มอีกตัว:
     - **Key:** `VITE_GEMINI_API_KEY`
     - **Value:** `AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc`
     - **Scopes:** All scopes

3. **Redeploy**
   - ไปที่ **Deploys** tab
   - คลิก **Trigger deploy** → **Clear cache and deploy site**

---

## 🔍 ตรวจสอบการตั้งค่า

### ใน Local Development
```bash
# ตรวจสอบว่าไฟล์ .env.local มีอยู่
cat .env.local

# ตรวจสอบว่า API key ถูกโหลด (ใน browser console)
console.log(import.meta.env.VITE_GEMINI_API_KEY)
```

### ใน Netlify
1. ไปที่ **Deploys** tab
2. คลิกที่ deploy ล่าสุด
3. ดู **Build log**
4. ตรวจสอบว่า environment variables ถูกโหลด

---

## ⚠️ สิ่งสำคัญ

### 1. Vite Environment Variables
- Variables ที่จะ expose ไปยัง client-side ต้องมี prefix `VITE_`
- Variables ที่ไม่มี `VITE_` prefix จะไม่ถูก expose (ใช้ได้แค่ใน server-side)

### 2. Security
- ⚠️ **API Key จะถูก expose ใน client-side code**
- สำหรับ production ควรพิจารณาใช้:
  - **Backend Proxy** - สร้าง API endpoint ที่เรียก Gemini API จาก server-side
  - **Netlify Functions** - สร้าง serverless function สำหรับเรียก Gemini API

### 3. .env Files Priority
Vite จะโหลด env files ตามลำดับนี้ (ไฟล์ที่โหลดทีหลังจะ override ไฟล์ก่อนหน้า):
1. `.env`
2. `.env.local`
3. `.env.[mode]` (เช่น `.env.production`)
4. `.env.[mode].local`

---

## 🐛 แก้ไขปัญหา

### Problem: "API Key is missing" ใน Local
**Solution:**
1. ตรวจสอบว่า `.env.local` มีอยู่และมี API key
2. ตรวจสอบว่าใช้ `VITE_GEMINI_API_KEY` หรือ `GEMINI_API_KEY`
3. รีสตาร์ท dev server

### Problem: "API Key is missing" ใน Netlify
**Solution:**
1. ตรวจสอบว่าเพิ่ม environment variables ใน Netlify แล้ว
2. ตรวจสอบว่า variable names ถูกต้อง (`GEMINI_API_KEY` และ `VITE_GEMINI_API_KEY`)
3. **Redeploy** หลังจากตั้งค่า environment variables
4. ตรวจสอบ build logs ว่ามี error หรือไม่

### Problem: API Key ถูก expose ใน client-side
**Solution:**
- ใช้ Backend Proxy หรือ Netlify Functions แทน
- อย่าใช้ API key โดยตรงใน client-side code

---

## 📚 อ้างอิง

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

---

*อัพเดทล่าสุด: $(date)*

