// triage.jsx — triage view + fiche detail + synthese + export
/* global React */

const { useState: useStateT, useMemo: useMemoT } = React;

function HermesTriagePanel({ item, ctx }) {
  const [open, setOpen] = useStateT(false);
  const [loading, setLoading] = useStateT(false);
  const [questions, setQuestions] = useStateT([]);
  const [error, setError] = useStateT(null);

  async function generate() {
    if (questions.length > 0) { setOpen(o => !o); return; }
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
Verbatims clés : ${(r.verbatim_cles || []).slice(0,2).join(" | ") || "—"}

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
    } catch(e) {
      setError("Erreur : " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function copyQuestions() {
    const md = questions.map((q,i) => `${i+1}. ${q}`).join("\n");
    navigator.clipboard.writeText("## Questions Hermès\n" + md);
  }

  return (
    <div className="fiche-section" style={{borderTop: "1px solid var(--border)", marginTop: 16, paddingTop: 12}}>
      <div style={{display:"flex", alignItems:"center", gap:10}}>
        <button
          className="btn btn-ghost small"
          onClick={generate}
          disabled={loading}
          style={{color:"var(--terra)"}}
        >
          {loading
            ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span> Hermès réfléchit…</>
            : <>{open && questions.length > 0 ? "▲" : "▼"} ⚡ Penser avec Hermès</>
          }
        </button>
        {questions.length > 0 && open && (
          <button className="btn-inline small" onClick={copyQuestions} title="Copier les questions">⎘</button>
        )}
      </div>
      {open && !loading && (
        <div style={{marginTop:10}}>
          {error && <div className="small" style={{color:"var(--red)"}}>{error}</div>}
          {questions.map((q,i) => (
            <div key={i} className="fiche-body" style={{
              paddingLeft:18, position:"relative", marginBottom:6,
              fontSize:13, lineHeight:1.5
            }}>
              <span style={{position:"absolute",left:0,color:"var(--terra)",fontWeight:700}}>{i+1}.</span>
              {q}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FicheDetail({ item, ctx, onCopy }) {
  if (!item || !item.result) {
    return (
      <div className="empty">
        <div className="empty-title">Sélectionne une fiche</div>
        <p className="small">Clique sur un item dans la liste pour afficher la fiche qualifiée.</p>
      </div>
    );
  }
  const r = item.result;
  const projets = (r.projects || []).map(pid => ctx.projects.find(p => p.id === pid)).filter(Boolean);

  function copyMd() {
    const md = window.exportItemMarkdown(item, ctx);
    navigator.clipboard.writeText(md);
    onCopy && onCopy("Fiche copiée en markdown");
  }

  const sb = r.score_breakdown || {};
  const sbItems = [
    ["PERTINENCE", sb.pertinence || 0, ctx.weights.pertinence],
    ["FRAÎCHEUR", sb.fraicheur || 0, ctx.weights.fraicheur],
    ["PROFONDEUR", sb.profondeur || 0, ctx.weights.profondeur],
    ["ACTIONNABLE", sb.actionnable || 0, ctx.weights.actionnable],
    ["ORIGINALITÉ", sb.originalite || 0, ctx.weights.originalite],
  ];

  return (
    <div>
      <div className="fiche-head">
        <div className="fiche-meta-row">
          <window.BlocChip blocId={r.bloc_id} />
          <window.ScorePill score={r.score} />
          <span className="mono small muted">{r.type_contenu}</span>
          {r.bloc_confidence && <span className="mono small muted">conf. {r.bloc_confidence}</span>}
          <div className="grow"></div>
          <button className="btn btn-ghost small" onClick={copyMd} title="Copier la fiche en markdown">
            ⎘ Copier
          </button>
        </div>
        <h2 className="fiche-title">{r.title}</h2>
        <div className="fiche-meta-row small muted">
          <span><strong className="cream">Source</strong> : {r.source_detected || "—"}</span>
          {projets.length > 0 && (
            <span>· <strong className="cream">Projets</strong> : {projets.map(p => p.name).join(", ")}</span>
          )}
        </div>
      </div>

      {r.summary && (
        <div className="fiche-section">
          <div className="fiche-section-label">— Fiche</div>
          <div className="fiche-body">{r.summary}</div>
        </div>
      )}

      <div className="fiche-section">
        <div className="fiche-section-label">— Score multicritères</div>
        <div className="score-bars">
          {sbItems.map(([label, val, max]) => (
            <div className="score-bar" key={label}>
              <div className="score-bar-label">{label}</div>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{width: `${(val / Math.max(max,1)) * 100}%`}}></div>
              </div>
              <div className="score-bar-value">{val}/{max}</div>
            </div>
          ))}
        </div>
      </div>

      {r.angle_editorial && (
        <div className="fiche-section">
          <div className="fiche-section-label">— Angle éditorial</div>
          <div className="fiche-body" style={{fontStyle: "italic", color: "var(--green)"}}>{r.angle_editorial}</div>
          {r.format_potentiel?.length > 0 && (
            <div className="fiche-tag-list" style={{marginTop: 10}}>
              {r.format_potentiel.map((f, i) => <span key={i} className="fiche-tag">{f}</span>)}
            </div>
          )}
        </div>
      )}

      {r.verbatim_cles?.length > 0 && (
        <div className="fiche-section">
          <div className="fiche-section-label">— Verbatims & idées-force</div>
          {r.verbatim_cles.map((v, i) => (
            <div key={i} className="fiche-quote">"{v}"</div>
          ))}
        </div>
      )}

      {r.questions_ouvertes?.length > 0 && (
        <div className="fiche-section">
          <div className="fiche-section-label">— Questions ouvertes</div>
          {r.questions_ouvertes.map((q, i) => (
            <div key={i} className="fiche-body" style={{paddingLeft: 14, position: "relative", marginBottom: 4}}>
              <span style={{position: "absolute", left: 0, color: "var(--gold)"}}>?</span>{q}
            </div>
          ))}
        </div>
      )}

      {r.alerte_doublon && (
        <div className="fiche-section">
          <div className="fiche-section-label" style={{color: "var(--gold)"}}>— ⚠ Alerte doublon</div>
          <div className="fiche-body small">{r.alerte_doublon}</div>
        </div>
      )}

      <div className="fiche-section">
        <div className="fiche-section-label">— Texte source (extrait)</div>
        <div className="fiche-body small dim" style={{
          fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.6,
          background: "var(--bg2)", padding: 12, borderRadius: 4,
          maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap"
        }}>
          {item.text.slice(0, 800)}{item.text.length > 800 ? "…" : ""}
        </div>
      </div>

      <HermesTriagePanel item={item} ctx={ctx} />
    </div>
  );
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

function VerbatimWall({ items }) {
  const all = [];
  items.forEach(i => {
    if (!i.result?.verbatim_cles) return;
    i.result.verbatim_cles.forEach(v => {
      all.push({ text: v, item: i, kind: classifyVerbatim(v) });
    });
  });

  const groups = {
    peur:    { label: "Ce qui inquiète", icon: "▲", body: all.filter(v => v.kind === "peur") },
    incompr: { label: "Ce qui interroge", icon: "?", body: all.filter(v => v.kind === "incompr") },
    valeur:  { label: "Ce qui est valorisé", icon: "●", body: all.filter(v => v.kind === "valeur") },
    neutre:  { label: "Autres signaux", icon: "○", body: all.filter(v => v.kind === "neutre") },
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">Mur des verbatims</div>
          <div className="panel-sub">Citations classées par tonalité — peurs · interrogations · valeurs. Classification heuristique, à corriger à la main si besoin.</div>
        </div>
        <span className="mono small muted">{all.length} verbatims</span>
      </div>
      {all.length === 0 ? (
        <p className="muted small">Pas encore de verbatims extraits. Lance l'analyse pour qu'ils apparaissent.</p>
      ) : (
        <div className="verbatim-grid">
          {Object.entries(groups).map(([k, g]) => g.body.length > 0 && (
            <div key={k} className={`verbatim-col v-${k}`}>
              <div className="verbatim-head">
                <span className="verbatim-mark">{g.icon}</span>
                <span>{g.label}</span>
                <span className="mono small muted">({g.body.length})</span>
              </div>
              <div className="verbatim-list">
                {g.body.map((v, i) => (
                  <div key={i} className="verbatim-card">
                    <div className="verbatim-text">"{v.text}"</div>
                    <div className="verbatim-source mono small muted">
                      — {v.item.result.source_detected || "Source inconnue"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LimitesPanel({ gardefous }) {
  if (!gardefous || !gardefous.length) return null;
  return (
    <div className="panel limites-panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">— Limites assumées (à relire avant publication)</div>
          <div className="panel-sub">Le scoring est un outil de lecture, pas un verdict.</div>
        </div>
      </div>
      <div className="limites-grid">
        {gardefous.map(g => (
          <div key={g.id} className="limite-cell">
            <span className="limite-mark">{g.icon}</span>
            <div>
              <strong className="cream">{g.title}.</strong>{" "}
              <span className="dim small">{g.body}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SyntheseView({ items, ctx }) {
  const byBloc = useMemoT(() => {
    const m = {};
    ctx.blocs.forEach(b => { m[b.id] = []; });
    items.forEach(it => {
      if (!it.result) return;
      const b = it.result.bloc_id;
      if (m[b]) m[b].push(it);
    });
    // sort by score desc
    Object.keys(m).forEach(k => m[k].sort((a,b) => (b.result.score||0) - (a.result.score||0)));
    return m;
  }, [items, ctx.blocs]);

  const ranked = useMemoT(() =>
    [...items].filter(i => i.result).sort((a,b) => (b.result.score||0) - (a.result.score||0)).slice(0, 5),
    [items]
  );

  const blocCounts = ctx.blocs.map(b => ({ ...b, count: byBloc[b.id]?.length || 0 })).filter(b => b.count > 0);

  return (
    <div>
      <div className="panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">Top 5 du jour</div>
            <div className="panel-sub">Les contenus à plus haut score, tous blocs confondus.</div>
          </div>
        </div>
        {ranked.length === 0 ? (
          <p className="muted small">Pas encore de contenu qualifié.</p>
        ) : (
          <div style={{display: "flex", flexDirection: "column", gap: 8}}>
            {ranked.map((it, i) => (
              <div key={it.id} className="item-card" style={{cursor: "default"}}>
                <div className="item-meta">
                  <span className="mono" style={{color: "var(--gold)", fontSize: 14, fontWeight: 700}}>#{i+1}</span>
                  <window.BlocChip blocId={it.result.bloc_id} />
                  <window.ScorePill score={it.result.score} />
                  <div className="grow"></div>
                  <span className="mono small muted">{it.result.source_detected}</span>
                </div>
                <div className="item-title">{it.result.title}</div>
                {it.result.angle_editorial && (
                  <div className="item-preview" style={{color: "var(--green)", fontStyle: "italic"}}>
                    → {it.result.angle_editorial}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">Par bloc thématique</div>
            <div className="panel-sub">Vue d'ensemble des signaux par sujet.</div>
          </div>
        </div>
        {blocCounts.length === 0 ? (
          <p className="muted small">Pas encore de contenu qualifié.</p>
        ) : (
          <div className="synthese-grid">
            {blocCounts.map(b => (
              <div key={b.id} className={`synthese-card ${b.id}`}>
                <div className="synthese-card-head">
                  <div className="synthese-card-title">{b.code} · {b.theme}</div>
                  <div className="synthese-count">{b.count}</div>
                </div>
                <ul>
                  {byBloc[b.id].slice(0, 4).map(it => (
                    <li key={it.id}>{it.result.title} <span className="mono muted">({it.result.score})</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TriageView({ items, ctx, gardefous, goPrev, goNext, toast, removeItem, activeFrameworkId }) {
  const [view, setView] = useStateT("list"); // list | synthese | verbatims
  const [selectedId, setSelectedId] = useStateT(null);
  const [filterBloc, setFilterBloc] = useStateT("all");
  const [sortBy, setSortBy] = useStateT("score"); // score | bloc | source

  const done = items.filter(i => i.result);

  const filtered = useMemoT(() => {
    let arr = done.slice();
    if (filterBloc !== "all") arr = arr.filter(i => i.result.bloc_id === filterBloc);
    if (sortBy === "score") arr.sort((a,b) => (b.result.score||0) - (a.result.score||0));
    if (sortBy === "bloc") arr.sort((a,b) => (a.result.bloc_id||"").localeCompare(b.result.bloc_id||""));
    if (sortBy === "source") arr.sort((a,b) => (a.result.source_detected||"").localeCompare(b.result.source_detected||""));
    return arr;
  }, [done, filterBloc, sortBy]);

  const selected = items.find(i => i.id === selectedId) || filtered[0];

  function exportAll() {
    const md = window.exportAllMarkdown(items, ctx);
    navigator.clipboard.writeText(md);
    toast("Triage complet copié en markdown (" + done.length + " fiches)");
  }
  function exportJson() {
    const json = JSON.stringify({ generated: new Date().toISOString(), context: { projects: ctx.projects, blocs: ctx.blocs, sources: ctx.sources }, items: done.map(i => ({ text: i.text, sourceHint: i.sourceHint, type: i.type, result: i.result }))}, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `le-filtre-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Export JSON téléchargé");
  }
  function downloadMd() {
    const md = window.exportAllMarkdown(items, ctx);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `le-filtre-${new Date().toISOString().slice(0,10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Markdown téléchargé");
  }

  const blocCounts = useMemoT(() => {
    const c = {};
    done.forEach(i => { c[i.result.bloc_id] = (c[i.result.bloc_id] || 0) + 1; });
    return c;
  }, [done]);

  return (
    <div>
      <div className="page-head">
        <div className="page-head-label">Phase 04 · Triage</div>
        <h1>{done.length} signal(aux) <em>qualifié(s)</em></h1>
        <p className="sub">
          Liste, fiches éditoriales, synthèse par bloc. Tu peux copier une fiche ou exporter tout le rapport.
        </p>
      </div>

      {activeFrameworkId && <window.ActivePrismeBar activeId={activeFrameworkId} />}

      <div className="toolbar">
        <div className="filter-group">
          <button className={`filter-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>Liste</button>
          <button className={`filter-btn ${view === "synthese" ? "active" : ""}`} onClick={() => setView("synthese")}>Synthèse</button>
          <button className={`filter-btn ${view === "verbatims" ? "active" : ""}`} onClick={() => setView("verbatims")}>Verbatims</button>
        </div>

        {view === "list" && (
          <>
            <div className="filter-group">
              <button className={`filter-btn ${filterBloc === "all" ? "active" : ""}`} onClick={() => setFilterBloc("all")}>Tous ({done.length})</button>
              {ctx.blocs.map(b => blocCounts[b.id] ? (
                <button key={b.id} className={`filter-btn ${filterBloc === b.id ? "active" : ""}`} onClick={() => setFilterBloc(b.id)}>
                  {b.code} ({blocCounts[b.id]})
                </button>
              ) : null)}
            </div>

            <div className="filter-group">
              <button className={`filter-btn ${sortBy === "score" ? "active" : ""}`} onClick={() => setSortBy("score")}>↓ Score</button>
              <button className={`filter-btn ${sortBy === "bloc" ? "active" : ""}`} onClick={() => setSortBy("bloc")}>Bloc</button>
              <button className={`filter-btn ${sortBy === "source" ? "active" : ""}`} onClick={() => setSortBy("source")}>Source</button>
            </div>
          </>
        )}

        <div className="grow"></div>
        <button className="btn" onClick={exportAll}>⎘ Copier MD</button>
        <button className="btn" onClick={downloadMd}>↓ .md</button>
        <button className="btn" onClick={exportJson}>↓ .json</button>
      </div>

      {view === "list" ? (
        <div className="triage-layout">
          <div className="triage-list">
            {filtered.map(it => (
              <div
                key={it.id}
                className={`item-card ${selected?.id === it.id ? "selected" : ""}`}
                onClick={() => setSelectedId(it.id)}
              >
                <div className="item-meta">
                  <window.BlocChip blocId={it.result.bloc_id} />
                  <window.ScorePill score={it.result.score} />
                  <div className="grow"></div>
                  <span className="mono">{it.result.source_detected}</span>
                </div>
                <div className="item-title">{it.result.title}</div>
                <div className="item-preview">{it.result.summary}</div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="empty">
                <div className="empty-title">Rien dans ce filtre.</div>
              </div>
            )}
          </div>
          <div className="triage-detail">
            <FicheDetail item={selected} ctx={ctx} onCopy={toast} />
          </div>
        </div>
      ) : view === "synthese" ? (
        <SyntheseView items={items} ctx={ctx} />
      ) : (
        <VerbatimWall items={items.filter(i => i.result)} />
      )}

      {view !== "list" && <LimitesPanel gardefous={gardefous} />}

      <div className="gap-12" style={{marginTop: 24}}>
        <button className="btn" onClick={goPrev}>
          <span className="btn-arrow">←</span> Analyse
        </button>
        <div className="grow"></div>
        {goNext && (
          <button className="btn btn-primary" onClick={goNext}>
            Dashboard <span className="btn-arrow">→</span>
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { FicheDetail, SyntheseView, TriageView, VerbatimWall, LimitesPanel });
