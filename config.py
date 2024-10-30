import os
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs, urlencode

load_dotenv()

DEBUG = os.getenv('DEBUG', 'True') == 'True'
PORT = int(os.getenv('PORT', 5000))

def get_database_url():
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        return None
    
    # Parse the URL
    parsed_url = urlparse(db_url)
    
    # Get the hostname (e.g., ep-cool-name-123456.us-east-2.aws.neon.tech)
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

SQLALCHEMY_DATABASE_URI = get_database_url()
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.getenv('SECRET_KEY', 'cbtech')

SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
    "connect_args": {
        "sslmode": "require"
    }
}