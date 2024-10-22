from flask import Blueprint, request, jsonify
from models import db, Cliente, Assistencia
from .schemas import cliente_schema, clientes_schema, assistencia_schema, assistencias_schema
import logging

api = Blueprint('api', __name__)
logger = logging.getLogger(__name__)

@api.route('/clientes', methods=['GET', 'POST'])
def handle_clientes():
    logger.info("Clientes route accessed")
    if request.method == 'POST':
        logger.info("Recebida requisição POST para criar cliente")
        logger.debug(f"Dados recebidos: {request.json}")
        try:
            data = cliente_schema.load(request.json)
            new_cliente = Cliente(**data)
            db.session.add(new_cliente)
            db.session.commit()
            logger.info(f"Cliente criado com sucesso: {new_cliente.id}")
            return jsonify(cliente_schema.dump(new_cliente)), 201
        except Exception as e:
            logger.error(f"Erro ao criar cliente: {str(e)}")
            db.session.rollback()
            return jsonify({"error": str(e)}), 400
    
    clientes = Cliente.query.all()
    logger.info(f"Retornando {len(clientes)} clientes")
    return jsonify(clientes_schema.dump(clientes))

@api.route('/assistencias', methods=['GET', 'POST'])
def handle_assistencias():
    logger.info("Assistencias route accessed")
    if request.method == 'POST':
        logger.info("Recebida requisição POST para criar assistência")
        logger.debug(f"Dados recebidos: {request.json}")
        try:
            data = assistencia_schema.load(request.json)
            new_assistencia = Assistencia(**data)
            db.session.add(new_assistencia)
            db.session.commit()
            logger.info(f"Assistência criada com sucesso: {new_assistencia.id}")
            return jsonify(assistencia_schema.dump(new_assistencia)), 201
        except Exception as e:
            logger.error(f"Erro ao criar assistência: {str(e)}")
            db.session.rollback()
            return jsonify({"error": str(e)}), 400
    
    assistencias = Assistencia.query.all()
    logger.info(f"Retornando {len(assistencias)} assistências")
    return jsonify(assistencias_schema.dump(assistencias))