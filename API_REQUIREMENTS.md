# รีวิวระบบและรายการ API ที่ต้องใช้

## 📋 สรุประบบ

ระบบ **ThaiLife Rewards** เป็นแอปพลิเคชัน Healthcare Rewards & Wellness ที่มีฟีเจอร์หลักดังนี้:

1. **ระบบ Authentication** (Login/Register)
2. **หน้าหลัก** - แสดง Hero Card, Quick Nav, Banners, Rewards Preview
3. **ระบบแลกของรางวัล** - แสดงรายการของรางวัลและคะแนนที่ต้องใช้
4. **AI Health Assistant** - แชทบอทให้คำปรึกษาสุขภาพ พร้อมฟีเจอร์:
   - Knowledge Graph Visualization
   - Medical Flowchart
   - Medical Checklist (สำหรับ Slit Lamp Examination)
   - AI Brain View (แสดงความรู้ที่เรียนรู้)
5. **โปรไฟล์ผู้ใช้** - ข้อมูลส่วนตัว, ประวัติการแลกคะแนน, ตั้งค่า

---

## 🔌 API ที่ต้องใช้

### 1. **Google Gemini API** ✅ (ใช้งานอยู่แล้ว)

**สถานะ:** กำลังใช้งานผ่าน `@google/genai` package

**Endpoints ที่ใช้:**
- `ai.models.generateContentStream()` - สำหรับแชทแบบ streaming
- `ai.models.generateContent()` - สำหรับการวิเคราะห์และสร้างข้อมูล

**ฟังก์ชันที่ใช้:**
- `generateHealthAdvice()` - ให้คำปรึกษาสุขภาพ
- `extractKnowledgeGraph()` - สร้าง Knowledge Graph จากบทสนทนา
- `analyzeMedicalImage()` - วิเคราะห์รูปภาพทางการแพทย์
- `generateRandomHealthQuestion()` - สร้างคำถามสุ่มเกี่ยวกับสุขภาพ

**Configuration:**
- Model: `gemini-3-flash-preview`
- API Key: ต้องตั้งค่าใน `.env.local` เป็น `GEMINI_API_KEY`

**ไฟล์ที่เกี่ยวข้อง:**
- `services/geminiService.ts`

---

### 2. **Authentication API** ❌ (ยังไม่มี - ใช้ Mock)

**สถานะ:** ยังไม่มี Backend API, ใช้ Mock Login/Register

**Endpoints ที่ต้องมี:**

#### 2.1 Login API
```
POST /api/auth/login
Body: {
  email: string
  password: string
}
Response: {
  token: string
  user: {
    id: string
    name: string
    email: string
    memberLevel: string
    points: number
  }
}
```

#### 2.2 Register API
```
POST /api/auth/register
Body: {
  name: string
  email: string
  password: string
}
Response: {
  token: string
  user: {
    id: string
    name: string
    email: string
    memberLevel: string
    points: number
  }
}
```

#### 2.3 Logout API
```
POST /api/auth/logout
Headers: {
  Authorization: Bearer <token>
}
```

#### 2.4 Refresh Token API
```
POST /api/auth/refresh
Body: {
  refreshToken: string
}
Response: {
  token: string
  refreshToken: string
}
```

**ไฟล์ที่ต้องแก้ไข:**
- `components/LoginScreen.tsx` - เพิ่ม API call
- `components/RegisterScreen.tsx` - เพิ่ม API call
- `App.tsx` - จัดการ authentication state และ token

---

### 3. **User Profile API** ❌ (ยังไม่มี - ใช้ Mock)

**สถานะ:** ยังไม่มี Backend API, ใช้ข้อมูล Mock

**Endpoints ที่ต้องมี:**

#### 3.1 Get User Profile
```
GET /api/user/profile
Headers: {
  Authorization: Bearer <token>
}
Response: {
  id: string
  name: string
  email: string
  phone?: string
  memberLevel: string
  points: number
  avatar?: string
  createdAt: string
}
```

#### 3.2 Update User Profile
```
PUT /api/user/profile
Headers: {
  Authorization: Bearer <token>
}
Body: {
  name?: string
  phone?: string
  avatar?: string
}
Response: {
  ...user profile
}
```

**ไฟล์ที่ต้องแก้ไข:**
- `App.tsx` - Tab.PROFILE section

---

### 4. **Rewards API** ❌ (ยังไม่มี - ใช้ Mock)

