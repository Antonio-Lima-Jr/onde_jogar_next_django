# 🎯 MVP — frozen vision (1 sentence)

**Allow users to create public sports events and allow other people to find and participate in these events.**

Nothing beyond that.

---

## 🧩 MVP - FEATURES

I will split it into **6 blocks**, from the most structural to the most visible.

---

### 1️⃣ Project foundation (mandatory)

> Without this, nothing moves.
> There is no product here, only foundation.

#### Feature

**Project configured and running locally**

#### Actions to execute

- Create repository (monorepo)
- Initialize Git
- Define folder structure
- Officially define the stack in the README
- Bring up an empty project with no errors

📌 **Done criteria**

- Repository exists
- `git status` is clean
- Clear structure, even without functional code

---

### 2️⃣ Minimal infrastructure (local environment)

> MVP infrastructure is the minimum possible to run.
>

#### Feature

**Backend can talk to the database**

#### Actions to execute

- Add Docker Compose
- Bring up local PostgreSQL
- Define `.env`
- Ensure the backend connects to the database

📌 **Done criteria**

- Database starts
- Backend connects
- No data yet

---

### 3️⃣ Basic user authentication

> Without users, there is no event or participation.
>

#### Feature

**User can authenticate**

#### Actions to execute

- Create `users` app
- Define user model (custom or default)
- Configure login
- Configure signup
- Protect authenticated routes

📌 **Done criteria**

- User creates an account
- User logs in
- Token works

---

### 4️⃣ Event management (core of the product)

> This is where the real product is born.
>

#### Feature

**User creates and views events**

#### Actions to execute

- Create `events` app
- Define `Event` model
- Create endpoint to:
  - create event
  - list upcoming events
  - view event detail
- Validate basic data:
  - future date
  - slots > 0

📌 **Done criteria**

- Event appears in the list
- Event has its own page

---

### 5️⃣ Event participation

> This is the product’s “magic click”.
>

#### Feature

**User joins and leaves events**

#### Actions to execute

- Create `Participation` model
- Create endpoint to:
  - join event
  - leave event
- Business rules:
  - do not join twice
  - respect the slot limit

📌 **Done criteria**

- Participant list updates correctly
- Slot limits are respected

---

### 6️⃣ Public layer (SEO + utility)

> An MVP without a public layer validates nothing.
>

#### Feature

**Events are publicly visible**

#### Actions to execute

- Public events page
- Public event page
- Public profile page
- Server-side rendering

📌 **Done criteria**

- Logged-out user can see events
- URLs are shareable

---

## 🗂️ MVP broken into TECHNICAL DELIVERIES (correct order)

Now the most important part: **execution order**.

---

### 🧱 Phase 1 — Setup (Day 1)

- [ ]  Create repository
- [ ]  Define monorepo
- [ ]  Create a simple README
- [ ]  Bring up an empty project

👉 **No features yet.**

---

### 🧱 Phase 2 — Raw backend (Day 2)

- [ ]  Django initialized
- [ ]  Postgres connected
- [ ]  `/health` endpoint
- [ ]  Admin accessible

👉 Backend runs on its own.

---

### 🧱 Phase 3 — Domain (Day 3)

- [ ]  Create models:
  - User
  - Event
  - Participation
- [ ]  Run migrations
- [ ]  Admin configured

👉 Still no frontend.

---

### 🧱 Phase 4 — API (Day 4)

- [ ]  Event endpoints
- [ ]  Participation endpoints
- [ ]  Auth protecting actions

👉 Full API.

---

### 🧱 Phase 5 — Functional frontend (Days 5–6)

- [ ]  Event list
- [ ]  Event detail
- [ ]  Create event
- [ ]  Join / leave

👉 Simple UI, but functional.

---

### 🧱 Phase 6 — Final adjustments (Day 7)

- [ ]  Full flow tested
- [ ]  Basic UX adjustments
- [ ]  Fake data in admin
- [ ]  “Usable” MVP

---

## 🧠 Golden rule from now on

> Do not add anything that is not on this list.
> If a new idea comes up:

- run it through `mvp-scope-analyzer`
- it will probably become **POSTPONE**
