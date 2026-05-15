// engine.jsx — Claude prompt builder + JSON parser + scoring helpers

function buildPrompt(item, ctx) {
  const {
    projects,
    blocs,
    sources,
    weights
  } = ctx;
  const projectsBlock = projects.map(p => `  - [${p.id}] ${p.name} — ${p.objective}${p.keywords ? ` (mots-clés : ${p.keywords})` : ""}`).join("\n");
  const blocsBlock = blocs.map(b => `  - ${b.code} · ${b.theme} — ${b.description}`).join("\n");
  const sourcesBlock = sources.length ? sources.map(s => `  - "${s.name}" → ${s.protocol}`).join("\n") : "  (aucun protocole spécifique défini)";
  const weightsBlock = weights ? `Pondérations score sur 100 (la somme = 100) :
  - pertinence (alignement avec projets utilisateur) : ${weights.pertinence}
  - fraîcheur (actualité / signal récent) : ${weights.fraicheur}
  - profondeur (qualité analytique du contenu) : ${weights.profondeur}
  - actionnable (matière exploitable pour produire) : ${weights.actionnable}
  - originalité (angle, contrepoint, signal faible) : ${weights.originalite}` : "";
  const hint = item.sourceHint ? `\nL'utilisateur indique que cette source est : "${item.sourceHint}".` : "";
  const type = item.type ? `\nType déclaré : ${item.type}.` : "";
  return `Tu es **Le Filtre**, un moteur de triage éditorial qualifié. Ton rôle : analyser un contenu (newsletter, article, note, transcription) et le qualifier dans le système de classification de l'utilisateur.

═══ CONTEXTE UTILISATEUR ═══

PROJETS EN COURS :
${projectsBlock}

BLOCS THÉMATIQUES :
${blocsBlock}

PROTOCOLES SOURCES RÉCURRENTES :
${sourcesBlock}

${weightsBlock}

═══ CONTENU À QUALIFIER ═══
${hint}${type}

\`\`\`
${item.text.slice(0, 8000)}
\`\`\`

═══ CONSIGNES ═══

1. Identifie la source si possible (ex: "Bien ou bien", "TTSO", "Hallu World", "LinkedIn", "Newsletter inconnue", etc.).
2. Choisis UN bloc dominant (B1 à B6). Si ambigu, mentionne-le.
3. Identifie les projets pertinents (1 à 3 IDs).
4. Score chaque dimension de 0 à 20 selon les pondérations, puis somme = score total /100.
5. Rédige une fiche courte (3-5 lignes max) en français, ton sobre éditorial.
6. Si le contenu mérite un approfondissement (score > 70), propose un angle éditorial concret pour une production (vidéo, newsletter, podcast, note).
7. Extrais 2-3 verbatims ou idées-force courts.
8. Soulève 1-2 questions ouvertes que ce contenu pose.

═══ FORMAT DE RÉPONSE ═══

Renvoie UNIQUEMENT un objet JSON valide, sans backticks, sans markdown, sans texte autour. Structure exacte :

{
  "title": "titre synthétique 5-10 mots",
  "source_detected": "nom de la source ou 'Inconnue'",
  "summary": "fiche courte 3-5 lignes",
  "bloc_id": "B1|B2|B3|B4|B5|B6",
  "bloc_label": "nom du bloc",
  "bloc_confidence": "haute|moyenne|basse",
  "projects": ["p_xxx", "p_yyy"],
  "type_contenu": "newsletter|article|video|podcast|note|autre",
  "score": 73,
  "score_breakdown": {
    "pertinence": 18,
    "fraicheur": 15,
    "profondeur": 14,
    "actionnable": 12,
    "originalite": 14
  },
  "angle_editorial": "1-2 phrases, ou null si score < 70",
  "format_potentiel": ["note","newsletter"],
  "verbatim_cles": ["citation 1", "citation 2"],
  "questions_ouvertes": ["question 1"],
  "alerte_doublon": null
}`;
}
function safeJSONParse(raw) {
  if (!raw) return null;
  let txt = raw.trim();
  // strip code fences
  txt = txt.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  // grab first {...} block
  const first = txt.indexOf("{");
  const last = txt.lastIndexOf("}");
  if (first >= 0 && last > first) txt = txt.slice(first, last + 1);
  try {
    return JSON.parse(txt);
  } catch (e) {
    // try a soft repair: remove trailing commas
    try {
      const cleaned = txt.replace(/,(\s*[\]}])/g, "$1");
      return JSON.parse(cleaned);
    } catch (e2) {
      return null;
    }
  }
}

