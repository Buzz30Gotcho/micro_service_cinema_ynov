# 🚀 Configuration Coolify pour le déploiement

## Architecture

```
Frontend (Vite/Nginx) 
    ↓
API Gateway (Express)
    ↓
    ├─> Auth Service (Python)
    ├─> Catalog Service (PHP)
    ├─> Booking Service (NestJS)
    └─> Payment Service (Node.js)
```

## 🔴 Problème identifié

Le frontend essayait d'appeler `/movies` directement, mais devrait passer par l'API Gateway.

## ✅ Solution appliquée

### 1. **Frontend - Variables d'environnement au runtime**

Le frontend est maintenant configuré pour :
- Lire `VITE_API_BASE` au build time (variable Vite)
- Charger `config.js` généré au runtime (pour injecter l'URL dynamiquement)

**Fichiers modifiés:**
- `front/Dockerfile` : Passage de `VITE_API_BASE` au build
- `front/entrypoint.sh` : Script pour générer `config.js` au runtime
- `front/index.html` : Charge `config.js` avant `main.js`
- `front/src/api/http.js` : Lit depuis Vite ou `window.__ENV__`

### 2. **Configuration sur Coolify**

Pour chaque **Application** ou **Service** sur Coolify, vous devez configurer les variables d'environnement :

#### **Service Frontend**
```env
VITE_API_BASE=http://yc4w8g0ows8so00kcs0wo4cs.72.62.179.60.sslip.io
```

#### **Service API Gateway**
```env
AUTH_URL=http://auth_service_name:4002
CATALOG_URL=http://catalog_service_name:4001
BOOKING_URL=http://booking_service_name:4003
PAYMENT_URL=http://payment_service_name:4004
```

*Note: Remplacez les noms par ceux de vos services Coolify*

#### **Service Catalog (PHP)**
```env
DB_HOST=postgres_host_from_coolify
DB_PORT=5432
DB_NAME=catalog_db
DB_USER=catalog_user
DB_PASSWORD=catalog_pass
PUBLIC_BASE_URL=http://yc4w8g0ows8so00kcs0wo4cs.72.62.179.60.sslip.io
```

#### **Service Booking (NestJS)**
```env
DB_HOST=postgres_host_from_coolify
DB_PORT=5432
DB_NAME=booking_db
DB_USER=booking_user
DB_PASSWORD=booking_pass
APP_PORT=4003
```

#### **Service Auth (Python)**
```env
MONGO_HOST=mongo_host_from_coolify
MONGO_PORT=27017
```

### 3. **Ordre de déploiement recommandé**

1. ✅ **Base de données** (PostgreSQL, MongoDB)
2. ✅ **Services de microservices** (Auth, Catalog, Booking, Payment)
3. ✅ **API Gateway**
4. ✅ **Frontend**

### 4. **Test après déploiement**

1. Accédez au frontend: `http://jgsw0c0ggggwsg4ss000skgc.72.62.179.60.sslip.io`
2. Ouvrez la console du navigateur (F12)
3. Vous devriez voir: `API Base URL: http://yc4w8g0ows8so00kcs0wo4cs.72.62.179.60.sslip.io`
4. Vérifiez les appels API dans l'onglet **Network** - ils doivent aller vers `/movies`, `/sessions`, etc.

### 5. **Troubleshooting**

#### ❌ Erreur: `GET http://... /movies 404`
- Vérifiez que l'API Gateway est en route
- Vérifiez que `VITE_API_BASE` pointe vers le bon domaine

#### ❌ Erreur: `Cannot reach API Gateway`
- Vérifiez les URLs des services dans l'API Gateway
- Vérifiez que les services internes peuvent communiquer
- Vérifiez les règles de pare-feu

#### ❌ Frontend charge mais pas les données
- Ouvrez F12 → Console → Cherchez `API Base URL`
- Vérifiez que l'URL est correcte
- Testez l'API Gateway avec `curl`: `curl http://api-gateway-url/movies`

### 6. **Fichiers modifiés pour votre référence**

```
front/
  ├── Dockerfile          ← Injecte VITE_API_BASE au build
  ├── entrypoint.sh       ← Génère config.js au runtime
  ├── index.html          ← Charge config.js
  └── src/api/
      └── http.js         ← Lit API_BASE_URL depuis Vite/window.__ENV__
```

---

**En résumé:** Le problème venait d'une URL d'API manquante. Désormais, l'URL est injectée au runtime via un script d'entrée nginx, ce qui permet à Coolify de configurer dynamiquement l'URL de l'API Gateway sans rebuilder l'image.
