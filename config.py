import os
from dotenv import load_dotenv

load_dotenv()

# Extrair o endpoint ID da URL do banco de dados
db_url = os.getenv('DATABASE_URL')
if db_url:
    from urllib.parse import urlparse, parse_qs
    parsed_url = urlparse(db_url)
    endpoint_id = parsed_url.hostname.split('.')[0]
    
    # Adicionar o endpoint ID à URL
    query_params = parse_qs(parsed_url.query)
    query_params['options'] = f'endpoint={endpoint_id}'
    new_query = '&'.join(f'{k}={v[0]}' for k, v in query_params.items())
    
    DATABASE_URL = f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}?{new_query}"
else:
    DATABASE_URL = None

SECRET_KEY = os.getenv('SECRET_KEY', 'uma_chave_secreta_padrao')
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:5000')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
PORT = int(os.getenv('PORT', 5000))

# Imprimir as configurações para debug
print(f"DATABASE_URL: {DATABASE_URL}")
print(f"BACKEND_URL: {BACKEND_URL}")
print(f"FRONTEND_URL: {FRONTEND_URL}")
print(f"DEBUG: {DEBUG}")
print(f"PORT: {PORT}")