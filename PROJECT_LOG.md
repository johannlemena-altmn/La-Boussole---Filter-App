# Le Filtre — Journal de suivi projet

> Document de travail interne. Mise à jour journalière ou hebdomadaire selon le rythme.
> Conçu pour rendre le projet **actionnable** : ce qui est fait, ce qui bloque, ce qu'on décide ensemble.

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

## Sprint actuel · semaine du 11 mai 2026

### V2.1 (ce qui vient d'être livré · 14/05)

| Statut | Item | Détail |
|---|---|---|
| 🟢 | **Cluster verbatim 2D → 3D** | Sur Dashboard. Extraction unigrammes + bigrammes (fr+en, stopwords), co-occurrence, layout force-directed (2D) puis Fibonacci sphere projetée (3D). Filtre liens, sélection nœud, export SVG + PNG (transposable Canva). |
| 🟢 | **Capture fichier** | PDF.js branché (extraction texte multi-page avec barre de progression). DOCX extraction minimale (parse `w:t`). Texte/markdown/CSV/JSON lus directement. |
| 🟢 | **Capture photo** | Tesseract.js (OCR fr+en) chargé à la demande, ~2 Mo. Barre de progression. Renvoie texte + score de confiance. |
| 🟢 | **Capture audio** | MediaRecorder + Web Speech API (Chrome/Safari). Transcription live fr-FR pendant l'enregistrement, empilée en fin de capture. |
| 🟢 | **Capture lien** | noembed.com (oEmbed proxy CORS-friendly) — aperçu titre/auteur/thumbnail/provider avant empilement. |
| 🟢 | **Studio · exports** | Carte mentale → SVG + PNG haute résolution. Storyboard → markdown copié. Infographie → impression PDF + HTML copié. |
| 🟢 | **PROJECT_LOG.md** | Ce document. |

### Validation à faire avec partenaires/parties prenantes

- [ ] Tester le cluster 2D avec **un vrai jeu de 15-30 sources** (newsletters de la semaine) → valider que les termes récurrents émergent et font sens
- [ ] Tester l'extraction PDF sur des **PDFs réels** (rapport ADEME, étude Arcom, etc.)
- [ ] Tester l'OCR sur **photos de carnet** avec écriture manuscrite — calibrer le seuil de confiance
- [ ] Tester l'aperçu lien sur les domaines clés : YouTube, Substack, Le Monde, Mediapart
- [ ] Vérifier que le SVG exporté du cluster s'ouvre proprement dans Canva (vs Illustrator)

---

## Backlog — V2.2 (court terme · 1-2 sprints)

### 🔵 Capture & extraction

- [ ] **JSZip pour DOCX propre** — actuellement extraction binaire approximative. Cible : 99% de fidélité texte.
- [ ] **PDF scanné → OCR automatique** — si pdfjs ne renvoie pas de texte (< 50 car.), basculer auto sur Tesseract page par page.
- [ ] **Détection langue auto** pour OCR (au lieu de fra+eng systématique → impact perf de ~2×)
- [ ] **Import Drive / Dropbox** — passerelle optionnelle, jamais obligatoire. Choisir entre OAuth ou drag-and-drop manuel uniquement.
- [ ] **YouTube transcript** — pour vidéos > 4min : extraction du transcript public (YouTube en propose souvent un). Pas de yt-dlp côté navigateur — décider d'un backend Python optionnel ou rester sur "colle le transcript".
- [ ] **Instagram / TikTok** — limites des API. Garder l'aperçu oEmbed et demander à l'utilisateur de coller la transcription manuellement, le temps de clarifier le partenariat éventuel.

### 🔵 Cluster

- [ ] **Algorithme d'extraction de concepts** plus malin : remplacer les n-grams par un TF-IDF + clustering (k-means léger côté JS) ou par un appel Claude pour extraire concepts directement
- [ ] **Causalité / corrélations explicites** : actuellement on a la co-occurrence (= corrélation faible). Pour suggérer de la **causalité**, il faudrait une analyse plus poussée — déléguer à Claude avec un prompt dédié.
- [ ] **Cluster temporel** — un axe temps en plus, pour voir l'évolution des thèmes sur 4-12 semaines
- [ ] **Filtrer le cluster par bloc** — n'afficher que les nœuds d'un bloc précis
- [ ] **Sauvegarder un cluster** comme snapshot — pour comparer 2 périodes

### 🔵 Studio

- [ ] **PNG export propre** pour storyboard (actuellement seulement markdown)
- [ ] **Vraie infographie A4** : utiliser `html-to-image` pour rendre un PNG haute résolution au lieu du print
- [ ] **Carte mentale interactive** — drag des nœuds, ajout/édition manuels

### 🔵 Dashboard

- [ ] **Coût mensuel réel** — calculer à partir du nombre d'appels Claude effectués (tracking local)
- [ ] **Widget temporel** — graphique de rythme de publication par projet
- [ ] **Widget « ce qui n'a pas été traité »** — pile vieillissante

### 🔵 Triage / Analyse

- [ ] **Classification verbatims via Claude** au lieu de l'heuristique regex (peurs/incompréhensions/valeurs)
- [ ] **Dédoublonnage** entre items — pas juste alerte_doublon par item, mais détection globale (cosine similarity sur le texte)

