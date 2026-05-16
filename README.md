# DevFolio AI — Frontend

Next.js 15 web app for **DevFolio AI**: marketing site, authenticated dashboard, public portfolios, job tracker, AI studio, **Stripe billing**, and **admin console**.

Pairs with the [DevFolio AI API](../devfolio-ai-api/README.md) (FastAPI + PostgreSQL).

---

## Live demo

| | URL |
|---|-----|
| **App** | https://dev-folio-ai-frontend.vercel.app |
| **API** | https://devfolio-ai-api.onrender.com |
| **API docs** | https://devfolio-ai-api.onrender.com/docs |

---

## What recruiters should look at

### User-facing features

| Feature | Route | Notes |
|---------|-------|--------|
| Landing & marketing | `/` | Product overview |
| Register / Login | `/register`, `/login` | Email/password + Google |
| Forgot password | `/forgot-password`, `/reset-password` | Email link flow |
| Dashboard | `/dashboard` | Overview stats |
| Profile editor | `/dashboard/profile` | Bio, skills, avatar, resume |
| Public portfolio | `/portfolio/[slug]` | Shareable link |
| Job tracker | `/dashboard/tracker` | Applications by status |
| AI Studio | `/dashboard/ai` | Resume analyze + job match + history |
| **Billing / Pro** | `/dashboard/billing` | Stripe Checkout (test mode) |

### Admin (role `admin` only)

| Feature | Route | Notes |
|---------|-------|--------|
| Admin console | `/dashboard/admin` | JWT `role === "admin"` |
| Overview | Overview tab | User counts, **Pro subscribers**, estimated MRR |
| **Who paid for Pro** | Overview → table | Email, **payment amount**, Pro since, Stripe IDs |
| All users | Users tab | Plan badge, payment, filter **Pro only** |
| Platform data | Applications, Portfolios, AI tabs | Paginated, searchable |

> Admin uses the **same login** as normal users. Promote a user on the API: `python -m scripts.promote_admin email@example.com`, then log in again.

### Engineering highlights

- **Next.js 15** App Router, TypeScript, Tailwind CSS v4
- Typed API client with JWT refresh handling
- Client-side auth guards (`AuthGuard`, `AdminGuard`)
- Role-based redirect (admin → `/dashboard/admin` after login)
- Stripe: redirect to Checkout (no card data on our servers)

---

## Tech stack

- **Next.js 15** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS v4**
- **lucide-react** icons
- REST client → FastAPI backend

---

## Quick start (local)

### Prerequisites

- Node.js 20+
- Backend API running (see [backend README](../devfolio-ai-api/README.md))

### 1. Install

```bash
cd devfolio-ai-clientSide
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_V1_PREFIX=/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-web-client-id
```

On the **backend** `.env`, add CORS:

```env
CORS_ALLOW_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### 3. Run

```bash
npm run dev
```

Open http://localhost:3000

### 4. Production build (optional)

```bash
npm run build
npm start
```

---

## Deploy (Vercel)

1. Import this repo on Vercel.
2. Set environment variables:

   | Variable | Example |
   |----------|---------|
   | `NEXT_PUBLIC_API_URL` | `https://devfolio-ai-api.onrender.com` |
   | `NEXT_PUBLIC_API_V1_PREFIX` | `/api/v1` |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Same as backend Google Web client |

3. Deploy. Ensure backend `CORS_ALLOW_ORIGINS` includes your Vercel URL.

---

## Project structure

```text
src/
├── app/
│   ├── (auth)/              # login, register, forgot/reset password
│   ├── dashboard/
│   │   ├── page.tsx         # overview
│   │   ├── profile/
│   │   ├── tracker/
│   │   ├── ai/
│   │   ├── billing/         # Stripe upgrade UI
│   │   └── admin/           # admin console
│   └── portfolio/[slug]/    # public portfolio
├── components/
│   ├── ui/
│   ├── layout/              # Header, DashboardSidebar
│   └── features/auth/       # guards, Google sign-in
├── lib/api/                 # auth, profile, tracker, ai, billing, admin
├── context/AuthContext.tsx
└── types/
```

---

## Demo script (2 minutes for interviews)

1. Open **live app** → register or use your demo account.
2. Fill **Profile**, add a **job** in Tracker, run **AI Studio** analysis.
3. **Billing** → Upgrade with Stripe test card `4242 4242 4242 4242` → return as **Pro**.
4. Log in as **admin** → **Admin console** → show **Pro subscribers** table (email + payment).
5. Mention: JWT auth, webhooks, RBAC, PostgreSQL migrations — details in API README.

**Security note:** Admin credentials are not published on the login page. Admin demo can be shown on a call or via a short screen recording.

---

## Related repo

Backend API: [devfolio-ai-api](../devfolio-ai-api/README.md)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | ESLint |
