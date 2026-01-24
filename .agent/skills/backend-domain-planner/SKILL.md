---
name: backend-domain-planner
description: Plans backend domain structure by organizing entities into coherent Django apps aligned with business responsibilities.
---

# Backend Domain Planner Skill

Use this skill when defining or revising the backend domain structure.

## Planning steps

1. **Identify business contexts**  
   Group entities by clear business responsibility.

2. **Define app boundaries**  
   Ensure each Django app represents a single domain context.

3. **Assign ownership**  
   Each entity must belong to exactly one app.

4. **Check separation of concerns**  
   Ensure business rules are not coupled to transport or serialization layers.

## Design rules

- One app represents one business context.
- Avoid generic or catch-all apps such as `core` or `common`.
- Assume an API-first backend.
- Assume Django Admin is used as an internal operational tool.
- Business rules should live outside views and serializers.

## Output expectations

- List Django apps with:
  - app name
  - business responsibility
  - owned entities
- Do not define model fields or relationships.
- Do not define API endpoints.
