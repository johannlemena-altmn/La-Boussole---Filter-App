#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  Le Filtre — Script de démarrage local  v0.3
#  Usage : bash demarrer.sh
#  Serveur HTTP Python · React CDN · Babel CDN (pas de Node requis)
# ═══════════════════════════════════════════════════════════════
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   Le Filtre — Démarrage Local  v0.3             ║"
echo "║   Serveur HTTP · React CDN · Babel CDN          ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ── Vérifier les fichiers JSX ──────────────────────────────────
JSX_COUNT=$(ls app/*.jsx 2>/dev/null | wc -l | tr -d ' ')

if [ "$JSX_COUNT" -eq 0 ]; then
  echo "  ✗  Aucun fichier .jsx trouvé dans le dossier 'app/'"
  echo ""
  echo "  ┌─ ÉTAPE REQUISE ──────────────────────────────────────┐"
  echo "  │  Copie les fichiers .jsx dans :                      │"
  echo "  │     $DIR/app/                                        │"
  echo "  │  Puis relance :  bash demarrer.sh                    │"
  echo "  └──────────────────────────────────────────────────────┘"
  echo ""
  exit 1
fi

echo "  ✓  app/ — $JSX_COUNT fichiers .jsx détectés"

# ── Vérifier Python3 ──────────────────────────────────────────
if ! command -v python3 &>/dev/null; then
  echo "  ✗  Python3 introuvable."
  echo "     macOS inclut Python3 par défaut — relance un nouveau Terminal."
  exit 1
fi

PORT=5173
URL="http://localhost:$PORT/Le%20Filtre.html"

echo ""
echo "  ════════════════════════════════════════════════"
echo "  Démarrage du serveur local sur le port $PORT…"
echo ""
echo "  → $URL"
echo ""
echo "  Une fois la page ouverte :"
echo "  1. Colle ta clé API dans la barre VERTE en haut"
echo "     (obtenir une clé : https://console.anthropic.com)"
echo "  2. Lance l'analyse normalement"
echo ""
echo "  Ctrl+C pour arrêter le serveur."
echo "  ════════════════════════════════════════════════"
echo ""

# Ouvrir le navigateur après 1.5s
(sleep 1.5 && open "$URL") &

# Lancer le serveur HTTP Python (pas de Node requis !)
python3 -m http.server $PORT
