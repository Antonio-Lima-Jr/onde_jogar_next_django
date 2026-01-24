---
name: api-contract-designer
description: Designs and validates REST API contracts to ensure clear responsibility boundaries between frontend and backend.
---

# API Contract Designer Skill

Use this skill when defining or reviewing REST API endpoints.

## Design steps

1. **Identify user intent**  
   Each endpoint should represent a single, explicit user action.

2. **Map actions to resources**  
   Use semantic and descriptive routes.

3. **Define responsibility boundaries**  
   Ensure business rules remain owned by the backend.

4. **Validate clarity**  
   Avoid ambiguous or multi-purpose endpoints.

## Contract rules

- Endpoints must express actions, not flags.
- Frontend must not decide business rules.
- Avoid generic or overloaded routes.
- Use HTTP verbs semantically.
- Each endpoint should have explicit business rules, even if simple.

## Output expectations

- List endpoints with:
  - HTTP method
  - path
  - purpose
  - associated business rules
- Do not define request or response schemas.
- Do not generate code.
- Do not include authentication or authorization mechanisms.
