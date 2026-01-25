# Theme System Specification (Light/Dark)

Este documento consolida a estratégia oficial de tema para o MVP, baseada no design claro em `specs/design/clean/explore_events_clean/code.html` e no tema escuro atual do app.

---

## 1) Diagnóstico fiel do estado atual

### Fonte de verdade do tema
- O tema é **hardcoded**: o `<html>` renderiza sempre com `className="dark"`.
- Não existe estado de tema, preferência de usuário, leitura de storage ou fallback do sistema.

### Origem das cores
- O projeto usa **Tailwind v4 + @theme** (não há `tailwind.config.*`).
- Tokens atuais são **semanticamente “dark”** (ex.: `--color-dark-bg`, `--color-dark-card`).
- `body` aplica `background-color: var(--color-dark-bg)` diretamente.

### Implicação
- Trocar `dark` → `light` no `<html>` **quebraria a UI**, pois não há tokens alternativos.
- Os tokens não são neutros; a modelagem atual impede troca de tema sem refatoração.

---

## 2) Objetivo

Permitir troca de tema **sem backend**, com **persistência em localStorage**, **sem Tailwind dark variants**, e com **controle via classe no `<html>`** (`light|dark`).

---

## 3) Decisões já tomadas

✅ Salvar tema apenas no `localStorage`  
✅ Classe no `<html>` como switch  
✅ Tokens CSS neutros como base  
✅ Sem backend  
✅ Sem `dark:` variants do Tailwind  

❌ Sem system theme por enquanto  
❌ Sem middleware  
❌ Sem cookies/JWT neste momento  

---

## 4) Plano incremental (implementação oficial)

### Fase A — Tornar CSS “theme-aware”

**Objetivo:** criar tokens neutros e mapeá-los para dark/light.  
**Ações:**
- Criar tokens neutros (ex.: `--color-background`, `--color-surface`, `--color-border`, `--color-text`).
- Mapear `:root` para **dark** (tema atual).
- Criar overrides para `html.light`.
- Manter Tailwind v4 sem `dark:` variants.

### Fase B — Remover dependência explícita de “dark”

**Objetivo:** usar tokens neutros em toda a UI.  
**Ações:**
- Substituir usos de `--color-dark-*` por tokens neutros.
- Ajustar `body` para usar `--color-background` e `--color-text`.

### Fase C — Estado de tema no Next (infra)

**Objetivo:** persistir e aplicar tema antes do paint.  
**Ações:**
- Criar `ThemeStorage` (localStorage).
- Criar `ThemeProvider`.
- Aplicar classe no `<html>` (`light|dark`) no layout.
- Evitar flash (FOUC).

### Fase D — Controle no Profile Settings (UX)

**Objetivo:** permitir o usuário escolher tema.  
**Ações:**
- Adicionar seletor simples (Light/Dark).
- Ao trocar, atualizar `localStorage` e `<html>` em tempo real.

### Fase E — Validação visual

**Objetivo:** garantir legibilidade e contraste.  
**Ações:**
- Validar em `/events`, `/events/[id]`, `/profile/[id]`.
- Checar contrastes, bordas e surfaces.

---

## 5) Design de referência

**Light theme base:** `specs/design/clean/explore_events_clean/code.html`  
**Dark theme base:** UI atual do app.

---

## 6) Critérios de aceite

- UI permite alternar tema sem recarregar a página.
- Preferência persiste em `localStorage`.
- Nenhum endpoint de backend é necessário.
- Sem Tailwind `dark:` variants.
- O tema atual escuro continua idêntico visualmente após a Fase B.
