from marshmallow import Schema, fields

class ClienteSchema(Schema):
    id = fields.Int(dump_only=True)
    nome = fields.Str(required=True)
    email = fields.Email(required=True)
    nif = fields.Str(required=True)
    telefone = fields.Str(required=True)
    morada = fields.Str(required=True)

class AssistenciaSchema(Schema):
    id = fields.Int(dump_only=True)
    marca = fields.Str(required=True)
    modelo = fields.Str(required=True)
    imei = fields.Str(required=True)
    avaria = fields.Str(required=True)
    observacoes = fields.Str()
    tecnico = fields.Str(required=True)
    valor = fields.Float(required=True)
    cliente_id = fields.Int(required=True)
    data_entrada = fields.DateTime(dump_only=True)
    data_saida = fields.DateTime()