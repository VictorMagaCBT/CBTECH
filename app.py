from flask import Flask
from flask_cors import CORS
from models import db
from api.routes import api

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
db.init_app(app)

# Register the API blueprint
app.register_blueprint(api, url_prefix='/api')

# Create the database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)