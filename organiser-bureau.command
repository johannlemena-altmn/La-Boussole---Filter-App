#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  Organiser le Bureau — Johann
#  Double-clique pour lancer dans Terminal
#  Crée 3 dossiers thématiques avec les fichiers libres
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

DESK="$HOME/Desktop"
cd "$DESK"

MED="Captures & Médias"
DOC="Docs & Recherche"
FOR="Formation"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   Organiser le Bureau — Johann               ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

mkdir -p "$MED" "$DOC" "$FOR"

# ── 1. CAPTURES & MÉDIAS ───────────────────────────────────────
echo "  📸 Captures & Médias..."

# Screenshots macOS
find . -maxdepth 1 -name "Capture d'écran*" -exec mv -n {} "./$MED/" \; 2>/dev/null || true

# Enregistrements d'écran
find . -maxdepth 1 -name "Enregistrement de l'écran*" -exec mv -n {} "./$MED/" \; 2>/dev/null || true

# Vidéo
find . -maxdepth 1 \( -iname "*.mov" -o -iname "*.mp4" -o -iname "*.avi" \) \
  -exec mv -n {} "./$MED/" \; 2>/dev/null || true

# Audio
find . -maxdepth 1 \( -iname "*.m4a" -o -iname "*.mp3" -o -iname "*.wav" -o -iname "*.aiff" \) \
  -exec mv -n {} "./$MED/" \; 2>/dev/null || true

# Photos / images (JPG, JPEG, WEBP — clairement médias)
find . -maxdepth 1 \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" \) \
  -exec mv -n {} "./$MED/" \; 2>/dev/null || true

# Salvador Dalí — HTML + dossier associé
find . -maxdepth 1 -name "The Three Sphinxes*" -exec mv -n {} "./$MED/" \; 2>/dev/null || true

# PNG média/perso identifiables par préfixe
find . -maxdepth 1 -name "543414319_*" -exec mv -n {} "./$MED/" \; 2>/dev/null || true
[ -f "Carte Zeliq Perso.png" ] && mv -n "Carte Zeliq Perso.png" "./$MED/" 2>/dev/null || true

# ── 2. FORMATION ───────────────────────────────────────────────
echo "  🎓 Formation..."

# Cours / mémoires / présentations scolaires
find . -maxdepth 1 -name "L2 *"         -exec mv -n {} "./$FOR/" \; 2>/dev/null || true
find . -maxdepth 1 -name "L3 *"         -exec mv -n {} "./$FOR/" \; 2>/dev/null || true
find . -maxdepth 1 -name "Rattrapage *" -exec mv -n {} "./$FOR/" \; 2>/dev/null || true
find . -maxdepth 1 -name "memoire-*"    -exec mv -n {} "./$FOR/" \; 2>/dev/null || true
find . -maxdepth 1 -name "CEJM_*"       -exec mv -n {} "./$FOR/" \; 2>/dev/null || true
find . -maxdepth 1 -name "Billet - *"   -exec mv -n {} "./$FOR/" \; 2>/dev/null || true

# ── 3. DOCS & RECHERCHE ────────────────────────────────────────
echo "  📄 Docs & Recherche..."

# PDFs, Word, Excel, PowerPoint, TXT, RTF
find . -maxdepth 1 \( \
  -iname "*.pdf"  -o \
  -iname "*.docx" -o \
  -iname "*.doc"  -o \
  -iname "*.txt"  -o \
  -iname "*.rtf"  -o \
  -iname "*.xlsx" -o \
  -iname "*.xls"  -o \
  -iname "*.pptx" -o \
  -iname "*.ppt"  \
\) -exec mv -n {} "./$DOC/" \; 2>/dev/null || true

# PNGs restants = infographies / captures de recherche
find . -maxdepth 1 -iname "*.png" -exec mv -n {} "./$DOC/" \; 2>/dev/null || true

# HTML restants
find . -maxdepth 1 -iname "*.html" -exec mv -n {} "./$DOC/" \; 2>/dev/null || true

# ── Résultat ───────────────────────────────────────────────────
echo ""
echo "  ✓ Bureau organisé !"
echo ""
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │ Captures & Médias  → screenshots, images, audio │"
echo "  │ Formation          → cours, mémoires, école     │"
echo "  │ Docs & Recherche   → rapports, PDFs, articles   │"
echo "  └─────────────────────────────────────────────────┘"
echo ""
echo "  Les dossiers projets existants n'ont pas été touchés."
echo "  Tu peux fermer cette fenêtre."
echo ""
