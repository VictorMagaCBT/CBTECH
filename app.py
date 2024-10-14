from flask import Flask
from flask_cors import CORS
from models import db, Cliente, Assistencia
from api.routes import api
from dotenv import load_dotenv
import os

load_dotenv()  # Carrega as variáveis de ambiente do arquivo .env

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Configure o PostgreSQL
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
db.init_app(app)

# Register the API blueprint
app.register_blueprint(api, url_prefix='/api')

def populate_test_data():
    # Check if there are already clients in the database
    if Cliente.query.first() is None:
        # Create test clients
        clients = [
            Cliente(nome="João Silva", email="joao@email.com", nif="123456789", telefone="912345678", morada="Rua A, 123, Lisboa"),
            Cliente(nome="Maria Santos", email="maria@email.com", nif="987654321", telefone="923456789", morada="Avenida B, 456, Porto"),
            Cliente(nome="Pedro Ferreira", email="pedro@email.com", nif="456789123", telefone="934567890", morada="Praça C, 789, Braga"),
            Cliente(nome="Ana Rodrigues", email="ana@email.com", nif="789123456", telefone="945678901", morada="Largo D, 012, Faro")
        ]
        
        # Add clients to the database
        for client in clients:
            db.session.add(client)
        
        # Commit the changes
        db.session.commit()
        print("Test data populated successfully.")
    else:
        print("Database already contains data. Skipping population.")

# Create the database tables and populate with test data
with app.app_context():
    db.create_all()
    populate_test_data()

if __name__ == '__main__':
    app.run(debug=True)