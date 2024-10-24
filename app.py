from flask import Flask, request, render_template
from flask_cors import CORS
from models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import register_commands
import config
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)


CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "https://cbtech.vercel.app",  # Domínio do Vercel
            "https://stunning-carnival-pvx6547vqqxcrqx-5173.app.github.dev"
            "https://cbtech.netlify.app"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
}, supports_credentials=True)


# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SECRET_KEY'] = config.SECRET_KEY
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = config.SQLALCHEMY_ENGINE_OPTIONS

# Inicializar o banco de dados
db.init_app(app)

# Registrar o blueprint da API
app.register_blueprint(api, url_prefix='/api')

# Configurar o admin
admin = setup_admin(app)

# Registrar comandos
register_commands(app)

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/api')
def api_root():
    return render_template('index.html')

@app.before_request
def log_request_info():
    logger.debug('Headers: %s', request.headers)
    logger.debug('Body: %s', request.get_data())

@app.after_request
def log_response_info(response):
    logger.debug('Response Status: %s', response.status)
    logger.debug('Response: %s', response.get_data())
    return response

if __name__ == '__main__':
    logger.info(f"Iniciando a aplicação em modo {'DEBUG' if config.DEBUG else 'PRODUÇÃO'}")
    logger.info(f"Porta: {config.PORT}")
    logger.info(f"Database URI: {config.SQLALCHEMY_DATABASE_URI}")
    app.run(debug=config.DEBUG, port=config.PORT)
