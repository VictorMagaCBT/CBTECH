#!/usr/bin/env bash
# exit on error
set -o errexit

# Instalar dependências Python
pip install -r requirements.txt

# Inicializar o banco de dados (se necessário)
python -c "from app import app, db; app.app_context().push(); db.create_all()"