from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import register_commands
import config
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Permitir todas as origens para teste

# Configure o PostgreSQL
app.config["SQLALCHEMY_DATABASE_URI"] = config.DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = config.SECRET_KEY

# Initialize the database
db.init_app(app)

# Register the API blueprint
app.register_blueprint(api, url_prefix='/api')

# Setup admin
setup_admin(app)

# Register commands
register_commands(app)

@app.route('/')
def index():
    return jsonify({
        "message": "Bem-vindo à API da CBTECH",
        "endpoints": {
            "admin": "/admin",
            "api": "/api",
            "clientes": "/api/clientes",
            "assistencias": "/api/assistencias"
        }
    })

@app.before_request
def log_request_info():
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data())

@app.after_request
def log_response_info(response):
    app.logger.debug('Response Status: %s', response.status)
    app.logger.debug('Response: %s', response.get_data())
    return response

if __name__ == '__main__':
    app.run(debug=config.DEBUG, port=config.PORT, host='0.0.0.0')