// ─────── VISION PROMPT (pour items avec imageData) ───────
function buildVisionPrompt(item, ctx) {
  const {
    projects,
    blocs,
    sources,
    weights
  } = ctx;
  const projectsBlock = projects.map(p => `  - [${p.id}] ${p.name} — ${p.objective}${p.keywords ? ` (mots-clés : ${p.keywords})` : ""}`).join("\n");
  const blocsBlock = blocs.map(b => `  - ${b.code} · ${b.theme} — ${b.description}`).join("\n");
  const weightsBlock = weights ? `Pondérations score sur 100 :
  - pertinence : ${weights.pertinence}  - fraîcheur : ${weights.fraicheur}
  - profondeur : ${weights.profondeur}  - actionnable : ${weights.actionnable}  - originalité : ${weights.originalite}` : "";
  const textPrompt = `Tu es Le Filtre, un moteur de triage éditorial. Analyse cette image comme un contenu éditorial à part entière.

═══ CONTEXTE UTILISATEUR ═══

PROJETS EN COURS :
${projectsBlock}

BLOCS THÉMATIQUES :
${blocsBlock}

${weightsBlock}

═══ CONTENU À ANALYSER ═══
Source déclarée : "${item.sourceHint || "inconnue"}". Type déclaré : ${item.type || "note"}.

Observe attentivement cette image. Lis tous les textes visibles (imprimés, manuscrits, légendes, titres). Identifie les visuels, graphiques, tableaux, schémas, captures d'écran. Déduis l'angle éditorial et les idées-force.

Si l'image est un document de travail, une note, un schéma, un article photographié, ou une capture d'écran : traite son contenu exactement comme un article texte.

═══ CONSIGNES ═══

1. Identifie la source si possible.
2. Choisis UN bloc dominant (B1 à B6).
3. Identifie les projets pertinents.
4. Score chaque dimension de 0 à 20 selon les pondérations, somme = score /100.
5. Rédige une fiche courte (3-5 lignes) en français, ton sobre éditorial.
6. Si score > 70, propose un angle éditorial concret.
7. Extrais 2-3 verbatims ou idées-force visibles dans l'image.
8. Soulève 1-2 questions ouvertes.

Renvoie UNIQUEMENT un objet JSON valide, sans backticks, sans markdown :

{
  "title": "titre synthétique 5-10 mots",
  "source_detected": "nom de la source ou 'Inconnue'",
  "summary": "fiche courte 3-5 lignes",
  "bloc_id": "B1|B2|B3|B4|B5|B6",
  "bloc_label": "nom du bloc",
  "bloc_confidence": "haute|moyenne|basse",
  "projects": [],
  "type_contenu": "note|article|video|podcast|autre",
  "score": 0,
  "score_breakdown": { "pertinence": 0, "fraicheur": 0, "profondeur": 0, "actionnable": 0, "originalite": 0 },
  "angle_editorial": null,
  "format_potentiel": [],
  "verbatim_cles": [],
  "questions_ouvertes": [],
  "alerte_doublon": null
}`;
  return [{
    type: "image",
    source: {
      type: "base64",
      media_type: item.imageMediaType || "image/jpeg",
      data: item.imageData
    }
  }, {
    type: "text",
    text: textPrompt
  }];
}