**สถานะ:** ยังไม่มี Backend API, ใช้ข้อมูล Mock ใน `REWARD_ITEMS`

**Endpoints ที่ต้องมี:**

#### 4.1 Get Rewards List
```
GET /api/rewards
Query Params: {
  category?: string
  page?: number
  limit?: number
}
Response: {
  items: RewardItem[]
  total: number
  page: number
  limit: number
}
```

#### 4.2 Get Reward Detail
```
GET /api/rewards/:id
Response: {
  id: string
  title: string
  category: string
  points: number
  imageUrl: string
  description: string
  available: boolean
  stock?: number
  terms?: string
}
```

#### 4.3 Redeem Reward
```
POST /api/rewards/:id/redeem
Headers: {
  Authorization: Bearer <token>
}
Body: {
  quantity?: number
}
Response: {
  success: boolean
  transactionId: string
  remainingPoints: number
  message: string
}
```

**ไฟล์ที่ต้องแก้ไข:**
- `App.tsx` - Tab.REWARDS section
- `components/RewardCard.tsx` - เพิ่ม redeem functionality

---

### 5. **Points/Transaction API** ❌ (ยังไม่มี)

**สถานะ:** ยังไม่มี Backend API

**Endpoints ที่ต้องมี:**

#### 5.1 Get Points Balance
```
GET /api/user/points
Headers: {
  Authorization: Bearer <token>
}
Response: {
  currentPoints: number
  totalEarned: number
  totalSpent: number
  memberLevel: string
}
```

#### 5.2 Get Transaction History
```
GET /api/user/transactions
Headers: {
  Authorization: Bearer <token>
}
Query Params: {
  type?: 'earned' | 'spent'
  page?: number
  limit?: number
}
Response: {
  transactions: Transaction[]
  total: number
  page: number
  limit: number
}
```

Transaction Type:
```typescript
interface Transaction {
  id: string
  type: 'earned' | 'spent'
  amount: number
  description: string
  rewardId?: string
  rewardTitle?: string
  createdAt: string
}
```

**ไฟล์ที่ต้องแก้ไข:**
- `App.tsx` - Tab.PROFILE section (ประวัติการแลกคะแนน)
- `components/HeroCard.tsx` - แสดงคะแนนปัจจุบัน

---

### 6. **Banner/Campaign API** ❌ (ยังไม่มี - ใช้ Mock)

**สถานะ:** ยังไม่มี Backend API

**Endpoints ที่ต้องมี:**

#### 6.1 Get Banners
```
GET /api/banners
Query Params: {
  position?: 'home' | 'rewards'
  active?: boolean
}
Response: {
  banners: Banner[]
}
```

Banner Type:
```typescript
interface Banner {
  id: string
  title: string
  imageUrl: string
  linkUrl?: string
  position: string
  active: boolean
  startDate?: string
  endDate?: string
}
```

**ไฟล์ที่ต้องแก้ไข:**
- `components/BannerCarousel.tsx`
- `components/SectionBanner.tsx`

---

### 7. **AI Chat History API** ❌ (ยังไม่มี)

**สถานะ:** ยังไม่มี Backend API, ข้อมูลแชทหายเมื่อ refresh

**Endpoints ที่ต้องมี:**

#### 7.1 Save Chat History
```
POST /api/chat/history
Headers: {
  Authorization: Bearer <token>
}
Body: {
  messages: ChatMessage[]
  knowledgeGraph?: KnowledgeGraphData
  flowchart?: FlowchartData
  checklist?: MedicalChecklist
}
Response: {
  chatId: string
  savedAt: string
}
```

#### 7.2 Get Chat History
```
GET /api/chat/history
Headers: {
  Authorization: Bearer <token>
}
Query Params: {
  page?: number
  limit?: number
}
Response: {
  chats: ChatHistory[]
  total: number
}
```

#### 7.3 Get Chat Detail
```
GET /api/chat/history/:id
Headers: {
  Authorization: Bearer <token>
}
Response: {
  id: string
  messages: ChatMessage[]
  knowledgeGraph?: KnowledgeGraphData
  flowchart?: FlowchartData
  checklist?: MedicalChecklist
  createdAt: string
  updatedAt: string
}
```

#### 7.4 Delete Chat History
```
DELETE /api/chat/history/:id
Headers: {
  Authorization: Bearer <token>
}
```

**ไฟล์ที่ต้องแก้ไข:**
- `App.tsx` - Tab.AI_CHAT section
- เพิ่มฟีเจอร์บันทึกและโหลดประวัติแชท

