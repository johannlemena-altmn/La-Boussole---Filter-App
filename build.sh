#!/bin/bash
# build.sh — compile les JSX → JS avant déploiement
set -e
echo "→ Compilation JSX → JS..."
./node_modules/.bin/babel app/ \
  --out-dir app-dist/ \
  --presets @babel/preset-react \
  --no-babelrc \
  --source-type script \
  --extensions ".jsx"
echo "✓ $(ls app-dist/*.js | wc -l | tr -d ' ') fichiers compilés dans app-dist/"
echo ""
echo "Déploiement :"
echo "  Netlify Drop → glisse le dossier sur app.netlify.com/drop"
echo "  Vercel CLI   → vercel --prod"
