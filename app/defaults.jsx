// defaults.jsx — seeds (projets / blocs / sources / stack / garde-fous / sample)

const DEFAULT_PROJECTS = [
  { id: "p_boussole", name: "Veille Boussole", objective: "Rapport hebdo en 6 blocs — signaux faibles transition + récits", keywords: "RSE, transition, récits, médias, IA responsable, sobriété", rhythm: "hebdomadaire" },
  { id: "p_fne", name: "Lettre Sobriété Matières (FNE)", objective: "Newsletter trimestrielle sur matières premières, sobriété, économie circulaire", keywords: "matières, ressources, sobriété, recyclage, métaux critiques, low-tech", rhythm: "trimestrielle" },
  { id: "p_projetz", name: "Projet Z / Boussole des Récits", objective: "Littératie médiatique — framework F/I/V/U, analyse narrative", keywords: "récits, épistémologie, médias, F/I/V/U, slow media", rhythm: "continue" },
  { id: "p_video", name: "Création vidéo (YouTube + réseaux)", objective: "Storyboards, formats courts/longs, ligne éditoriale à construire", keywords: "vidéo, format, storyboard, vulgarisation, scénario", rhythm: "à construire" },
  { id: "p_podcast", name: "Podcast (potentiel)", objective: "Sourcing d'angles, invités, sujets — exploration", keywords: "podcast, invité, angle, interview, audio", rhythm: "à construire" },
  { id: "p_pro", name: "Énergie Responsable / RSE pro", objective: "Veille réglementaire CEE, ADEME, transition énergétique", keywords: "CEE, ADEME, RSE, énergie, réglementation, EdTech", rhythm: "continue" },
  { id: "p_bapec", name: "BAPEC / Regen School", objective: "Veille management innovation, paradigmes régénératifs", keywords: "régénératif, management, transition, paradigme", rhythm: "continue" },
  { id: "p_signaux", name: "Signaux faibles (futur job/projets)", objective: "Veille systémique macro/micro, politique, démocratie, culture", keywords: "signaux faibles, démocratie, géopolitique, culture, prospective", rhythm: "continue" },
];

const DEFAULT_BLOCS = [
  { id: "B1", code: "B1", theme: "RSE / Transition écologique & sociale", color: "B1", description: "Transition écologique, justice sociale, sobriété, biodiversité, climat, économie régénérative, low-tech, circulaire." },
  { id: "B2", code: "B2", theme: "Épistémologie / Analyse narrative & médias", color: "B2", description: "Littératie médiatique, framework F/I/V/U, slow media, analyse de récits, désinformation, méta-discours." },
  { id: "B3", code: "B3", theme: "Tech / IA & numérique responsable", color: "B3", description: "IA générative, éthique, biais, numérique responsable, sobriété numérique, accessibilité, communs, open source." },
  { id: "B4", code: "B4", theme: "Géopolitique / Socioéconomie", color: "B4", description: "Géopolitique, conflits, économie mondiale, démocratie, institutions, prospective, signaux faibles macro." },
  { id: "B5", code: "B5", theme: "Sciences cognitives / Psychologie & comportement", color: "B5", description: "Sciences cognitives, neurosciences, biais, psychologie sociale, comportement, addiction, attention." },
  { id: "B6", code: "B6", theme: "Création / Formats culturels & inspiration éditoriale", color: "B6", description: "Inspirations éditoriales, formats culturels, narration, design, art, écriture, podcast, vidéo, esthétique." },
];

const DEFAULT_SOURCES = [
  { id: "s_bob", name: "Bien ou bien", protocol: "Inspiration éditoriale / formats — détecter formats remarquables, ton, structures narratives. Default → B6.", defaultBloc: "B6" },
  { id: "s_ttso", name: "Time To Sign Off (TTSO)", protocol: "Épistémologie + slow media — analyser le métadiscours médiatique, cadrages alternatifs. Default → B2.", defaultBloc: "B2" },
  { id: "s_hallu", name: "Hallu World", protocol: "IA + numérique responsable — détecter usages, dérives, contrepoints sur l'IA générative. Default → B3.", defaultBloc: "B3" },
];

