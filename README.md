# Flask Backend for Assistência Técnica

This is a Flask backend for managing clients and technical assistance records.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the appropriate values in `.env`

5. Run the application:
   ```
   python app.py
   ```

The server will start running on `http://127.0.0.1:5000/`.

## API Endpoints

- GET /clientes: Retrieve all clients
- POST /clientes: Create a new client
- GET /assistencias: Retrieve all assistance records
- POST /assistencias: Create a new assistance record

## Database

The application uses PostgreSQL as the database. Make sure to set up your database and provide the correct DATABASE_URL in your .env file.