from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Cliente, Assistencia

app = Flask(__name__)
CORS(app)

# Configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
db.init_app(app)

# Create the database tables
with app.app_context():
    db.create_all()

@app.route('/clientes', methods=['GET', 'POST'])
def handle_clientes():
    if request.method == 'POST':
        data = request.json
        new_cliente = Cliente(
            nome=data['nome'],
            email=data['email'],
            nif=data['nif'],
            telefone=data['telefone'],
            morada=data['morada']
        )
        db.session.add(new_cliente)
        db.session.commit()
        return jsonify(new_cliente.serialize()), 201
    
    clientes = Cliente.query.all()
    return jsonify([cliente.serialize() for cliente in clientes])

@app.route('/assistencias', methods=['GET', 'POST'])
def handle_assistencias():
    if request.method == 'POST':
        data = request.json
        new_assistencia = Assistencia(
            marca=data['marca'],
            modelo=data['modelo'],
            imei=data['imei'],
            avaria=data['avaria'],
            observacoes=data['observacoes'],
            tecnico=data['tecnico'],
            valor=data['valor'],
            cliente_id=data['cliente_id']
        )
        db.session.add(new_assistencia)
        db.session.commit()
        return jsonify(new_assistencia.serialize()), 201
    
    assistencias = Assistencia.query.all()
    return jsonify([assistencia.serialize() for assistencia in assistencias])

if __name__ == '__main__':
    app.run(debug=True)