import os
import subprocess
import sys
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


def run_command(command: str, cwd: str = "."):
    """Executa um comando no terminal e aguarda a conclusão."""
    try:
        console.print(f"[bold blue] Executando:[/] [cyan]{command}[/]")
        subprocess.run(command, shell=True, check=True, cwd=cwd)
    except subprocess.CalledProcessError as e:
        console.print(f"[bold red] Erro ao executar comando:[/] {e}")
    except KeyboardInterrupt:
        console.print("\n[yellow] Operação interrompida pelo usuário.[/]")


# --- Backend Commands ---


@backend_app.command("db-up")
def db_up():
    """Inicia o banco de dados via Docker."""
    run_command("docker compose up -d", cwd="infra")


@backend_app.command("db-down")
def db_down():
    """Para o banco de dados."""
    run_command("docker compose down", cwd="infra")


@backend_app.command("run")
def backend_run():
    """Inicia o servidor de desenvolvimento do Django."""
    # Garante que o banco está rodando antes
    db_up()
    run_command("python manage.py runserver 8971", cwd="apps/backend")


@backend_app.command("makemigrations")
def makemigrations(name: Optional[str] = typer.Option(None, help="Nome da migration")):
    """Cria novas migrations no Django."""
    cmd = "python manage.py makemigrations"
    if name:
        cmd += f" --name {name}"
    run_command(cmd, cwd="apps/backend")


@backend_app.command("migrate")
def migrate():
    """Aplica as migrations no banco de dados."""
    run_command("python manage.py migrate", cwd="apps/backend")


@backend_app.command("create-app")
def create_app(name: str = typer.Argument(..., help="Nome do novo app")):
    """Cria um novo app Django dentro da pasta apps/backend."""
    run_command(f"python manage.py startapp {name}", cwd="apps/backend")


# --- Frontend Commands ---


@frontend_app.command("install")
def frontend_install():
    """Instala as dependências do frontend (npm install)."""
    run_command("npm install", cwd="apps/frontend")


@frontend_app.command("dev")
def frontend_dev():
    """Inicia o servidor de desenvolvimento do Next.js."""
    run_command("npm run dev", cwd="apps/frontend")


@frontend_app.command("build")
def frontend_build():
    """Cria a build de produção do frontend."""
    run_command("npm run build", cwd="apps/frontend")


@frontend_app.command("prod")
def frontend_prod(skip_build: bool = typer.Option(False, "--skip-build", help="Pula o build antes de iniciar se já estiver pronto.")):
    """Executa o frontend em modo produção para ativar o cache do Next."""
    if not skip_build:
        frontend_build()
    run_command("NODE_ENV=production npm run start", cwd="apps/frontend")


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
                        "Rodar Banco (Docker Up)",
                        "Parar Banco (Docker Down)",
                        "Rodar Servidor (Runserver)",
                        "Criar Migrations (Makemigrations)",
                        "Aplicar Migrations (Migrate)",
                        "Criar Novo App",
                        "Voltar",
                    ],
                ).ask()

                if action == "Voltar":
                    break
                elif action == "Rodar Banco (Docker Up)":
                    db_up()
                elif action == "Parar Banco (Docker Down)":
                    db_down()
                elif action == "Rodar Servidor (Runserver)":
                    backend_run()
                elif action == "Criar Migrations (Makemigrations)":
                    name = questionary.text("Nome da migration (opcional):").ask()
                    makemigrations(name=name if name else None)
                elif action == "Aplicar Migrations (Migrate)":
                    migrate()
                elif action == "Criar Novo App":
                    name = questionary.text("Qual o nome do novo App?").ask()
                    if name:
                        create_app(name)

        elif choice == "Frontend (Next.js)":
            while True:
                action = questionary.select(
                    "Ações de Frontend:",
                    choices=[
                        "Instalar Dependências (npm install)",
                        "Rodar Dev (npm run dev)",
                        "Build Projeto",
                        "Executar Produção (npm run start)",
                        "Voltar",
                    ],
                ).ask()

                if action == "Voltar":
                    break
                elif action == "Instalar Dependências (npm install)":
                    frontend_install()
                elif action == "Rodar Dev (npm run dev)":
                    frontend_dev()
                elif action == "Build Projeto":
                    frontend_build()
                elif action == "Executar Produção (npm run start)":
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
