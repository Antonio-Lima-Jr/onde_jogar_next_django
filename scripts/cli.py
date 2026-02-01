import os
import subprocess
import sys
import shlex
from typing import Optional
import typer
import questionary
from rich.console import Console
from rich.panel import Panel

app = typer.Typer(help="CLI de gerenciamento do projeto Onde Jogar")
backend_app = typer.Typer(help="Comandos do Backend (Django)")
frontend_app = typer.Typer(help="Comandos do Frontend (Next.js)")

app.add_typer(backend_app, name="backend")
app.add_typer(frontend_app, name="frontend")

console = Console()

# --- Helpers ---


def run_command(command: str, cwd: str = ".", display_command: Optional[str] = None):
    """Executa um comando no terminal e aguarda a conclusão."""
    try:
        console.print(f"[bold blue] Executando:[/] [cyan]{display_command or command}[/]")
        subprocess.run(command, shell=True, check=True, cwd=cwd)
    except subprocess.CalledProcessError as e:
        console.print(f"[bold red] Erro ao executar comando:[/] {e}")
    except KeyboardInterrupt:
        console.print("\n[yellow] Operação interrompida pelo usuário.[/]")

def run_command_result(command: str, cwd: str = ".", display_command: Optional[str] = None) -> tuple[int, str, str]:
    """Executa um comando e retorna (returncode, stdout, stderr)."""
    console.print(f"[bold blue] Executando:[/] [cyan]{display_command or command}[/]")
    result = subprocess.run(
        command,
        shell=True,
        cwd=cwd,
        capture_output=True,
        text=True,
    )
    return result.returncode, result.stdout, result.stderr

# --- Backend Commands ---

def backend_exec(command: str, display_command: Optional[str] = None):
    """Executa um comando dentro do container backend."""
    # -T avoids TTY issues when piping output in non-interactive contexts.
    run_command(
        f"docker compose exec -T backend-sd sh -lc \"{command}\"",
        cwd="infra",
        display_command=display_command,
    )

def backend_exec_result(command: str, display_command: Optional[str] = None) -> tuple[int, str, str]:
    """Executa um comando no container backend e retorna (returncode, stdout, stderr)."""
    return run_command_result(
        f"docker compose exec -T backend-sd sh -lc \"{command}\"",
        cwd="infra",
        display_command=display_command,
    )


@backend_app.command("db-up")
def db_up():
    """Sobe todos os serviços via Docker."""
    run_command("docker compose up -d", cwd="infra")


@backend_app.command("db-down")
def db_down():
    """Para o banco de dados."""
    run_command("docker compose down", cwd="infra")


@backend_app.command("build-no-cache")
def build_no_cache():
    """Faz build sem cache de todos os serviços."""
    run_command("docker compose -f infra/docker-compose.yml build --no-cache")


@backend_app.command("run")
def backend_run():
    """Acompanha os logs do servidor backend (já iniciado via Docker)."""
    run_command("docker compose logs -f backend-sd", cwd="infra")


@backend_app.command("stop")
def backend_stop():
    """Para o container do servidor backend."""
    run_command("docker compose stop backend-sd", cwd="infra")


@backend_app.command("logs-backend")
def backend_logs():
    """Acompanha os logs do backend."""
    run_command("docker compose logs -f backend-sd", cwd="infra")


@backend_app.command("logs-worker")
def worker_logs():
    """Acompanha os logs do worker Celery."""
    run_command("docker compose logs -f celery-worker-sd-1", cwd="infra")


@backend_app.command("logs-beat")
def beat_logs():
    """Acompanha os logs do Celery Beat."""
    run_command("docker compose logs -f celery-beat-sd", cwd="infra")


@backend_app.command("logs-rabbitmq")
def rabbitmq_logs():
    """Acompanha os logs do RabbitMQ."""
    run_command("docker compose logs -f rabbitmq-sd", cwd="infra")


@backend_app.command("logs-db")
def db_logs():
    """Acompanha os logs do banco."""
    run_command("docker compose logs -f db-sd", cwd="infra")


