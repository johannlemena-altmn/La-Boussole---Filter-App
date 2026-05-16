// triage.jsx — triage view + fiche detail + synthese + export
/* global React */

const {
  useState: useStateT,
  useMemo: useMemoT
} = React;
function HermesTriagePanel({
  item,
  ctx
}) {
  const [open, setOpen] = useStateT(false);
  const [loading, setLoading] = useStateT(false);
  const [questions, setQuestions] = useStateT([]);
  const [error, setError] = useStateT(null);
  async function generate() {
    if (questions.length > 0) {
      setOpen(o => !o);
      return;
    }
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const r = item.result;
      const prompt = `Tu es Hermès, un agent de pensée critique éditoriale. Analyse ce contenu qualifié et génère exactement 5 questions de pensée critique qui aideront l'éditeur à décider quoi en faire.

Contenu : "${r.title}"
Résumé : ${r.summary || "—"}
Bloc : ${r.bloc_id} · Score : ${r.score}/100
Angle éditorial : ${r.angle_editorial || "non défini"}
Verbatims clés : ${(r.verbatim_cles || []).slice(0, 2).join(" | ") || "—"}

Génère 5 questions courtes (1 phrase max chacune) qui poussent à questionner :
1. La source et son agenda
2. Ce qui manque dans le récit
3. La pertinence pour les projets en cours
4. Le contre-argument le plus solide
5. L'action concrète à tirer de ce contenu

Réponds avec un tableau JSON : ["question1","question2","question3","question4","question5"]
Uniquement le JSON, sans explication.`;
      const raw = await window.claude.complete(prompt);
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        setQuestions(parsed);
      } else {
        setError("Réponse inattendue de Hermès.");
      }
    } catch (e) {
      setError("Erreur : " + e.message);
    } finally {
      setLoading(false);
    }
  }
  function copyQuestions() {
    const md = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
    navigator.clipboard.writeText("## Questions Hermès\n" + md);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fiche-section",
    style: {
      borderTop: "1px solid var(--border)",
      marginTop: 16,
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: generate,
    disabled: loading,
    style: {
      color: "var(--terra)"
    }
  }, loading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      animation: "spin 1s linear infinite",
      display: "inline-block"
    }
  }, "\u25CC"), " Herm\xE8s r\xE9fl\xE9chit\u2026") : /*#__PURE__*/React.createElement(React.Fragment, null, open && questions.length > 0 ? "▲" : "▼", " \u26A1 Penser avec Herm\xE8s")), questions.length > 0 && open && /*#__PURE__*/React.createElement("button", {
    className: "btn-inline small",
    onClick: copyQuestions,
    title: "Copier les questions"
  }, "\u2398")), open && !loading && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, error && /*#__PURE__*/React.createElement("div", {
    className: "small",
    style: {
      color: "var(--red)"
    }
  }, error), questions.map((q, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "fiche-body",
    style: {
      paddingLeft: 18,
      position: "relative",
      marginBottom: 6,
      fontSize: 13,
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      color: "var(--terra)",
      fontWeight: 700
    }
  }, i + 1, "."), q))));
}
function FicheDetail({
  item,
  ctx,
  onCopy
}) {
  if (!item || !item.result) {
    return /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-title"
    }, "S\xE9lectionne une fiche"), /*#__PURE__*/React.createElement("p", {
      className: "small"
    }, "Clique sur un item dans la liste pour afficher la fiche qualifi\xE9e."));
  }
  const r = item.result;
  const projets = (r.projects || []).map(pid => ctx.projects.find(p => p.id === pid)).filter(Boolean);
  function copyMd() {
    const md = window.exportItemMarkdown(item, ctx);
    navigator.clipboard.writeText(md);
    onCopy && onCopy("Fiche copiée en markdown");
  }
  const sb = r.score_breakdown || {};
  const sbItems = [["PERTINENCE", sb.pertinence || 0, ctx.weights.pertinence], ["FRAÎCHEUR", sb.fraicheur || 0, ctx.weights.fraicheur], ["PROFONDEUR", sb.profondeur || 0, ctx.weights.profondeur], ["ACTIONNABLE", sb.actionnable || 0, ctx.weights.actionnable], ["ORIGINALITÉ", sb.originalite || 0, ctx.weights.originalite]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fiche-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fiche-meta-row"
  }, /*#__PURE__*/React.createElement(window.BlocChip, {
    blocId: r.bloc_id
  }), /*#__PURE__*/React.createElement(window.ScorePill, {
    score: r.score
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, r.type_contenu), r.bloc_confidence && /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, "conf. ", r.bloc_confidence), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: copyMd,
    title: "Copier la fiche en markdown"
  }, "\u2398 Copier")), /*#__PURE__*/React.createElement("h2", {
    className: "fiche-title"
  }, r.title), /*#__PURE__*/React.createElement("div", {
    className: "fiche-meta-row small muted"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", {
    className: "cream"
  }, "Source"), " : ", r.source_detected || "—"), projets.length > 0 && /*#__PURE__*/React.createElement("span", null, "\xB7 ", /*#__PURE__*/React.createElement("strong", {
    className: "cream"
  }, "Projets"), " : ", projets.map(p => p.name).join(", ")))), r.summary && /*#__PURE__*/React.createElement("div", {
    className: "fiche-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fiche-section-label"
  }, "\u2014 Fiche"), /*#__PURE__*/React.createElement("div", {
    className: "fiche-body"
  }, r.summary)), /*#__PURE__*/React.createElement("div", {
    className: "fiche-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fiche-section-label"
  }, "\u2014 Score multicrit\xE8res"), /*#__PURE__*/React.createElement("div", {
    className: "score-bars"
  }, sbItems.map(([label, val, max]) => /*#__PURE__*/React.createElement("div", {
    className: "score-bar",
    key: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "score-bar-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "score-bar-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "score-bar-fill",
    style: {
      width: `${val / Math.max(max, 1) * 100}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "score-bar-value"
  }, val, "/", max))))), r.angle_editorial && /*#__PURE__*/React.createElement("div", {
    className: "fiche-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fiche-section-label"
  }, "\u2014 Angle \xE9ditorial"), /*#__PURE__*/React.createElement("div", {
    className: "fiche-body",
    style: {
      fontStyle: "italic",
      color: "var(--green)"
    }
  }, r.angle_editorial), r.format_potentiel?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "fiche-tag-list",
    style: {
      marginTop: 10
    }
  }, r.format_potentiel.map((f, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "fiche-tag"
  }, f)))), r.verbatim_cles?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "fiche-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fiche-section-label"
  }, "\u2014 Verbatims & id\xE9es-force"), r.verbatim_cles.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "fiche-quote"
  }, "\"", v, "\""))), r.questions_ouvertes?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "fiche-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fiche-section-label"
  }, "\u2014 Questions ouvertes"), r.questions_ouvertes.map((q, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "fiche-body",
    style: {
      paddingLeft: 14,
      position: "relative",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      color: "var(--gold)"
    }
  }, "?"), q))), r.alerte_doublon && /*#__PURE__*/React.createElement("div", {
    className: "fiche-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fiche-section-label",
    style: {
      color: "var(--gold)"
    }
  }, "\u2014 \u26A0 Alerte doublon"), /*#__PURE__*/React.createElement("div", {
    className: "fiche-body small"
  }, r.alerte_doublon)), /*#__PURE__*/React.createElement("div", {
    className: "fiche-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fiche-section-label"
  }, "\u2014 Texte source (extrait)"), /*#__PURE__*/React.createElement("div", {
    className: "fiche-body small dim",
    style: {
      fontFamily: "var(--mono)",
      fontSize: 11,
      lineHeight: 1.6,
      background: "var(--bg2)",
      padding: 12,
      borderRadius: 4,
      maxHeight: 200,
      overflowY: "auto",
      whiteSpace: "pre-wrap"
    }
  }, item.text.slice(0, 800), item.text.length > 800 ? "…" : "")), /*#__PURE__*/React.createElement(HermesTriagePanel, {
    item: item,
    ctx: ctx
  }));
}

// ─── Verbatim classifier (heuristique légère côté front) ───────────────
function classifyVerbatim(v) {
  const t = v.toLowerCase();
  // Peurs / inquiétudes
  if (/peur|inqui[èe]t|crainte|risque|menace|danger|effrayant|angoiss/.test(t)) return "peur";
  // Incompréhensions / questions
  if (/[?¿]|comprends pas|incompr|pourquoi|comment|étrange|bizarre|confus/.test(t)) return "incompr";
  // Valorisations
  if (/aime|précieux|essentiel|important|vital|inspirant|admirable|positi|formidable|beau|bel|riche|valoris|gratitude/.test(t)) return "valeur";
  return "neutre";
}
function VerbatimWall({
  items
}) {
  const all = [];
  items.forEach(i => {
    if (!i.result?.verbatim_cles) return;
    i.result.verbatim_cles.forEach(v => {
      all.push({
        text: v,
        item: i,
        kind: classifyVerbatim(v)
      });
    });
  });
  const groups = {
    peur: {
      label: "Ce qui inquiète",
      icon: "▲",
      body: all.filter(v => v.kind === "peur")
    },
    incompr: {
      label: "Ce qui interroge",
      icon: "?",
      body: all.filter(v => v.kind === "incompr")
    },
    valeur: {
      label: "Ce qui est valorisé",
      icon: "●",
      body: all.filter(v => v.kind === "valeur")
    },
    neutre: {
      label: "Autres signaux",
      icon: "○",
      body: all.filter(v => v.kind === "neutre")
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "Mur des verbatims"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "Citations class\xE9es par tonalit\xE9 \u2014 peurs \xB7 interrogations \xB7 valeurs. Classification heuristique, \xE0 corriger \xE0 la main si besoin.")), /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, all.length, " verbatims")), all.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "muted small"
  }, "Pas encore de verbatims extraits. Lance l'analyse pour qu'ils apparaissent.") : /*#__PURE__*/React.createElement("div", {
    className: "verbatim-grid"
  }, Object.entries(groups).map(([k, g]) => g.body.length > 0 && /*#__PURE__*/React.createElement("div", {
    key: k,
    className: `verbatim-col v-${k}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "verbatim-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "verbatim-mark"
  }, g.icon), /*#__PURE__*/React.createElement("span", null, g.label), /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, "(", g.body.length, ")")), /*#__PURE__*/React.createElement("div", {
    className: "verbatim-list"
  }, g.body.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "verbatim-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "verbatim-text"
  }, "\"", v.text, "\""), /*#__PURE__*/React.createElement("div", {
    className: "verbatim-source mono small muted"
  }, "\u2014 ", v.item.result.source_detected || "Source inconnue"))))))));
}
function LimitesPanel({
  gardefous
}) {
  if (!gardefous || !gardefous.length) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "panel limites-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "\u2014 Limites assum\xE9es (\xE0 relire avant publication)"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "Le scoring est un outil de lecture, pas un verdict."))), /*#__PURE__*/React.createElement("div", {
    className: "limites-grid"
  }, gardefous.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "limite-cell"
  }, /*#__PURE__*/React.createElement("span", {
    className: "limite-mark"
  }, g.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "cream"
  }, g.title, "."), " ", /*#__PURE__*/React.createElement("span", {
    className: "dim small"
  }, g.body))))));
}
function SyntheseView({
  items,
  ctx
}) {
  const byBloc = useMemoT(() => {
    const m = {};
    ctx.blocs.forEach(b => {
      m[b.id] = [];
    });
    items.forEach(it => {
      if (!it.result) return;
      const b = it.result.bloc_id;
      if (m[b]) m[b].push(it);
    });
    // sort by score desc
    Object.keys(m).forEach(k => m[k].sort((a, b) => (b.result.score || 0) - (a.result.score || 0)));
    return m;
  }, [items, ctx.blocs]);
  const ranked = useMemoT(() => [...items].filter(i => i.result).sort((a, b) => (b.result.score || 0) - (a.result.score || 0)).slice(0, 5), [items]);
  const blocCounts = ctx.blocs.map(b => ({
    ...b,
    count: byBloc[b.id]?.length || 0
  })).filter(b => b.count > 0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "Top 5 du jour"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "Les contenus \xE0 plus haut score, tous blocs confondus."))), ranked.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "muted small"
  }, "Pas encore de contenu qualifi\xE9.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, ranked.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "item-card",
    style: {
      cursor: "default"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "item-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: "var(--gold)",
      fontSize: 14,
      fontWeight: 700
    }
  }, "#", i + 1), /*#__PURE__*/React.createElement(window.BlocChip, {
    blocId: it.result.bloc_id
  }), /*#__PURE__*/React.createElement(window.ScorePill, {
    score: it.result.score
  }), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, it.result.source_detected)), /*#__PURE__*/React.createElement("div", {
    className: "item-title"
  }, it.result.title), it.result.angle_editorial && /*#__PURE__*/React.createElement("div", {
    className: "item-preview",
    style: {
      color: "var(--green)",
      fontStyle: "italic"
    }
  }, "\u2192 ", it.result.angle_editorial))))), /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "Par bloc th\xE9matique"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "Vue d'ensemble des signaux par sujet."))), blocCounts.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "muted small"
  }, "Pas encore de contenu qualifi\xE9.") : /*#__PURE__*/React.createElement("div", {
    className: "synthese-grid"
  }, blocCounts.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.id,
    className: `synthese-card ${b.id}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "synthese-card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "synthese-card-title"
  }, b.code, " \xB7 ", b.theme), /*#__PURE__*/React.createElement("div", {
    className: "synthese-count"
  }, b.count)), /*#__PURE__*/React.createElement("ul", null, byBloc[b.id].slice(0, 4).map(it => /*#__PURE__*/React.createElement("li", {
    key: it.id
  }, it.result.title, " ", /*#__PURE__*/React.createElement("span", {
    className: "mono muted"
  }, "(", it.result.score, ")")))))))));
}
function TriageView({
  items,
  ctx,
  gardefous,
  goPrev,
  goNext,
  toast,
  removeItem,
  activeFrameworkId
}) {
  const [view, setView] = useStateT("list"); // list | synthese | verbatims
  const [selectedId, setSelectedId] = useStateT(null);
  const [filterBloc, setFilterBloc] = useStateT("all");
  const [sortBy, setSortBy] = useStateT("score"); // score | bloc | source

  const done = items.filter(i => i.result);
  const filtered = useMemoT(() => {
    let arr = done.slice();
    if (filterBloc !== "all") arr = arr.filter(i => i.result.bloc_id === filterBloc);
    if (sortBy === "score") arr.sort((a, b) => (b.result.score || 0) - (a.result.score || 0));
    if (sortBy === "bloc") arr.sort((a, b) => (a.result.bloc_id || "").localeCompare(b.result.bloc_id || ""));
    if (sortBy === "source") arr.sort((a, b) => (a.result.source_detected || "").localeCompare(b.result.source_detected || ""));
    return arr;
  }, [done, filterBloc, sortBy]);
  const selected = items.find(i => i.id === selectedId) || filtered[0];
  function exportAll() {
    const md = window.exportAllMarkdown(items, ctx);
    navigator.clipboard.writeText(md);
    toast("Triage complet copié en markdown (" + done.length + " fiches)");
  }
  function exportJson() {
    const json = JSON.stringify({
      generated: new Date().toISOString(),
      context: {
        projects: ctx.projects,
        blocs: ctx.blocs,
        sources: ctx.sources
      },
      items: done.map(i => ({
        text: i.text,
        sourceHint: i.sourceHint,
        type: i.type,
        result: i.result
      }))
    }, null, 2);
    const blob = new Blob([json], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `le-filtre-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Export JSON téléchargé");
  }
  function downloadMd() {
    const md = window.exportAllMarkdown(items, ctx);
    const blob = new Blob([md], {
      type: "text/markdown"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `le-filtre-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Markdown téléchargé");
  }
  const blocCounts = useMemoT(() => {
    const c = {};
    done.forEach(i => {
      c[i.result.bloc_id] = (c[i.result.bloc_id] || 0) + 1;
    });
    return c;
  }, [done]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head-label"
  }, "Phase 04 \xB7 Triage"), /*#__PURE__*/React.createElement("h1", null, done.length, " signal(aux) ", /*#__PURE__*/React.createElement("em", null, "qualifi\xE9(s)")), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Liste, fiches \xE9ditoriales, synth\xE8se par bloc. Tu peux copier une fiche ou exporter tout le rapport.")), activeFrameworkId && /*#__PURE__*/React.createElement(window.ActivePrismeBar, {
    activeId: activeFrameworkId
  }), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("button", {
    className: `filter-btn ${view === "list" ? "active" : ""}`,
    onClick: () => setView("list")
  }, "Liste"), /*#__PURE__*/React.createElement("button", {
    className: `filter-btn ${view === "synthese" ? "active" : ""}`,
    onClick: () => setView("synthese")
  }, "Synth\xE8se"), /*#__PURE__*/React.createElement("button", {
    className: `filter-btn ${view === "verbatims" ? "active" : ""}`,
    onClick: () => setView("verbatims")
  }, "Verbatims")), view === "list" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("button", {
    className: `filter-btn ${filterBloc === "all" ? "active" : ""}`,
    onClick: () => setFilterBloc("all")
  }, "Tous (", done.length, ")"), ctx.blocs.map(b => blocCounts[b.id] ? /*#__PURE__*/React.createElement("button", {
    key: b.id,
    className: `filter-btn ${filterBloc === b.id ? "active" : ""}`,
    onClick: () => setFilterBloc(b.id)
  }, b.code, " (", blocCounts[b.id], ")") : null)), /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("button", {
    className: `filter-btn ${sortBy === "score" ? "active" : ""}`,
    onClick: () => setSortBy("score")
  }, "\u2193 Score"), /*#__PURE__*/React.createElement("button", {
    className: `filter-btn ${sortBy === "bloc" ? "active" : ""}`,
    onClick: () => setSortBy("bloc")
  }, "Bloc"), /*#__PURE__*/React.createElement("button", {
    className: `filter-btn ${sortBy === "source" ? "active" : ""}`,
    onClick: () => setSortBy("source")
  }, "Source"))), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: exportAll
  }, "\u2398 Copier MD"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: downloadMd
  }, "\u2193 .md"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: exportJson
  }, "\u2193 .json")), view === "list" ? /*#__PURE__*/React.createElement("div", {
    className: "triage-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "triage-list"
  }, filtered.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: `item-card ${selected?.id === it.id ? "selected" : ""}`,
    onClick: () => setSelectedId(it.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "item-meta"
  }, /*#__PURE__*/React.createElement(window.BlocChip, {
    blocId: it.result.bloc_id
  }), /*#__PURE__*/React.createElement(window.ScorePill, {
    score: it.result.score
  }), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, it.result.source_detected)), /*#__PURE__*/React.createElement("div", {
    className: "item-title"
  }, it.result.title), /*#__PURE__*/React.createElement("div", {
    className: "item-preview"
  }, it.result.summary))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-title"
  }, "Rien dans ce filtre."))), /*#__PURE__*/React.createElement("div", {
    className: "triage-detail"
  }, /*#__PURE__*/React.createElement(FicheDetail, {
    item: selected,
    ctx: ctx,
    onCopy: toast
  }))) : view === "synthese" ? /*#__PURE__*/React.createElement(SyntheseView, {
    items: items,
    ctx: ctx
  }) : /*#__PURE__*/React.createElement(VerbatimWall, {
    items: items.filter(i => i.result)
  }), view !== "list" && /*#__PURE__*/React.createElement(LimitesPanel, {
    gardefous: gardefous
  }), /*#__PURE__*/React.createElement("div", {
    className: "gap-12",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: goPrev
  }, /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2190"), " Analyse"), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), goNext && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: goNext
  }, "Dashboard ", /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2192"))));
}
Object.assign(window, {
  FicheDetail,
  SyntheseView,
  TriageView,
  VerbatimWall,
  LimitesPanel
});