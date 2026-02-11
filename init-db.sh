#!/bin/bash

# Script d'initialisation et de seed des bases de données
# Usage: ./init-db.sh [--import-json <path>]

set -e

IMPORT_JSON=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --import-json)
      IMPORT_JSON="$2"
      shift 2
      ;;
    *)
      echo "Argument inconnu: $1"
      exit 1
      ;;
  esac
done

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== INITIALISATION MS-CINEMA ===${NC}"

# 1. Arrêter et relancer tous les containers
echo -e "${YELLOW}➜ Arrêt des containers existants...${NC}"
docker compose down 2>/dev/null || true

echo -e "${YELLOW}➜ Lancement des containers...${NC}"
docker compose up -d

echo -e "${YELLOW}➜ Attente du démarrage des services...${NC}"
sleep 5

# 2. Attendre que les services soient prêts
wait_service() {
  local port=$1
  local max_wait=30
  local elapsed=0
  
  while [ $elapsed -lt $max_wait ]; do
    if curl -s http://localhost:$port/health > /dev/null 2>&1; then
      return 0
    fi
    sleep 1
    ((elapsed++))
  done
  return 1
}

echo -e "${YELLOW}➜ Vérification de la disponibilité de Catalog (port 4001)...${NC}"
if wait_service 4001; then
  echo -e "${GREEN}✓ Catalog est prêt${NC}"
else
  echo -e "${RED}✗ Catalog n'a pas répondu${NC}"
fi

echo -e "${YELLOW}➜ Vérification de la disponibilité de Booking (port 4003)...${NC}"
if wait_service 4003; then
  echo -e "${GREEN}✓ Booking est prêt${NC}"
else
  echo -e "${RED}✗ Booking n'a pas répondu${NC}"
fi

# 3. Seed les données de base
echo -e "${YELLOW}➜ Population des bases de données...${NC}"

# Movies
MOVIES=(
  '{"title":"Lumières de la Ville","genre":"Comédie Dramatique","duration":138,"rating":4.7,"year":2025,"ageRating":"12+","image":"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80","description":"Dans une métropole futuriste, un artiste marginal découvre un complot.","director":"Sophie Martin","synopsis":"Un voyage épique à travers la ville."}'
  '{"title":"Océan Bleu","genre":"Documentaire","duration":102,"rating":4.3,"year":2024,"image":"https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&q=80","description":"Explorez les profondeurs inconnues des abysses.","director":"Jean Dupont"}'
  '{"title":"Nocturne","genre":"Thriller","duration":116,"rating":4.1,"year":2025,"image":"https://images.unsplash.com/photo-1505432197924-c36723205007?w=800&q=80","description":"Un détective hanté par son passé.","director":"Marc Levy"}'
  '{"title":"Atlas","genre":"Aventure","duration":129,"rating":4.5,"year":2024,"image":"https://images.unsplash.com/photo-1511203348235-99893a036329?w=800&q=80","description":"Une exploratrice part à la recherche d une cité perdue.","director":"Lara Croft"}'
  '{"title":"Hyperdrive","genre":"Science-Fiction","duration":138,"rating":4.6,"year":2025,"image":"https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=800&q=80","description":"L équipage d un vaisseau spatial doit survivre.","director":"James Cameron"}'
  '{"title":"Renaissance","genre":"Historique","duration":145,"rating":4.2,"year":2024,"image":"https://images.unsplash.com/photo-1533109721025-d1ae7ee7c452?w=800&q=80","description":"La Florence du XVe siècle et deux artistes rivaux.","director":"Ridley Scott"}'
)

echo -e "${YELLOW}  Import des movies dans Catalog...${NC}"
for movie in "${MOVIES[@]}"; do
  if curl -s -X POST http://localhost:3030/catalogue/movies \
    -H "Content-Type: application/json" \
    -d "$movie" > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Movie créé${NC}"
  else
    echo -e "  ${RED}✗ Erreur création movie${NC}"
  fi
done

# Sessions
TODAY=$(date +%Y-%m-%d)
TOMORROW=$(date -d "+1 day" +%Y-%m-%d)

SESSIONS=(
  "{\"nameMovie\":\"Lumières de la Ville\",\"numberPlace\":120,\"hourStart\":\"20:00\",\"hourEnd\":\"22:18\",\"dateSeance\":\"$TODAY\",\"salleId\":\"Salle 1\",\"price\":12.50}"
  "{\"nameMovie\":\"Nocturne\",\"numberPlace\":80,\"hourStart\":\"14:30\",\"hourEnd\":\"16:26\",\"dateSeance\":\"$TODAY\",\"salleId\":\"Salle 2\",\"price\":10.00}"
  "{\"nameMovie\":\"Atlas\",\"numberPlace\":150,\"hourStart\":\"18:00\",\"hourEnd\":\"20:09\",\"dateSeance\":\"$TODAY\",\"salleId\":\"Salle 3\",\"price\":12.50}"
  "{\"nameMovie\":\"Hyperdrive\",\"numberPlace\":200,\"hourStart\":\"21:00\",\"hourEnd\":\"23:18\",\"dateSeance\":\"$TOMORROW\",\"salleId\":\"Salle 1\",\"price\":14.00}"
)

echo -e "${YELLOW}  Import des séances dans Booking...${NC}"
for session in "${SESSIONS[@]}"; do
  if curl -s -X POST http://localhost:3030/sessions/seance \
    -H "Content-Type: application/json" \
    -d "$session" > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Séance créée${NC}"
  else
    echo -e "  ${RED}✗ Erreur création séance${NC}"
  fi
done

# 4. Import JSON custom si fourni
if [ -n "$IMPORT_JSON" ] && [ -f "$IMPORT_JSON" ]; then
  echo -e "${YELLOW}➜ Import depuis fichier JSON: $IMPORT_JSON${NC}"
  
  # Import movies
  movies_count=$(jq '.movies | length' "$IMPORT_JSON" 2>/dev/null || echo 0)
  if [ "$movies_count" -gt 0 ]; then
    echo -e "${YELLOW}  Import des movies depuis JSON...${NC}"
    jq -c '.movies[]' "$IMPORT_JSON" | while read -r movie; do
      if curl -s -X POST http://localhost:3030/catalogue/movies \
        -H "Content-Type: application/json" \
        -d "$movie" > /dev/null 2>&1; then
        title=$(echo "$movie" | jq -r '.title')
        echo -e "  ${GREEN}✓ $title importé${NC}"
      fi
    done
  fi
  
  # Import sessions
  sessions_count=$(jq '.sessions | length' "$IMPORT_JSON" 2>/dev/null || echo 0)
  if [ "$sessions_count" -gt 0 ]; then
    echo -e "${YELLOW}  Import des séances depuis JSON...${NC}"
    jq -c '.sessions[]' "$IMPORT_JSON" | while read -r session; do
      if curl -s -X POST http://localhost:3030/sessions/seance \
        -H "Content-Type: application/json" \
        -d "$session" > /dev/null 2>&1; then
        name=$(echo "$session" | jq -r '.nameMovie')
        echo -e "  ${GREEN}✓ Séance $name importée${NC}"
      fi
    done
  fi
fi

echo -e "${GREEN}=== INITIALISATION COMPLÈTE ===${NC}"
echo -e "${GREEN}Frontal: http://localhost:5173${NC}"
echo -e "${GREEN}API Gateway: http://localhost:3030${NC}"
echo -e "${GREEN}Admin Dashboard: http://localhost:5173/admin${NC}"
