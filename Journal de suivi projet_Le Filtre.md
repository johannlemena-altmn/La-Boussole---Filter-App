# Le Filtre — Journal de suivi projet
*Document de travail interne. Mise à jour : 15 mai 2026.*
*Conçu pour rendre le projet actionnable : ce qui est fait, ce qui bloque, ce qu'on décide ensemble.*
*Double usage : suivi opérationnel + cahier des charges pour future équipe.*

---

## Vision en une ligne

Un outil de triage éditorial **sobre, local-first, open-source visé**, qui calibre l'IA sur **ta** grille de lecture, te laisse le geste humain (dessin, montage, écriture), et expose explicitement ses limites + sa stack.

---

## Légende statuts

- 🟢 **livré** — fonctionnel en production
- 🟡 **partiel** — en place mais à durcir / brancher pour de vrai
- 🔵 **backlog** — décidé mais pas encore commencé
- ⚪ **à creuser** — besoin de discussion / décision avant de coder
- 🔴 **bloquant** — dépend d'une décision externe / coût / partenariat

---

## État livré à ce jour (15 mai 2026)

### V2.1 — Livré le 14 mai

| Statut | Item | Détail |
|---|---|---|
| 🟢 | **Cluster verbatim 2D → 3D** | Extraction unigrammes + bigrammes, co-occurrence, layout force-directed (2D) + Fibonacci sphere (3D). Filtre liens, export SVG + PNG. |
| 🟢 | **Capture fichier** | PDF.js (multi-page + barre de progression). DOCX extraction minimale (parse w:t — à durcir). Texte/MD/CSV/JSON natifs. |
| 🟢 | **Capture photo** | Tesseract.js OCR fr+en, chargé à la demande, barre de progression, score confiance. |
| 🟢 | **Capture audio** | MediaRecorder + Web Speech API (Chrome/Safari). Transcription live fr-FR. |
| 🟢 | **Capture lien** | noembed.com oEmbed — aperçu titre/auteur/thumbnail avant empilement. |
| 🟢 | **Studio exports** | Carte mentale → SVG + PNG. Storyboard → markdown. Infographie → print PDF + HTML. |
| 🟢 | **Token cost widget** | Compteur flottant temps réel : tokens cumulés + coût en €, historique par appel, graphique barres. |
| 🟢 | **6 phases de navigation** | Calibrage / Capture / Analyse / Triage / Dashboard / Studio. |

### Session 15 mai — Livré aujourd'hui (Agentic OS)

| Statut | Item | Détail |
|---|---|---|
| 🟢 | **6 Skills Cowork packagés** | boussole-compress ⓪ / storyboard ① / interview ② / veille-hebdo ③ / synthese-profonde ④ / dataviz ⑤. Chacun avec ADN éditorial figé + anchors de calibration + auto-évaluation 5 dimensions. |
| 🟢 | **Fichiers .skill installables** | Dossier `agents-ia/skills/` : 6 fichiers .skill prêts à glisser dans Cowork Settings. |
| 🟢 | **Synthèse Substack produite** | Article "Ce n'est pas un corpus théorique. C'est une carte." : 40/50 auto-évaluation. Prêt à publier. |
| 🟢 | **Mermaid Chart MCP connecté** | Rendu diagrammes SVG directement dans Cowork. |
| 🟢 | **Gmail / Drive / Calendar MCP** | Déjà connectés, opérationnels pour Agent ③ Veille Hebdo. |
| 🟢 | **Cluster v2 "neural flow"** | Fond sombre, lueurs SVG par bloc, physique live rAF, pulse rings, panneau "Figures dominantes", labels alternés gauche/droite, section Mécanismes dépliable. |
| 🟢 | **Infographie v2** | Titre éditable inline, 2 colonnes (distribution + termes récurrents + sources pivot), export Markdown. |
| 🟢 | **Tirets cadratins éliminés** | Conventions rédactionnelles Projet Z appliquées à tous les JSX (manifesto, studio, dashboard). |
| 🟡 | **Dataviz Agent ⑤** | Napkin.ai (prompt manuel) + Datawrapper (CSV + config) + Mermaid (code). Opérationnel mais pas intégré dans l'UI du Filtre. |
| 🟡 | **Manifeste du Filtre** | Corpus théorique identifié (4 voix + carte des publics). Principe ① documenté. Principes ②–⑥ à construire (6 max, calqués sur 6 portes campus de la transition). |

