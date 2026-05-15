# MÉMO — Outil de Triage & Organisation de Contenus

## "Le Filtre" — Architecture & Contexte complet

*Version 1.0 — Mai 2026 | Construit avec Johann*

---

## 1\. GENÈSE DU PROJET

### Le problème de départ

Johann accumule des contenus depuis plusieurs années sans système de triage efficace : newsletters, articles, vidéos, podcasts, PDFs de cours, liens sauvegardés, notes éparses. La "curiosité excessive" couplée à une charge cognitive élevée (plusieurs projets en parallèle) crée un engorgement chronique : tout est sauvegardé, rien n'est vraiment consommé ni exploité.

Le prompt de base (document en PJ) a été construit lors d'une session précédente (9 mai 2026\) pour Cowork/Gmail. Il couvre 4 étapes : scan exhaustif → tri par blocs → qualification éditoriale → synthèse stratégique.

### L'ambition élargie

Rendre cet outil accessible à **tout profil curieux submergé** — pas uniquement des profils RSE/transition. Le problème est universel : étudiants, professionnels, créateurs de contenu, chercheurs, militants, journalistes... Tous se noient dans un flux d'informations jamais vraiment trié.

---

## 2\. CONTEXTE UTILISATEUR (Johann)

### Projets principaux alimentés par la veille

| Projet | Description | Fréquence d'alimentation |
| :---- | :---- | :---- |
| **Veille Boussole** | Rapports hebdomadaires structurés en 5 blocs thématiques | Hebdomadaire |
| **Lettre Sobriété Matières (FNE)** | Newsletter trimestrielle, matières premières & transition | Trimestrielle |
| **Projet Z / Boussole des Récits** | Littératie médiatique, framework F/I/V/U, débat public | Continue |
| **Création vidéo** (YouTube \+ réseaux) | Formats courts/longs, storyboards, ligne éditoriale | À construire |
| **Podcast (potentiel)** | Angles, invités, sujets | À construire |
| **Travail (Energie Responsable ; suivi glaaster même si terminé car utile)** | Veille RSE, CEE, règlementaire, ADEME et écosystème de la transition énergétique(Veille EdTech, accessibilité, inclusion, SaaS | Continue |
| **BAPEC / Regen School** | Veille RSE, transition, management innovation | Continue |
| ***Potentiel futur job/projets*** | *Veille systémique (macro/micro), enjeux socio-environnementaux, politique/démocratie, culture/arts → signaux faibles(ex avec la candidature Makesense)* | *Continue* |

### Sources récurrentes avec protocoles spécifiques

- **Bien ou bien** → traitement "inspiration éditoriale" (B6)  
- **Time To Sign Off (TTSO)** → traitement "épistémologie \+ slow media" (B2)  
- **Hallu World** → traitement "IA \+ numérique responsable" (B3)  
- Plus : newsletters RSE/impact (nombreuses), alertes LinkedIn/Twitter, flux Feedly (à confirmer)

### Les 6 Blocs Boussole+ (système de classification)

| Bloc | Thème | Couleur |
| :---- | :---- | :---- |
| B1 | RSE / Transition écologique & sociale | 🟢 Vert |
| B2 | Épistémologie / Analyse narrative & médias | 🔵 Bleu |
| B3 | Tech / IA & numérique responsable | 🟣 Violet |
| B4 | Géopolitique / Socioéconomie | 🟡 Jaune |
| B5 | Sciences cognitives / Psychologie & comportement | 🔴 Rouge |
| B6 | Création / Formats culturels & inspiration éditoriale | 🟠 Orange |

---

## 3\. ARCHITECTURE DE L'OUTIL — DEUX COUCHES

### Couche 1 — Prompt Cowork (usage personnel Johann)

**Statut** : V1 existante (PJ), à affiner avec fichiers de contexte **Fonctionnement** : Cowork \+ Gmail connecté → scan automatique mailbox → rapport structuré **Avantage** : Accès direct aux mails, zéro copier-coller **Limite** : Nécessite compte Anthropic \+ Cowork → non scalable pour le public **Fichiers à intégrer dans le prompt** :

- Liste des projets Johann \+ mots-clés associés  
- Liste des sources récurrentes \+ leurs protocoles de traitement  
- Définition des 6 blocs avec exemples de contenus  
- Template de fiche qualifiée au format markdown

### Couche 2 — Artifact public (React \+ API Claude intégrée)

**Statut** : À construire **Fonctionnement** : App web standalone — l'utilisateur définit ses projets/blocs, colle/uploade ses contenus, l'IA trie et qualifie **Avantage** : Zéro setup, zéro compte, accessible à tous **Sources supportées** :

- ✅ Texte collé (newsletter, article, notes)  
- ✅ URLs multiples (analyse du contenu de chaque lien)  
- ✅ Upload PDF/fichier  
- ✅ Flux RSS (URL de flux à parser)  
- ⬜ Gmail (version publique : hors scope — vie privée)

---

## 4\. SPÉCIFICATIONS DE L'ARTIFACT PUBLIC

### Nom de travail

**"Le Filtre"** — ou autre nom à définir (sobre, mémorable, universel)

### Flux utilisateur (UX)

\[1. SETUP\] → Définir ses "projets" (libres) \+ ses "blocs thématiques" (ou utiliser les défauts)

\[2. INPUT\] → Coller contenus / URLs / uploader fichier / flux RSS

\[3. ANALYSE\] → Claude analyse, classe, score chaque contenu

\[4. OUTPUT\] → Tableau de triage \+ fiches qualifiées \+ synthèse

\[5. EXPORT\] → Markdown / JSON / Copier-coller

### Modules fonctionnels

1. **Setup rapide** : 2-3 questions pour calibrer l'outil (tes projets, tes centres d'intérêt, ton objectif principal : consommer / créer / partager / archiver)  
2. **Zone d'input multi-source** : tabs pour chaque type de source  
3. **Moteur de triage** : appel API Claude avec prompt structuré (4 étapes du prompt PJ adapté)  
4. **Dashboard résultats** : vue tableau \+ vue fiches \+ vue synthèse  
5. **Système de blocs customisable** : blocs Boussole par défaut, modifiables par l'utilisateur  
6. **Export** : copier en markdown, télécharger en JSON

