# คู่มือการตั้งค่า Hybrid AI (Groq + Gemini)

## ✅ สิ่งที่ทำเสร็จแล้ว

- ✅ สร้าง `services/groqService.ts` - Groq service สำหรับ text generation
- ✅ สร้าง `services/hybridAIService.ts` - Hybrid service ที่ใช้ Groq + Gemini
- ✅ อัพเดท `App.tsx` ให้ใช้ hybrid service
- ✅ อัพเดท `vite.config.ts` ให้รองรับ GROQ_API_KEY
- ✅ อัพเดท `package.json` เพิ่ม groq-sdk

---

## 🚀 ขั้นตอนการตั้งค่า

### 1. ติดตั้ง Dependencies

```bash
npm install
```

หรือถ้ายังไม่ได้ติดตั้ง groq-sdk:
```bash
npm install groq-sdk
```

---

### 2. รับ Groq API Key

1. **ไปที่ Groq Console**
   - ไปที่ https://console.groq.com/
   - สร้าง account (ฟรี ไม่ต้องใช้ credit card)

2. **สร้าง API Key**
   - ไปที่ API Keys section
   - คลิก "Create API Key"
   - Copy API key ที่ได้

---

### 3. ตั้งค่า Environment Variables

#### ใน `.env.local` (Local Development)

เพิ่ม Groq API key ใน `.env.local`:

```env
# Gemini API (สำหรับ image analysis)
GEMINI_API_KEY=AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc
VITE_GEMINI_API_KEY=AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc

# Groq API (สำหรับ text generation - เร็วและฟรี)
GROQ_API_KEY=your_groq_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

**ตัวอย่าง:**
```env
GEMINI_API_KEY=AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc
VITE_GEMINI_API_KEY=AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc
GROQ_API_KEY=gsk_your_groq_key_here
VITE_GROQ_API_KEY=gsk_your_groq_key_here
```

#### ใน Netlify (Production)

1. ไปที่ **Site settings** → **Environment variables**
2. เพิ่ม variables:
   - `GROQ_API_KEY` = `your_groq_api_key`
   - `VITE_GROQ_API_KEY` = `your_groq_api_key`
   - `GEMINI_API_KEY` = `AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc` (ถ้ายังไม่มี)
   - `VITE_GEMINI_API_KEY` = `AIzaSyBemhbG7S_76I94F3jfxc9kil4ylp7rhZc` (ถ้ายังไม่มี)

3. **Redeploy**
   - ไปที่ Deploys tab
   - คลิก "Trigger deploy" → "Clear cache and deploy site"

---

### 4. ทดสอบ

```bash
npm run dev
```

เปิด browser และทดสอบ:
1. ไปที่หน้า "AI Chat"
2. ส่งข้อความทดสอบ - ควรใช้ **Groq** (เร็วกว่า)
3. อัพโหลดรูปภาพ - ควรใช้ **Gemini** (รองรับ vision)

---

## 📊 ระบบทำงานอย่างไร

### Text Generation (ใช้ Groq)
- ✅ `generateHealthAdvice()` - แชทบอท
- ✅ `generateRandomHealthQuestion()` - สร้างคำถามสุ่ม
- ✅ `extractKnowledgeGraph()` - สร้าง Knowledge Graph

**ข้อดี:**
- เร็วมาก (10-100x เร็วกว่า Gemini)
- ฟรี 100% (14,400 requests/day)
- ไม่จำกัดมาก

### Image Analysis (ใช้ Gemini)
- ✅ `analyzeMedicalImage()` - วิเคราะห์รูปภาพทางการแพทย์

**ข้อดี:**
- รองรับ Vision/Image Analysis
- วิเคราะห์รูปภาพได้ดี

---

## 🔄 Fallback Strategy

ระบบมี fallback function ที่ถ้า Groq ล้มเหลวจะ fallback ไปใช้ Gemini:

- `generateHealthAdviceWithFallback()` - มี fallback
- `extractKnowledgeGraphWithFallback()` - มี fallback

(ตอนนี้ใช้ function ปกติที่ไม่มี fallback แต่สามารถเปลี่ยนได้)

---

## 🐛 แก้ไขปัญหา

### Problem: "Groq API Key missing"
**Solution:**
1. ตรวจสอบว่าเพิ่ม `GROQ_API_KEY` ใน `.env.local` แล้ว
2. รีสตาร์ท dev server
3. ตรวจสอบว่าใช้ `VITE_GROQ_API_KEY` หรือ `GROQ_API_KEY`

### Problem: "Module not found: groq-sdk"
**Solution:**
```bash
npm install groq-sdk
```

### Problem: Groq ไม่ทำงาน แต่ Gemini ทำงาน
**Solution:**
- ตรวจสอบ Groq API key ถูกต้อง
- ตรวจสอบว่า Groq account ยัง active อยู่
- ดู console logs สำหรับ error details

---

## 📝 หมายเหตุ

- **Groq** ใช้สำหรับ text generation เท่านั้น (ไม่รองรับ vision)
- **Gemini** ใช้สำหรับ image analysis
- ถ้า Groq ล้มเหลว ระบบจะแสดง error (ไม่ fallback อัตโนมัติ)
- สามารถเปลี่ยนไปใช้ fallback functions ได้ถ้าต้องการ

---

## 🎯 สรุป

1. ✅ ติดตั้ง `groq-sdk`: `npm install`
2. ✅ รับ Groq API key จาก https://console.groq.com/
3. ✅ เพิ่ม `GROQ_API_KEY` ใน `.env.local`
4. ✅ เพิ่ม `GROQ_API_KEY` ใน Netlify environment variables
5. ✅ Redeploy (ถ้าใน production)
6. ✅ ทดสอบ!

---

*อัพเดทล่าสุด: $(date)*

