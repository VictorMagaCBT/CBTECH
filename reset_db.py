from flask import Flask
from models import db
from sqlalchemy import text
import config

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

def reset_database():
    with app.app_context():
        # Drop all tables and types
        db.session.execute(text("""
            DROP TABLE IF EXISTS assistencia CASCADE;
            DROP TABLE IF EXISTS cliente CASCADE;
            DROP TYPE IF EXISTS estado_assistencia;
        """))
        db.session.commit()
        print("Database reset completed successfully!")

if __name__ == '__main__':
    reset_database()