# Plano curto — ajustes finais do MVP

Baseado em: `specs/mvp.md`, `specs/checklist.md`, `specs/auth.md`, `specs/auth_jwt.md`.

## Objetivo
Fechar o MVP com fluxo completo funcional e UX mínima consistente, sem expandir o escopo.

## Passos (ordem sugerida)

1) **Fluxo completo manual (end-to-end)**
- Cadastro → login → criar evento → listar → detalhe → entrar/sair.
- Registrar problemas encontrados e corrigir apenas o necessário.

2) **Permissões + UX alinhadas**
- Garantir regras de `specs/auth.md` em profile/event/participation.
- Esconder/desabilitar ações inválidas.
- Mensagem simples para 403 no frontend.

3) **Páginas públicas / SSR**
- Confirmar acesso anônimo em `/events`, `/events/[id]`, `/profile/[id]`.
- Verificar SEO/SSR nas páginas públicas.

4) **Dados de demonstração**
- Criar fake data via admin para validar navegação e listagens.

5) **Checklist de aceite**
- Marcar itens de `specs/checklist.md` conforme validações acima.

## Fora do escopo
Qualquer feature nova não listada em `specs/mvp.md` deve passar pelo `mvp-scope-analyzer`.