// ─────── ANALYZE ITEM ───────
async function analyzeItem(item, ctx) {
  try {
    let raw;
    if (item.imageData) {
      // Voie Vision — envoie l'image directement à Claude
      const contentArray = buildVisionPrompt(item, ctx);
      raw = await window.claude.completeMultimodal(contentArray);
    } else {
      // Voie texte — comportement habituel
      const prompt = buildPrompt(item, ctx);
      raw = await window.claude.complete(prompt);
    }
    const parsed = safeJSONParse(raw);
    if (!parsed) {
      return {
        ok: false,
        error: "Réponse non parsable",
        raw
      };
    }
    // normalize
    parsed.score = Number(parsed.score) || 0;
    parsed.score_breakdown = parsed.score_breakdown || {};
    parsed.projects = Array.isArray(parsed.projects) ? parsed.projects : [];
    parsed.verbatim_cles = Array.isArray(parsed.verbatim_cles) ? parsed.verbatim_cles : [];
    parsed.questions_ouvertes = Array.isArray(parsed.questions_ouvertes) ? parsed.questions_ouvertes : [];
    parsed.format_potentiel = Array.isArray(parsed.format_potentiel) ? parsed.format_potentiel : [];
    return {
      ok: true,
      result: parsed
    };
  } catch (e) {
    return {
      ok: false,
      error: e.message || "Échec d'appel"
    };
  }
}
function scoreClass(score) {
  if (score >= 75) return "high";
  if (score >= 50) return "mid";
  return "low";
}

// markdown export
function exportItemMarkdown(item, ctx) {
  if (!item.result) return "";
  const r = item.result;
  const projets = (r.projects || []).map(pid => {
    const p = ctx.projects.find(pp => pp.id === pid);
    return p ? p.name : pid;
  }).join(", ");
  const lines = [];
  lines.push(`## ${r.title || "(sans titre)"}`);
  lines.push("");
  lines.push(`**Source** : ${r.source_detected || "—"} · **Type** : ${r.type_contenu || "—"} · **Bloc** : ${r.bloc_id} — ${r.bloc_label || ""} · **Score** : ${r.score}/100`);
  lines.push("");
  if (projets) lines.push(`**Projets** : ${projets}`);
  lines.push("");
  if (r.summary) {
    lines.push("### Fiche");
    lines.push(r.summary);
    lines.push("");
  }
  if (r.angle_editorial) {
    lines.push("### Angle éditorial");
    lines.push(r.angle_editorial);
    lines.push("");
  }
  if (r.verbatim_cles?.length) {
    lines.push("### Verbatims");
    r.verbatim_cles.forEach(v => lines.push(`> ${v}`));
    lines.push("");
  }
  if (r.questions_ouvertes?.length) {
    lines.push("### Questions ouvertes");
    r.questions_ouvertes.forEach(q => lines.push(`- ${q}`));
    lines.push("");
  }
  if (r.format_potentiel?.length) {
    lines.push(`**Formats potentiels** : ${r.format_potentiel.join(", ")}`);
    lines.push("");
  }
  lines.push("---");
  return lines.join("\n");
}
function exportAllMarkdown(items, ctx) {
  const done = items.filter(i => i.result);
  const head = ["# Le Filtre — Triage éditorial", "", `_Généré le ${new Date().toLocaleString("fr-FR")}_`, "", `**${done.length} contenu(s) qualifié(s)**`, ""];
  // group by bloc
  const byBloc = {};
  done.forEach(i => {
    const b = i.result.bloc_id || "?";
    (byBloc[b] = byBloc[b] || []).push(i);
  });
  const order = ["B1", "B2", "B3", "B4", "B5", "B6", "?"];
  order.forEach(b => {
    const arr = byBloc[b];
    if (!arr || !arr.length) return;
    const blocDef = ctx.blocs.find(bb => bb.id === b);
    head.push(`# ${b} — ${blocDef?.theme || ""} (${arr.length})`);
    head.push("");
    arr.sort((a, b) => (b.result.score || 0) - (a.result.score || 0));
    arr.forEach(i => head.push(exportItemMarkdown(i, ctx)));
  });
  return head.join("\n");
}
Object.assign(window, {
  buildPrompt,
  safeJSONParse,
  analyzeItem,
  scoreClass,
  exportItemMarkdown,
  exportAllMarkdown
});