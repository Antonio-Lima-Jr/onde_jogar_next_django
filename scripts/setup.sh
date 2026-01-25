#!/bin/bash

# setup.sh - Prepara o ambiente de desenvolvimento para o projeto Onde Jogar

# Cores para o output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}== Configurando ambiente de desenvolvimento ==${NC}"

# 1. Criar o .venv na raiz se não existir
if [ ! -d ".venv" ]; then
    echo -e "${BLUE}Criando ambiente virtual (.venv) na raiz...${NC}"
    python3 -m venv .venv
else
    echo -e "${GREEN}.venv já existe na raiz.${NC}"
fi

# 2. Ativar o .venv
echo -e "${BLUE}Ativando ambiente virtual...${NC}"
source .venv/bin/activate

# 3. Atualizar pip
pip install --upgrade pip

# 4. Instalar dependências do CLI
echo -e "${BLUE}Instalando dependências do CLI (scripts/requirements.txt)...${NC}"
pip install -r scripts/requirements.txt

# 5. Instalar dependências do Backend
if [ -f "apps/backend/requirements.txt" ]; then
    echo -e "${BLUE}Instalando dependências do Backend (apps/backend/requirements.txt)...${NC}"
    pip install -r apps/backend/requirements.txt
else
    echo -e "${BLUE}Aviso: apps/backend/requirements.txt não encontrado.${NC}"
fi

echo -e "\n${GREEN}== Configuração concluída! ==${NC}"
echo -e "Para ativar o ambiente, execute:"
echo -e "${BLUE}source .venv/bin/activate${NC}"
