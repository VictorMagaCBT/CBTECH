from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from models import db, Cliente, Assistencia

admin = Admin(name='Painel de Administração', template_mode='bootstrap3')

class ClienteView(ModelView):
    column_list = ('id', 'nome', 'email', 'nif', 'telefone')
    column_searchable_list = ['nome', 'email', 'nif']
    column_filters = ['nome', 'email']

class AssistenciaView(ModelView):
    column_list = ('id', 'cliente', 'marca', 'modelo', 'data_entrada', 'data_saida', 'valor')
    column_searchable_list = ['cliente.nome', 'marca', 'modelo']
    column_filters = ['data_entrada', 'data_saida', 'valor']

def setup_admin(app):
    admin.init_app(app)
    admin.add_view(ClienteView(Cliente, db.session))
    admin.add_view(AssistenciaView(Assistencia, db.session))