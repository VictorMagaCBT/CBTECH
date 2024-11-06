from marshmallow import Schema, fields

class AssistenciaSchema(Schema):
    id = fields.Int(dump_only=True)
    marca = fields.Str(required=True)
    modelo = fields.Str(required=True)
    imei = fields.Str()  # Não mais obrigatório
    codigo_seguranca = fields.Str()  # Não mais obrigatório
    avaria = fields.Str(required=True)
    observacoes = fields.Str()
    tecnico = fields.Str(required=True)
    valor = fields.Float()  # Não mais obrigatório
    estado = fields.Str(required=True)
    cliente_id = fields.Int(required=True)
    data_entrada = fields.DateTime(dump_only=True)
    data_saida = fields.DateTime()

class ClienteSchema(Schema):
    id = fields.Int(dump_only=True)
    nome = fields.Str(required=True)
    email = fields.Email()  # Não mais obrigatório
    nif = fields.Str()  # Não mais obrigatório
    telefone = fields.Str(required=True)
    morada = fields.Str()  # Não mais obrigatório
    assistencias = fields.Nested(AssistenciaSchema, many=True, dump_only=True)

cliente_schema = ClienteSchema()
clientes_schema = ClienteSchema(many=True)
assistencia_schema = AssistenciaSchema()
assistencias_schema = AssistenciaSchema(many=True)