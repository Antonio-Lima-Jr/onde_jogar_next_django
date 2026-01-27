---
name: mvp-feature-planner
description: "Planejar features e ajustes do MVP do Onde Jogar com base nas specs existentes. Use quando precisar definir próximos passos, ajustar UX/fluxos ou criar/atualizar .md simples (ex.: checklist ou plano), garantindo consistência com specs/ e evitando overengineering ou expansão de escopo."
---

# Mvp Feature Planner

## Overview

Planejar o que entra no MVP, organizar ajustes em passos claros e manter tudo alinhado às specs atuais. Foco em planos curtos, pragmáticos e documentados em arquivos .md simples.

## Workflow (sempre que aplicável)

1. **Ler specs relevantes**
   - `specs/mvp.md` (escopo congelado)
   - `specs/checklist.md` (itens pendentes e critérios)
   - `specs/auth.md` + `specs/auth_jwt.md` (regras de auth)
   - `specs/theme.md` (decisões de tema, se o ajuste tocar UI)
   - Qualquer arquivo em `specs/design/` citado pelo pedido

2. **Mapear gaps vs. specs**
   - Transformar itens em ações objetivas e mínimas.
   - Checar se algo é “novo” e potencialmente fora de escopo.

3. **Validar escopo**
   - Se surgir ideia nova, usar o skill `mvp-scope-analyzer`.
   - Preferir ajustes locais a novas features.

4. **Produzir plano enxuto**
   - 3–6 itens no máximo, em ordem lógica.
   - Cada item deve ter resultado observável (“feito quando…”).

5. **Atualizar .md simples quando necessário**
   - Preferir `specs/checklist.md` para itens de aceite.
   - Criar `specs/plan.md` apenas se não houver lugar adequado.
   - Evitar novas pastas ou docs longos.

## Output esperado

- Plano curto em bullets com foco no MVP.
- Mudanças em `.md` objetivas, sem overengineering.
- Sinalizar claramente qualquer item “fora do escopo”.

## Guardrails

- Não adicionar features novas se não estiverem em `specs/mvp.md`.
- Não criar infra, automações ou scripts extras.
- Manter linguagem simples e direta, preferindo checklists.
- Não altere este arquivo
- Altere apenas a pasta specs com as novas features descrita
