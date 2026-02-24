import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Clé secrète de l'application
    SECRET_KEY = os.getenv("SECRET_KEY")

    # Paramètres MongoDB
    MONGO_INITDB_ROOT_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME")
    MONGO_INITDB_ROOT_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
    MONGO_DB = os.getenv("MONGO_DB")
    MONGO_USER = os.getenv("MONGO_USER", "admin")
    MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "adminpass")
    MONGO_PORT = os.getenv("MONGO_PORT", "27017")
    MONGO_HOST = os.getenv("MONGO_HOST", "auth_bdd")

    # Construction de l'URI complète
    MONGO_URI = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB}?authSource=admin"

    # Config Mongo Express (optionnel)
    MONGO_EXPRESS_PORT = os.getenv("MONGO_EXPRESS_PORT")
    ME_CONFIG_MONGODB_ADMINUSERNAME = os.getenv("ME_CONFIG_MONGODB_ADMINUSERNAME")
    ME_CONFIG_MONGODB_ADMINPASSWORD = os.getenv("ME_CONFIG_MONGODB_ADMINPASSWORD")
    ME_CONFIG_MONGODB_SERVER = os.getenv("ME_CONFIG_MONGODB_SERVER")

    # JWT Token Configuration
    JWT_ACCESS_TOKEN_EXPIRES = 30 * 60  # 30 minutes en secondes
    JWT_REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60  # 7 jours en secondes

    # Email Configuration (SMTP)
    SMTP_HOST = os.getenv("SMTP_HOST", "")
    SMTP_PORT = os.getenv("SMTP_PORT", "587")
    SMTP_USER = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@centralcinema.com")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
