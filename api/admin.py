from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin import AdminIndexView
from models import db, Cliente, Assistencia
from flask import url_for

class MyAdminIndexView(AdminIndexView):
    def __init__(self, *args, **kwargs):
        super(MyAdminIndexView, self).__init__(*args, **kwargs)
        self.admin = None

    def _get_admin_base_template(self):
        return self.admin.base_template if self.admin else "admin/base.html"

class ClienteView(ModelView):
    column_list = ('id', 'nome', 'email', 'nif', 'telefone')
    column_searchable_list = ['nome', 'email', 'nif']
    column_filters = ['nome', 'email']
    create_modal = True
    edit_modal = True

    def __init__(self, *args, **kwargs):
        super(ClienteView, self).__init__(*args, **kwargs)
        self.static_folder = 'static'

    def is_accessible(self):
        return True

class AssistenciaView(ModelView):
    column_list = ('id', 'cliente', 'marca', 'modelo', 'data_entrada', 'data_saida', 'valor')
    column_searchable_list = ['cliente.nome', 'marca', 'modelo']
    column_filters = ['data_entrada', 'data_saida', 'valor']
    create_modal = True
    edit_modal = True

    def __init__(self, *args, **kwargs):
        super(AssistenciaView, self).__init__(*args, **kwargs)
        self.static_folder = 'static'

    def is_accessible(self):
        return True

def setup_admin(app):
    # Configurar o CSS personalizado antes de criar a instância do Admin
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    
    admin = Admin(
        app, 
        name='CBTECH Admin', 
        template_mode='bootstrap3',
        index_view=MyAdminIndexView(),
        base_template='admin/master.html'
    )

    # Adicionar as views
    admin.add_view(ClienteView(Cliente, db.session))
    admin.add_view(AssistenciaView(Assistencia, db.session))

    # Adicionar CSS personalizado
    @app.route('/admin/static/custom.css')
    def admin_custom_css():
        custom_css = """
            .navbar-default {
                background-color: #3498db !important;
                border-color: #2980b9 !important;
            }
            .navbar-default .navbar-brand,
            .navbar-default .navbar-nav > li > a {
                color: #ecf0f1 !important;
            }
            .navbar-default .navbar-brand:hover,
            .navbar-default .navbar-nav > li > a:hover {
                color: #ffffff !important;
                background-color: #2980b9 !important;
            }
            .btn-primary {
                background-color: #3498db !important;
                border-color: #2980b9 !important;
            }
            .btn-primary:hover {
                background-color: #2980b9 !important;
            }
        """
        return custom_css, 200, {'Content-Type': 'text/css'}

    # Injetar o CSS personalizado em todos os templates
    @app.before_request
    def before_request():
            app.jinja_env.globals['admin_custom_css'] = url_for('admin_custom_css')

    return admin