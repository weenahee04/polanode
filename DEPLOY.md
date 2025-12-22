# คู่มือการ Deploy ไปยัง Netlify

## 📋 สิ่งที่เตรียมไว้แล้ว

✅ `netlify.toml` - Configuration file สำหรับ Netlify
✅ `public/_redirects` - สำหรับ SPA routing
✅ `.netlifyignore` - ไฟล์ที่ต้อง ignore เมื่อ deploy

---

## 🚀 วิธี Deploy

### วิธีที่ 1: Deploy ผ่าน Netlify Dashboard (แนะนำ)

1. **เตรียม Repository**
   - Push โค้ดขึ้น GitHub/GitLab/Bitbucket
   - ตรวจสอบว่า `.env.local` ถูก ignore แล้ว (อยู่ใน `.gitignore`)

2. **เข้า Netlify Dashboard**
   - ไปที่ [https://app.netlify.com](https://app.netlify.com)
   - คลิก "Add new site" → "Import an existing project"
   - เลือก Git provider (GitHub/GitLab/Bitbucket)
   - เลือก repository ของคุณ

3. **ตั้งค่า Build Settings**
   - Build command: `npm run build` (จะใช้จาก `netlify.toml` อัตโนมัติ)
   - Publish directory: `dist` (จะใช้จาก `netlify.toml` อัตโนมัติ)
   - คลิก "Deploy site"

4. **ตั้งค่า Environment Variables** ⚠️ สำคัญ!
   - ไปที่ Site settings → Environment variables
   - เพิ่ม variable:
     - Key: `GEMINI_API_KEY`
     - Value: `AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc`
   - คลิก "Save"

5. **Redeploy**
   - หลังจากตั้งค่า environment variable แล้ว
   - ไปที่ Deploys tab
   - คลิก "Trigger deploy" → "Clear cache and deploy site"

---

### วิธีที่ 2: Deploy ผ่าน Netlify CLI

1. **ติดตั้ง Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```
   - เลือก "Create & configure a new site"
   - ตั้งชื่อ site (หรือใช้ชื่อ default)
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **ตั้งค่า Environment Variable**
   ```bash
   netlify env:set GEMINI_API_KEY "AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

### วิธีที่ 3: Drag & Drop (สำหรับทดสอบ)

1. **Build โปรเจกต์**
   ```bash
   npm run build
   ```

2. **เข้า Netlify Dashboard**
   - ไปที่ [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - ลาก folder `dist` ไปวาง

3. **ตั้งค่า Environment Variable**
   - ไปที่ Site settings → Environment variables
   - เพิ่ม `GEMINI_API_KEY`

⚠️ **หมายเหตุ:** วิธีนี้ไม่เหมาะสำหรับ production เพราะต้อง build และ upload ใหม่ทุกครั้ง

---

## ⚙️ การตั้งค่าเพิ่มเติม

### Custom Domain
1. ไปที่ Site settings → Domain management
2. คลิก "Add custom domain"
3. ใส่ domain name ของคุณ
4. ตั้งค่า DNS ตามที่ Netlify แนะนำ

### Build Hooks (สำหรับ CI/CD)
1. ไปที่ Site settings → Build & deploy → Build hooks
2. คลิก "Add build hook"
3. ตั้งชื่อและ copy URL
4. ใช้ URL นี้ใน GitHub Actions หรือ CI/CD อื่นๆ

### Branch Deploys
- Netlify จะ deploy ทุก branch อัตโนมัติ
- Production branch: `main` หรือ `master`
- Preview branches: branch อื่นๆ ทั้งหมด

---

## 🔍 ตรวจสอบการ Deploy

1. **ตรวจสอบ Build Logs**
   - ไปที่ Deploys tab
   - คลิกที่ deploy ที่ต้องการ
   - ดู build logs ว่ามี error หรือไม่

2. **ทดสอบ API Key**
   - เปิดเว็บไซต์ที่ deploy แล้ว
   - ไปที่หน้า AI Chat
   - ส่งข้อความทดสอบ
   - ควรได้รับคำตอบจาก Gemini AI

3. **ตรวจสอบ Console**
   - เปิด Browser DevTools (F12)
   - ดู Console tab
   - ตรวจสอบว่ามี error หรือไม่

---

## 🐛 แก้ไขปัญหา

### Build ล้มเหลว
- ตรวจสอบ build logs ใน Netlify
- ทดสอบ build ภายในเครื่อง: `npm run build`
- ตรวจสอบว่า dependencies ติดตั้งครบ: `npm install`

### API Key ไม่ทำงาน
- ตรวจสอบว่าเพิ่ม `GEMINI_API_KEY` ใน Environment variables แล้ว
- ตรวจสอบว่า value ถูกต้อง (ไม่มี space หรือ newline)
- Redeploy หลังจากตั้งค่า environment variable

### 404 Error เมื่อ refresh หน้า
- ตรวจสอบว่า `public/_redirects` มีอยู่
- ตรวจสอบว่า `netlify.toml` มี redirect rule

### Environment Variable ไม่ทำงาน
- ตรวจสอบว่า variable name ตรงกับที่ใช้ใน code (`GEMINI_API_KEY`)
- Redeploy หลังจากตั้งค่า
- ตรวจสอบ build logs ว่ามี error เกี่ยวกับ env หรือไม่

---

## 📝 หมายเหตุ

- ⚠️ **อย่า commit `.env.local`** - ใช้ Environment variables ใน Netlify แทน
- 🔒 **API Key ปลอดภัย** - Netlify จะไม่แสดง API key ใน client-side code
- 🚀 **Auto Deploy** - Netlify จะ deploy อัตโนมัติเมื่อ push code ใหม่
- 📦 **Build Cache** - Netlify จะ cache dependencies เพื่อ build เร็วขึ้น

---

## 🔗 Links ที่เป็นประโยชน์

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)
- [Environment Variables in Netlify](https://docs.netlify.com/environment-variables/overview/)

---

*อัพเดทล่าสุด: $(date)*

