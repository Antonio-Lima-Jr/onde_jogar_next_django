# Auth & Permissions (estado atual)

## Visão geral
- **Auth**: JWT (SimpleJWT) com access curto e refresh em cookie httpOnly via BFF no Next.
- **Permissão global**: `IsAuthenticatedOrReadOnly`.
- **Autorização por objeto**: **ativa** para perfil e eventos.
- **Admin**: superuser bypass em endpoints protegidos.

---

## Matriz de permissões (atual)

👤 Usuários  
Ação | Anônimo | Autenticado | Dono do perfil  
Ver perfil | ✅ | ✅ | ✅  
Criar usuário | ✅ | — | —  
Atualizar perfil | ❌ | ❌ | ✅  

Regra: `request.user == profile.user` (superuser bypass).

📅 Eventos  
Ação | Anônimo | Autenticado | Criador do evento  
Listar | ✅ | ✅ | ✅  
Ver | ✅ | ✅ | ✅  
Criar | ❌ | ✅ | ✅  
Atualizar | ❌ | ❌ | ✅  
Deletar | ❌ | ❌ | ✅  

Regra: `request.user == event.created_by` (superuser bypass).

🤝 Participação (join / leave)  
Ação | Anônimo | Autenticado | Dono da participação  
Entrar | ❌ | ✅ | ✅  
Sair | ❌ | ✅* | ✅  

*Sair: o próprio usuário **ou** o criador do evento (ou superuser).

---

## Melhorias sugeridas (não implementadas)
- **Frontend**: tratamento claro de 403 (mensagem simples).
- **Testes**: cobrir permissões de update profile, update/delete event e leave.