@backend_app.command("makemigrations")
def makemigrations(name: Optional[str] = typer.Option(None, help="Nome da migration")):
    """Cria novas migrations no Django."""
    cmd = "python manage.py makemigrations"
    if name:
        cmd += f" --name {name}"
    backend_exec(cmd)


@backend_app.command("migrate")
def migrate():
    """Aplica as migrations no banco de dados."""
    backend_exec("python manage.py migrate")


@backend_app.command("create-app")
def create_app(name: str = typer.Argument(..., help="Nome do novo app")):
    """Cria um novo app Django dentro da pasta apps/backend."""
    backend_exec(f"python manage.py startapp {name}")


@backend_app.command("create-superuser")
def create_superuser():
    """Cria um superuser para acessar o Django Admin."""
    username = questionary.text("Username do superuser:", default="admin").ask()
    if not username:
        console.print("[bold red] Username é obrigatório.[/]")
        return

    email = questionary.text("Email do superuser:", default="admin@example.com").ask()
    if not email:
        console.print("[bold red] Email é obrigatório.[/]")
        return

    password = questionary.password("Senha do superuser:").ask()
    confirm = questionary.password("Confirme a senha:").ask()
    if not password or password != confirm:
        console.print("[bold red] Senhas não conferem.[/]")
        return

    env_command = (
        f"DJANGO_SUPERUSER_USERNAME={shlex.quote(username)} "
        f"DJANGO_SUPERUSER_EMAIL={shlex.quote(email)} "
        f"DJANGO_SUPERUSER_PASSWORD={shlex.quote(password)} "
        "python manage.py createsuperuser --noinput"
    )
    display_command = (
        f"docker compose exec -T backend-sd sh -lc "
        f"\"DJANGO_SUPERUSER_USERNAME={username} "
        f"DJANGO_SUPERUSER_EMAIL={email} "
        "DJANGO_SUPERUSER_PASSWORD=****** "
        "python manage.py createsuperuser --noinput\""
    )
    while True:
        code, _, stderr = backend_exec_result(env_command, display_command=display_command)
        if code == 0:
            return
        if "username is already taken" in (stderr or "").lower():
            console.print("[yellow]Esse username já existe. Escolha outro.[/]")
            username = questionary.text("Novo username do superuser:", default=username).ask()
            if not username:
                console.print("[bold red] Username é obrigatório.[/]")
                return
            env_command = (
                f"DJANGO_SUPERUSER_USERNAME={shlex.quote(username)} "
                f"DJANGO_SUPERUSER_EMAIL={shlex.quote(email)} "
                f"DJANGO_SUPERUSER_PASSWORD={shlex.quote(password)} "
                "python manage.py createsuperuser --noinput"
            )
            display_command = (
                f"docker compose exec -T backend-sd sh -lc "
                f"\"DJANGO_SUPERUSER_USERNAME={username} "
                f"DJANGO_SUPERUSER_EMAIL={email} "
                "DJANGO_SUPERUSER_PASSWORD=****** "
                "python manage.py createsuperuser --noinput\""
            )
            continue
        console.print(f"[bold red] Erro ao criar superuser:[/] {stderr.strip()}")
        return


# --- Frontend Commands ---


@frontend_app.command("install")
def frontend_install():
    """Instala as dependências do frontend (pnpm install)."""
    run_command("pnpm install", cwd="apps/frontend")


@frontend_app.command("dev")
def frontend_dev():
    """Inicia o servidor de desenvolvimento do Next.js."""
    run_command("pnpm dev", cwd="apps/frontend")

@frontend_app.command("debug")
def frontend_debug():
    """Inicia o servidor de desenvolvimento do Next.js em modo debug."""
    run_command("pnpm dev:debug", cwd="apps/frontend")


@frontend_app.command("build")
def frontend_build():
    """Cria a build de produção do frontend."""
    run_command("pnpm build", cwd="apps/frontend")


