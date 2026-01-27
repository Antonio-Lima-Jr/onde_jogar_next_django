# Auth JWT (implementado)

## Estado atual
- **Backend**: SimpleJWT com access curto e refresh com rotação/blacklist.
- **Frontend**: Next atua como BFF e guarda refresh em cookie httpOnly.
- **Rotas**:
  - `POST /api/auth/login` (Next → Django `/api/auth/token/`)
  - `POST /api/auth/refresh` (Next → Django `/api/auth/token/refresh/`)
  - `POST /api/auth/logout` (Next → Django `/api/auth/logout/`)

## Fluxo resumido
- Login retorna `access` e cookie `refresh`.
- Requests usam `Authorization: Bearer <access>`.
- Refresh renova o `access` via cookie httpOnly.
- Logout invalida refresh (blacklist).
