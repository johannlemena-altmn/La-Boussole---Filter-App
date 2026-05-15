# Agentic OS — Boussole des Récits
**Architecture :** 6 processus spécialisés · ADN éditorial figé · Calibration ML · Auto-évaluation  
**Basé sur :** ARR framework · GPS check · 4 workers (Analyst / Planner / Operator / Auditor)  
**Construit depuis :** Le Filtre triage (35 signaux, session mai 2026)

---

## Le principe clé

> *"Find a highly specific task people hate doing, but they have to do it repeatedly. That's where the money is."*

| Tâche | Temps avant | Temps après |
|---|---|---|
| Transformer un signal en storyboard vidéo | 2-3h | ~10 min |
| Préparer un brief d'interview | 1-2h | ~5 min |
| Synthétiser la semaine de veille | 1-2h (chaque lundi) | automatique |
| Écrire un long-form à partir de sources éparses | 3-4h | ~15 min |
| Créer un graphique ou visuel de données | 1-2h | ~5 min |
| Lire et résumer un document volumineux | 30-60 min | ~2 min |

---

## Les 6 agents (Agentic OS)

```
[Agent 0 Compress] <- préprocesseur, réduit les inputs avant traitement
        |
[Agent 3 Veille Hebdo] <- planificateur, lundi 7h auto (Gmail MCP + schedule)
        |
[Le Filtre — triage + scores]
   /        |        |        \
[1]       [2]      [4]      [5]
Storyboard Interview Synthèse Dataviz
   |        |        |        |
YouTube  Podcast Substack  Visuels
   |        |        |        |
[Capture Le Filtre -> nouveau cycle de veille]
```

| # | Agent | Skill Cowork | Déclencheur | Output |
|---|---|---|---|---|
| 0 | Compress | boussole-compress | Fichier volumineux / pipeline long | Contexte compressé 60-95% |
| 1 | Storyboard Vidéo | boussole-storyboard | Signal score >= 80 | Storyboard + script voix-off |
| 2 | Préparation Interview | boussole-interview | Signal + invité identifié | Brief 1 page + 12 questions |
| 3 | Veille Boussole Hebdo | boussole-veille-hebdo | Lundi 7h (Schedule) | Rapport 6 blocs + Top 5 |
| 4 | Synthèse Profonde | boussole-synthese-profonde | >= 3 signaux même bloc >= 75 | Article 800-1500 mots |
| 5 | Dataviz | boussole-dataviz | Signal/synthèse avec données | Prompt Napkin / Datawrapper / SVG / Mermaid |

---

## Fichiers .skill (prêts à installer dans Cowork)

Dossier : agents-ia/skills/

  boussole-compress.skill
  boussole-storyboard.skill
  boussole-interview.skill
  boussole-veille-hebdo.skill
  boussole-synthese-profonde.skill
  boussole-dataviz.skill

Installation : Glisser le fichier .skill dans Cowork -> Settings -> Skills

---

## Structure interne de chaque skill

```
boussole-[nom]/
├── SKILL.md                      <- instructions + workflow 4 étapes + auto-évaluation
└── references/
    ├── editorial-dna.md          <- KERNEL : ADN éditorial figé (blocs, style, voix)
    └── calibration-anchors.md   <- TRAINING DATA : exemples gold standard avec scores
```

Analogie ML :
- editorial-dna.md = poids figés (ne dérivent pas entre les sessions)
- calibration-anchors.md = données d'entraînement (exemples avec scores attendus)
- Auto-évaluation (5 dimensions, 0-10) = fonction de perte
- AUDITOR step = validation loop
- Seuil de livraison 35/50 = critère d'acceptation
- Détection de dérive = regularization

---

## Outils dataviz connectés (Agent 5)

| Outil | Usage | Lien |
|---|---|---|
| Napkin.ai | Diagrammes conceptuels depuis texte | https://www.napkin.ai |
| Datawrapper | Graphiques de données interactifs | https://www.datawrapper.de |
| Mermaid | Diagrammes process / timeline | https://mermaid.live |
| Canva | Visuels branding (via MCP si connecté) | Via MCP |
| SVG/HTML | Code autonome embarquable | Généré directement |

---

## GPS check — avant d'automatiser

G — Goal : L'objectif est-il formulé en UNE phrase claire ?
P — Proof : Quel est le critère de succès ?
S — Steps : Chaque étape est-elle décrite sans ambiguïté ?

Si une réponse est floue -> rester en mode manuel. Automatiser après.

---

## Principe final

> "When output becomes infinite, taste becomes scarce."

Les agents produisent. Toi tu juges, tu choisis, tu publies.
Le Filtre + les agents = infrastructure. La Boussole des Récits = ta voix.
