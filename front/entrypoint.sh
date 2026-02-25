#!/bin/sh
# Script d'entrée pour substituer les variables d'environnement dans l'app Vite

# Destination du fichier de config JS
CONFIG_FILE="/usr/share/nginx/html/config.js"

# Créer le fichier de configuration avec les variables d'environnement
cat > "$CONFIG_FILE" << EOF
// Configuration générée au runtime
window.__ENV__ = {
  VITE_API_BASE: '${VITE_API_BASE:-http://localhost:3030}',
};
EOF

# Démarrer nginx
exec nginx -g "daemon off;"
