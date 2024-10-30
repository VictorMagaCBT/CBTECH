from flask import Blueprint, request, jsonify
from models import db, Cliente, Assistencia
from .schemas import cliente_schema, clientes_schema, assistencia_schema, assistencias_schema
from sqlalchemy import or_
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

@api.route('/clientes/<int:id>', methods=['GET'])
def get_cliente(id):
    try:
        cliente = Cliente.query.get_or_404(id)
        result = cliente_schema.dump(cliente)
        # Include assistências in the response
        result['assistencias'] = assistencias_schema.dump(cliente.assistencias)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Erro ao buscar cliente {id}: {str(e)}")
        return jsonify({"error": str(e)}), 404

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
    result = assistencias_schema.dump(assistencias)
    logger.info(f"Retornando {len(assistencias)} assistências")
    return jsonify(result)

# Novos endpoints de pesquisa
@api.route('/clientes/search', methods=['GET'])
def search_clientes():
    try:
        nome = request.args.get('nome', '')
        telefone = request.args.get('telefone', '')
        
        query = Cliente.query
        
        if nome:
            query = query.filter(Cliente.nome.ilike(f'%{nome}%'))
        if telefone:
            query = query.filter(Cliente.telefone.ilike(f'%{telefone}%'))
        
        clientes = query.all()
        logger.info(f"Pesquisa de clientes retornou {len(clientes)} resultados")
        return jsonify(clientes_schema.dump(clientes))
    except Exception as e:
        logger.error(f"Erro na pesquisa de clientes: {str(e)}")
        return jsonify({"error": str(e)}), 400

@api.route('/assistencias/search', methods=['GET'])
def search_assistencias():
    try:
        marca = request.args.get('marca', '')
        modelo = request.args.get('modelo', '')
        
        query = Assistencia.query
        
        if marca:
            query = query.filter(Assistencia.marca.ilike(f'%{marca}%'))
        if modelo:
            query = query.filter(Assistencia.modelo.ilike(f'%{modelo}%'))
        
        # Incluir informações do cliente relacionado
        query = query.join(Cliente)
        
        assistencias = query.all()
        logger.info(f"Pesquisa de assistências retornou {len(assistencias)} resultados")
        
        # Serializar os resultados incluindo dados do cliente
        resultados = []
        for assistencia in assistencias:
            dados = assistencia_schema.dump(assistencia)
            dados['cliente'] = {
                'id': assistencia.cliente.id,
                'nome': assistencia.cliente.nome,
                'email': assistencia.cliente.email,
                'telefone': assistencia.cliente.telefone
            }
            resultados.append(dados)
        
        return jsonify(resultados)
    except Exception as e:
        logger.error(f"Erro na pesquisa de assistências: {str(e)}")
        return jsonify({"error": str(e)}), 400