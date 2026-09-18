# Hirely AI — AI Job Tracker + Resume Optimizer

A luxury-styled, full-stack SaaS: upload a CV, get an instant AI score, optimize it
for US / German / UK hiring conventions in one click, generate tailored cover letters,
and track every application on a drag-and-drop board.

> **Note on the stack:** you listed both NestJS and .NET as the backend. Running two
> backend frameworks side by side doesn't add anything — they'd just duplicate the same
> API — so this build uses **one** backend: **NestJS + GraphQL + MongoDB**, which covers
> everything (auth, resume AI, job tracker) cleanly. If you specifically need a .NET
> service for something else (e.g. a separate internal tool), say so and I'll scope that
> as its own piece.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Apollo Client |
| Backend | NestJS + GraphQL (Apollo) + Mongoose (MongoDB) + Passport JWT |
| AI | Google Gemini API (`gemini-2.0-flash`) — free tier, no card, no expiry — resume scoring, optimization, cover letters |
| Storage | Cloudinary — resume files (raw), avatars (image), any future video |
| Infra | Docker + docker-compose (Mongo + backend + frontend) |

## Folder structure

```
hirely-ai/
├── docker-compose.yml
├── backend/                 → NestJS GraphQL API
│   └── src/
│       ├── auth/            → JWT register/login, guards
│       ├── users/           → User schema + service
│       ├── resume/          → Upload, AI scoring, optimization, cover letters
│       ├── jobs/            → Job application tracker (CRUD)
│       ├── openai/          → OpenAI wrapper (all 3 AI features)
│       └── cloudinary/      → File upload service
└── frontend/                → Next.js app
    └── src/
        ├── app/              → Landing, /login, /register, /dashboard/*
        ├── components/       → UI kit + landing + dashboard components
        └── lib/              → Apollo client, auth helpers, GraphQL docs
```

---

## 1. Set up MongoDB

You have two options — pick whichever is easier for you:

### Option A — MongoDB Atlas (free, no install, recommended)
1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a **free M0 cluster** (any region close to you).
3. Under **Database Access**, create a user + password.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) for development.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hirely-ai
   ```
6. Paste that into `backend/.env` as `MONGODB_URI`.

### Option B — Run MongoDB locally via Docker (already wired into docker-compose)
Nothing to do — `docker-compose.yml` already spins up a `mongo:7` container and the
backend points at it automatically (`mongodb://mongodb:27017/hirely-ai`) when you run
everything with Docker. Skip straight to step 3 below.

---

## 2. Environment variables

**Backend** — copy the example and fill it in:
```bash
cd backend
cp .env.example .env
```
Fill in:
- `MONGODB_URI` — from step 1 (only needed if NOT using docker-compose's Mongo)
- `JWT_SECRET` — any long random string
- `GEMINI_API_KEY` — free, from https://aistudio.google.com/apikey (no credit card, no expiry — just click "Create API key")
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your
  Cloudinary dashboard (https://console.cloudinary.com) → these three values are on the
  homepage the moment you log in.

**Frontend** — copy the example:
```bash
cd frontend
cp .env.local.example .env.local
```
Defaults already point at `http://localhost:4000` — no changes needed for local dev.

---

## 3. Run it

### Fastest — Docker (recommended)
From the project root:
```bash
docker-compose up --build
```
- Frontend → http://localhost:3000
- Backend GraphQL playground → http://localhost:4000/graphql
- MongoDB → localhost:27017 (persisted in a Docker volume)

### Manual (without Docker)
Two terminals:
```bash
# Terminal 1 — backend
cd backend
npm install --legacy-peer-deps
npm run start:dev

# Terminal 2 — frontend
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Make sure `MONGODB_URI` in `backend/.env` points at either your Atlas cluster or
`mongodb://localhost:27017/hirely-ai` if you have Mongo installed natively.

---

## 4. How the AI features work

- **Score (0–100)**: on upload, the backend extracts text from the PDF/DOCX
  (`pdf-parse` / `mammoth`), sends it to Gemini with the target role + market, and
  stores a structured breakdown (strengths, weaknesses, ATS issues, keyword gaps).
- **Optimize**: rewrites the resume text following market-specific conventions
  (e.g. German *Lebenslauf* formatting vs. US 1-page ATS style vs. UK CV style).
- **Cover letter**: generates a ~300-word letter from the resume + a pasted job
  description, tailored to the target market's tone.

All three live in `backend/src/openai/openai.service.ts` (file/class name kept as
"openai" for the rest of the app, but it now calls Gemini's `gemini-2.0-flash`
model) — tweak the prompts there if you want different scoring criteria or tone.

**About the free tier:** Gemini's free tier has no card requirement and doesn't
expire like OpenAI's trial credits — it just has daily/per-minute rate limits
(fine for personal projects and demos). If you ever outgrow it, the same
`openai.service.ts` file can be swapped back to OpenAI or any other provider —
only that one file needs to change.

## 5. Design

Dark "obsidian & gold" luxury theme — glassmorphism panels, gold gradient accents,
Playfair Display for headings + Inter for body text, Framer Motion micro-animations
throughout (hover lifts, animated score ring, drag-and-drop board, staggered reveals).
Fully responsive: sidebar nav collapses to a bottom tab bar under `md` breakpoint.

## 6. What's stubbed / left for you to extend

- Email verification / password reset (auth currently is register/login only)
- Resume file preview (currently text-only view of extracted content)
- Multi-resume comparison view
- Payment/subscription gating (Stripe is already in your usual stack if you want it)

## 7. Deploying

- **Frontend** → Vercel (zero-config for Next.js)
- **Backend** → Render / Railway / a VPS with Docker
- **MongoDB** → Atlas (already production-ready)
- **Cloudinary** → no deploy needed, it's already hosted

Set the same environment variables on whichever platform you use, and update
`NEXT_PUBLIC_API_URL` / `FRONTEND_URL` to your real domains.