@frontend_app.command("prod")
def frontend_prod(skip_build: bool = typer.Option(False, "--skip-build", help="Pula o build antes de iniciar se já estiver pronto.")):
    """Executa o frontend em modo produção para ativar o cache do Next."""
    if not skip_build:
        frontend_build()
    run_command("NODE_ENV=production pnpm start", cwd="apps/frontend")


# --- Interactive Menu ---


def interactive_menu():
    """Menu interativo hierárquico."""
    console.print(
        Panel.fit("🚀 [bold green]Onde Jogar CLI[/]", subtitle="Modo Interativo")
    )

    while True:
        choice = questionary.select(
            "O que você deseja gerenciar?",
            choices=["Backend (Django / DB)", "Frontend (Next.js)", "Sair"],
        ).ask()

        if choice == "Sair":
            break

        if choice == "Backend (Django / DB)":
            while True:
                action = questionary.select(
                    "Ações de Backend:",
                    choices=[
                        "Execute All (Docker Up)",
                        "Parar Banco (Docker Down)",
                        "Build Sem Cache (Docker)",
                        "Acompanhar Logs Backend (Runserver)",
                        "Parar Servidor (Docker Stop)",
                        "Criar Migrations (Makemigrations)",
                        "Aplicar Migrations (Migrate)",
                        "Criar Superuser (Admin)",
                        "Criar Novo App",
                        "Ver Logs (Backend/Worker/Beat/Rabbit/DB)",
                        "Voltar",
                    ],
                ).ask()

                if action == "Voltar":
                    break
                elif action == "Execute All (Docker Up)":
                    db_up()
                elif action == "Parar Banco (Docker Down)":
                    db_down()
                elif action == "Build Sem Cache (Docker)":
                    build_no_cache()
                elif action == "Acompanhar Logs Backend (Runserver)":
                    backend_run()
                elif action == "Parar Servidor (Docker Stop)":
                    backend_stop()
                elif action == "Criar Migrations (Makemigrations)":
                    name = questionary.text("Nome da migration (opcional):").ask()
                    makemigrations(name=name if name else None)
                elif action == "Aplicar Migrations (Migrate)":
                    migrate()
                elif action == "Criar Superuser (Admin)":
                    create_superuser()
                elif action == "Criar Novo App":
                    name = questionary.text("Qual o nome do novo App?").ask()
                    if name:
                        create_app(name)
                elif action == "Ver Logs (Backend/Worker/Beat/Rabbit/DB)":
                    log_choice = questionary.select(
                        "Qual serviço você quer ver os logs?",
                        choices=[
                            "Backend",
                            "Worker",
                            "Beat",
                            "RabbitMQ",
                            "Banco",
                            "Voltar",
                        ],
                    ).ask()
                    if log_choice == "Backend":
                        backend_logs()
                    elif log_choice == "Worker":
                        worker_logs()
                    elif log_choice == "Beat":
                        beat_logs()
                    elif log_choice == "RabbitMQ":
                        rabbitmq_logs()
                    elif log_choice == "Banco":
                        db_logs()

        elif choice == "Frontend (Next.js)":
            while True:
                action = questionary.select(
                    "Ações de Frontend:",
                    choices=[
                        "Instalar Dependências (pnpm install)",
                        "Rodar Dev (pnpm dev)",
                        "Rodar Debug (pnpm dev:debug)",
                        "Build Projeto",
                        "Executar Produção (pnpm start)",
                        "Voltar",
                    ],
                ).ask()

                if action == "Voltar":
                    break
                elif action == "Instalar Dependências (pnpm install)":
                    frontend_install()
                elif action == "Rodar Dev (pnpm dev)":
                    frontend_dev()
                elif action == "Rodar Debug (pnpm dev:debug)":
                    frontend_debug()
                elif action == "Build Projeto":
                    frontend_build()
                elif action == "Executar Produção (pnpm start)":
                    frontend_prod()


@app.callback(invoke_without_command=True)
def main(ctx: typer.Context):
    """
    Se rodar sem comandos, abre o menu interativo.
    """
    if ctx.invoked_subcommand is None:
        interactive_menu()


if __name__ == "__main__":
    app()
