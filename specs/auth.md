Perfeito. Vamos fazer isso de forma bem explícita, porque esse mapa vira referência técnica do projeto.

Vou dividir em duas matrizes:

🔴 Permission Matrix ATUAL (como o sistema realmente funciona hoje)

🟢 Permission Matrix IDEAL (para quando decidir endurecer regras)

Sem julgamento — só realidade → evolução.

🔴 Permission Matrix — ATUAL (estado real do sistema)
Premissas atuais

Auth: Token DRF

Permissão global: IsAuthenticatedOrReadOnly

❌ Sem autorização por objeto

❌ Frontend não garante segurança (apenas UX)

👤 Usuários
Ação	Anônimo	Autenticado	Dono do perfil
Ver perfil	✅	✅	✅
Criar usuário (register)	✅	—	—
Atualizar perfil	❌	⚠️ SIM (qualquer perfil)	⚠️ SIM
Deletar perfil	❌	⚠️ SIM (se endpoint existir)	⚠️ SIM

⚠️ Problema atual
Qualquer usuário autenticado pode atualizar qualquer perfil, pois não existe checagem de ownership.

📅 Eventos
Ação	Anônimo	Autenticado	Criador do evento
Listar eventos	✅	✅	✅
Ver evento	✅	✅	✅
Criar evento	❌	✅	✅
Atualizar evento	❌	⚠️ SIM (qualquer evento)	⚠️ SIM
Deletar evento	❌	⚠️ SIM (qualquer evento)	⚠️ SIM

⚠️ Problema atual
Não existe distinção entre criador e outros usuários autenticados.

🤝 Participação (join / leave)
Ação	Anônimo	Autenticado	Dono da participação
Entrar em evento	❌	✅	✅
Sair de evento	❌	⚠️ SIM (qualquer participação)	⚠️ SIM

⚠️ Se o endpoint aceitar participation_id, qualquer usuário autenticado pode remover participação de outro.

🧠 Resumo do estado atual

✅ Identidade conhecida

❌ Ownership ignorado

❌ Autorização fraca

✅ Funciona para MVP fechado

❌ Não seguro para ambiente aberto

🟢 Permission Matrix — IDEAL (evolução correta, sem exagero)

Agora, como deveria ficar quando você decidir ajustar — sem mudar auth, sem JWT, sem microserviços.

👤 Usuários (Ideal)
Ação	Anônimo	Autenticado	Dono do perfil
Ver perfil	✅	✅	✅
Criar usuário	✅	—	—
Atualizar perfil	❌	❌	✅
Deletar perfil	❌	❌	✅

📌 Regra:

request.user == profile.user

📅 Eventos (Ideal)
Ação	Anônimo	Autenticado	Criador do evento
Listar eventos	✅	✅	✅
Ver evento	✅	✅	✅
Criar evento	❌	✅	✅
Atualizar evento	❌	❌	✅
Deletar evento	❌	❌	✅

📌 Regra:

request.user == event.created_by

🤝 Participação (Ideal)
Ação	Anônimo	Autenticado	Dono da participação
Entrar em evento	❌	✅	✅
Sair de evento	❌	❌	✅

📌 Regra:

request.user == participation.user

🔐 Permissões ideais no código (modelo mental)
1️⃣ Permissão global
IsAuthenticatedOrReadOnly

2️⃣ Permissão por objeto (exemplo)
class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user

🧠 Diferença conceitual importante
Conceito	Hoje	Ideal
Autenticação	✅	✅
Autorização global	✅	✅
Autorização por objeto	❌	✅
Confiança no frontend	⚠️	❌
Segurança real	❌	✅
🎯 Estratégia recomendada (sem pressa)

👉 Não precisa mudar agora, porque:

MVP já funciona

Usuários ainda são poucos

Complexidade aumenta

👉 Mas agora está mapeado, documentado e consciente.

📌 Regra de ouro (guarde isso)

Auth responde “quem é você”
Permission responde “o que você pode fazer com isso”

Hoje você resolveu o primeiro.
O segundo está claramente desenhado.

---

## ✅ Plano de Mudanças (baseado no levantamento acima)

Objetivo: evoluir de **“autenticação sem ownership”** para **“autenticação + autorização por objeto”** sem mudar o mecanismo de auth (continua Token DRF).

### Escopo
- **Backend**: adicionar autorização por objeto para usuários, eventos e participações.
- **Frontend**: ajustar UX para lidar com 403/404 e evitar ações inválidas.

### Fora do escopo (por enquanto)
- Trocar Token por JWT.
- Multi‑tenancy ou ACL avançada.
- Cache de auth/sessão.

### Decisões pendentes (validar antes de implementar)
1. **Perfil**: permitir update apenas do próprio usuário — **SIM**.
2. **Eventos**: update/delete apenas para criador — **SIM**.
3. **Participações**: remover participação — **o próprio usuário ou o criador do evento**.
4. **Admin**: superuser pode tudo — **SIM**.

---

## 📌 Plano por fases (incremental)

### Fase 1 — Restrições mínimas (ownership)
**Backend**
- Implementar permissões por objeto para:
  - **UserDetailView** → apenas o dono pode atualizar.
  - **EventViewSet** → apenas o criador pode editar/deletar.
  - **Participation** → apenas o usuário pode sair do evento.
- Garantir que `join` e `leave` sempre usem `request.user`.

**Frontend**
- Em ações protegidas, tratar `403` com mensagem clara (“sem permissão”).
- Manter UX atual, mas bloquear botões quando o usuário não for dono (opcional).

✅ Resultado esperado: segurança real sem mudar o modelo de autenticação.

---

### Fase 2 — Consolidação e validação
- Adicionar testes de permissão (unitários ou API) para:
  - update profile
  - update/delete event
  - leave event
- Revisar logs de produção para detectar `403` frequentes.

---

### Fase 3 — Refinamento UX
- Mostrar mensagens específicas de “evento de outro usuário”.
- Ajustar navegação (ex: esconder “edit profile” quando não for dono).

---

## ✅ Critérios de aceite
- Usuário autenticado **não consegue** editar perfis de terceiros.
- Usuário autenticado **não consegue** editar/deletar eventos de terceiros.
- Participações só podem ser removidas pelo próprio usuário.
- Rotas públicas continuam públicas (listagem, detalhe).
- Frontend lida com `403` sem quebrar UX.