---

### 8. **AI Knowledge/Learning API** ❌ (ยังไม่มี)

**สถานะ:** ยังไม่มี Backend API, ข้อมูลหายเมื่อ refresh

**Endpoints ที่ต้องมี:**

#### 8.1 Save Learned Concepts
```
POST /api/ai/knowledge
Headers: {
  Authorization: Bearer <token>
}
Body: {
  concepts: LearnedConcept[]
}
Response: {
  saved: number
}
```

#### 8.2 Get Learned Concepts
```
GET /api/ai/knowledge
Headers: {
  Authorization: Bearer <token>
}
Response: {
  concepts: LearnedConcept[]
  total: number
}
```

**ไฟล์ที่ต้องแก้ไข:**
- `App.tsx` - AI Brain View functionality
- `components/AIBrainView.tsx`

---

## 📝 สรุป API ที่ต้องพัฒนา

### ✅ API ที่มีอยู่แล้ว:
1. **Google Gemini API** - ใช้งานแล้ว

### ❌ API ที่ต้องพัฒนา (Backend):

1. **Authentication API** (4 endpoints)
   - Login
   - Register
   - Logout
   - Refresh Token

2. **User Profile API** (2 endpoints)
   - Get Profile
   - Update Profile

3. **Rewards API** (3 endpoints)
   - Get Rewards List
   - Get Reward Detail
   - Redeem Reward

4. **Points/Transaction API** (2 endpoints)
   - Get Points Balance
   - Get Transaction History

5. **Banner/Campaign API** (1 endpoint)
   - Get Banners

6. **AI Chat History API** (4 endpoints)
   - Save Chat History
   - Get Chat History
   - Get Chat Detail
   - Delete Chat History

7. **AI Knowledge/Learning API** (2 endpoints)
   - Save Learned Concepts
   - Get Learned Concepts

**รวมทั้งหมด: 18 endpoints**

---

## 🔧 Configuration ที่ต้องตั้งค่า

### Environment Variables:
```env
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here

# Backend API (ต้องเพิ่ม)
API_BASE_URL=http://localhost:8000/api
# หรือ
API_BASE_URL=https://api.thailife-rewards.com/api
```

---

## 🚀 ขั้นตอนการพัฒนา

1. **ตั้งค่า Backend Server** (Node.js/Express, Python/FastAPI, หรืออื่นๆ)
2. **สร้าง Database Schema** สำหรับ:
   - Users
   - Rewards
   - Transactions
   - Chat History
   - Learned Concepts
   - Banners
3. **พัฒนา API Endpoints** ตามรายการด้านบน
4. **สร้าง API Service Layer** ใน Frontend:
   - `services/apiService.ts` - สำหรับ API calls
   - `services/authService.ts` - สำหรับ authentication
5. **อัพเดท Components** ให้เรียกใช้ API แทน Mock Data
6. **เพิ่ม Error Handling และ Loading States**
7. **เพิ่ม Token Management** (Storage, Refresh, etc.)

---

## 📦 Dependencies ที่อาจต้องเพิ่ม

```json
{
  "axios": "^1.6.0",  // สำหรับ HTTP requests
  "react-query": "^5.0.0",  // สำหรับ data fetching (optional)
  "zustand": "^4.4.0"  // สำหรับ state management (optional)
}
```

---

## 🔒 Security Considerations

1. **JWT Token Management** - เก็บ token ใน secure storage
2. **API Rate Limiting** - ป้องกัน abuse
3. **Input Validation** - validate ทุก input
4. **CORS Configuration** - ตั้งค่า CORS ให้ถูกต้อง
5. **HTTPS** - ใช้ HTTPS ใน production
6. **API Key Protection** - ไม่ expose Gemini API key ใน client-side (ควรใช้ proxy)

---

## 📱 หมายเหตุเพิ่มเติม

- ระบบปัจจุบันใช้ **Mock Data** สำหรับ Rewards, User Profile
- **Authentication** ยังไม่มีการตรวจสอบจริง (แค่เปลี่ยน state)
- **Chat History** และ **Learned Concepts** จะหายเมื่อ refresh หน้า
- **Points Balance** ยังไม่มีการอัพเดทจริง
- **Image Upload** ใช้ base64 encoding ซึ่งอาจมีปัญหาเรื่องขนาดไฟล์ใหญ่

---

*เอกสารนี้สร้างเมื่อ: $(date)*

