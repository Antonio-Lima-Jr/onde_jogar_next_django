# Short plan — final MVP adjustments

Based on: `specs/mvp.md`, `specs/checklist.md`, `specs/auth.md`, `specs/auth_jwt.md`.

## Goal
Close the MVP with a complete functional flow and consistent minimal UX, without expanding scope.

## Steps (suggested order)

1) **Manual end-to-end flow**
- Register → login → create event (with category) → list → detail → join/leave.
- Record issues found and fix only what is necessary.

2) **Permissions + UX alignment**
- Enforce `specs/auth.md` rules on profile/event/participation.
- Hide/disable invalid actions.
- Simple 403 message on the frontend.

3) **Public pages / SSR**
- Confirm anonymous access to `/events`, `/events/[id]`, `/profile/[id]`.
- Verify SEO/SSR on public pages.

4) **Demo data**
- Create fake data via admin to validate navigation and lists.

5) **Acceptance checklist**
- Mark items in `specs/checklist.md` according to the validations above.

## Out of scope
Any new feature not listed in `specs/mvp.md` must go through `mvp-scope-analyzer`.
