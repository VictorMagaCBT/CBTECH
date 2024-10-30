"""add codigo_seguranca and estado fields

Revision ID: add_new_fields_001
Create Date: 2024-02-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_new_fields_001'
down_revision = 'initial_schema_001'  # Point to the initial schema
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create the enum type
    op.execute("DO $$ BEGIN CREATE TYPE estado_assistencia AS ENUM ('orçamentado', 'reparado', 'entregue'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;")
    
    # Add codigo_seguranca column
    op.add_column('assistencia',
        sa.Column('codigo_seguranca', sa.String(50), nullable=False, server_default='')
    )
    
    # Add estado column
    op.add_column('assistencia',
        sa.Column('estado', 
                 sa.Enum('orçamentado', 'reparado', 'entregue', 
                        name='estado_assistencia', 
                        create_type=False),
                 nullable=False, 
                 server_default='orçamentado')
    )

def downgrade() -> None:
    # Drop the columns
    op.drop_column('assistencia', 'estado')
    op.drop_column('assistencia', 'codigo_seguranca')
    
    # Drop the enum type
    op.execute('DROP TYPE IF EXISTS estado_assistencia;')