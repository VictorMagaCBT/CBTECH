from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Cliente, Assistencia
from api.routes import api
import config
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)

print("DATABASE_URL:", config.DATABASE_URL)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": config.FRONTEND_URL}})

# Configure o PostgreSQL
app.config["SQLALCHEMY_DATABASE_URI"] = config.DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = config.SECRET_KEY

# Initialize the database
db.init_app(app)

# Teste de conexão com o banco de dados
with app.app_context():
    try:
        db.engine.connect()
        print("Conexão com o banco de dados bem-sucedida!")
    except Exception as e:
        print("Erro ao conectar ao banco de dados:", str(e))

# Register the API blueprint
app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def home():
    return jsonify({"message": "Bem-vindo à API da CBTECH"}), 200

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