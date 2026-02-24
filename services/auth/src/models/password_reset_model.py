import uuid
from datetime import datetime, timedelta


class PasswordReset:
    """Modèle pour gérer les tokens de réinitialisation de mot de passe"""

    @staticmethod
    def create_token(resets_col, email):
        """
        Crée un nouveau token de réinitialisation
        
        Args:
            resets_col: Collection MongoDB pour les tokens
            email (str): Email de l'utilisateur
            
        Returns:
            str: Token généré (UUID)
        """
        # Générer un token unique
        token = str(uuid.uuid4())
        
        # Calculer la date d'expiration (1 heure)
        expires_at = datetime.utcnow() + timedelta(hours=1)
        
        # Supprimer les anciens tokens de cet utilisateur
        resets_col.delete_many({"email": email})
        
        # Créer le nouveau token
        reset_data = {
            "token": token,
            "email": email,
            "created_at": datetime.utcnow(),
            "expires_at": expires_at,
            "used": False
        }
        
        resets_col.insert_one(reset_data)
        
        return token

    @staticmethod
    def verify_token(resets_col, token):
        """
        Vérifie si un token est valide
        
        Args:
            resets_col: Collection MongoDB
            token (str): Token à vérifier
            
        Returns:
            dict or None: Données du token si valide, None sinon
        """
        reset = resets_col.find_one({"token": token})
        
        if not reset:
            return None
        
        # Vérifier si le token a déjà été utilisé
        if reset.get("used", False):
            return None
        
        # Vérifier si le token n'a pas expiré
        if reset["expires_at"] < datetime.utcnow():
            return None
        
        return reset

    @staticmethod
    def mark_as_used(resets_col, token):
        """
        Marque un token comme utilisé
        
        Args:
            resets_col: Collection MongoDB
            token (str): Token à marquer
        """
        resets_col.update_one(
            {"token": token},
            {"$set": {"used": True, "used_at": datetime.utcnow()}}
        )

    @staticmethod
    def cleanup_expired(resets_col):
        """
        Supprime les tokens expirés
        
        Args:
            resets_col: Collection MongoDB
            
        Returns:
            int: Nombre de tokens supprimés
        """
        result = resets_col.delete_many({
            "expires_at": {"$lt": datetime.utcnow()}
        })
        return result.deleted_count

    @staticmethod
    def get_by_email(resets_col, email):
        """
        Récupère tous les tokens actifs d'un email
        
        Args:
            resets_col: Collection MongoDB
            email (str): Email de l'utilisateur
            
        Returns:
            list: Liste des tokens actifs
        """
        return list(resets_col.find({
            "email": email,
            "used": False,
            "expires_at": {"$gt": datetime.utcnow()}
        }))
