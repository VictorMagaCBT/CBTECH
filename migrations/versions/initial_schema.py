"""initial schema

Revision ID: initial_schema_001
Create Date: 2024-02-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'initial_schema_001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create cliente table
    op.create_table('cliente',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nome', sa.String(100), nullable=False),
        sa.Column('email', sa.String(120), unique=True, nullable=False),
        sa.Column('nif', sa.String(20), unique=True, nullable=False),
        sa.Column('telefone', sa.String(20), nullable=False),
        sa.Column('morada', sa.String(200), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create assistencia table (without codigo_seguranca and estado initially)
    op.create_table('assistencia',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('marca', sa.String(50), nullable=False),
        sa.Column('modelo', sa.String(50), nullable=False),
        sa.Column('imei', sa.String(20), nullable=False),
        sa.Column('avaria', sa.String(200), nullable=False),
        sa.Column('observacoes', sa.Text(), nullable=True),
        sa.Column('tecnico', sa.String(100), nullable=False),
        sa.Column('valor', sa.Float(), nullable=False),
        sa.Column('cliente_id', sa.Integer(), nullable=False),
        sa.Column('data_entrada', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('data_saida', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['cliente_id'], ['cliente.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('assistencia')
    op.drop_table('cliente')