from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text, Enum
from datetime import datetime
import config

db = SQLAlchemy()

engine = create_engine(config.SQLALCHEMY_DATABASE_URI, **config.SQLALCHEMY_ENGINE_OPTIONS)

class Cliente(db.Model):
    __tablename__ = 'cliente'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    nif = db.Column(db.String(20), unique=True, nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    morada = db.Column(db.String(200), nullable=False)
    assistencias = db.relationship('Assistencia', backref='cliente', lazy=True)

class Assistencia(db.Model):
    __tablename__ = 'assistencia'
    id = db.Column(db.Integer, primary_key=True)
    marca = db.Column(db.String(50), nullable=False)
    modelo = db.Column(db.String(50), nullable=False)
    imei = db.Column(db.String(20), nullable=False)
    codigo_seguranca = db.Column(db.String(50), nullable=False)
    avaria = db.Column(db.String(200), nullable=False)
    observacoes = db.Column(db.Text)
    tecnico = db.Column(db.String(100), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    estado = db.Column(Enum('orçamentado', 'reparado', 'entregue', name='estado_assistencia'), nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    data_entrada = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    data_saida = db.Column(db.DateTime)

# Função para testar a conexão
def test_db_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            if result.scalar() == 1:
                print("Conexão com o banco de dados bem-sucedida!")
                return True
            else:
                print("Conexão estabelecida, mas o teste falhou.")
                return False
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {str(e)}")
        return False