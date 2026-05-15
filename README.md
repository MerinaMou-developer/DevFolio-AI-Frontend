# DevFolio AI — Frontend

Next.js 15 App Router frontend for [DevFolio AI API](../devfolio-ai-api/README.md).

## Structure

```text
src/
├── app/                    # App Router (routes + metadata)
│   ├── (auth)/             # login, register
│   ├── dashboard/          # authenticated app
│   └── portfolio/[slug]/   # public portfolios
├── components/
│   ├── ui/                 # Button, Card, Input, …
│   ├── layout/             # Header, Footer
│   └── features/           # auth, tracker, …
├── lib/
│   ├── api/                # typed API client
│   ├── constants/
│   └── helpers/
├── hooks/
├── context/                # AuthProvider
├── styles/
└── types/
```

## Setup

1. Copy env file:

```bash
cp .env.example .env.local
```

2. Point at your API (default `http://localhost:8000`).

3. Add `http://localhost:3000` to backend `CORS_ALLOW_ORIGINS` in `devfolio-ai-api/.env`.

4. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Marketing landing page
- Email/password + Google sign-in
- Profile editor with avatar/resume upload
- Public portfolio pages (`/portfolio/{slug}`)
- Kanban job tracker
- AI Studio (resume analyze, job match, history)
