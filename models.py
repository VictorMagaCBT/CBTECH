from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    nif = db.Column(db.String(20), unique=True, nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    morada = db.Column(db.String(200), nullable=False)
    assistencias = db.relationship('Assistencia', backref='cliente', lazy=True)

class Assistencia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    marca = db.Column(db.String(50), nullable=False)
    modelo = db.Column(db.String(50), nullable=False)
    imei = db.Column(db.String(20), nullable=False)
    avaria = db.Column(db.String(200), nullable=False)
    observacoes = db.Column(db.Text)
    tecnico = db.Column(db.String(100), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    data_entrada = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    data_saida = db.Column(db.DateTime)