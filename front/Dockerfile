# ------------------------------
# Étape 1 : développement
# ------------------------------
FROM node:20-alpine AS dev

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copier tout le projet
COPY . .

# Exposer le port pour dev
EXPOSE 5173   
# Vite dev server par défaut

# Commande pour dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]