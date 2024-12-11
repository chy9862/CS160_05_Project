from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from db import get_db_connection

inventory_bp = Blueprint("inventory", __name__)


@inventory_bp.route("/add", methods=["POST"])
@jwt_required()
def add_food_item():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    # Validate required fields
    if not all(key in data for key in ["food_name", "quantity", "expiration_date"]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = get_db_connection()
        c = conn.cursor()

        # First check if item with same expiration date already exists for this user
        c.execute(
            """
            SELECT id, quantity FROM inventory 
            WHERE user_id = ? AND food_name = ? AND expiration_date = ?
            """,
            (current_user_id, data["food_name"], data["expiration_date"]),
        )
        existing_item = c.fetchone()

        if existing_item:
            # Update existing item quantity
            c.execute(
                """
                UPDATE inventory
                SET quantity = quantity + ?
                WHERE id = ?
                """,
                (data["quantity"], existing_item[0]),
            )
        else:
            # Insert new item
            c.execute(
                """
                INSERT INTO inventory (user_id, food_name, quantity, expiration_date)
                VALUES (?, ?, ?, ?)
                """,
                (
                    current_user_id,
                    data["food_name"],
                    data["quantity"],
                    data["expiration_date"],
                ),
            )

        # Get the id of the inserted item
        item_id = c.lastrowid

        conn.commit()
        conn.close()

        return (
            jsonify(
                {
                    "message": "Food item added successfully",
                    "item": {
                        "id": item_id,
                        "food_name": data["food_name"],
                        "quantity": data["quantity"],
                        "expiration_date": data["expiration_date"],
                    },
                }
            ),
            201,
        )

    except Exception as e:
        return jsonify({"error": "Failed to add food item", "details": str(e)}), 500


@inventory_bp.route("/", methods=["GET"])
@jwt_required()
def get_inventory():
    # Your route logic here
    current_user_id = get_jwt_identity()

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM inventory WHERE user_id = ?", (current_user_id,))

        # Get column names from cursor description
        columns = [description[0] for description in c.description]
        
        # Fetch the data
        inventory_items = c.fetchall()
        
        # Convert to list of dictionaries with column names
        formatted_items = [dict(zip(columns, item)) for item in inventory_items]
        
        conn.close()

        return jsonify({
            "message": f"Inventory items for user {current_user_id}",
            "items": formatted_items
        }), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch inventory", "details": str(e)}), 500
