#!/usr/bin/env bash
# exit on error
set -o errexit

# Atualizar pip
python -m pip install --upgrade pip

# Instalar wheel primeiro
pip install wheel

# Instalar dependências Python
pip install -r requirements.txt

# Inicializar o banco de dados (se necessário)
python -c "from app import app, db; app.app_context().push(); db.create_all()"