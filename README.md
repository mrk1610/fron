# AI Resume Studio

An AI-powered resume tailoring and job application tracking web app. Build a master candidate profile, generate ATS-optimized resume variations for specific job descriptions using Google Gemini, and track your job applications — all in one place.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite 6 |
| Backend | Express.js (TypeScript), served via Node.js |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| Database | Supabase (PostgreSQL + Auth + Row Level Security) |
| Animation | Motion (Framer Motion v12) |
| Icons | Lucide React |
| Build | Vite (frontend) + esbuild (server bundle) |

---

## Features

- **Master Profile** — Enter your career details once; reuse across all resumes
- **AI Resume Tailoring** — Paste a job description (or upload PDF) and Gemini rewrites your resume for ATS keyword alignment
- **ATS Match Score** — Each tailored resume gets a score based on keyword coverage
- **CV Template Gallery** — Multiple resume layout templates (modern, classic, etc.)
- **Application Tracker** — Kanban-style board to track job applications by status
- **Google OAuth + Email Auth** — Powered by Supabase Auth
- **Rate Limiting** — 10 AI requests per minute per IP

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build frontend (Vite) + bundle server (esbuild) into `dist/` |
| `npm start` | Run the production build (`dist/server.cjs`) |
| `npm run lint` | TypeScript type check (no emit) |
| `npm run clean` | Remove `dist/` folder |

---

## Project Structure

```
├── src/
│   ├── components/        # React components (AuthScreen, ResumeBuilder, TrackerBoard, etc.)
│   ├── lib/               # Supabase client, DB helpers
│   ├── App.tsx            # Root component, routing logic
│   ├── types.ts           # TypeScript type definitions
│   ├── data.ts            # Static data (ATS presets, templates)
│   └── index.css          # Global styles
├── supabase/
│   ├── schema.sql         # Database schema + RLS policies + triggers
│   └── trigger.sql        # Auth trigger (also included in schema.sql)
├── assets/                # Static assets
├── server.ts              # Express server (API routes + Vite middleware)
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript config
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/generate-resume` | Tailor resume with Gemini AI |
| `POST` | `/api/analyze-resume` | Get AI improvement suggestions |

All AI endpoints are rate-limited to **10 requests per minute per IP**.

---

## Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add environment variables in Vercel dashboard (same as your `.env`):
   - `GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**

> The build command (`npm run build`) and output directory (`dist`) are auto-detected by Vercel.
