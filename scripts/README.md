# CLI de Gerenciamento do Projeto Onde Jogar

Este CLI foi desenvolvido para facilitar o gerenciamento e desenvolvimento do projeto **Onde Jogar**, automatizando tarefas comuns do backend (Django) e frontend (Next.js).

## Instalação

### Pré-requisitos

- Python 3.8+
- Ambiente virtual (recomendado)

### Instalação Automática

Execute o script de setup localizado na raiz do projeto:

```bash
./scripts/setup.sh
```

Este script irá:
- Criar um ambiente virtual (`.venv`) na raiz
- Instalar as dependências do CLI (`scripts/requirements.txt`)
- Instalar as dependências do backend (`apps/backend/requirements.txt`)

### Instalação Manual

1. Crie e ative um ambiente virtual:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Instale as dependências:

```bash
pip install -r scripts/requirements.txt &&
pip install -r apps/backend/requirements.txt
```

## Uso

O CLI pode ser usado de duas formas: **comandos diretos** ou **menu interativo**.

### Menu Interativo (Recomendado para Iniciantes)

Execute o CLI sem argumentos para abrir o menu interativo:

```bash
python scripts/cli.py
```

O menu é hierárquico e guiará você pelas opções disponíveis. Aqui está um exemplo de como navegar:

1. **Seleção Principal:**
   ```
   🚀 Onde Jogar CLI - Modo Interativo

   O que você deseja gerenciar?
   ❯ Backend (Django / DB)
     Frontend (Next.js)
     Sair
   ```

2. **Menu Backend:**
   ```
   Ações de Backend:
   ❯ Rodar Banco (Docker Up)
     Parar Banco (Docker Down)
     Rodar Servidor (Runserver)
     Criar Migrations (Makemigrations)
     Aplicar Migrations (Migrate)
     Criar Novo App
     Voltar
   ```

3. **Menu Frontend:**
   ```
   Ações de Frontend:
   ❯ Instalar Dependências (npm install)
     Rodar Dev (npm run dev)
     Build Projeto
     Voltar
   ```

Use as setas do teclado para navegar e Enter para selecionar. Para voltar, escolha "Voltar" ou pressione Ctrl+C.

### Comandos Diretos

Para usuários avançados, você pode executar comandos diretamente via linha de comando.

#### Backend (Django)

```bash
# Banco de dados
python scripts/cli.py backend db-up        # Inicia o banco via Docker
python scripts/cli.py backend db-down      # Para o banco

# Servidor
python scripts/cli.py backend run          # Inicia o servidor Django (também inicia o DB)

# Migrations
python scripts/cli.py backend makemigrations [--name NOME]  # Cria migrations
python scripts/cli.py backend migrate       # Aplica migrations

# Apps
python scripts/cli.py backend create-app NOME_APP  # Cria novo app Django
```

#### Frontend (Next.js)

```bash
python scripts/cli.py frontend install     # Instala dependências (npm install)
python scripts/cli.py frontend dev         # Inicia servidor de desenvolvimento
python scripts/cli.py frontend build       # Cria build de produção
python scripts/cli.py frontend prod        # Inicia o Next em modo produção (start)
```

### Exemplos de Uso Comum

#### Configuração Inicial

```bash
# 1. Setup do ambiente
./scripts/setup.sh

# 2. Iniciar banco
python scripts/cli.py backend db-up

# 3. Aplicar migrations
python scripts/cli.py backend migrate

# 4. Instalar dependências do frontend
python scripts/cli.py frontend install
```

#### Desenvolvimento Diário

```bash
# Iniciar tudo (backend + banco)
python scripts/cli.py backend run

# Em outro terminal, iniciar frontend
python scripts/cli.py frontend dev
```

#### Após Alterações no Modelo

```bash
# Criar migrations
python scripts/cli.py backend makemigrations

# Aplicar
python scripts/cli.py backend migrate
```

## Funcionalidades

- **Execução Segura**: Todos os comandos são executados com verificação de erros
- **Feedback Visual**: Usa Rich para output colorido e organizado
- **Interrupção Segura**: Ctrl+C interrompe operações sem quebrar o estado
- **Integração**: Comandos do backend garantem que o banco esteja rodando quando necessário
- **Modo Produção do Frontend**: O submenu do frontend agora inclui a opção de rodar `npm run start` com `NODE_ENV=production` (cache ativo e ISR funcionando). O comando `frontend prod` também está disponível para execução direta.

## Modo Produção Local do Frontend

1. Prepare o build com `python scripts/cli.py frontend build`.
2. Execute `python scripts/cli.py frontend prod` (ou use o menu interativo) para subir o Next.js no modo produção.
3. O Next expõe a porta `3000` e respeita os tempos de `revalidate`, permitindo validar ISR/caching antes de enviar para um host real.

Para testar o stack completo em containers, utilize `docker compose -f infra/docker-compose.prod.yml up --build`. Esse compose levanta o PostgreSQL local e o frontend containerizado com `apps/frontend/Dockerfile.prod`.

Caso precise de um ambiente rápido sem containers, o comando `frontend prod` usa o build local e dá o mesmo comportamento de cache que o deploy usaria.

## Estrutura do Código

O CLI é construído com:
- **Typer**: Framework para CLIs em Python
- **Questionary**: Para menus interativos
- **Rich**: Para output formatado
- **Subprocess**: Para execução de comandos do sistema

## Troubleshooting

- **Erro de dependências**: Certifique-se de ativar o ambiente virtual: `source .venv/bin/activate`
- **Docker não encontrado**: Instale Docker e Docker Compose
- **Portas ocupadas**: Verifique se as portas 8000 (Django) e 3000 (Next.js) estão livres
- **Permissões**: Execute `chmod +x scripts/setup.sh` se houver problemas com o script

Para mais informações sobre o projeto, consulte o [README.md](../README.md) da raiz.</content>
<parameter name="filePath">/home/dev/Projects/onde-jogar-2/scripts/README.md
