import click
from flask.cli import with_appcontext
from models import db, Cliente, Assistencia, test_db_connection
from datetime import datetime

@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear existing data and create new tables."""
    db.drop_all()
    db.create_all()
    click.echo('Initialized the database.')

@click.command('seed-db')
@with_appcontext
def seed_db_command():
    """Seed the database with sample data."""
    # Add sample data here
    # Add sample clients
    cliente1 = Cliente(nome="João Silva", email="joao@example.com", nif="123456789", telefone="912345678", morada="Rua A, 123")
    cliente2 = Cliente(nome="Maria Santos", email="maria@example.com", nif="987654321", telefone="923456789", morada="Avenida B, 456")
    db.session.add(cliente1)
    db.session.add(cliente2)
    
    # Add sample assistências
    assistencia1 = Assistencia(marca="Samsung", modelo="Galaxy S21", imei="123456789012345", avaria="Ecrã partido", observacoes="Substituir ecrã", tecnico="Carlos", valor=150.00, cliente=cliente1, data_entrada=datetime.now())
    assistencia2 = Assistencia(marca="iPhone", modelo="12 Pro", imei="987654321098765", avaria="Bateria não carrega", observacoes="Substituir bateria", tecnico="Ana", valor=100.00, cliente=cliente2, data_entrada=datetime.now())
    db.session.add(assistencia1)
    db.session.add(assistencia2)
    
    db.session.commit()
    click.echo('Seeded the database.')

@click.command('test-db')
@with_appcontext
def test_db_command():
    """Test the database connection."""
    success = test_db_connection()
    if success:
        click.echo('Database connection test passed successfully.')
    else:
        click.echo('Database connection test failed.')

def register_commands(app):
    app.cli.add_command(init_db_command)
    app.cli.add_command(seed_db_command)
    app.cli.add_command(test_db_command)