### 🔵 Accessibilité

- [ ] **Mode contraste AAA** (utilisateur a explicitement reporté à plus tard)
- [ ] **Navigation clavier** complète sur dashboard (drag widgets via Tab + flèches)
- [ ] **Reader-mode** : version texte seul pour malvoyants / liseuses

---

## ⚪ À creuser ensemble (décisions à prendre)

### Modèle open-source local vs Claude

- Le projet vise **local-first / open-source** (cf. manifeste, principe ①)
- Mais le moteur d'analyse actuel = **Claude (Anthropic)**, propriétaire
- **Choix à faire** : (a) basculer sur Mistral 7B / Llama via Ollama, (b) garder Claude comme option payante et offrir un fallback local, (c) attendre qu'un modèle local atteigne la qualité d'analyse souhaitée
- **Mon avis** : (b) — pragmatique. Documenter clairement. Laisser l'utilisateur choisir.

### Périmètre social listening

- L'idée d'origine (notes 51 lignes) parlait d'un outil concurrent à Agorapulse / Buska, accédant aux DMs et commentaires
- Mais : APIs Meta/TikTok restrictives, consentement complexe, scope énorme
- **Choix à faire** : (a) viser l'écoute publique + RSS uniquement, (b) intégration profonde via API avec consentement strict, (c) repousser à un projet séparé
- **Mon avis** : (a) pour la V0. Le scope « DM + SAV » mérite un autre produit.

### Modèle économique

- Open-source = code libre ≠ gratuit pour utilisateur final
- Pistes : SaaS hébergé (payant), version locale (gratuite), services pros (audit veille, formation)
- À discuter avec partenaires identifiés

### Partenaires potentiels (à contacter / cartographier)

- **Outil OCR/vidéo open-source** : possible partenariat technique (Whisper.cpp, OpenCV)
- **Tiers-lieux numériques** : cf. Richard Hanna — distribution + cas d'usage
- **Médias indépendants** : TTSO, Bien ou bien, Hallu World — testeurs alpha potentiels
- **Académie / recherche** : data.europa.eu, Programminghistorian — caution méthodologique

---

## 🔴 Bloquants identifiés

| Item | Pourquoi bloquant | Décision attendue |
|---|---|---|
| **API Meta** | Coût + restrictions + ToS | Choix scope social listening |
| **Hébergement Whisper.cpp** | C++, pas en navigateur | Backend optionnel ou utilisateur installe localement |
| **Modèle ML d'apprentissage continu** | Mentionné dans la note d'origine — complexe, demande infra | Reporter à V1.0 ou repenser comme « fine-tuning utilisateur léger » |

---

## Métriques de santé du projet (à remplir chaque semaine)

| Semaine | Items traités | Sources distinctes | Score moyen | Bugs ouverts | Sessions partenaires |
|---|---|---|---|---|---|
| 11/05 | — | — | — | 0 | 0 |
| 18/05 | | | | | |
| 25/05 | | | | | |

---

## Notes de réunion / arbitrages

### 14 mai 2026 — Direction V2

- **Décision** : on garde mode sombre, on met clair en principal (fait)
- **Décision** : 6 phases au lieu de 4 → ajout Dashboard + Studio (fait)
- **Décision** : Manifeste plein écran au premier lancement (fait)
- **Demande** : cluster 3D type « neural flow » pour visualiser les patterns récurrents → 2D validable d'abord, puis 3D (fait)
- **Demande** : câbler vraiment les modes Fichier/Photo/Audio/Lien pour démo partenaires (fait)
- **À discuter** : voir avec qui on présente la démo en premier, et quel use case concret (rapport hebdo Boussole, lettre FNE, ou veille pro ?)

---

## Rituels suggérés

### Quotidien (5 min, en début ou fin de journée)

1. Capturer 1-3 items dans Le Filtre
2. Si la pile dépasse 10 : lancer l'analyse
3. Noter en bas de ce doc une ligne « ce qui m'a marqué » (verbatim, idée, doute)

### Hebdomadaire (30 min, vendredi)

1. Faire le Dashboard de la semaine (Phase 05)
2. Vérifier le cluster 2D : qu'est-ce qui revient ? Est-ce attendu ?
3. Décider 1-2 productions à pousser en Studio
4. Mettre à jour le tableau des métriques ci-dessus
5. Faire remonter 1 bug + 1 envie

### Mensuel (1h, dernier vendredi)

1. Revue des principes du manifeste — est-ce qu'on les a tenus ?
2. Revue de la stack — est-ce qu'on a dérivé ?
3. Décider un item du backlog 🔵 à pousser en haut de pile
4. Inviter une partie prenante extérieure à tester (30 min de session)

---

## Carnet de bord — ce qui m'a marqué cette semaine

> _À remplir au fil de l'eau. Objectif : capter les signaux faibles sur l'outil lui-même, pas sur la veille._

- 14/05 — _[ exemple ]_ Le cluster a fait émerger « captation » et « attention » comme cluster fort sur 3 newsletters distinctes. Vrai signal vs artefact d'un même article cité ailleurs ?
