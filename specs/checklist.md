# ✅ Checklist técnico — MVP (alinhado a README.md, mvp.md, auth.md)

## 1) Escopo e documentação (specs/)
- [ ] `specs/mvp.md` continua refletindo apenas o escopo do MVP.
- [ ] `specs/auth.md` é a fonte oficial das regras de autorização.
- [ ] `specs/auth_jwt.md` descreve o fluxo JWT implementado.

## 2) Backend — autorização por objeto (apps/backend/)
- [ ] **Perfil**: update permitido somente ao próprio usuário.
- [ ] **Eventos**: update/delete permitido somente ao criador do evento.
- [ ] **Participações**: remover participação permitido ao próprio usuário **ou** ao criador do evento.
- [ ] **Admin**: superuser pode tudo (bypass).
- [ ] Respostas 403/404 coerentes e previsíveis.

## 3) Frontend — UX alinhada às permissões (apps/frontend/)
- [ ] Botões de **Edit Profile** somente para dono do perfil.
- [ ] Botões de **Follow** somente para outros usuários.
- [ ] Ações proibidas escondidas ou desabilitadas (sem quebrar UX).
- [ ] Tratamento claro de 403 (mensagem simples).

## 4) Páginas públicas (apps/frontend/)
- [ ] `/events` visível para anônimos.
- [ ] `/events/[id]` visível para anônimos.
- [ ] `/profile/[id]` visível para anônimos.
- [ ] SEO/SSR mantidos para páginas públicas.

## 5) Infra e CLI (infra/, scripts/)
- [ ] CLI intacto (sem regressões).
- [ ] README atualizado se alguma regra/fluxo mudar.

## 6) Critérios de aceite (global)
- [ ] Usuário autenticado **não** edita conteúdo de terceiros.
- [ ] Páginas públicas continuam acessíveis.
- [ ] UX não expõe ações inválidas.
- [ ] Nada fora do escopo do MVP é adicionado.

## 7) Melhorias sugeridas (não implementadas)
- [ ] Frontend com tratamento explícito de 403 (mensagem simples).
- [ ] Testes de permissão para update profile, update/delete event e leave.
