# Onde Jogar

**Onde Jogar** is a platform for discovering and participating in local sports events.

The goal of the product is to allow anyone to create a public sports event and for other people to find and join these events in a simple way, without relying on closed groups or scattered communication.

---

## 🎯 Product Vision

> “I want to play today. Where is there a game?”

Onde Jogar solves the problem of discovering and organizing amateur sports games by offering a public, simple, and accessible space for creating and participating in events.

---

## 🧩 MVP Scope

The MVP is intentionally simple and focused only on the core value of the product.

### Included features

- User registration and authentication
- Creation of public sports events
- Listing of upcoming events
- Viewing event details
- Event participation (join and leave)
- Public viewing of events and profiles

### Out of MVP scope

- Chat
- Notifications
- Payments
- Automatic geolocation
- Maps
- Social feed
- Reviews or rankings
- Recommendation systems

Any functionality outside this list must go through explicit validation before being added.

---

## 🏗️ Architecture

This project uses an **API-first** architecture, organized as a **monorepo**.

### Main stack

- **Frontend**: Next.js (App Router, SEO-first)
- **Backend**: Django + Django REST Framework
- **Database**: PostgreSQL
- **Local infrastructure**: Docker Compose
- **Monorepo management**: pnpm + Turbo
- **AI-assisted planning**: Google Antigravity

---

## 📁 Repository Structure

**Exact monorepo structure** for the **Onde Jogar** MVP, already designed for:

- Django + Next
- clean monorepo
- growth without refactoring

```txt
onde-jogar/
├── .agent/                          # Antigravity workspace
│   └── skills/
│       ├── mvp-scope-analyzer/
│       │   └── skill.md
│       │
│       ├── backend-domain-planner/
│       │   └── skill.md
│       │
│       └── api-contract-designer/
│           └── skill.md
│
├── apps/
│   ├── backend/                     # Django Backend (API + Admin)
│   │   ├── config/              # Django Project
│   │   │   ├── __init__.py
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   ├── asgi.py
│   │   │   └── wsgi.py
│   │   │
│   │   ├── users/               # Users app
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── services.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── migrations/
│   │   │
│   │   ├── events/              # Events app
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── services.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── migrations/
│   │   │
│   │   ├── manage.py
│   │   ├── requirements.txt
│   │   └── .env.example
│   │
│   ├── frontend/                     # Next.js Frontend
│   │   ├── app/
│   │   │   ├── page.tsx          # Landing
│   │   │   ├── events/
│   │   │   │   ├── page.tsx      # Public list
│   │   │   │   └── [id]/page.tsx # Event detail
│   │   │   ├── users/
│   │   │   │   └── [username]/page.tsx
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   │
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   │
│   │   ├── public/
│   │   ├── styles/
│   │   └── package.json
│   │
├── infra/                       # Local infrastructure
│   ├── docker-compose.yml
│   └── README.md
│
├── specs/                       # specs
│   └── mvp.md                   # Frozen MVP description
│
├── .env                         # Local variables
├── .gitignore
├── package.json                 # Root (pnpm/turbo)
├── pnpm-workspace.yaml
├── turbo.json
└── README.md                    # Project overview
