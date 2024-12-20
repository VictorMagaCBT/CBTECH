from flask import Flask, render_template, Response, request
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import register_commands
import config
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Updated CORS configuration
CORS(app, 
     resources={
         r"/api/*": {
             "origins": [
                 "http://localhost:5173",
                 "https://cbtechapp.netlify.app"
             ],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }
     },
     supports_credentials=True
)

# Rest of the configurations
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SECRET_KEY'] = config.SECRET_KEY
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = config.SQLALCHEMY_ENGINE_OPTIONS

@app.after_request
def after_request(response: Response) -> Response:
    return response

db.init_app(app)
migrate = Migrate(app, db)
app.register_blueprint(api, url_prefix='/api')
admin = setup_admin(app)
register_commands(app)

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/api')
def api_root():
    return render_template('index.html')

if __name__ == '__main__':
    logger.info(f"Starting application in {'DEBUG' if config.DEBUG else 'PRODUCTION'} mode")
    logger.info(f"Port: {config.PORT}")
    logger.info(f"Database URI: {config.SQLALCHEMY_DATABASE_URI}")
    app.run(debug=config.DEBUG, port=config.PORT)
