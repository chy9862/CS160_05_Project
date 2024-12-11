import sqlite3

DATABASE_PATH = "./data/food.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    return conn


def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS users
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         username TEXT UNIQUE NOT NULL,
         password TEXT NOT NULL,
         email TEXT UNIQUE NOT NULL)
    """
    )

    c.execute(
        """
        CREATE TABLE IF NOT EXISTS inventory
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         user_id INTEGER NOT NULL,
         food_name TEXT NOT NULL,
         quantity INTEGER NOT NULL,
         expiration_date TEXT NOT NULL,
         FOREIGN KEY (user_id) REFERENCES users(id))
    """
    )

    conn.commit()
    conn.close()
