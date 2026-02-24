# 🔐 Guide Complet - Système de Mot de Passe Oublié

## 📋 Vue d'ensemble

Le système de réinitialisation de mot de passe est **entièrement implémenté** et fonctionnel. Il fonctionne en mode développement par défaut.

## 🏗️ Architecture

### Backend (Python/Flask - services/auth/)

#### 1. **Routes** (`src/routes/password_routes.py`)
```python
POST /auth/forgot        # Demander un lien de réinitialisation
POST /auth/reset         # Finalisé la réinitialisation avec le token
GET  /auth/reset/verify/<token>  # Vérifier si un token est valide
```

#### 2. **Modèle** (`src/models/password_reset_model.py`)
- **Génération de token** : UUID unique
- **Durée de validité** : 1 heure
- **Stockage** : MongoDB (collection `password_resets`)
- **Sécurité** : Un seul token actif par email, suppression auto après expiration

#### 3. **Service Email** (`src/services/email_service.py`)
- **Mode Développement** (défaut) : Affiche le lien dans les logs docker
- **Mode Production** : Envoie des emails via SMTP

### Frontend (Vue 3 - front/)

#### Composants
1. **ForgotPasswordPage.vue** - Formulaire pour demander un lien
2. **ResetPasswordPage.vue** - Formulaire pour créer un nouveau mot de passe
3. **LoginPage.vue** - Lien "Mot de passe oublié ?"

#### Store (`src/stores/auth.store.js`)
```javascript
forgotPassword(email)    // Demander un lien
resetPassword(payload)   // Réinitialiser le mot de passe
```

## 🧪 Comment Tester

### **Étape 1 : Accéder à la page "Mot de passe oublié"**

1. Ouvre http://localhost:5173/login
2. Clique sur "Mot de passe oublié ?"
3. Ou accède directement à http://localhost:5173/forgot-password

### **Étape 2 : Soumettre votre email**

1. Entre l'email d'un compte existant
   - Exemple : `admin@test.com` (compte créé au démarrage)
2. Clique "Envoyer le lien"
3. Tu verras : **"Si un compte avec cet email existe, un lien de réinitialisation a été envoyé."**

### **Étape 3 : Récupérer le token (Mode Développement)**

Vérifie les logs du service auth :

```bash
# Dans un terminal, affiche les logs docker
docker compose logs auth -f
```

Tu verras quelque chose comme :

```
================================================================================
📧 EMAIL DE RÉINITIALISATION (MODE DÉVELOPPEMENT)
================================================================================
À: admin@test.com
Sujet: Réinitialisation de votre mot de passe - Central Cinema

🔗 LIEN DE RÉINITIALISATION :
http://localhost:5173/reset-password/550e8400-e29b-41d4-a716-446655440000
================================================================================
```

### **Étape 4 : Utiliser le lien de réinitialisation**

**Méthode 1 : Copier-coller le lien**
1. Copie l'URL du lien du log
2. Colle-le dans ta barre d'adresse du navigateur
3. Ou clique directement sur le lien depuis le log

**Méthode 2 : Via code**
Le token est dans le lien : `/reset-password/{TOKEN}`

### **Étape 5 : Créer un nouveau mot de passe**

1. Une fois sur la page de réinitialisation
2. Entre le nouveau mot de passe (min 6 caractères)
3. Confirme le mot de passe
4. Clique "Réinitialiser le mot de passe"
5. Tu verras : **"Votre mot de passe a été réinitialisé avec succès."**
6. Tu seras redirigé vers la page de connexion après 3 secondes

### **Étape 6 : Se connecter avec le nouveau mot de passe**

