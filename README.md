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

