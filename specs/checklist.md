# ✅ Technical checklist — MVP (aligned to README.md, mvp.md, auth.md)

## 1) Scope and docs (specs/)
- [ ] `specs/mvp.md` reflects only the MVP scope.
- [ ] `specs/auth.md` is the source of truth for authorization rules.
- [ ] `specs/auth_jwt.md` describes the JWT flow in place.

## 2) Backend — object-level authorization (apps/backend/)
- [ ] **Profile**: update allowed only to the owner.
- [ ] **Events**: update/delete allowed only to the event owner.
- [ ] **Participations**: remove participation allowed to the user **or** the event owner.
- [ ] **Admin**: superuser can do anything (bypass).
- [ ] 403/404 responses are consistent and predictable.

## 3) Frontend — UX aligned with permissions (apps/frontend/)
- [ ] **Edit Profile** button only for the profile owner.
- [ ] **Follow** button only for other users.
- [ ] Forbidden actions hidden or disabled (no UX break).
- [ ] Clear 403 handling (simple message).

## 4) Public pages (apps/frontend/)
- [ ] `/events` visible to anonymous users.
- [ ] `/events/[id]` visible to anonymous users.
- [ ] `/profile/[id]` visible to anonymous users.
- [ ] SEO/SSR preserved for public pages.
- [ ] Explore shows events on the map.
- [ ] “Use my location” button works.
- [ ] Distance filter appears only when location is active.
- [ ] Geolocation is opt-in (not mandatory).
- [ ] Filters progress gradually (do not require everything at once).

## 5) Infra and CLI (infra/, scripts/)
- [ ] CLI intact (no regressions).
- [ ] README updated if any rule/flow changes.

## 6) Acceptance criteria (global)
- [ ] Authenticated user **cannot** edit other users' content.
- [ ] Public pages remain accessible.
- [ ] UX does not expose invalid actions.
- [ ] Nothing outside the MVP scope is added.
- [ ] Event can be created with category and map location.
