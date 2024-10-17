import click
from flask.cli import with_appcontext
from models import db, Cliente, Assistencia

@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    db.drop_all()
    db.create_all()
    click.echo('Initialized the database.')

@click.command('seed-db')
@with_appcontext
def seed_db_command():
    """Add sample data to the database."""
    # Adicionar alguns clientes de exemplo
    cliente1 = Cliente(nome='João Silva', email='joao@example.com', nif='123456789', telefone='912345678', morada='Rua A, 123')
    cliente2 = Cliente(nome='Maria Santos', email='maria@example.com', nif='987654321', telefone='923456789', morada='Avenida B, 456')
    db.session.add(cliente1)
    db.session.add(cliente2)

    # Adicionar algumas assistências de exemplo
    assistencia1 = Assistencia(marca='Samsung', modelo='Galaxy S20', imei='123456789012345', avaria='Ecrã partido', tecnico='Carlos', valor=150.00, cliente=cliente1)
    assistencia2 = Assistencia(marca='iPhone', modelo='12 Pro', imei='987654321098765', avaria='Bateria não carrega', tecnico='Ana', valor=80.00, cliente=cliente2)
    db.session.add(assistencia1)
    db.session.add(assistencia2)

    db.session.commit()
    click.echo('Added sample data to the database.')

def register_commands(app):
    app.cli.add_command(init_db_command)
    app.cli.add_command(seed_db_command)