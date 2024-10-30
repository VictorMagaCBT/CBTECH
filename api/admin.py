from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin import AdminIndexView
from models import db, Cliente, Assistencia
from flask import url_for, Response

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
    column_list = ('id', 'cliente', 'marca', 'modelo', 'imei', 'codigo_seguranca', 'estado', 'data_entrada', 'data_saida', 'valor')
    column_searchable_list = ['cliente.nome', 'marca', 'modelo', 'imei', 'codigo_seguranca']
    column_filters = ['data_entrada', 'data_saida', 'valor', 'estado']
    column_sortable_list = ['data_entrada', 'data_saida', 'valor', 'estado']
    form_columns = ('cliente', 'marca', 'modelo', 'imei', 'codigo_seguranca', 'avaria', 'observacoes', 'tecnico', 'valor', 'estado', 'data_saida')
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
    def admin_custom_css() -> Response:
        """
        Route handler that serves custom CSS for the admin interface.
        This function is used by Flask's routing system and referenced in templates.
        
        Returns:
            Response: A response containing the CSS content with appropriate headers
        """
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
        return Response(custom_css, mimetype='text/css')

    # Injetar o CSS personalizado em todos os templates
    @app.before_request
    def before_request() -> None:
        """
        Before request handler that adds the custom CSS URL to the template globals.
        This function is automatically called by Flask before each request.
        """
        app.jinja_env.globals['admin_custom_css'] = url_for('admin_custom_css')

    return admin