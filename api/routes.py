from flask import Blueprint, request, jsonify
from models import db, Cliente, Assistencia
from .schemas import ClienteSchema, AssistenciaSchema

api = Blueprint('api', __name__)

@api.route('/clientes', methods=['GET', 'POST'])
def handle_clientes():
    if request.method == 'POST':
        data = ClienteSchema().load(request.json)
        new_cliente = Cliente(**data)
        db.session.add(new_cliente)
        db.session.commit()
        return jsonify(ClienteSchema().dump(new_cliente)), 201
    
    clientes = Cliente.query.all()
    return jsonify(ClienteSchema(many=True).dump(clientes))

@api.route('/clientes/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify(ClienteSchema().dump(cliente))
    
    elif request.method == 'PUT':
        data = ClienteSchema().load(request.json)
        for key, value in data.items():
            setattr(cliente, key, value)
        db.session.commit()
        return jsonify(ClienteSchema().dump(cliente))
    
    elif request.method == 'DELETE':
        db.session.delete(cliente)
        db.session.commit()
        return '', 204

@api.route('/assistencias', methods=['GET', 'POST'])
def handle_assistencias():
    if request.method == 'POST':
        data = AssistenciaSchema().load(request.json)
        new_assistencia = Assistencia(**data)
        db.session.add(new_assistencia)
        db.session.commit()
        return jsonify(AssistenciaSchema().dump(new_assistencia)), 201
    
    assistencias = Assistencia.query.all()
    return jsonify(AssistenciaSchema(many=True).dump(assistencias))

@api.route('/assistencias/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_assistencia(id):
    assistencia = Assistencia.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify(AssistenciaSchema().dump(assistencia))
    
    elif request.method == 'PUT':
        data = AssistenciaSchema().load(request.json)
        for key, value in data.items():
            setattr(assistencia, key, value)
        db.session.commit()
        return jsonify(AssistenciaSchema().dump(assistencia))
    
    elif request.method == 'DELETE':
        db.session.delete(assistencia)
        db.session.commit()
        return '', 204