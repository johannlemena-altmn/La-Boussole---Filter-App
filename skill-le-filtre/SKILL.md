---
name: le-filtre
description: >
  Skill de triage éditorial selon la méthodologie "Le Filtre" — à utiliser dès que Johann
  mentionne analyser, trier, qualifier, scorer ou classer du contenu (newsletters, articles,
  notes, vidéos, podcasts, PDFs, URLs). Déclencher aussi pour : "aide-moi à trier mes contenus",
  "analyse ce que j'ai reçu", "classe ça dans mes blocs", "fais une fiche qualifiée",
  "score ce contenu", "c'est pour quelle veille ?", "ça rentre dans quel bloc ?".
  Contient le cadre complet : 6 blocs Boussole+, scoring 5 critères, format fiche qualifiée,
  protocoles sources récurrentes, projets de Johann.
---

# Le Filtre — Skill de Triage Éditorial

## Principe fondamental

Le Filtre est un outil de triage sobre : l'IA prépare, classe et suggère — elle ne décide pas à
la place de l'utilisateur. Le scoring n'est pas une vérité. Le silence est une donnée. Le geste
humain final compte.

Chaque contenu analysé passe par 4 étapes : **détecter la source → choisir le bloc → scorer →
extraire l'angle exploitable**. Le résumé (2-3 phrases max) doit permettre à Johann de juger
la pertinence sans ouvrir le contenu.

---

## Les 6 Blocs Boussole+ (système de classification)

| Code | Thème | Mots-clés centraux |
|------|-------|-------------------|
| **B1** 🟢 | RSE / Transition écologique & sociale | sobriété, impact, CSRD, ESG, biodiversité, décarbonation, économie circulaire, CEE, ADEME |
| **B2** 🔵 | Épistémologie / Analyse narrative & médias | slow media, littératie, récits, biais, opinion vs fait, désinformation, cadrage, F/I/V/U |
| **B3** 🟣 | Tech / IA & numérique responsable | IA générative, numérique frugal, open source, low-tech, accessibilité numérique, data |
| **B4** 🟡 | Géopolitique / Socioéconomie | macro, signaux faibles, démographie, inégalités, géopolitique des ressources, politique publique |
| **B5** 🔴 | Sciences cognitives / Psychologie & comportement | biais cognitifs, motivation, apprentissage, attention, comportement organisationnel |
| **B6** 🟠 | Création / Formats culturels & inspiration éditoriale | storytelling, design, typographie, formats vidéo, newsletters, storyboard, culture pop utile |

**Règle de multi-bloc** : si un contenu couvre légitimement 2 blocs, indiquer les deux (ex : B1+B3).
Ne pas forcer — un contenu dans le mauvais bloc est pire qu'un contenu non classé.

---

## Système de score pondéré (sur 10)

Chaque critère est noté de 0 à 2 :

| Critère | Poids | Question clé |
|---------|-------|-------------|
| **Pertinence projet** | ×2 | Ce contenu nourrit-il directement un projet actif de Johann ? |
| **Originalité** | ×1.5 | Apporte-t-il un angle, une donnée ou un cadre qu'on ne voit pas partout ? |
| **Actionnabilité** | ×1.5 | Peut-on en tirer quelque chose de concret : angle vidéo, argument, référence ? |
| **Densité informationnelle** | ×1 | Le rapport signal/bruit est-il bon ? |
| **Temporalité** | ×1 | Est-ce urgent/frais, ou intemporel mais solide ? |

**Score final** = somme pondérée ramenée sur 10. Arrondi à 0.5.
Seuil de qualification recommandé : **≥ 6.5**

---

## Format de la fiche qualifiée

Pour chaque contenu analysé, produire :

```
── FICHE #[N] ─────────────────────────────────────────────
Source     : [nom exact de la newsletter / site / auteur]
Type       : [note / article / vidéo / podcast / thread / rapport]
Bloc       : [B1 à B6, ou B1+B3 si multi-bloc]
Score      : [X.X / 10]  →  [QUALIFIÉ / À ÉCARTER / RÉSERVER]

Résumé     : [2-3 phrases qui permettent de juger sans ouvrir le contenu.
              Pas de résumé générique — pointer l'information spécifique.]

Angle      : [Une phrase : comment Johann peut exploiter ce contenu ?
              Ex : "Angle pour Boussole B1 : chiffre sur les CEE à recycler dans la synthèse Q2"]

Projets    : [Quels projets de Johann sont directement nourris ? Liste courte.]
────────────────────────────────────────────────────────────
```

