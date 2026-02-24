from flask import Blueprint, jsonify, request, current_app
from src.models.user_model import User
from src.models.password_reset_model import PasswordReset
from src.services.email_service import email_service
from werkzeug.security import generate_password_hash
import sys

password_bp = Blueprint("password", __name__)


# POST /auth/forgot
@password_bp.route("/forgot", methods=["POST"])
def forgot_password():
    """
    Initie une demande de réinitialisation de mot de passe
    Génère un token unique et envoie un email
    """
    data = request.get_json() or {}
    email = data.get("email")
    
    if not email:
        return jsonify({"error": "Email requis"}), 400

    users_col = current_app.db.users
    user = User.get_by_email(users_col, email)
    
    # Pour des raisons de sécurité, on retourne toujours un succès
    # même si l'utilisateur n'existe pas (éviter l'énumération d'emails)
    if not user:
        return jsonify({
            "message": "Si un compte avec cet email existe, un lien de réinitialisation a été envoyé."
        }), 200

    try:
        # Créer un nouveau token
        resets_col = current_app.db.password_resets
        token = PasswordReset.create_token(resets_col, email)
        
        # Envoyer l'email
        email_sent = email_service.send_password_reset_email(email, token)
        
        if not email_sent:
            print(f"⚠️ Avertissement : Email non envoyé à {email}, mais le token existe")
        
        return jsonify({
            "message": "Si un compte avec cet email existe, un lien de réinitialisation a été envoyé."
        }), 200
        
    except Exception as e:
        print(f"❌ Erreur lors de la création du token : {str(e)}")
        return jsonify({"error": "Une erreur est survenue"}), 500


# POST /auth/reset
@password_bp.route("/reset", methods=["POST"])
def reset_password():
    """
    Réinitialise le mot de passe avec un token valide
    """
    data = request.get_json() or {}
    token = data.get("token")
    new_password = data.get("password")
    
    sys.stderr.write(f"\n🔑 Tentative de réinitialisation avec token: {token[:10]}...\n")
    sys.stderr.flush()

    if not token or not new_password:
        return jsonify({"error": "Token et nouveau mot de passe requis"}), 400

    # Vérifier la longueur minimale du mot de passe
    if len(new_password) < 6:
        return jsonify({"error": "Le mot de passe doit contenir au moins 6 caractères"}), 400

    try:
        resets_col = current_app.db.password_resets
        
        # Vérifier le token
        sys.stderr.write(f"🔍 Vérification du token...\n")
        sys.stderr.flush()
        reset = PasswordReset.verify_token(resets_col, token)
        if not reset:
            sys.stderr.write(f"❌ Token invalide ou expiré\n")
            sys.stderr.flush()
            return jsonify({"error": "Token invalide ou expiré"}), 400
        
        sys.stderr.write(f"✅ Token valide pour: {reset['email']}\n")
        sys.stderr.flush()
        
        # Récupérer l'utilisateur (données brutes pour l'update)
        users_col = current_app.db.users
        user_data = users_col.find_one({"email": reset["email"]})
        
        if not user_data:
            sys.stderr.write(f"❌ Utilisateur introuvable: {reset['email']}\n")
            sys.stderr.flush()
            return jsonify({"error": "Utilisateur introuvable"}), 404
        
        # Mettre à jour le mot de passe
        hashed_password = generate_password_hash(new_password)
        sys.stderr.write(f"🔐 Hachage du mot de passe...\n")
        sys.stderr.flush()
        
        users_col.update_one(
            {"_id": user_data["_id"]},
            {"$set": {"password": hashed_password}}
        )
        
        sys.stderr.write(f"✅ Mot de passe mis à jour\n")
        sys.stderr.flush()
        
        # Marquer le token comme utilisé
        PasswordReset.mark_as_used(resets_col, token)
        
        sys.stderr.write(f"✅ Mot de passe réinitialisé pour {reset['email']}\n")
        sys.stderr.flush()
        
        return jsonify({"message": "Mot de passe réinitialisé avec succès"}), 200
        
    except Exception as e:
        sys.stderr.write(f"❌ Erreur lors de la réinitialisation : {str(e)}\n")
        sys.stderr.flush()
        return jsonify({"error": "Une erreur est survenue"}), 500


# GET /auth/reset/verify/:token (optionnel - pour vérifier un token avant affichage du formulaire)
@password_bp.route("/reset/verify/<token>", methods=["GET"])
def verify_reset_token(token):
    """
    Vérifie si un token de réinitialisation est valide
    Utile pour afficher un message d'erreur côté frontend avant de soumettre le formulaire
    """
    try:
        resets_col = current_app.db.password_resets
        reset = PasswordReset.verify_token(resets_col, token)
        
        if not reset:
            return jsonify({"valid": False, "error": "Token invalide ou expiré"}), 400
        
        return jsonify({
            "valid": True,
            "email": reset["email"],
            "expires_at": reset["expires_at"].isoformat()
        }), 200
        
    except Exception as e:
        print(f"❌ Erreur lors de la vérification du token : {str(e)}")
        return jsonify({"valid": False, "error": "Une erreur est survenue"}), 500