### Session 16 mai — Livré aujourd'hui (Lecture Active + Boussole des Récits)

| Statut | Item | Détail |
|---|---|---|
| 🟢 | **Mode Lecture Active (Studio ✦)** | 4e outil dans le Studio. Flux 3 étapes : Ancrage (notes libres) → Extraction (extrait exact + paraphrase + réaction) → Usage (4 modes : Enseigner / Expérimenter / Créer du contenu / Documenter). Stockage localStorage `lf-lectures-v1`. Export Markdown structuré. Implémenté dans `studio.jsx`. |
| 🟢 | **Phase 07 — Tracker de projets** | Nouvelle phase dans la nav. Créer/gérer des projets (statuts Idée/En cours/Bloqué/Livré), décomposer en tâches avec cases à cocher, sparkline de progression sur 30 jours, lier des sources issues de la veille qualifiée. localStorage `lf-tracker-v1`. Nouveau fichier `tracker.jsx`. |

---

## Backlog V2.3 — Nouveaux chantiers (Boussole des Récits)

> Demande du 15 mai : transformer Le Filtre en système de pensée actif — lire avec intention, ancrer dans des projets concrets, construire une rhétorique personnelle sur le long terme.

### 🔵 Couche Lecture & Pensée critique

| Priorité | Item | Détail technique | Effort | Dépend de |
|---|---|---|---|---|
| P1 | **Mode Lecture Active** ✅ | Flux 3 étapes intégré dans Studio. Annoter → Extraire (extrait exact + paraphrase + réaction) → Intégrer (4 modes d'usage). localStorage `lf-lectures-v1`. | — | livré |
| P2 | **Boîte à outils frameworks (6 prismes)** | Panneau dédié accessible depuis Calibrage ou Studio. 6 frameworks activables selon le contexte : Double Diamond (divergence / convergence), 6 portes campus de la transition (sobriété / systémique / récit / soin / communs / gouvernance), AARRR (acquisition / activation / rétention / recommandation / revenu), WHY?HOW?WHAT? (cercle doré de Simon Sinek), SIMAC (Situation / Intérêt / Message / Action / Conclusion), Méthode Lecture Active (ce doc). Chaque prisme = une grille de questions activable sur n'importe quel contenu capturé. | L | — |
| P2 | **Mode Journaling / écoute active** | Prompts structurés déclenchables depuis n'importe quel item pour développer : pensée critique (contre-arguments, angle mort, sources manquantes), rhétorique (formulation pour public non-initié), prise de parole (pitch 60s, ouverture atelier, hook conférence). Stockage dans localStorage avec historique. | M | Lecture Active |
| P3 | **Stratégie Ancrée — couche frameworks** | Absorber les 7 modules de la Stratégie Ancrée comme socle épistémique de l'app. Module 0 (Hygiène Cognitive : F/I/V/U, OSCAR, Spinoza) = garde-fou visible en haut de chaque phase. Modules 1-6 (Ancrage, Lecture Systémique, Vrai Problème, Design Stratégique, Narration, Décision Collective, Implémentation) = prismes activables dans la boîte à outils. 3 layers (Forge perso / Diffusion partageable / Offre produit) = contexte de déploiement de chaque item. | L | Boîte à outils frameworks |

### 🔵 Couche Projets & Suivi

| Priorité | Item | Détail technique | Effort | Dépend de |
|---|---|---|---|---|
| P2 | **Tracker de projets (mode Todoist)** | Vue dédiée Phase 07 ou panneau latéral. Chaque projet = titre + description + statut (Idée / En cours / Bloqué / Livré) + liste de tâches avec cases à cocher + graphe de progression (barres de complétion semaine par semaine). Chaque item de la veille peut être rattaché à 0-N projets. Stockage localStorage `lf-projects-v1`. | L | — |
| P2 | **Vue projet : tous les contenus associés** | Pour chaque projet, tableau de bord des items qui lui sont rattachés : liste des sources, cluster thématique restreint, timeline de capture, score moyen de pertinence. Permet de voir "ce que j'ai lu sur ce sujet" d'un coup. | M | Tracker de projets |
| P3 | **Graphes de progression par projet** | Courbes d'avancement : items capturés × temps, tâches complétées × temps, score moyen des sources × temps. Visualisation simple (sparklines ou barres). | M | Tracker de projets |
| P3 | **Mapping contenu → projet** | Dans la vue Triage, bouton "Rattacher à un projet" sur chaque item qualifié. Aussi déclenchable depuis la Lecture Active (champ "Usage" → sélectionner un projet existant). | S | Tracker + Lecture Active |

### 🔵 Couche Notes physiques → numériques

| Priorité | Item | Détail technique | Effort | Dépend de |
|---|---|---|---|---|
| P3 | **Photo de notes manuscrites → note numérique** | Dans la Phase 02 Capture, mode "Photo de notes" : prendre ou importer une photo d'un schéma ou d'une note manuscrite → OCR Tesseract.js → zone de texte éditable → titre auto-suggéré → sauvegarder dans la pile. | M | OCR existant (Tesseract.js) |
| P3 | **Export notes vers dossier bureau** | Depuis n'importe quelle note (Lecture Active, notes OCR, Journaling) : bouton "Sauvegarder sur le bureau" → File System Access API (Chrome/Edge) → crée un fichier .md dans un dossier choisi par l'utilisateur. Historique des exports dans Dashboard. | M | File System Access API |
| P4 | **Dossier projet automatique** | Si un item est rattaché à un projet : option "Créer un dossier projet" sur le bureau avec sous-dossiers (Notes / Sources / Exports). Vérifier compatibilité File System Access API avant de coder. | L | Export notes + Tracker projets |

---

## Backlog V2.2 — Court terme (1-2 sprints)

### 🔴 PRIORITÉ 1 — Intégration des skills dans l'UI

> Problème identifié : les 6 skills existent en fichiers .skill mais sont invisibles dans Le Filtre. L'utilisateur ne peut pas les déclencher depuis l'interface.

| Priorité | Item | Détail technique | Effort |
|---|---|---|---|
| P1 | **Boutons "Déclencher un agent" dans Triage** | Sur chaque item scoré ≥ 80 : afficher ① Storyboard et/ou ② Interview. Sur cluster de 3+ items même bloc ≥ 75 : afficher ④ Synthèse. | M |
| P1 | **Guardrails — friction avant lancement** | Avant tout appel Claude coûteux : modale d'estimation (tokens estimés, coût en €, temps estimé). Bouton "Annuler" toujours visible. Confirmation obligatoire. | M |
| P1 | **Dashboard → Agent ③ Veille Hebdo** | Bouton "Lancer la veille" dans Phase 05 Dashboard, avec sélection période + estimation coût avant confirmation. | M |
| P2 | **Agent ⑤ Dataviz dans Studio** | Si signal contient données chiffrées : bouton "Créer un visuel" → choix outil (Mermaid / Napkin prompt / Datawrapper CSV). | M |
| P2 | **Agent ⓪ Compress en amont de chaque analyse** | Option "Compresser d'abord" avant tout lancement d'analyse sur fichier > 5000 mots. Afficher l'économie tokens estimée. | S |

### 🔴 PRIORITÉ 2 — Extraction DOCX propre

| Priorité | Item | Détail technique | Effort |
|---|---|---|---|
| P1 | **JSZip pour DOCX** | Remplacer le parse binaire approximatif par JSZip + extraction XML propre. Cible : 99% fidélité texte, titres hiérarchiques, listes. | M |
| P2 | **PDF scanné → OCR auto** | Si pdfjs renvoie < 50 caractères : basculer automatiquement sur Tesseract page par page. Barre de progression par page. | S |
| P3 | **Détection langue auto OCR** | Remplacer fra+eng systématique par détection auto (langdetect.js). Impact perf × 2 actuellement. | S |

### 🔵 Design & Manifeste

| Priorité | Item | Détail | Effort |
|---|---|---|---|
| P1 | **Design refresh — Low-tech cohérent** | Inspiration Richard Hanna (richardhanna.dev) : typographie texte-first, espacement généreux, zéro décoration superflue, monochrome + une couleur accent. Cohérent avec principe ① sobre/local-first. | L |
| P1 | **Manifeste du Filtre — document complet** | 6 principes max (calqués sur 6 portes campus de la transition). Principe ① déjà documenté. Principes ②–⑥ à construire avec Johann. Plein écran au premier lancement. | M |
| P2 | **Page "Lire le Manifeste"** | Actuellement bouton sans destination. Rédiger et intégrer le manifeste complet dans l'app. | M |
| P3 | **Cohérence typographique** | Unifier la hiérarchie typographique entre les 6 phases. Vérifier contraste AAA sur fond clair et sombre. | S |

### 🔵 Cluster & Analyse

| Priorité | Item | Détail | Effort |
|---|---|---|---|
| P2 | **TF-IDF + clustering k-means** | Remplacer n-grams par TF-IDF (côté JS) ou appel Claude dédié pour extraction concepts. | L |
| P2 | **Cluster temporel** | Axe temps en plus — voir l'évolution des thèmes sur 4-12 semaines. | L |
| P3 | **Filtrer cluster par bloc** | N'afficher que les nœuds d'un bloc B1-B6 précis. | S |
| P3 | **Snapshot cluster** | Sauvegarder un état du cluster pour comparer 2 périodes. | S |
| P3 | **Dédoublonnage global** | Cosine similarity sur le texte des items — détecter les doublons cross-items, pas juste par item individuel. | M |

### 🔵 Studio

| Priorité | Item | Détail | Effort |
|---|---|---|---|
| P2 | **PNG export storyboard** | Actuellement markdown only. html-to-image pour PNG haute résolution. | S |
| P2 | **Infographie A4 vraie** | html-to-image → PNG au lieu du print CSS. | S |
| P3 | **Carte mentale interactive** | Drag des nœuds, ajout/édition manuels. | L |

### 🔵 Dashboard

| Priorité | Item | Détail | Effort |
|---|---|---|---|
| P2 | **Coût mensuel réel** | Calculer depuis le tracking local des appels Claude (déjà partiellement implémenté via lf_stats). | S |
| P3 | **Widget rythme de publication** | Graphique par projet dans le temps. | M |
| P3 | **Widget pile vieillissante** | Items non traités depuis > X jours — alerte douce. | S |

### 🔵 MCP & Automatisation

| Priorité | Item | Détail | Effort |
|---|---|---|---|
| P1 | **Démo Agent ③ Veille Hebdo** | Démontrer le flux complet : Gmail MCP scan → rapport 6 blocs → save Drive. Tester avant présentation partenaires. | S |
| P2 | **Schedule Agent ③** | Configurer via skill "schedule" de Cowork pour lundi 7h automatique. | S |
| P2 | **Napkin.ai API key** | En developer preview. Surveiller la disponibilité — configurer quand ouvert. | — |
| P3 | **Datawrapper MCP** | MCPs communautaires disponibles (GitHub palewire) — nécessite API key Datawrapper + config manuelle. | M |

### 🔵 Accessibilité

| Priorité | Item | Effort |
|---|---|---|
| P4 | Mode contraste AAA | S |
| P4 | Navigation clavier complète Dashboard | M |
| P4 | Reader-mode texte seul | M |

---

## ⚪ À creuser ensemble (décisions à prendre)

### Modèle open-source local vs Claude

- Vise local-first/open-source (principe ①) mais moteur actuel = Claude (Anthropic), propriétaire.
- **Options :** (a) Mistral 7B / Llama via Ollama, (b) garder Claude + fallback local, (c) attendre qualité locale suffisante.
- **Recommandation :** (b) pragmatique. Documenter clairement. Laisser l'utilisateur choisir.

### Périmètre social listening — Analyse détaillée

**Contexte :** l'idée d'origine visait un outil concurrent à Agorapulse / Buska (accès DMs, mentions, commentaires). Cette ambition se heurte à des contraintes techniques et éthiques. Mais le social listening reste une pierre angulaire potentielle du projet, si on le recentre.

#### Ce qui est bloqué (et pourquoi ne pas insister)

| Signal | Raison du blocage | Verdict |
|---|---|---|
| **Twitter/X DMs et mentions** | API v2 Basic : 1 500 tweets/mois gratuits. Au-delà : $100/mois (Basic) ou $5 000/mois (Pro). TOS restrictive sur la revente/redistribution. | Trop cher, trop fragile |
| **Instagram mentions/commentaires** | Nécessite app Facebook approuvée, review longue. Accès DMs : interdit en dehors du partenaire Meta. | Bloqué ToS |
| **TikTok** | API Research disponible mais réservée académiques. Content Discovery API : waitlist. | Non prioritaire V0 |
| **LinkedIn** | API très restreinte, réservée partenaires agréés. Pas de search API publique. | Non viable |

#### Ce qui est faisable, frugal, et cohérent avec le manifeste

**Couche 1 — Le "slow web" (RSS et flux ouverts) : priorité absolue**

Le web lent est très bien outillé, CORS-friendly, zero API key, et produit du signal de haute qualité.

Sources couvrant 80% des besoins éditoriaux :
- Substack, WordPress, Podcast RSS, Feedburner, Atom
- Le Monde, Libération, Mediapart (flux RSS publics)
- Newsletters PDF/HTML envoyées par mail (déjà capturables via Capture Fichier)
- Blogs, sites de référence thématiques

Implémentation : `rss-parser` (npm CDN) côté navigateur. Aucun backend. Chaque source RSS = une entrée dans la pile Le Filtre. Automatisable via Agent ③ Veille Hebdo (Gmail MCP récupère les newsletters, RSS Parser récupère les flux).

**Couche 2 — Mastodon / Fediverse (API ouverte, zero coût)**

Mastodon expose une API publique sans authentification pour les timelines publiques et les recherches. Cohérent avec le manifeste (décentralisé, open-source, pas de GAFAM).

Implémentation : appels directs à l'API REST de n'importe quelle instance (`mastodon.social`, `piaille.fr`, etc.). Aucun OAuth requis pour les flux publics. MCPs disponibles sur le registre.

Valeur : signal de communautés tech, transition, médias indépendants.

**Couche 3 — Moteurs de recherche à haute valeur éditoriale**

Au lieu de surveiller les réseaux sociaux post par post, surveiller ce que les moteurs de recherche remontent sur des requêtes ciblées. Beaucoup plus efficace pour le profil éditorial de la Boussole.

Options comparées :

| Outil | Coût | Signal | Cohérence manifeste |
|---|---|---|---|
| **SearXNG** (self-hosted) | Gratuit, local | Web général agrégé | Excellent (open-source, local) |
| **Brave Search API** | $3/1 000 requêtes | Web indépendant, pas de tracking | Très bon |
| **Exa.ai** | $5/1 000 req (neural search) | Contenu sémantiquement proche | Fort pour veille éditoriale |
| **Tavily API** | Gratuit 1 000/mois | Web + résumé IA | Bon pour exploration rapide |
| **Serper.dev** | $50 crédit offert, puis ~$0.30/1 000 | Google News + Web | Pratique, pas frugal |

Recommandation : Exa.ai en premier (recherche neurale = trouve les articles "qui pensent comme toi"), avec SearXNG en fallback local-first.

**Couche 4 — YouTube (API Google gratuite)**

YouTube Data API v3 : 10 000 unités/jour gratuites. Permet de chercher des vidéos, récupérer les métadonnées, accéder aux captions publiques.

Use case : transcription automatique de conférences, émissions, podcasts vidéo. Très pertinent pour la Boussole des Récits (Hamant en conférence, Radjou TEDx, etc.).

Implémentation : appel API depuis le navigateur avec clé API Google. MCP disponible.

**Couche 5 — Reddit (signal communautaire)**

Reddit a durci son API post-2023 mais maintenu un niveau gratuit. 100 requêtes OAuth/minute gratuit.

Use case : r/lowtech, r/degrowth, r/journalism, r/environment pour le signal communautaire et les contre-arguments populaires.

Implémentation : via CORS proxy ou MCP dédié.

#### Architecture recommandée pour Le Filtre

```
SOCIAL LISTENING STACK
        ↓
Couche 1 : RSS Parser (zero API key) ←─── Priorité V2.2
Couche 2 : Mastodon API (open) ←────────── Priorité V2.3
Couche 3 : Exa.ai / SearXNG (semantic) ←── Priorité V2.3
Couche 4 : YouTube captions API ←────────── Priorité V2.4
Couche 5 : Reddit API (communauté) ←──────── Optionnel
        ↓
Filtre Le Filtre (scoring, triage, cluster)
        ↓
Agents Boussole (synthèse, podcast, dataviz)
```

Chaque couche est optionnelle, déclarée dans la Stack widget du Dashboard, avec coût affiché.

#### Décision à prendre

Valider cet ordre de priorité. Question clé : est-ce que Le Filtre est un outil pour les **éditeurs qui surveillent leur propre espace** (Buska/Agorapulse), ou pour les **journalistes/penseurs qui surveillent un champ de débat** (veille de veille) ?

La réponse change tout : si c'est le premier cas, les couches Twitter/Instagram restent nécessaires et le coût sera élevé. Si c'est le second (ce que la Boussole des Récits suggère fortement), les couches 1-3 suffisent à 90% du besoin, pour un coût proche de zéro.

**Recommandation :** viser le second profil. Nommer le positionnement explicitement dans le manifeste : "outil pour navigateurs de sens, pas pour community managers."

### Modèle économique

- Open-source ≠ gratuit pour utilisateur final.
- Pistes : SaaS hébergé (payant), version locale (gratuite), services pros (audit veille, formation).
- À discuter avec partenaires identifiés.

### Corpus théorique — Clusters 2-6

- Pistes Johann : Bihouix, Citton, Charbonnier, Gorz.
- Zone blanche à documenter comme signaux Le Filtre avant publication du manifeste complet.
- **Thèse confirmée :** corpus = cartographie des publics, pas manifeste théorique.

---

## 🔴 Bloquants identifiés

| Item | Pourquoi bloquant | Décision attendue |
|---|---|---|
| **API Meta** | Coût + restrictions + ToS | Choix scope social listening |
| **Hébergement Whisper.cpp** | C++, pas navigateur | Backend optionnel ou installation locale utilisateur |
| **Modèle ML apprentissage continu** | Complexe, demande infra | Reporter V1.0 ou repenser comme fine-tuning léger |
| **Napkin.ai API** | Developer preview — pas encore ouvert | Surveiller disponibilité |

---

## Cahier des charges — Pour future équipe

> Section destinée à l'onboarding d'une équipe de développement. Décrit les intentions, contraintes et priorités du projet.

### Principes de conception non négociables

1. **Sobre** — aucun appel réseau non nécessaire, pas d'analytics tiers, pas de tracking
2. **Local-first** — toutes les données restent sur la machine de l'utilisateur (localStorage/IndexedDB)
3. **Open-source visé** — code lisible, documenté, sans dépendances propriétaires obligatoires
4. **Friction explicite** — chaque opération coûteuse (tokens Claude) doit afficher son coût estimé avant confirmation
5. **Exposer les limites** — l'outil dit ce qu'il ne sait pas faire, ce qui est approximatif, ce qui est expérimental

### Architecture actuelle

- **Frontend** : React (CDN) + TailwindCSS, servi via Python HTTP server ou Vite
- **IA** : Claude API (Anthropic) via appel direct navigateur (`anthropic-dangerous-direct-browser-access: true`)
- **Stockage** : localStorage (`le-filtre-v0.2`) — state.items (pile contenu) + state.stack (config blocs/projets)
- **Capture** : PDF.js + Tesseract.js + Web Speech API + MediaRecorder + noembed oEmbed
- **Visualisation** : cluster force-directed (2D/3D), studio infographie/storyboard/carte mentale
- **Automatisation** : 6 Skills Cowork (.skill) + MCPs connectés (Gmail, Drive, Calendar, Mermaid)

### Fonctionnalités prioritaires pour V2.2

1. **Guardrails/friction** avant chaque appel IA coûteux — estimation tokens + confirmation obligatoire
2. **JSZip DOCX** — extraction texte propre (actuellement approximative)
3. **Boutons agents dans l'UI** — rendre les 6 skills actionnables depuis Triage et Studio
4. **Design refresh** — low-tech cohérent, inspiré de richardhanna.dev, principe ① visible dans le design
5. **Manifeste complet** — 6 principes, lien depuis l'app

### Fonctionnalités à ne PAS implémenter en V2.2

- Accès APIs sociales (Meta, TikTok) — reporté
- Backend serveur — rester 100% client-side
- Comptes utilisateurs / authentification — rester local
- Analytics / télémétrie — jamais

### Partenaires potentiels à contacter

| Partenaire | Type | Usage |
|---|---|---|
| Richard Hanna (richardhanna.dev) | Tiers-lieu numérique | Distribution, cas d'usage, inspiration design |
| TTSO / Bien ou bien / Hallu World | Médias indépendants | Testeurs alpha |
| Low Tech Lab | Technique + pédagogique | Partenariat potentiel, caution manifeste |
| data.europa.eu / Programminghistorian | Académique | Caution méthodologique |

---

## Métriques de santé (à remplir chaque vendredi)

| Semaine | Items traités | Sources distinctes | Score moyen | Bugs ouverts | Sessions partenaires |
|---|---|---|---|---|---|
| 11/05 | — | — | — | 0 | 0 |
| 18/05 | | | | | |
| 25/05 | | | | | |

---

## Notes d'arbitrage

### 14 mai 2026

- Mode sombre → clair en principal ✅
- 6 phases (Calibrage / Capture / Analyse / Triage / Dashboard / Studio) ✅
- Manifeste plein écran au premier lancement ✅
- Cluster 2D validable → 3D ✅
- Modes Fichier/Photo/Audio/Lien câblés ✅

### 15 mai 2026

- Agentic OS : 6 skills packagés + ADN éditorial figé + calibration ML ✅
- Thèse corpus = cartographie des publics (pas manifeste théorique) ✅
- Séquence éditoriale : Agent ④ Synthèse → test audience → Agent ② Podcast si traction ✅
- Note M2 académique → backlog (après publication Substack) ✅
- Mermaid Chart MCP connecté ✅
- Design/manifeste Richard Hanna → backlog P1 V2.2 🔵

### 16 mai 2026

- Mode Lecture Active livré dans Studio (4e outil) ✅
- Backlog V2.3 structuré : 3 couches (Lecture/Pensée critique, Projets/Suivi, Notes physiques) ✅
- Stratégie Ancrée (7 modules) : décision d'absorber comme couche frameworks, pas outil séparé ✅
- Prochains 2 chantiers validés : Boîte à outils frameworks (P2) + Tracker de projets (P2)
- Tracker livré en Phase 07 ✅
- Prochaine étape : Boîte à outils frameworks (6 prismes), puis questions UX spécifiques

### À décider ensemble (prochaine session)

- Quel est le premier cas d'usage pour la démo partenaires ? (Rapport hebdo Boussole / Lettre FNE / Veille pro)
- Quand contacter Richard Hanna ?
- Clusters 2-6 : documenter Bihouix, Citton, Charbonnier, Gorz dans Le Filtre avant manifeste ?

---

## Rituels

### Quotidien (5 min)
1. Capturer 1-3 items dans Le Filtre
2. Si pile > 10 : lancer l'analyse
3. Une ligne "ce qui m'a marqué" en bas de ce doc

### Hebdomadaire (30 min, vendredi)
1. Dashboard Phase 05
2. Vérifier cluster 2D : qu'est-ce qui revient ?
3. Décider 1-2 productions à pousser en Studio
4. Mettre à jour les métriques
5. Remonter 1 bug + 1 envie

### Mensuel (1h, dernier vendredi)
1. Revue des principes du manifeste — tenus ?
2. Revue de la stack — dérive ?
3. Monter un item 🔵 backlog en haut de pile
4. Inviter une partie prenante externe (30 min de test)

---

## Carnet de bord — ce qui m'a marqué

*Objectif : capter les signaux faibles sur l'outil lui-même, pas sur la veille.*

- 14/05 — Le cluster a fait émerger "captation" et "attention" comme cluster fort sur 3 newsletters distinctes. Vrai signal vs artefact d'un même article cité ailleurs ?
- 15/05 — La thèse "carte des publics" pour les 4 voix : non formulée dans les sources, émergée de la combinaison. Confirmation que l'Agent ④ fait son travail.
- 16/05 — La méthode Lecture Active (vidéo "Forget Your Reading Journal") : son vrai apport n'est pas la prise de notes mais la coupure entre copier, reformuler, réagir — trois gestes cognitifs distincts qui empêchent l'illusion d'apprentissage passif. Logique à intégrer comme contrainte UX dans Le Filtre (les 3 champs sont séparés, pas un bloc libre).