// ─── STACK : transparence des outils & coûts ───────────────────────────
// Ce que l'outil utilise (ou pourrait utiliser) — visible dans le Dashboard.
const DEFAULT_STACK = [
  {
    id: "st_claude", layer: "IA", name: "Claude (Anthropic)", role: "Moteur d'analyse principal",
    model: "Propriétaire", value: "non", cost: "API payante (~$3/Mtok entrée, $15/Mtok sortie)", monthly: 12,
    frugalAlt: "Ollama + Mistral 7B ou LLaMA 3.2 — gratuit, 0€, aucune donnée sortante. Install : ollama.com → `ollama pull mistral:7b`. RGPD total.",
    priority: "haute"
  },
  {
    id: "st_whisper", layer: "IA", name: "Whisper.cpp (local)", role: "Transcription audio/vidéo",
    model: "Open-source (OpenAI MIT)", value: "oui", cost: "Gratuit, CPU local", monthly: 0,
    frugalAlt: "—", priority: "moyenne"
  },
  {
    id: "st_clip", layer: "IA", name: "CLIP / BLIP (local)", role: "Vision images (analyse visuelle)",
    model: "Open-source", value: "oui", cost: "Gratuit, CPU/GPU local", monthly: 0,
    frugalAlt: "—", priority: "moyenne"
  },
  {
    id: "st_mermaid", layer: "Visualisation", name: "Mermaid.js", role: "Génération de diagrammes (Studio)",
    model: "Open-source (MIT)", value: "oui", cost: "Gratuit, CDN jsDelivr", monthly: 0,
    frugalAlt: "PlantUML auto-hébergé (Docker) — 0€, aucun CDN externe. Syntaxe différente.",
    priority: "moyenne"
  },
  {
    id: "st_storage", layer: "Données", name: "localStorage (navigateur)", role: "Persistance fiches & config",
    model: "Standard W3C", value: "oui", cost: "Gratuit, 0 transfert réseau", monthly: 0,
    frugalAlt: "—", priority: "haute"
  },
  {
    id: "st_drive", layer: "Données", name: "Drive / Dropbox (optionnel)", role: "Import fichiers depuis cloud",
    model: "Propriétaire", value: "non", cost: "Compte existant utilisé", monthly: 0,
    frugalAlt: "Syncthing (syncthing.net) — P2P, 0 serveur tiers, RGPD natif, 0€. Ou export JSON → dossier local uniquement.",
    priority: "basse"
  },
  {
    id: "st_yt", layer: "Sources web", name: "YouTube oEmbed + yt-dlp", role: "Import vidéos longues",
    model: "yt-dlp open-source (Unlicense)", value: "partiel", cost: "Gratuit", monthly: 0,
    frugalAlt: "PeerTube (joinpeertube.org) si hébergé en propre. Sinon yt-dlp seul est déjà l'alternative la plus frugale.",
    priority: "moyenne"
  },
  {
    id: "st_ig", layer: "Sources web", name: "Instagram Graph API", role: "Import vidéos <4min, posts",
    model: "Propriétaire Meta", value: "non", cost: "Gratuit avec compte dev — auth obligatoire", monthly: 0,
    frugalAlt: "Capture manuelle uniquement. Aucune alternative automatisable sans risque RGPD.",
    priority: "basse"
  },
  {
    id: "st_host", layer: "Hébergement", name: "Statique / GitHub Pages", role: "Distribution de l'app",
    model: "Open-source (Microsoft)", value: "oui", cost: "Gratuit", monthly: 0,
    frugalAlt: "Codeberg Pages (codeberg.org — hébergeur allemand RGPD) ou Framagit (framagit.org — hébergeur français RGPD). Gratuit.",
    priority: "haute"
  },
];

// ─── RÉSEAUX (social listening — note de scope) ───────────────────────
const DEFAULT_NETWORKS = [
  { id: "n_ig", name: "Instagram", api: "Graph API + auth utilisateur", enabled: true, scope: "Posts, reels <4min, commentaires" },
  { id: "n_yt", name: "YouTube", api: "Data API v3", enabled: true, scope: "Vidéos, transcripts, commentaires" },
  { id: "n_tt", name: "TikTok", api: "Research API (limitée)", enabled: false, scope: "Vidéos publiques, hashtags" },
  { id: "n_li", name: "LinkedIn", api: "Marketing API (restreinte)", enabled: false, scope: "Posts publics" },
  { id: "n_sub", name: "Substack", api: "RSS public", enabled: true, scope: "Newsletters, articles" },
  { id: "n_pod", name: "Podcasts (Spotify / Deezer / RSS)", api: "RSS + APIs", enabled: true, scope: "Épisodes, descriptions" },
  { id: "n_fb", name: "Facebook", api: "Graph API + auth", enabled: false, scope: "Pages publiques, posts" },
  { id: "n_snap", name: "Snapchat", api: "Public Stories API", enabled: false, scope: "Stories publiques (limité)" },
];

