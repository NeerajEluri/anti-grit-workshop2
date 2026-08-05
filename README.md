# anti-grit-workshop2 — AI-Powered Agriculture Crop Advisory Assistant

A production-grade, full-stack Agri-Tech web application providing personalized AI crop advisories, multimodal plant disease/pest diagnoses, weather integration, market price tracking, agronomist chat assistant, and admin oversight. Built with **React** (Vite + TS + Tailwind), **Express.js** (Node.js), **Supabase** (PostgreSQL + Auth + Storage + RLS), and **Google Gemini** (`@google/genai`).

---

## 🌟 Key Features

- **Auth & Role-Based Access**: Email/password authentication via Supabase Auth (`farmer` & `admin` roles).
- **Farm Profile Management**: Register and manage multiple farm profiles with land size, soil types, irrigation sources, and current crop seasons.
- **AI Crop Recommendation Engine**: Structured JSON-schema crop recommendations grounded in farm parameters and microclimate weather using Google Gemini 2.5 Flash.
- **Multimodal Disease Vision Diagnosis**: Image upload for leaf/plant inspection with instant severity ratings and step-by-step organic remedies.
- **Persistent Agronomist Chat**: Threaded AI Q&A assistant grounded in target farm context.
- **Market Price Intelligence**: Mandi price tracking with interactive Recharts line graphs and AI selling window recommendations.
- **Admin Oversight**: Master crop database CRUD, low-confidence diagnosis review flags, user management, and audit trail viewer.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | **React.js** (Vite + TypeScript), **Tailwind CSS**, `react-router-dom` v6, `@tanstack/react-query`, `recharts`, `lucide-react` |
| Backend | **Node.js** (v20+), **Express.js**, `cors`, `helmet`, `express-rate-limit`, `multer` |
| Database & Auth | **Supabase PostgreSQL**, `@supabase/supabase-js`, `@supabase/server` |
| Generative AI | **`@google/genai`** SDK (Google Gemini 2.5 Flash text & vision) |
| Validation | **Zod** schema validation |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your Supabase credentials and Google Gemini API key:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://jupiqsxvhutpehkcmgmw.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_JWKS_URL=https://jupiqsxvhutpehkcmgmw.supabase.co/auth/v1/.well-known/jwks.json

VITE_SUPABASE_URL=https://jupiqsxvhutpehkcmgmw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run Development Server
Launch both frontend and backend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 📦 Build for Production

```bash
npm run build
```
Outputs optimized client assets to `dist/`.
