import os
from dotenv import load_dotenv

load_dotenv()

DEBUG = os.getenv('DEBUG', 'True') == 'True'
PORT = int(os.getenv('PORT', 5000))

SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.getenv('SECRET_KEY', 'cbtech')

SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
    "connect_args": {
        "sslmode": "require"
    }
}

print(f"DEBUG: {DEBUG}")
print(f"PORT: {PORT}")
print(f"SQLALCHEMY_DATABASE_URI: {SQLALCHEMY_DATABASE_URI}")