import os
import sys
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from datetime import datetime, timezone

# Add current directory to path to import src if needed
sys.path.append(os.getcwd())

try:
    from src.config import Config

    MONGO_URI = Config.MONGO_URI
    MONGO_DB = Config.MONGO_DB
except Exception as e:
    print(f"Warning: Could not import Config ({e}). Using fallback defaults.")
    MONGO_USER = os.getenv("MONGO_USER", "admin")
    MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "adminpass")
    MONGO_HOST = os.getenv("MONGO_HOST", "auth_bdd")
    MONGO_PORT = os.getenv("MONGO_PORT", "27017")
    MONGO_DB = os.getenv("MONGO_DB", "authdb")
    MONGO_URI = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB}?authSource=admin"

print(f"Connecting to {MONGO_URI}...")

try:
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB]
    users_col = db.users

    # Admin credentials
    ADMIN_EMAIL = "admin@test.com"
    ADMIN_PASSWORD = "password"

    existing = users_col.find_one({"email": ADMIN_EMAIL})

    if existing:
        print(f"User {ADMIN_EMAIL} already exists.")
        # Ensure role is admin
        users_col.update_one({"_id": existing["_id"]}, {"$set": {"role": "admin"}})
        print("Ensured role is 'admin'.")
    else:
        print("Creating new admin user...")
        hashed = generate_password_hash(ADMIN_PASSWORD)
        now = datetime.now(timezone.utc)
        users_col.insert_one(
            {
                "email": ADMIN_EMAIL,
                "password": hashed,
                "first_name": "Admin",
                "last_name": "System",
                "role": "admin",
                "created_at": now,
                "updated_at": now,
            }
        )
        print(
            f"Admin user created successfully.\nEmail: {ADMIN_EMAIL}\nPassword: {ADMIN_PASSWORD}"
        )

except Exception as e:
    print(f"Error: {e}")
