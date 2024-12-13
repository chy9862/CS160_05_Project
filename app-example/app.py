from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import sqlite3
from flask_cors import CORS  # Import Flask-CORS

app = Flask(__name__)

CORS(app)

# Configure SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///food_inventory.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define a FoodItem model
class FoodItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    expiration_date = db.Column(db.String(10), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    image_uri = db.Column(db.String(255), nullable=True)
    size =  db.Column(db.String(255), nullable=True)


# Initialize the database
with app.app_context():
    db.drop_all()
    db.create_all()

# Routes
@app.route('/items', methods=['GET'])
def get_items():
    items = FoodItem.query.all()
    return jsonify([{
        "id": item.id,
        "name": item.name,
        "expirationDate": item.expiration_date,
        "imageURL": item.image_uri
    } for item in items])

@app.route('/items', methods=['POST'])
def add_item():
    data = request.json
    new_item = FoodItem(
        name=data['name'],
        expiration_date=data['expiration_date'],
        quantity=data['quantity'],
        image_uri=data.get('image_uri'),
        size = data['size']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"message": "Item added successfully"}), 201

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = FoodItem.query.get(item_id)
    if item is None:
        return jsonify({"message": "Item not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted successfully"}), 200


@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = FoodItem.query.get(item_id)  # ID로 데이터 검색
    if item is None:
        return jsonify({"message": "Item not found"}), 404
    return jsonify({
        "id": item.id,
        "name": item.name,
        "expirationDate": item.expiration_date,
        "imageURL": item.image_uri,
        "quantity": item.quantity,
        "size": item.size
    }), 200


# Routes for Products (using raw SQLite queries)
@app.route('/products/<string:barcode>', methods=['GET'])
def get_product_name_by_barcode(barcode):
    try:
        conn = sqlite3.connect('instance/products.db')  # Connect to products.db
        cursor = conn.cursor()

        cursor.execute("SELECT product_name, size FROM Products WHERE barcode=?", (barcode,))

        row = cursor.fetchall()
        conn.close()

        if row:
            # If a product is found, return its name as JSON
            return jsonify({"product_name": row[0]}), 200
        else:
            # If no product is found, return a 404 error
            return jsonify({"message": "Product not found"}), 404
    
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/products/<string:barcode>', methods=['POST'])
def add_product_with_barcode(barcode):
    data = request.json  # Get the JSON data from the request body
    try:
        # Connect to products.db
        conn = sqlite3.connect('instance/products.db')
        cursor = conn.cursor()

        # Insert data into the Products table with the barcode from the URL
        cursor.execute(
            "INSERT INTO Products (brand, product_name, barcode, size) VALUES (?, ?, ?, ?)",
            (data['brand'], data['product_name'], barcode, data['size'])
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Product added successfully"}), 201


    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/products/<string:barcode>', methods=['PUT'])
def update_product(barcode):
    data = request.json  

    try:
        # Connect to products.db
        conn = sqlite3.connect('instance/products.db')
        cursor = conn.cursor()

        # Update the product in the Products table with the given barcode
        cursor.execute(
            """
            UPDATE Products 
            SET brand = ?, product_name = ?, size = ?
            WHERE barcode = ?
            """,
            (data['brand'], data['product_name'], data['size'], barcode)
        )
        
        # Check if any row was updated
        if cursor.rowcount == 0:
            return jsonify({"error": "No product found with the given barcode"}), 404

        conn.commit()
        conn.close()

        return jsonify({"message": "Product updated successfully"}), 200

    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='192.168.1.238', port=5000, debug=True)


