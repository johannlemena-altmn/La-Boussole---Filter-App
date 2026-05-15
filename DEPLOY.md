# Déployer Le Filtre sur Vercel

## Pré-requis
- Un compte Vercel (gratuit) : vercel.com
- Node.js installé (pour la CLI)

---

## Option A — Vercel CLI (recommandée, 2 minutes)

```bash
# 1. Installer la CLI Vercel (une seule fois)
npm install -g vercel

# 2. Se positionner dans le dossier du projet
cd "/Users/johannlemena/Documents/Claude/Projects/Le Filtre - App"

# 3. Déployer (1re fois : connecter ton compte Vercel via le navigateur)
vercel

# 4. Déployer en production
vercel --prod
```

Vercel te donnera une URL publique du type : `https://le-filtre-xxxx.vercel.app`

---

## Option B — Vercel via interface web (sans CLI)

1. Va sur vercel.com et connecte-toi
2. Clique "Add New Project"
3. Importe depuis GitHub (ou glisse-dépose le dossier via "Deploy from local")
4. Framework Preset → **Other** (pas Next.js)
5. Root Directory → laisser vide (racine du projet)
6. Build Command → laisser vide
7. Output Directory → laisser vide
8. Clique "Deploy"

---

## Option C — Netlify Drop (le plus rapide, sans compte requis)

1. Va sur **app.netlify.com/drop**
2. Glisse-dépose le dossier **"Le Filtre - App"** dans la zone de dépôt
3. Netlify génère instantanément une URL publique

---

## Mettre à jour après modifications

```bash
# Avec Vercel CLI (depuis le dossier du projet)
vercel --prod
```

Netlify Drop : re-glisser le dossier sur app.netlify.com.

---

## Structure déployée

```
index.html          ← app principale (CDN Babel+React+Tailwind)
app/
  defaults.jsx      ← données par défaut
  engine.jsx        ← moteur IA (Claude Haiku)
  studio.jsx        ← Studio Schéma + Lecture Active
  tracker.jsx       ← Tracker projets + Hermès
  dashboard.jsx     ← Tableau de bord + Stack coûts
  triage.jsx        ← Triage contenus
  components.jsx    ← composants partagés
  manifesto.jsx     ← Manifeste
  frameworks.jsx    ← Prismes & calibrage
  cluster.jsx       ← Cluster/carte
  extractors.jsx    ← extracteurs de contenu
  tweaks-panel.jsx  ← panneau de réglages
  app.jsx           ← point d'entrée React
vercel.json         ← config déploiement Vercel
```

## Note sécurité

L'app demande ta **clé API Anthropic** dans la bannière verte en haut.
La clé est stockée localement dans le navigateur (localStorage) — elle ne transite jamais par un serveur tiers.