1. Email : (celui que tu as entrée)
2. Mot de passe : (nouveau mot de passe créé à l'étape 5)
3. Clique "Se connecter"

## 📧 Configuration Email (Production)

### Option 1 : Gmail (Recommandé pour tests)

1. **Créer un mot de passe d'application** Google :
   - Vais sur https://myaccount.google.com/apppasswords
   - Sélectionne "Mail" et "Windows Computer"
   - Google te génère un mot de passe unique

2. **Mettre à jour `services/auth/.env`** :
```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=mot-de-passe-application-genere
FROM_EMAIL=votre-email@gmail.com
FRONTEND_URL=http://localhost:5173
```

3. **Relancer le service** :
```bash
docker compose restart auth
```

### Option 2 : SendGrid

1. **Créer un compte** : https://sendgrid.com
2. **Générer une clé API**
3. **Mettre à jour `.env`** :
```dotenv
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxx
FROM_EMAIL=noreply@youromain.com
FRONTEND_URL=http://localhost:5173
```

### Option 3 : Service SMTP Local (Mailtrap, Ethereal, etc.)

Utilise un service cloud gratuit comme Mailtrap ou Ethereal pour tester.

## 🔍 Tests Avancés

### Test 1 : Vérifier la validité d'un token

```bash
curl -X GET http://localhost:4002/auth/reset/verify/550e8400-e29b-41d4-a716-446655440000
```

Réponse attendue :
```json
{
  "valid": true,
  "email": "admin@test.com",
  "expires_at": "2025-12-19T15:30:00"
}
```

### Test 2 : Réinitialiser avec un token valide

```bash
curl -X POST http://localhost:4002/auth/reset \
  -H "Content-Type: application/json" \
  -d '{
    "token": "550e8400-e29b-41d4-a716-446655440000",
    "password": "newpassword123"
  }'
```

### Test 3 : Rejeter un token expiré

1. Attends que le lien du log soit généré (ou simule)
2. Attends plus d'1 heure
3. Essaie d'utiliser le lien
4. Tu verras : **"Token invalide ou expiré"**

### Test 4 : Sécurité - Email Enumeration

1. Envoie une demande pour un email qui **n'existe pas**
2. La répoirse sera : **"Si un compte avec cet email existe..."**
3. C'est intentionnel pour éviter la divulgation d'emails

## 📊 Flux Complet (Diagramme)

```
Utilisateur                 Frontend                Backend
    |                          |                        |
    |---(clique "Oublié") ----->|                        |
    |                          |----(POST /forgot)------>|
    |                          |                    Génère Token
    |                          |<-----(200/404)---------|
    |<--(Message succès)-------|                        |
    |                          |                    Envoie Email
    |                          |                    (console ou SMTP)
    |                          |                        |
    | (copie lien du log)      |                        |
    |                          |                        |
    |-----(visite lien)------->|                        |
    |<--(Page Réinitialiser)---|                        |
    |                          |                        |
    |---(Nouveau MDP)--------->|----(POST /reset)------>|
    |                          |                    Valide Token
    |                          |                    Update Mot de passe
    |                          |<-----(200)------------|
    |<--(Redirige Login)-------|                        |
    |                          |                        |
    |---(Connecte)------------>|----(POST /login)------>|
    |                          |                        |
    ✅ Succès !
```

## 🐛 Dépannage

### Problème : Le lien ne reçoit dans les logs

**Solution** :
- Vérifie que les logs sont activés : `docker compose logs auth -f`
- Vérifie que le service auth tourne : `docker compose ps`
- Redémarrer : `docker compose restart auth`

### Problème : "Token invalide ou expiré"

**Causes** :
- Le token a déjà été utilisé
- Plus d'1h s'est écoulée depuis la génération
- Une typo dans l'URL

**Solution** : Demander un nouveau lien

### Problème : L'email n'est pas envoyé (mode production)

**Vérifications** :
- Les variables SMTP sont correctes dans `.env`
- Le port SMTP est correct (587 pour TLS, 465 pour SSL)
- Le mot de passe d'application est bon (pas le mot de passe Gmail)
- Le firewall autorise la connexion SMTP

## 📁 Fichiers Clés

| Fichier | Description |
|---------|-------------|
| `services/auth/src/routes/password_routes.py` | Routes forgot/reset |
| `services/auth/src/models/password_reset_model.py` | Gestion des tokens |
| `services/auth/src/services/email_service.py` | Envoi d'emails |
| `front/src/pages/auth/ForgotPasswordPage.vue` | Page "Oublié" |
| `front/src/pages/auth/ResetPasswordPage.vue` | Page "Réinitialiser" |
| `front/src/stores/auth.store.js` | Store avec les actions |
| `services/auth/.env` | Configuration SMTP |

## ✨ Fonctionnalités Bonus

✅ **Mode développement** - Affiche le lien dans la console  
✅ **Mode production** - Envoie des emails SMTP professionnels  
✅ **Sécurité** - Tokens uniques, expiration 1h, utilisation unique  
✅ **UX** - Messages d'erreur clairs, redirection automatique  
✅ **Prévention** - Pas de divulgation d'emails (user enumeration)  

## 🎯 Prochaines Étapes

1. **Configurer SMTP ProductionGmail** ou SendGrid
2. **Tester le flux complet** avec un vrai email
3. **(Optionnel) Ajouter 2FA** (authentification à deux facteurs)
4. **(Optionnel) Rate limiting** sur le endpoint /forgot

---

**Créé le** : 19 février 2026  
**Statut** : ✅ Entièrement fonctionnel
