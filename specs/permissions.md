# Auth & Permissions (current state)

## Overview
- **Auth**: JWT (SimpleJWT) with short access and refresh in httpOnly cookie via Next BFF.
- **Global permission**: `IsAuthenticatedOrReadOnly`.
- **Object-level authorization**: **enabled** for profile and events.
- **Admin**: superuser bypass on protected endpoints.

---

## Permission matrix (current)

👤 Users  
Action | Anonymous | Authenticated | Profile owner  
View profile | ✅ | ✅ | ✅  
Create user | ✅ | — | —  
Update profile | ❌ | ❌ | ✅  

Rule: `request.user == profile.user` (superuser bypass).

📅 Events  
Action | Anonymous | Authenticated | Event owner  
List | ✅ | ✅ | ✅  
View | ✅ | ✅ | ✅  
Create | ❌ | ✅ | ✅  
Update | ❌ | ❌ | ✅  
Delete | ❌ | ❌ | ✅  

Rule: `request.user == event.created_by` (superuser bypass).

🏷️ Event categories  
Action | Anonymous | Authenticated  
List categories | ✅ | ✅  

🤝 Participation (join / leave)  
Action | Anonymous | Authenticated | Participation owner  
Join | ❌ | ✅ | ✅  
Leave | ❌ | ✅* | ✅  

*Leave: the user **or** the event owner (or superuser).

---

## Suggested improvements (not implemented)
- **Frontend**: clear 403 handling (simple message).
- **Tests**: cover update profile, update/delete event, and leave permissions.
