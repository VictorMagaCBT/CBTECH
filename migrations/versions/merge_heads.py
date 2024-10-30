"""merge heads

Revision ID: merge_heads_001
Create Date: 2024-02-20 11:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'merge_heads_001'
down_revision = 'add_new_fields_001'  # Point to the previous migration
branch_labels = None
depends_on = None

def upgrade() -> None:
    pass

def downgrade() -> None:
    pass