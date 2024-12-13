from flask import Flask, request, jsonify
from datetime import timedelta
from db import init_db, get_db_connection
from extensions import jwt
from users import users_bp
from user_inventory import inventory_bp
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# 1. App configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

# 2. Initialize JWT extension
jwt.init_app(app)

# 3. Register blueprints
app.register_blueprint(users_bp, url_prefix="/users")
app.register_blueprint(inventory_bp, url_prefix="/inventory")

# 4. Initialize database
init_db()


if __name__ == "__main__":
    app.run(debug=True)