// ─── GARDE-FOUS éditoriaux (notes d'origine, important) ───────────────
const DEFAULT_GARDEFOUS = [
  { id: "gf_1", icon: "⊘", title: "Ce n'est pas une vérité absolue", body: "Le scoring est une heuristique calibrée par toi. Il n'a pas valeur de jugement." },
  { id: "gf_2", icon: "⌖", title: "Points de vigilance permanents", body: "Recouper les sources, accepter le doute, garder un journal des biais détectés." },
  { id: "gf_3", icon: "⌁", title: "La majorité reste silencieuse", body: "Les commentaires les plus visibles ne sont pas les plus représentatifs. Le silence est une donnée." },
  { id: "gf_4", icon: "◐", title: "Situations conjoncturelles", body: "Un signal est souvent causal et daté. Ne pas généraliser sans recadrer dans son contexte." },
  { id: "gf_5", icon: "⇄", title: "Spontanéité ≠ vérité", body: "Les verbatims spontanés sont précieux mais partiels. Ils ne remplacent pas un terrain qualitatif." },
];

// ─── INSPIRATIONS / outils recommandés (transparence) ──────────────────
const DEFAULT_INSPIRATIONS = [
  { id: "in_1", category: "Sobriété design", name: "Linear", note: "Référence interactions minimalistes" },
  { id: "in_2", category: "Sobriété design", name: "Observatoire Média Écologie", note: "Design simple, lisible, frugal" },
  { id: "in_3", category: "Dashboards", name: "Grafana", note: "Pour l'inspiration data-viz modulaire (open-source)" },
  { id: "in_4", category: "Dashboards", name: "Superset (Apache)", note: "Alternative open-source pour data-viz lourde" },
  { id: "in_5", category: "Création visuelle", name: "Napkin.ai", note: "Esquisse rapide à intégrer comme appui, jamais comme substitut au geste" },
  { id: "in_6", category: "Data-viz", name: "Datawrapper", note: "Graphiques sobres, accessibles, à intégrer" },
  { id: "in_7", category: "Cadre", name: "data.europa.eu", note: "Guide data-viz officiel + pièges à éviter" },
];

const SAMPLE_CONTENT = `From: TTSO <hello@ttso.fr>
Subject: Les médias face au mur de l'attention

Cette semaine, on s'arrête sur un chiffre qui revient partout : 7 secondes. C'est, selon une étude de Microsoft reprise par tout le monde sans jamais être vérifiée, la durée d'attention moyenne d'un humain en 2025. Sauf que cette étude n'existe pas. Microsoft ne l'a jamais publiée. La source originale est une compilation de chiffres canadiens des années 2000, mal interprétée par un journaliste de Time Magazine, et reprise depuis dans des centaines d'articles, conférences TEDx, et livres de management.

Cas d'école d'une métrique zombie : un chiffre faux qui survit parce qu'il arrange tout le monde. Les médias en tirent un récit de déclin civilisationnel, les marketeurs justifient des formats toujours plus courts, les politiques accusent les écrans. Personne ne va vérifier.

Plus profondément, cette histoire pose la question du cadrage : qui décide qu'on parle d'"économie de l'attention" plutôt que d'"économie de la captation" ? Le premier terme suggère que l'attention est un actif que l'utilisateur place ; le second qu'elle lui est arrachée. Tim Wu, professeur à Columbia, défend la seconde formulation depuis dix ans dans "The Attention Merchants" (2016).

À lire cette semaine :
— "Stolen Focus" de Johann Hari (Crown, 2022) : enquête longue sur les 12 facteurs qui détruisent notre capacité d'attention, dont la nutrition et la pollution, rarement cités.
— Le rapport 2025 de l'Arcom sur la consommation médiatique des 15-24 ans : 3h47/jour sur les plateformes, mais 68% disent vouloir "moins de notifications".

Bonne lecture,
L'équipe TTSO`;

window.DEFAULTS = {
  projects: DEFAULT_PROJECTS,
  blocs: DEFAULT_BLOCS,
  sources: DEFAULT_SOURCES,
  stack: DEFAULT_STACK,
  networks: DEFAULT_NETWORKS,
  gardefous: DEFAULT_GARDEFOUS,
  inspirations: DEFAULT_INSPIRATIONS,
  sample: SAMPLE_CONTENT,
};
