#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  Le Filtre — Installation du Skill Cowork
#  Ce script copie le skill dans le dossier Cowork pour qu'il
#  soit automatiquement disponible dans toutes tes conversations.
#
#  Usage : bash installer-skill.sh
# ═══════════════════════════════════════════════════════════════
set -e

SKILL_SRC="$(cd "$(dirname "$0")" && pwd)"
SKILL_NAME="le-filtre"

# Trouver le dossier skills Cowork (chemin macOS standard)
SKILLS_BASE=$(find /var/folders -maxdepth 5 -name "skills" -path "*/claude-hostloop-plugins/*" 2>/dev/null | head -1)

if [ -z "$SKILLS_BASE" ]; then
  echo ""
  echo "  ✗  Dossier Cowork/skills introuvable."
  echo "     Assure-toi que l'app Cowork est installée et lancée."
  echo ""
  echo "  Installation manuelle :"
  echo "  1. Ouvre le Finder"
  echo "  2. Cmd+Shift+G → colle ce chemin :"
  echo "     /var/folders  (cherche un dossier claude-hostloop-plugins)"
  echo "  3. Copie le dossier 'le-filtre/' dans le dossier 'skills/'"
  exit 1
fi

DEST="$SKILLS_BASE/$SKILL_NAME"
echo ""
echo "  → Installation dans : $DEST"

# Copier le skill
rm -rf "$DEST"
mkdir -p "$DEST"
cp "$SKILL_SRC/SKILL.md" "$DEST/SKILL.md"

echo "  ✓  Skill '$SKILL_NAME' installé !"
echo ""
echo "  Redémarre Cowork (ou ouvre une nouvelle conversation)"
echo "  pour que le skill soit disponible."
echo ""
