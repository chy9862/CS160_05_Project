from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection
import sqlite3

users_bp = Blueprint("users", __name__)


@users_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    # return error if missing required fields
    if (
        not data
        or not data.get("username")
        or not data.get("password")
        or not data.get("email")
    ):
        return jsonify({"error": "Missing required fields"}), 400

    hashed_password = generate_password_hash(data["password"])

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute(
            "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
            (data["username"], hashed_password, data["email"]),
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "User created successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username or email already exists"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@users_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    # return error if missing required fields
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Missing username or password"}), 400

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username = ?", (data["username"],))
    user = c.fetchone()
    conn.close()

    if user and check_password_hash(user[2], data["password"]):
        access_token = create_access_token(identity=user[0])
        return jsonify(
            {
                "access_token": access_token,
                "user_id": user[0],
                "username": user[1],
                "email": user[3],
            }
        )

    return jsonify({"error": "Invalid username or password"}), 401


@users_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT username, email FROM users WHERE id = ?", (current_user_id,))
    user = c.fetchone()
    conn.close()

    if user:
        return jsonify({"username": user[0], "email": user[1]})

    return jsonify({"error": "User not found"}), 404
