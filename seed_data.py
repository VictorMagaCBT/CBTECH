from datetime import datetime, timedelta
from flask import Flask
from models import db, Cliente, Assistencia
import config
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Sample data
clientes_data = [
    {
        "nome": "João Silva",
        "email": "joao.silva@email.com",
        "nif": "123456789",
        "telefone": "912345678",
        "morada": "Rua das Flores, 123, Lisboa"
    },
    {
        "nome": "Maria Santos",
        "email": "maria.santos@email.com",
        "nif": "987654321",
        "telefone": "963852741",
        "morada": "Avenida da República, 45, Porto"
    },
    {
        "nome": "António Costa",
        "email": "antonio.costa@email.com",
        "nif": "456789123",
        "telefone": "936925814",
        "morada": "Rua do Comércio, 78, Braga"
    },
    {
        "nome": "Ana Ferreira",
        "email": "ana.ferreira@email.com",
        "nif": "789123456",
        "telefone": "917894562",
        "morada": "Praça da Liberdade, 15, Coimbra"
    },
    {
        "nome": "Pedro Oliveira",
        "email": "pedro.oliveira@email.com",
        "nif": "321654987",
        "telefone": "968741235",
        "morada": "Rua da Boavista, 234, Faro"
    },
    {
        "nome": "Sofia Martins",
        "email": "sofia.martins@email.com",
        "nif": "654987321",
        "telefone": "933698521",
        "morada": "Avenida Central, 56, Guimarães"
    },
    {
        "nome": "Rui Almeida",
        "email": "rui.almeida@email.com",
        "nif": "147258369",
        "telefone": "919876543",
        "morada": "Rua dos Clérigos, 89, Porto"
    },
    {
        "nome": "Carla Rodrigues",
        "email": "carla.rodrigues@email.com",
        "nif": "369258147",
        "telefone": "965432178",
        "morada": "Avenida da Liberdade, 167, Lisboa"
    },
    {
        "nome": "Miguel Sousa",
        "email": "miguel.sousa@email.com",
        "nif": "258369147",
        "telefone": "937891234",
        "morada": "Rua Augusta, 45, Lisboa"
    },
    {
        "nome": "Inês Santos",
        "email": "ines.santos@email.com",
        "nif": "741852963",
        "telefone": "912587436",
        "morada": "Rua de Santa Catarina, 123, Porto"
    }
]

# List of common phone brands and models
phones = [
    ("iPhone", ["13 Pro Max", "12", "11", "XR", "SE"]),
    ("Samsung", ["Galaxy S21", "Galaxy A52", "Galaxy Note 20", "Galaxy S20 FE"]),
    ("Xiaomi", ["Redmi Note 10", "Mi 11", "POCO X3", "Mi 10T"]),
    ("Huawei", ["P30 Pro", "P40 Lite", "Mate 20", "Nova 5T"]),
    ("OnePlus", ["9 Pro", "Nord", "8T", "7"])
]

# Common repair issues
avarias = [
    "Ecrã partido",
    "Bateria não carrega",
    "Botão home não funciona",
    "Câmera com defeito",
    "Não liga",
    "Sistema operativo com problemas",
    "Porta de carregamento danificada",
    "Alto-falante não funciona",
    "Bluetooth com falhas",
    "Wifi não conecta"
]

tecnicos = ["Luis Teixeira", "Patricia Oliveira"]

def generate_imei():
    return ''.join([str(random.randint(0, 9)) for _ in range(15)])

def generate_codigo_seguranca():
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])

def seed_database():
    with app.app_context():
        print("Starting database seeding...")
        
        # Create clients
        clientes = []
        for cliente_data in clientes_data:
            cliente = Cliente(**cliente_data)
            db.session.add(cliente)
            clientes.append(cliente)
        
        db.session.commit()
        print("Clients created successfully!")

        # Create service records
        for _ in range(20):
            # Random client
            cliente = random.choice(clientes)
            
            # Random phone
            marca, modelos = random.choice(phones)
            modelo = random.choice(modelos)
            
            # Random dates within the last 3 months
            data_entrada = datetime.now() - timedelta(days=random.randint(1, 90))
            data_saida = None
            if random.random() > 0.3:  # 70% chance of having a completion date
                data_saida = data_entrada + timedelta(days=random.randint(1, 14))
            
            # Random status based on data_saida
            if data_saida:
                estado = 'entregue' if random.random() > 0.3 else 'reparado'
            else:
                estado = 'orçamentado'
            
            assistencia = Assistencia(
                cliente_id=cliente.id,
                marca=marca,
                modelo=modelo,
                imei=generate_imei(),
                codigo_seguranca=generate_codigo_seguranca(),
                avaria=random.choice(avarias),
                observacoes=f"Cliente reportou o problema em {data_entrada.strftime('%d/%m/%Y')}",
                tecnico=random.choice(tecnicos),
                valor=random.uniform(30.0, 300.0),
                estado=estado,
                data_entrada=data_entrada,
                data_saida=data_saida
            )
            db.session.add(assistencia)
        
        db.session.commit()
        print("Service records created successfully!")
        print("Database seeding completed!")

if __name__ == '__main__':
    seed_database()