from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import os
import sys
from urllib.parse import urlparse, parse_qs, urlencode

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app import app
from models import db

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = db.metadata

def get_url():
    db_url = app.config['SQLALCHEMY_DATABASE_URI']
    if not db_url:
        return None
        
    # Parse the URL
    parsed_url = urlparse(db_url)
    
    # Get the hostname
    hostname = parsed_url.hostname
    
    # Extract endpoint ID (everything before the first dot)
    endpoint_id = hostname.split('.')[0]
    
    # Get existing query parameters
    query_params = parse_qs(parsed_url.query)
    
    # Add endpoint parameter
    query_params['options'] = [f'endpoint={endpoint_id}']
    
    # Convert query parameters back to string
    query_string = urlencode(query_params, doseq=True)
    
    # Reconstruct the URL with the updated query parameters
    return f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}?{query_string}"

def run_migrations_offline() -> None:
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = get_url()
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()