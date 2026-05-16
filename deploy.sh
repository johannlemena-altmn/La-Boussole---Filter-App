#!/bin/bash
set -e
echo "🔨 Build JSX → JS..."
npm run build
echo "📦 Commit & push..."
git add app/ app-dist/ "Le Filtre.html" netlify.toml
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M') — $*"
git push origin main
echo "✅ Déployé ! Vercel redéploie en ~30s."
echo "🔗 https://la-boussole-filter-app.vercel.app"