**Décision finale** :
- **QUALIFIÉ** (≥ 6.5) → entre dans la file de triage
- **RÉSERVER** (5.0–6.4) → potentiellement utile plus tard, contexte précis manquant
- **À ÉCARTER** (< 5.0) → archiver sans traitement

---

## Protocoles sources récurrentes

Ces sources ont des traitements spécifiques car Johann les reçoit régulièrement :

**Bien ou bien** → traitement "inspiration éditoriale" (B6 par défaut)
- Chercher : formats narratifs originaux, angles de storytelling, exemples de marques utiles
- Ne pas scorer sur la pertinence RSE directe — c'est de l'inspiration créative

**Time To Sign Off (TTSO)** → traitement "épistémologie + slow media" (B2 par défaut)
- Chercher : critique des médias, recommandations de lecture lente, réflexions sur l'attention
- Valoriser les contenus qui questionnent les pratiques informationnelles

**Hallu World** → traitement "IA + numérique responsable" (B3 par défaut)
- Chercher : cas d'usage concrets, risques identifiés, alternatives frugales, gouvernance IA
- Bonus de pertinence si le contenu touche à la formation ou à l'accessibilité

**Newsletters RSE génériques** (nombreuses) → B1 par défaut
- Priorité aux données chiffrées fraîches, réglementations, études de cas terrain
- Écarter les contenus trop corporate / greenwashing manifeste

---

## Projets actifs de Johann (contexte veille)

| Projet | Description | Blocs prioritaires |
|--------|-------------|-------------------|
| **Veille Boussole** | Rapports hebdomadaires structurés en 5 blocs | B1, B2, B3, B4 |
| **Lettre Sobriété Matières (FNE)** | Newsletter trimestrielle, matières premières & transition | B1, B4 |
| **Boussole des Récits / Projet Z** | Littératie médiatique, framework F/I/V/U | B2, B5 |
| **Création vidéo** | YouTube + réseaux, formats courts/longs | B6, B2 |
| **BAPEC / Regen School** | Veille RSE, transition, management innovation | B1, B5 |
| **Travail (Energie Responsable)** | Veille CEE, réglementaire, EdTech, accessibilité | B1, B3 |

---

## Règles de déduplication

Si un même contenu arrive via plusieurs sources :
1. Retenir la version la plus complète / la meilleure source
2. Mentionner "Vu également via [source2]" dans la fiche
3. Ne scorer qu'une fois — le fait qu'il circule beaucoup peut légèrement baisser l'originalité (-0.5 sur ce critère)

---

## Comportements attendus

**En triage batch** (plusieurs contenus d'un coup) :
- Commencer par un tableau récapitulatif : titre / bloc / score / décision
- Puis les fiches complètes pour les QUALIFIÉS uniquement (sauf si Johann veut tout)
- Classer les QUALIFIÉS par score décroissant

**En analyse unitaire** (un seul contenu) :
- Fiche complète + 1-2 suggestions d'angle supplémentaires
- Si score ≥ 8 : proposer spontanément un angle "analyse approfondie"

**En calibrage** (Johann ajuste ses blocs ou projets) :
- Écouter, noter les ajustements
- Proposer de mettre à jour ce skill si les blocs ou projets changent significativement

**Ce skill ne fait pas** :
- Rédiger les articles/newsletters (il prépare, il ne crée pas)
- Décider à la place de Johann (il suggère)
- Promettre une vérité sur le scoring (c'est un outil d'aide, pas un oracle)

---

## Garde-fous

- Le scoring est une aide, pas une vérité : Johann a toujours le dernier mot
- Les contenus très viraux ne sont pas forcément les plus pertinents
- Le silence sur une thématique dans les newsletters reçues est aussi une information
- Signaler si un contenu est difficile à classifier plutôt que de forcer un bloc

---

*Skill Le Filtre v0.2 — Mai 2026*
*Mettre à jour quand les projets, blocs ou sources récurrentes évoluent.*