### Principes de design

- **Sobre** : pas de couleurs criardes, typographie lisible, densité d'information maîtrisée  
- **Accessible** : contraste WCAG AA minimum, navigation clavier, lecteur d'écran compatible  
- **Editorial** : l'interface ressemble à un outil de journaliste/chercheur, pas à un dashboard SaaS générique  
- **Mobile-friendly** : fonctionne sur téléphone (lecture des résultats, au moins)  
- **Progressif** : l'utilisateur peut aller jusqu'à l'étape qu'il souhaite (juste trier, ou aller jusqu'à la fiche complète)

---

## 5\. PROMPT COWORK V1 — ÉTAT & LACUNES

### Ce qui est bien dans le prompt PJ

- Structure en 4 étapes claire et logique  
- Système de blocs bien défini avec couleurs  
- Fiche qualifiée détaillée (5 dimensions : analytique, vidéo, newsletter, podcast, note éditoriale)  
- Système de score pondéré transparent (5 critères)  
- Format de livraison précis

### Ce qui manque / à améliorer

1. **Contexte projet dynamique** : le prompt cite les projets de Johann en dur → à remplacer par un bloc de contexte injecté depuis un fichier (permet réutilisation par d'autres)  
2. **Protocoles sources récurrentes** : Bien ou bien, TTSO, Hallu World méritent des instructions spécifiques intégrées  
3. **Gestion des doublons** : si un même article arrive via 3 newsletters différentes → règle de déduplication  
4. **Niveau de détail variable** : certains contenus méritent une fiche courte, d'autres une analyse longue → ajouter un flag "analyse approfondie" pour les tops scores  
5. **Traçabilité temporelle** : garder la date de réception pour faire des tendances sur plusieurs semaines

---

## 6\. FICHIERS À TRANSMETTRE POUR LE BUILD

### Pour le prompt Cowork (raffinement)

| Fichier | Contenu | Format idéal |
| :---- | :---- | :---- |
| `projets_contexte.md` | Liste des projets \+ description \+ mots-clés \+ objectif de veille par projet | Markdown |
| `sources_protocoles.md` | Liste des sources récurrentes \+ leur traitement spécifique | Markdown |
| `blocs_definitions.md` | Les 6 blocs avec définitions élargies \+ exemples de contenus | Markdown |
| Export newsletter (ex.) | Un exemple de mail de Bien ou bien / TTSO / Hallu World | Texte brut ou HTML |

### Pour l'artifact public (build)

- Aucun fichier obligatoire — l'artifact sera autonome  
- Mais utile : tes blocs en JSON pour prépopuler les defaults

### Pour tester le prototype

- 5 à 10 mails représentatifs (texte collé) couvrant plusieurs blocs  
- Quelques URLs d'articles récents de tes newsletters

---

## 7\. PROCHAINES ÉTAPES

| Étape | Action | Priorité |
| :---- | :---- | :---- |
| **A** | Johann transmet les fichiers de contexte (projets, sources, blocs) | 🔴 Immédiat |
| **B** | Build de l'artifact public "Le Filtre" v0.1 (React \+ API Claude) | 🔴 Immédiat |
| **C** | Test de l'artifact avec 10 contenus réels | 🟡 Après B |
| **D** | Raffinement du prompt Cowork avec fichiers contexte | 🟡 Après A |
| **E** | Définir le nom définitif \+ ligne éditoriale de l'outil public | 🟢 Peut attendre |
| **F** | Réfléchir au modèle de diffusion (artifact partageable ? landing page ?) | 🟢 Peut attendre |

---

*Mémo généré le 14 mai 2026 — à mettre à jour après chaque session de travail*

---

**PS : creuser le framework F/I/V/U et aussi le “double diamond framework” pour compléter et solidifier l’outil** 