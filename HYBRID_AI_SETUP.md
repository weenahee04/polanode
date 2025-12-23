# คู่มือการตั้งค่า Hybrid AI (Groq + Gemini)

## 🎯 กลยุทธ์

ใช้ **Groq** สำหรับ text generation (เร็วและฟรี) และ **Gemini** สำหรับ image analysis (เมื่อจำเป็น)

---

## 📦 ติดตั้ง Dependencies

```bash
npm install groq-sdk
```

---

## 🔧 ตั้งค่า Environment Variables

### ใน `.env.local` (Local Development)
```env
# Groq API (สำหรับ text generation)
GROQ_API_KEY=your_groq_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here

# Gemini API (สำหรับ image analysis)
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### ใน Netlify (Production)
1. ไปที่ **Site settings** → **Environment variables**
2. เพิ่ม:
   - `GROQ_API_KEY` = `your_groq_api_key`
   - `VITE_GROQ_API_KEY` = `your_groq_api_key`
   - `GEMINI_API_KEY` = `your_gemini_api_key`
   - `VITE_GEMINI_API_KEY` = `your_gemini_api_key`

---

## 💻 สร้าง Hybrid Service

สร้างไฟล์ `services/hybridAIService.ts`:

```typescript
import { generateHealthAdvice as groqGenerate } from './groqService';
import { generateHealthAdvice as geminiGenerate, analyzeMedicalImage } from './geminiService';
import { extractKnowledgeGraph as groqExtract } from './groqService';
import { extractKnowledgeGraph as geminiExtract } from './geminiService';

// ใช้ Groq สำหรับ text (เร็วกว่าและฟรี)
export const generateHealthAdvice = groqGenerate;
export const extractKnowledgeGraph = groqExtract;
export const generateRandomHealthQuestion = async () => {
  // ใช้ Groq
  const { generateRandomHealthQuestion: groqGenerate } = await import('./groqService');
  return groqGenerate();
};

// ใช้ Gemini สำหรับ image analysis
export { analyzeMedicalImage };
```

---

## 🔄 วิธีเปลี่ยนไปใช้ Hybrid

### 1. สร้าง Groq Service
- Copy `services/groqService.example.ts` เป็น `services/groqService.ts`
- แก้ไขตามต้องการ

### 2. สร้าง Hybrid Service
- สร้าง `services/hybridAIService.ts` ตามตัวอย่างด้านบน

### 3. อัพเดท App.tsx
```typescript
// เปลี่ยนจาก
import { generateHealthAdvice, extractKnowledgeGraph, generateRandomHealthQuestion, analyzeMedicalImage } from './services/geminiService';

// เป็น
import { generateHealthAdvice, extractKnowledgeGraph, generateRandomHealthQuestion, analyzeMedicalImage } from './services/hybridAIService';
```

---

## 📊 เปรียบเทียบ Performance

| Feature | Groq | Gemini |
|---------|------|--------|
| Text Generation | ⭐⭐⭐⭐⭐ (เร็วมาก) | ⭐⭐⭐⭐ |
| Image Analysis | ❌ | ⭐⭐⭐⭐⭐ |
| Free Tier | ⭐⭐⭐⭐⭐ (14,400/day) | ⭐⭐⭐⭐ (1,500/day) |
| Cost | ฟรี 100% | ฟรี |

---

## 🎯 Use Cases

### ใช้ Groq สำหรับ:
- ✅ Text chat/conversation
- ✅ Knowledge Graph extraction
- ✅ Random question generation
- ✅ General text processing

### ใช้ Gemini สำหรับ:
- ✅ Image analysis
- ✅ Medical image analysis
- ✅ Vision tasks

---

## 💡 Tips

1. **Fallback Strategy**: ถ้า Groq ล้มเหลว ให้ fallback ไปใช้ Gemini
2. **Caching**: Cache responses เพื่อลด API calls
3. **Rate Limiting**: ตั้งค่า rate limiting เพื่อไม่ให้เกิน free tier

---

*อัพเดทล่าสุด: $(date)*

