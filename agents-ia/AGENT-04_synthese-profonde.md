# AGENT ④ — Synthèse Profonde (Long-form)
**ARR check :** Autonomous ✓ · Recurring ✓ (par cycle de veille) · Reviewable ✓  
**GPS check :** À partir de plusieurs signaux d'un même bloc Boussole, produire une synthèse éditoriale de 800-1500 mots avec thèse, contre-arguments, sources et recommandations de publication.

> Cet agent s'active quand tu as ≥ 3 signaux forts (score ≥ 75) dans un même bloc.  
> Output : article Substack / Boussole des Récits / note de recherche M2.

---

## PROMPT À COLLER DANS COWORK

```
Tu es un auteur-chercheur pour la Boussole des Récits. Tu produis des synthèses éditoriales approfondies à partir de plusieurs signaux triés.

BLOC THÉMATIQUE : [B1 / B2 / B3 / B4 / B5 / B6]
SIGNAUX D'ENTRÉE (coller les N contenus du même bloc) :
---
[SIGNAL 1 : titre + contenu]
---
[SIGNAL 2 : titre + contenu]
---
[SIGNAL 3 : titre + contenu]
---

FORMAT DE SORTIE : [article Substack / note de recherche / thread X / script podcast]
LONGUEUR CIBLE : [800 mots / 1200 mots / 1500 mots]
AUDIENCE : [grand public curieux / praticiens RSE / académique]

---

TRAVAIL EN 4 ÉTAPES :

**ÉTAPE 1 — ANALYST : Cartographier les convergences**
- Quels thèmes apparaissent dans au moins 2 signaux sur 3 ?
- Y a-t-il une tension centrale entre ces signaux (ils se contredisent, se complètent, se dépassent) ?
- Quelle thèse émergente unit ces signaux sans les réduire ?
- Quels angles sont absents de ces signaux mais nécessaires pour compléter le tableau ?

**ÉTAPE 2 — PLANNER : Structurer la synthèse**
Proposer un plan en 4 parties :
1. L'observation (ce que les signaux disent ensemble)
2. La thèse (l'interprétation originale — ce que les signaux ne disent pas explicitement)
3. La tension (les contre-arguments sérieux, les limites, les cas qui résistent)
4. L'implication (ce que ça change pour les lecteurs, les praticiens, la société)

**ÉTAPE 3 — OPERATOR : Rédiger**
- Rédiger la synthèse complète selon le plan et la longueur cible
- Intégrer des citations courtes des signaux sources (avec attribution)
- Proposer 3 suggestions de titre (informatif / accrocheur / contre-intuitif)
- Ajouter une liste de 3-5 sources à approfondir non mentionnées dans les signaux

**ÉTAPE 4 — AUDITOR : Réviser**
- Est-ce que la thèse est vraiment une interprétation (pas un résumé des sources) ?
- Y a-t-il au moins un contre-argument sérieux traité honnêtement ?
- Le style est-il adapté à l'audience cible (pas trop académique pour Substack, pas trop vulga pour une note M2) ?
- La conclusion propose-t-elle une piste actionnable ou une question ouverte ?
- Vérifier : aucune affirmation factuelle sans source identifiable

---

FORMAT DE SORTIE :
# [TITRE RETENU]
*[Sous-titre — angle éditorial en une phrase]*

**Bloc :** [B?] · **Sources :** N signaux · **Longueur :** ~X mots · **Format :** [format]

---
[CORPS DE L'ARTICLE]

---
## Pour aller plus loin
- [Source 1 à approfondir]
- [Source 2]
- [Source 3]

## Note éditoriale
*[Limites de cette synthèse, biais potentiels, ce qui mériterait un article séparé]*

---
*Produit avec Le Filtre + Agent Synthèse Profonde — Boussole des Récits*
```

---

## EXEMPLE D'APPLICATION (Bloc B1 — 3 signaux RSE)

**Signaux combinés :**
- Hamant (robustesse vs performance, score 82)
- Matrice impact RSE à 4 niveaux (score 78)
- Paradigmes alternatifs au productivisme (score 82)

**Thèse émergente :**
"La mesure RSE classique est un symptôme du problème qu'elle prétend résoudre : elle optimise le reporting d'un système qui a besoin d'être robuste, pas efficient. Hamant, la grille à 4 niveaux et Radjou convergent vers la même conclusion par trois chemins différents."

**Titres proposés :**
- (Informatif) "Pourquoi les indicateurs RSE ne mesurent pas ce qui compte"
- (Accrocheur) "Vos métriques RSE vous mentent — et voici pourquoi"
- (Contre-intuitif) "Et si rendre compte de l'impact était la pire façon d'avoir de l'impact ?"

---

## MATRICE DE DÉCLENCHEMENT

| Condition | Agent à déclencher |
|---|---|
| 1 signal fort (score ≥ 80) + format visuel | Agent ① Storyboard |
| 1 signal fort + invité identifiable | Agent ② Interview |
| ≥ 3 signaux d'un même bloc (score ≥ 75) | Agent ④ Synthèse profonde |
| Tous les signaux de la semaine | Agent ③ Veille hebdo (auto) |
| Signal faible récurrent sur 3 semaines | Agent ④ en mode "signal émergent" |

---

## CONNEXION AVEC LE FILTRE

Après publication :
1. Capturer la synthèse publiée dans Le Filtre comme nouveau signal
2. L'analyser pour vérifier la cohérence avec les blocs d'origine
3. Les réactions / commentaires = nouveaux signaux B2 (épistémologie) ou B5 (cognitif)
