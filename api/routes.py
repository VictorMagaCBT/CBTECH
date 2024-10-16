from flask import Blueprint, request, jsonify
from models import db, Cliente, Assistencia
from .schemas import ClienteSchema, AssistenciaSchema
import logging

api = Blueprint('api', __name__)
logger = logging.getLogger(__name__)

@api.route('/clientes', methods=['GET', 'POST'])
def handle_clientes():
    if request.method == 'POST':
        logger.info("Recebida requisição POST para criar cliente")
        logger.debug(f"Dados recebidos: {request.json}")
        try:
            data = ClienteSchema().load(request.json)
            new_cliente = Cliente(**data)
            db.session.add(new_cliente)
            db.session.commit()
            logger.info(f"Cliente criado com sucesso: {new_cliente.id}")
            return jsonify(ClienteSchema().dump(new_cliente)), 201
        except Exception as e:
            logger.error(f"Erro ao criar cliente: {str(e)}")
            db.session.rollback()
            return jsonify({"error": str(e)}), 400
    
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