from flask import Blueprint, request, jsonify
from models import db, Cliente, Assistencia
from .schemas import cliente_schema, clientes_schema, assistencia_schema, assistencias_schema
from sqlalchemy import or_, and_
from datetime import datetime
import logging

api = Blueprint('api', __name__)
logger = logging.getLogger(__name__)

@api.route('/clientes/search', methods=['GET'])
def search_clientes():
    try:
        nome = request.args.get('nome', '')
        telefone = request.args.get('telefone', '')

        query = Cliente.query
        if nome or telefone:
            filters = []
            if nome:
                filters.append(Cliente.nome.ilike(f'%{nome}%'))
            if telefone:
                filters.append(Cliente.telefone.ilike(f'%{telefone}%'))
            query = query.filter(or_(*filters))

        clientes = query.all()
        return jsonify(clientes_schema.dump(clientes))

    except Exception as e:
        logger.error(f"Erro na pesquisa de clientes: {str(e)}")
        return jsonify({"error": str(e)}), 400
    
@api.route('/assistencias/search', methods=['GET'])
def search_assistencias():
    try:
        marca = request.args.get('marca', '')
        modelo = request.args.get('modelo', '')
        data_inicio = request.args.get('dataInicio')
        data_fim = request.args.get('dataFim')

        # Construir a query base
        query = Assistencia.query

        # Adicionar filtros se fornecidos
        filters = []
        if marca:
            filters.append(Assistencia.marca.ilike(f'%{marca}%'))
        if modelo:
            filters.append(Assistencia.modelo.ilike(f'%{modelo}%'))
        
        # Adicionar filtros de data se fornecidos
        if data_inicio:
            data_inicio = datetime.strptime(data_inicio, '%Y-%m-%d')
            filters.append(Assistencia.data_entrada >= data_inicio)
        if data_fim:
            data_fim = datetime.strptime(data_fim, '%Y-%m-%d')
            filters.append(Assistencia.data_entrada <= data_fim)

        if filters:
            query = query.filter(and_(*filters))

        assistencias = query.all()
        result = assistencias_schema.dump(assistencias)
        return jsonify(result)

    except Exception as e:
        logger.error(f"Erro na pesquisa de assistências: {str(e)}")
        return jsonify({"error": str(e)}), 400

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
    result = clientes_schema.dump(clientes)
    logger.info(f"Retornando {len(clientes)} clientes")
    return jsonify(result)

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

@api.route('/assistencias/<int:id>', methods=['GET', 'PUT'])
def handle_assistencia(id):
    try:
        assistencia = Assistencia.query.get_or_404(id)
        
        if request.method == 'PUT':
            logger.info(f"Recebida requisição PUT para atualizar assistência {id}")
            logger.debug(f"Dados recebidos: {request.json}")
            
            data = request.json
            
            # Atualizar campos
            assistencia.marca = data.get('marca', assistencia.marca)
            assistencia.modelo = data.get('modelo', assistencia.modelo)
            assistencia.imei = data.get('imei', assistencia.imei)
            assistencia.codigo_seguranca = data.get('codigo_seguranca', assistencia.codigo_seguranca)
            assistencia.avaria = data.get('avaria', assistencia.avaria)
            assistencia.observacoes = data.get('observacoes', assistencia.observacoes)
            assistencia.tecnico = data.get('tecnico', assistencia.tecnico)
            assistencia.valor = data.get('valor', assistencia.valor)
            assistencia.estado = data.get('estado', assistencia.estado)
            
            db.session.commit()
            logger.info(f"Assistência {id} atualizada com sucesso")
            
            # Retornar assistência atualizada com informações do cliente
            result = assistencia_schema.dump(assistencia)
            result['cliente'] = {
                'id': assistencia.cliente.id,
                'nome': assistencia.cliente.nome,
                'email': assistencia.cliente.email
            }
            return jsonify(result)
        
        # GET request
        result = assistencia_schema.dump(assistencia)
        result['cliente'] = {
            'id': assistencia.cliente.id,
            'nome': assistencia.cliente.nome,
            'email': assistencia.cliente.email
        }
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Erro ao processar assistência {id}: {str(e)}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 400