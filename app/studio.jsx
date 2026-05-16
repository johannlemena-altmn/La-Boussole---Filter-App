// studio.jsx — Phase 06 : Studio — carte mentale, storyboard, infographie

const { useState: useStateS, useMemo: useMemoS, useRef: useRefS } = React;

// ─── Mind map mockup (carte mentale) ──────────────────────────────────
function MindMap({ items, ctx, toast }) {
  const svgRef = useRefS(null);
  const done = items.filter(i => i.result).slice(0, 24);
  const byBloc = {};
  ctx.blocs.forEach(b => { byBloc[b.id] = []; });
  done.forEach(i => { if (byBloc[i.result.bloc_id]) byBloc[i.result.bloc_id].push(i); });

  // SVG layout — radial, 6 sectors
  const cx = 360, cy = 280, R = 220;
  const blocs = ctx.blocs;

  return (
    <div className="studio-card">
      <div className="studio-card-head">
        <div>
          <h3>Carte mentale : rayonnement par bloc</h3>
          <p className="dim small">Vue radiale automatique de tes contenus qualifiés. Les rayons indiquent le nombre de signaux par bloc.</p>
        </div>
        <span className="mono small muted">{done.length} signaux mappés</span>
      </div>

      <svg ref={svgRef} viewBox="0 0 720 560" className="mindmap-svg" preserveAspectRatio="xMidYMid meet">
        {/* concentric guides */}
        <circle cx={cx} cy={cy} r={R} className="mm-ring" />
        <circle cx={cx} cy={cy} r={R*0.66} className="mm-ring" />
        <circle cx={cx} cy={cy} r={R*0.33} className="mm-ring" />

        {/* central node */}
        <circle cx={cx} cy={cy} r={36} className="mm-core" />
        <text x={cx} y={cy-3} textAnchor="middle" className="mm-core-label">Le</text>
        <text x={cx} y={cy+12} textAnchor="middle" className="mm-core-label-em">Filtre</text>

        {/* bloc petals */}
        {blocs.map((b, idx) => {
          const angle = (idx / blocs.length) * Math.PI * 2 - Math.PI/2;
          const bx = cx + Math.cos(angle) * R;
          const by = cy + Math.sin(angle) * R;
          const blocItems = byBloc[b.id] || [];
          const count = blocItems.length;
          const size = 24 + Math.min(count, 6) * 6;

          return (
            <g key={b.id}>
              <line x1={cx} y1={cy} x2={bx} y2={by} className={`mm-ray mm-${b.id}`} />
              <circle cx={bx} cy={by} r={size} className={`mm-node mm-${b.id}`} />
              <text x={bx} y={by-2} textAnchor="middle" className="mm-node-label">{b.code}</text>
              <text x={bx} y={by+13} textAnchor="middle" className="mm-node-count">{count}</text>
              {/* satellites (top 3 items) */}
              {blocItems.slice(0,3).map((it, k) => {
                const sub = angle + (k - 1) * 0.22;
                const sx = bx + Math.cos(sub) * 80;
                const sy = by + Math.sin(sub) * 80;
                return (
                  <g key={it.id}>
                    <line x1={bx} y1={by} x2={sx} y2={sy} className="mm-link" />
                    <circle cx={sx} cy={sy} r={6} className={`mm-sat mm-${b.id}`} />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      <div className="mm-legend">
        {blocs.map(b => (
          <div key={b.id} className="mm-leg-item">
            <span className={`bloc-dot dot-${b.id}`}></span>
            <span className="small">{b.code} · {b.theme}</span>
          </div>
        ))}
      </div>

      <div className="studio-card-actions">
        <span className="small dim">Le geste reste manuel : exporte le squelette, complète à la main, dessine les liens qui ne se voient pas ici.</span>
        <div className="grow"></div>
        <button className="btn btn-ghost small" onClick={() => {
          const svg = svgRef.current;
          if (!svg) return;
          const blob = new Blob([window.svgString(svg)], { type: "image/svg+xml;charset=utf-8" });
          window.downloadBlob(blob, `mindmap-${new Date().toISOString().slice(0,10)}.svg`);
          toast?.("SVG téléchargé · ouvre dans Canva / Illustrator / Figma");
        }}>⎘ Copier le SVG</button>
        <button className="btn btn-ghost small" onClick={async () => {
          const svg = svgRef.current;
          if (!svg) return;
          try {
            const blob = await window.svgToPng(svg, 2);
            window.downloadBlob(blob, `mindmap-${new Date().toISOString().slice(0,10)}.png`);
            toast?.("PNG téléchargé");
          } catch (e) { toast?.("Échec export PNG : " + e.message); }
        }}>↓ Exporter PNG</button>
      </div>
    </div>
  );
}

// ─── Storyboard mockup ────────────────────────────────────────────────
function Storyboard({ items, ctx, level, setLevel, toast }) {
  const top = items.filter(i => i.result).sort((a,b) => (b.result.score||0)-(a.result.score||0)).slice(0, 6);
  const levels = ["débutant", "intermédiaire", "avancé"];

  return (
    <div className="studio-card">
      <div className="studio-card-head">
        <div>
          <h3>Storyboard : squelette de production</h3>
          <p className="dim small">Auto-généré depuis tes signaux les mieux scorés. À toi de dessiner les vignettes, choisir le ton, monter.</p>
        </div>
        <div className="level-switch">
          <span className="small muted mono">Niveau&nbsp;:</span>
          {levels.map(l => (
            <button key={l} className={`level-btn ${level === l ? "on" : ""}`} onClick={() => setLevel(l)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="storyboard-track">
        {top.length === 0 && (
          <div className="empty" style={{padding: "40px 0"}}>
            <div className="empty-title">Pas encore de signaux à monter.</div>
            <p className="small">Reviens quand au moins 3 contenus sont qualifiés.</p>
          </div>
        )}
        {top.map((it, i) => {
          const blocs = ctx.blocs.find(b => b.id === it.result.bloc_id);
          return (
            <div key={it.id} className="storyboard-cell">
              <div className="sb-thumb">
                <span className="sb-num">{String(i+1).padStart(2,"0")}</span>
                <div className="sb-placeholder" aria-label="zone visuel à dessiner">
                  <span className="mono small">[visuel · {level}]</span>
                </div>
              </div>
              <div className="sb-meta">
                {blocs && <window.BlocChip blocId={blocs.id} />}
                <window.ScorePill score={it.result.score} />
              </div>
              <div className="sb-title">{it.result.title}</div>
              <div className="sb-narration">
                <div className="sb-label">Voix-off / accroche</div>
                <div className="sb-text">{it.result.summary?.slice(0, 110)}…</div>
              </div>
              {it.result.angle_editorial && (
                <div className="sb-angle">
                  <div className="sb-label">Angle</div>
                  <div className="sb-text" style={{fontStyle: "italic"}}>{it.result.angle_editorial}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="studio-card-actions">
        <span className="small dim">Niveau <strong className="cream">{level}</strong> : la complexité narrative s'adapte au lecteur. Toujours laisser visibles : sources, doutes, méthode.</span>
        <div className="grow"></div>
        <button className="btn btn-ghost small" onClick={() => {
          const md = [
            `# Storyboard · niveau ${level}`,
            `_Généré le ${new Date().toLocaleString("fr-FR")}_`,
            "",
            ...top.map((it, i) => {
              const blocs = ctx.blocs.find(b => b.id === it.result.bloc_id);
              return [
                `## ${String(i+1).padStart(2,"0")} · ${it.result.title}`,
                `**Bloc** : ${blocs?.code} · ${blocs?.theme || ""} · **Score** : ${it.result.score}/100`,
                "",
                `### Voix-off / accroche`,
                it.result.summary || "",
                "",
                it.result.angle_editorial ? `### Angle\n_${it.result.angle_editorial}_` : "",
                "",
                `### Visuel à dessiner — niveau ${level}`,
                `_[ à compléter à la main ]_`,
                "\n---\n"
              ].filter(Boolean).join("\n");
            })
          ].join("\n");
          navigator.clipboard.writeText(md);
          toast?.("Squelette storyboard copié en markdown");
        }}>⎘ Copier le squelette MD</button>
      </div>
    </div>
  );
}

// ─── Infographie ─────────────────────────────────────────────────────
function Infographic({ items, ctx, gardefous, toast }) {
  const sheetRef = useRefS(null);
  const [titleEdit, setTitleEdit] = useStateS("Ce que la semaine nous a dit");

  const done = items.filter(i => i.result);

  // Distribution par bloc
  const byBloc = {};
  ctx.blocs.forEach(b => { byBloc[b.id] = []; });
  done.forEach(i => { if (byBloc[i.result.bloc_id]) byBloc[i.result.bloc_id].push(i); });
  const max = Math.max(1, ...Object.values(byBloc).map(a => a.length));

  // Top 3 sources (score le plus élevé)
  const top3 = [...done].sort((a, b) => (b.result.score || 0) - (a.result.score || 0)).slice(0, 3);

  // Top 5 termes récurrents via extractTermsFromItems (réutilise le même algo que le cluster)
  const topTerms = (() => {
    try {
      const { terms } = window.extractTermsFromItems ? window.extractTermsFromItems(done, { minDocFreq: 2, topN: 5 }) : { terms: [] };
      return terms.slice(0, 5);
    } catch { return []; }
  })();

  // Bloc dominant
  const blocTotals = {};
  done.forEach(i => { blocTotals[i.result.bloc_id] = (blocTotals[i.result.bloc_id] || 0) + 1; });
  const topBlocEntry = Object.entries(blocTotals).sort((a, b) => b[1] - a[1])[0];
  const topBlocDef = topBlocEntry ? ctx.blocs.find(b => b.id === topBlocEntry[0]) : null;

  function copyMarkdown() {
    const md = [
      `# ${titleEdit}`,
      `*${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · Le Filtre v0.2*`,
      ``,
      `## Distribution par bloc`,
      ...ctx.blocs.map(b => {
        const n = byBloc[b.id]?.length || 0;
        if (n === 0) return null;
        return `- **${b.code} ${b.theme.split("/")[0].trim()}** : ${n} signal${n > 1 ? "s" : ""}`;
      }).filter(Boolean),
      ``,
      topTerms.length ? `## Termes récurrents\n${topTerms.map(t => `- ${t.term} (${t.freq} sources)`).join("\n")}` : "",
      ``,
      top3.length ? `## Sources pivot (top scores)\n${top3.map((it, i) => `${i + 1}. **${it.result.title}** — score ${it.result.score}/100`).join("\n")}` : "",
      ``,
      gardefous[0] ? `## Garde-fou\n> ${gardefous[0].title}. ${gardefous[0].body}` : "",
    ].filter(l => l !== null).join("\n");
    navigator.clipboard.writeText(md);
    toast?.("Synthèse copiée en Markdown");
  }

  return (
    <div className="studio-card">
      <div className="studio-card-head">
        <div>
          <h3>Infographie : gabarit de partage</h3>
          <p className="dim small">Format A4 éditable. Personnalise le titre, exporte en PDF ou copie le Markdown.</p>
        </div>
        <span className="mono small muted">Format A4 · sobre</span>
      </div>

      <div className="info-sheet" ref={sheetRef}>
        <header className="info-head">
          <div className="info-eyebrow">Le Filtre · synthèse</div>
          {/* Titre éditable inline */}
          <div
            className="info-title"
            contentEditable
            suppressContentEditableWarning
            onBlur={e => setTitleEdit(e.target.innerText)}
            style={{ outline: "none", cursor: "text", borderBottom: "1px dashed rgba(95,168,79,0.3)" }}
            title="Clique pour modifier le titre"
          >
            {titleEdit}
          </div>
          <div className="info-date small mono dim">{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
          {topBlocDef && (
            <div className="info-dominant">
              <span className={`bloc-dot dot-${topBlocDef.id}`} style={{ marginRight: 6 }} />
              <span className="small">Bloc dominant : <strong>{topBlocDef.code} · {topBlocDef.theme.split("/")[0].trim()}</strong></span>
              <span className="mono small muted" style={{ marginLeft: 8 }}>{done.length} signaux qualifiés</span>
            </div>
          )}
        </header>

        <div className="info-cols">
          {/* Colonne gauche : distribution */}
          <div className="info-col-main">
            <div className="info-section-label">· Distribution par bloc</div>
            {ctx.blocs.map(b => {
              const n = byBloc[b.id]?.length || 0;
              const w = (n / max) * 100;
              return (
                <div key={b.id} className="info-bar-row">
                  <div className="info-bar-name">
                    <span className={`bloc-dot dot-${b.id}`}></span>
                    <span className="small">{b.code} · {b.theme.split("/")[0].trim()}</span>
                  </div>
                  <div className="info-bar-track">
                    <div className={`info-bar-fill bg-${b.id}`} style={{ width: w + "%" }}></div>
                  </div>
                  <div className="info-bar-count mono small">{n}</div>
                </div>
              );
            })}
          </div>

          {/* Colonne droite : termes + sources pivot */}
          <div className="info-col-side">
            {topTerms.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div className="info-section-label">· Termes récurrents</div>
                <div className="info-terms">
                  {topTerms.map((t, i) => (
                    <div key={t.term} className="info-term-row">
                      <span className="info-term-rank mono small muted">{i + 1}</span>
                      <span className="small" style={{ fontWeight: i === 0 ? 600 : 400 }}>{t.term}</span>
                      <span className="info-term-freq mono small muted">{t.freq}×</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {top3.length > 0 && (
              <div>
                <div className="info-section-label">· Sources pivot</div>
                {top3.map((it, i) => (
                  <div key={it.id} className="info-source-row">
                    <span className={`bloc-dot dot-${it.result.bloc_id}`} style={{ flexShrink: 0, marginTop: 3 }} />
                    <div>
                      <div className="small" style={{ fontWeight: 500, lineHeight: 1.3 }}>{it.result.title}</div>
                      <div className="mono" style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>
                        score {it.result.score}/100
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="info-callout">
          <div className="info-section-label">· Garde-fou de la semaine</div>
          <div className="info-callout-body">
            {gardefous[0] && (
              <>
                <span className="info-callout-mark">{gardefous[0].icon}</span>
                <div>
                  <strong className="cream">{gardefous[0].title}.</strong>{" "}
                  <span className="dim">{gardefous[0].body}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Angles éditoriaux agrégés */}
        {(() => {
          const angles = done.filter(i => i.result?.angle_editorial).slice(0, 4);
          if (!angles.length) return null;
          return (
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
              <div className="info-section-label">· Angles éditoriaux à creuser</div>
              {angles.map((it, i) => (
                <div key={it.id} style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "flex-start" }}>
                  <span className={`bloc-dot dot-${it.result.bloc_id}`} style={{ flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <div className="small" style={{ fontStyle: "italic", color: "var(--green)", lineHeight: 1.4 }}>
                      {it.result.angle_editorial}
                    </div>
                    {it.result.format_potentiel?.length > 0 && (
                      <div className="mono" style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 3 }}>
                        → {it.result.format_potentiel.join(" · ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Questions ouvertes agrégées */}
        {(() => {
          const allQ = [];
          done.forEach(it => (it.result?.questions_ouvertes || []).slice(0,1).forEach(q => allQ.push(q)));
          if (!allQ.length) return null;
          return (
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
              <div className="info-section-label">· Questions qui restent ouvertes</div>
              {allQ.slice(0, 4).map((q, i) => (
                <div key={i} className="small" style={{ marginTop: 6, paddingLeft: 14, position: "relative", color: "var(--text-dim)", lineHeight: 1.5 }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--gold)" }}>?</span>
                  {q}
                </div>
              ))}
            </div>
          );
        })()}

        <div className="info-foot">
          <span className="mono small muted">Le Filtre · v0.2 · local-first · {done.length} signaux qualifiés</span>
          <span className="mono small muted">À compléter à la main →</span>
        </div>
      </div>

      <div className="studio-card-actions">
        <span className="small dim">Le squelette est prêt. La mise en image (illustration, dessin, photo sobre) reste ton geste.</span>
        <div className="grow"></div>
        <button className="btn btn-ghost small" onClick={copyMarkdown}>⎘ Copier Markdown</button>
        <button className="btn btn-ghost small" onClick={() => {
          window.print();
          toast?.("Boîte d'impression ouverte : choisir « Enregistrer en PDF »");
        }}>↓ PDF</button>
      </div>
    </div>
  );
}

// ─── Lecture Active (méthode 3 étapes) ───────────────────────────────
const LECTURES_KEY = 'lf-lectures-v1';

function loadLectures() {
  try { return JSON.parse(localStorage.getItem(LECTURES_KEY)) || {}; } catch { return {}; }
}
function saveLectures(data) {
  try { localStorage.setItem(LECTURES_KEY, JSON.stringify(data)); } catch {}
}

const LA_USAGES = [
  { id: 'enseigner',    label: 'Enseigner',          icon: '◦', desc: "expliquer à quelqu'un" },
  { id: 'experimenter', label: 'Expérimenter',        icon: '◉', desc: 'appliquer à un vrai problème' },
  { id: 'contenu',      label: 'Créer du contenu',    icon: '▲', desc: 'article, vidéo, thread, note' },
  { id: 'documenter',   label: 'Documenter',          icon: '▣', desc: "noter là où je l'utiliserai" },
];

function LectureActive({ items, ctx, toast }) {
  const done = items.filter(i => i.result);
  const [selectedId, setSelectedId] = useStateS(done[0]?.id || null);
  const [lectures, setLectures] = useStateS(() => loadLectures());

  const selected = done.find(i => i.id === selectedId);
  const emptyNote = { etape1: '', extrait: '', paraphrase: '', reaction: '', usages: [], usageNotes: '' };
  const note = lectures[selectedId] || emptyNote;

  function updateNote(field, value) {
    const updated = { ...lectures, [selectedId]: { ...(lectures[selectedId] || emptyNote), [field]: value } };
    setLectures(updated);
    saveLectures(updated);
  }

  function toggleUsage(uid) {
    const current = (lectures[selectedId] || emptyNote).usages || [];
    const usages = current.includes(uid) ? current.filter(x => x !== uid) : [...current, uid];
    updateNote('usages', usages);
  }

  function isComplete(id) {
    const n = lectures[id] || {};
    return !!(n.extrait && n.paraphrase && n.reaction && n.usages?.length);
  }

  function exportMarkdown() {
    if (!selected) return;
    const n = lectures[selectedId] || emptyNote;
    const md = [
      `# Lecture Active : ${selected.result.title}`,
      `_${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · Le Filtre v0.2_`,
      ``,
      `## Étape 1 · Ancrage`,
      n.etape1 || '—',
      ``,
      `## Étape 2 · Extraction`,
      ``,
      `**Extrait exact**`,
      `> ${(n.extrait || '—').replace(/\n/g, '\n> ')}`,
      ``,
      `**En mes mots**`,
      n.paraphrase || '—',
      ``,
      `**Ma réaction**`,
      n.reaction || '—',
      ``,
      `## Étape 3 · Usage`,
      `**Modes choisis :** ${(n.usages || []).map(u => LA_USAGES.find(x => x.id === u)?.label || u).join(', ') || '—'}`,
      n.usageNotes ? `\n${n.usageNotes}` : '',
    ].filter(l => l !== null).join('\n');
    navigator.clipboard.writeText(md);
    toast?.('Note Lecture Active copiée en Markdown');
  }

  const completedCount = done.filter(i => isComplete(i.id)).length;

  return (
    <div className="studio-card la-container">
      <div className="studio-card-head">
        <div>
          <h3>Lecture Active</h3>
          <p className="dim small">
            Méthode 3 étapes : ancrer ce qui accroche → extraire et reformuler → décider comment l'utiliser.
            Chaque note produit un bloc Markdown exportable.
          </p>
        </div>
        <span className="mono small muted">{done.length} signaux · {completedCount} noté{completedCount > 1 ? 's' : ''}</span>
      </div>

      {done.length === 0 ? (
        <div className="empty" style={{ padding: '40px 0' }}>
          <div className="empty-title">Aucun contenu qualifié disponible.</div>
          <p className="small">Reviens après avoir analysé au moins un item en Phase 03.</p>
        </div>
      ) : (
        <div className="la-layout">
          {/* Colonne liste */}
          <div className="la-sidebar">
            <div className="la-sidebar-label mono small muted">Sélectionne un contenu</div>
            {done.map(it => {
              const done_ = isComplete(it.id);
              const bloc = ctx.blocs.find(b => b.id === it.result.bloc_id);
              return (
                <button
                  key={it.id}
                  className={`la-item ${selectedId === it.id ? 'on' : ''} ${done_ ? 'done' : ''}`}
                  onClick={() => setSelectedId(it.id)}
                >
                  <span className={`bloc-dot dot-${it.result.bloc_id}`} style={{ flexShrink: 0, marginTop: 3 }} />
                  <div className="la-item-text">
                    <div className="small" style={{ fontWeight: 500, lineHeight: 1.3 }}>{it.result.title}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>
                      {bloc?.code} · score {it.result.score}/100
                    </div>
                  </div>
                  {done_ && <span className="la-check">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Formulaire 3 étapes */}
          {selected ? (
            <div className="la-form">
              <div className="la-item-head">
                <window.BlocChip blocId={selected.result.bloc_id} />
                <window.ScorePill score={selected.result.score} />
                <span className="small dim" style={{ marginLeft: 4, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selected.result.title}
                </span>
              </div>

              {/* Étape 1 : Ancrage */}
              <div className="la-step">
                <div className="la-step-num">1</div>
                <div className="la-step-body">
                  <div className="la-step-title">Ancrage</div>
                  <div className="la-step-hint dim small">Ce qui m'accroche · ce qui me questionne · ce qui résiste. Vite, sans peser les mots.</div>
                  <textarea
                    className="la-textarea" rows={3}
                    placeholder="Note rapide : ce que ça réveille, ce que ça contredit, une question ouverte…"
                    value={note.etape1}
                    onChange={e => updateNote('etape1', e.target.value)}
                  />
                </div>
              </div>

              {/* Étape 2 : Extraction */}
              <div className="la-step">
                <div className="la-step-num">2</div>
                <div className="la-step-body">
                  <div className="la-step-title">Extraction</div>
                  <div className="la-step-hint dim small">Trois gestes distincts : copier tel quel → réécrire avec tes mots → dire ce que tu en penses.</div>

                  <div className="la-field-label mono small">Extrait exact *</div>
                  <textarea
                    className="la-textarea" rows={3}
                    placeholder="Copie le passage qui t'a frappé, mot pour mot. L'exactitude oblige l'attention."
                    value={note.extrait}
                    onChange={e => updateNote('extrait', e.target.value)}
                  />

                  <div className="la-field-label mono small" style={{ marginTop: 12 }}>En mes mots *</div>
                  <textarea
                    className="la-textarea" rows={3}
                    placeholder="Reformule ce que l'auteur dit — sans reprendre son vocabulaire. C'est la preuve que tu as compris."
                    value={note.paraphrase}
                    onChange={e => updateNote('paraphrase', e.target.value)}
                  />

                  <div className="la-field-label mono small" style={{ marginTop: 12 }}>Ma réaction *</div>
                  <textarea
                    className="la-textarea" rows={2}
                    placeholder="Tu es d'accord ? Tu résistes ? Il manque quelque chose ? Laisse parler ton instinct éditorial."
                    value={note.reaction}
                    onChange={e => updateNote('reaction', e.target.value)}
                  />
                </div>
              </div>

              {/* Étape 3 : Usage */}
              <div className="la-step">
                <div className="la-step-num">3</div>
                <div className="la-step-body">
                  <div className="la-step-title">Usage</div>
                  <div className="la-step-hint dim small">L'info qui reste dans le carnet reste de la trivia. Choisis au moins un mode d'intégration.</div>

                  <div className="la-usages">
                    {LA_USAGES.map(u => (
                      <button
                        key={u.id}
                        className={`la-usage-btn ${(note.usages || []).includes(u.id) ? 'on' : ''}`}
                        onClick={() => toggleUsage(u.id)}
                      >
                        <span className="la-usage-icon">{u.icon}</span>
                        <div>
                          <div className="small" style={{ fontWeight: 500 }}>{u.label}</div>
                          <div className="la-usage-desc">{u.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="la-field-label mono small" style={{ marginTop: 12 }}>Où et comment</div>
                  <textarea
                    className="la-textarea" rows={2}
                    placeholder="Contexte précis : quel projet, quel atelier, quelle prise de parole ? Sois spécifique."
                    value={note.usageNotes}
                    onChange={e => updateNote('usageNotes', e.target.value)}
                  />
                </div>
              </div>

              <div className="studio-card-actions" style={{ marginTop: 0 }}>
                <span className="small dim">
                  {isComplete(selectedId)
                    ? '✓ Note complète. Exporte-la ou passe au contenu suivant.'
                    : '* Complète les champs marqués pour ancrer durablement.'}
                </span>
                <div className="grow"></div>
                <button className="btn btn-ghost small" onClick={exportMarkdown}>⎘ Copier Markdown</button>
              </div>
            </div>
          ) : (
            <div className="la-form la-empty-form">
              <div className="empty-title">Sélectionne un contenu à gauche.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Schéma actif (Infographie actionnable) ──────────────────────────
const SCHEMA_TYPES = [
  { id: 'flowchart', label: 'Flux',     glyph: '⟶', desc: 'Connexions & dépendances entre idées' },
  { id: 'mindmap',   label: 'Carte',    glyph: '◎', desc: 'Concept central + ramifications' },
  { id: 'quadrant',  label: 'Quadrant', glyph: '⊞', desc: 'Classement selon 2 axes' },
  { id: 'timeline',  label: 'Timeline', glyph: '⌛', desc: 'Progression / évolution' },
  { id: 'tableau',   label: 'Tableau',  glyph: '▦', desc: 'Comparaison structurée source par source' },
];

let _mermaidReady = false;
function ensureMermaid() {
  if (!_mermaidReady && window.mermaid) {
    try {
      window.mermaid.initialize({
        startOnLoad: false, theme: 'base',
        themeVariables: {
          primaryColor: '#d8e2c4', primaryTextColor: '#2a2418',
          primaryBorderColor: '#4a7a3e', lineColor: '#5a5040',
          background: '#faf5e9', edgeLabelBackground: '#f4eee2',
          tertiaryColor: '#f1ead8', fontSize: '14px',
        }
      });
    } catch {}
    _mermaidReady = true;
  }
}

function SchemaActif({ items, ctx, toast }) {
  const done = items.filter(i => i.result);
  const [sel, setSel] = useStateS(new Set());
  const [schemaType, setSchemaType] = useStateS('flowchart');
  const [angle, setAngle] = useStateS('');
  const [isGenerating, setIsGenerating] = useStateS(false);
  const [mermaidCode, setMermaidCode] = useStateS('');
  const [svgOutput, setSvgOutput] = useStateS('');
  const [showCode, setShowCode] = useStateS(false);
  const [iterPrompt, setIterPrompt] = useStateS('');
  const [hasError, setHasError] = useStateS(false);
  const [historyLen, setHistoryLen] = useStateS(0);

  function toggleItem(id) {
    setSel(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  const selectAll = () => setSel(new Set(done.map(i => i.id)));
  const clearSel  = () => setSel(new Set());

  async function renderMermaid(code) {
    ensureMermaid();
    if (!window.mermaid) { toast?.('Mermaid.js non disponible'); return false; }
    try {
      const uid = 'ms_' + Date.now();
      const { svg } = await window.mermaid.render(uid, code);
      setSvgOutput(svg);
      setHasError(false);
      return true;
    } catch {
      setSvgOutput('');
      setHasError(true);
      return false;
    }
  }

  async function generate(isIter = false) {
    const selectedItems = done.filter(i => sel.has(i.id));
    if (selectedItems.length === 0) { toast?.('Sélectionne au moins un article'); return; }
    setIsGenerating(true);
    setSvgOutput('');
    setHasError(false);

    const itemsBlock = selectedItems.map(it => [
      `### ${it.result.title} [${it.result.bloc_id} · ${it.result.score}/100]`,
      it.result.summary || '',
      it.result.verbatim_cles?.length ? `Verbatims : ${it.result.verbatim_cles.slice(0,2).join(' | ')}` : '',
      it.result.questions_ouvertes?.length ? `Questions : ${it.result.questions_ouvertes.slice(0,2).join(' · ')}` : '',
    ].filter(Boolean).join('\n')).join('\n\n');

    const typeInstr = {
      flowchart: 'un flowchart TD (de haut en bas) montrant les connexions et dépendances entre les idées clés',
      mindmap:   'une mindmap avec le concept central et ses ramifications thématiques principales',
      quadrant:  'un quadrantChart classant les idées selon deux axes pertinents (choisis les axes qui font le plus sens)',
      timeline:  'une timeline montrant la progression ou l\'évolution des idées dans le temps',
      tableau:   'un diagramme de type "block-beta" ou "classDiagram" structurant les idées comme un tableau comparatif entre sources',
    }[schemaType];

    const anglePart = angle ? `\nAngle éditorial / question directrice : "${angle}"` : '';
    const prevPart  = isIter && mermaidCode ? `\n\nDiagramme actuel à ajuster :\n${mermaidCode}` : '';
    const iterPart  = isIter && iterPrompt ? `\n\nDemande de raffinement : "${iterPrompt}"` : '';

    const prompt = `Tu es un expert en visualisation d'information éditoriale. Génère ${typeInstr}.

CONTEXTE PROJETS :
${ctx.projects.slice(0,3).map(p => `- ${p.name} : ${p.objective}`).join('\n')}

ARTICLES SÉLECTIONNÉS (${selectedItems.length}) :
${itemsBlock}
${anglePart}${prevPart}${iterPart}

RÈGLES IMPÉRATIVES :
- Renvoie UNIQUEMENT le code Mermaid brut, sans backticks, sans markdown, sans texte avant ou après
- 6 à 10 noeuds maximum pour garantir la lisibilité
- Labels en français, 3 à 5 mots maximum par noeud
- Identifiants de noeuds : lettres et chiffres uniquement, pas d'espaces ni accents (ex: A1, nodeIA)
- Labels avec espaces ou accents DOIVENT être entre guillemets : A1["Intelligence artificielle"]
- ${schemaType === 'flowchart' ? 'Commence impérativement par "flowchart TD"' : schemaType === 'mindmap' ? 'Commence impérativement par "mindmap"' : schemaType === 'quadrant' ? 'Commence impérativement par "quadrantChart"' : schemaType === 'tableau' ? 'Commence impérativement par "block-beta" pour un tableau comparatif lisible' : 'Commence impérativement par "timeline"'}

Code Mermaid :`;

    try {
      const raw = await window.claude.complete(prompt);
      let code = raw.trim()
        .replace(/^```(?:mermaid)?\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      // Retire tout texte avant le mot-clé Mermaid
      const keywords = ['flowchart', 'mindmap', 'quadrantChart', 'timeline', 'block-beta', 'classDiagram'];
      for (const kw of keywords) {
        const idx = code.indexOf(kw);
        if (idx > 0) { code = code.slice(idx); break; }
      }
      setMermaidCode(code);
      setHistoryLen(n => n + 1);
      const ok = await renderMermaid(code);
      if (!ok) toast?.('Schéma généré — affiche le code pour corriger manuellement');
      else { toast?.('Schéma généré ✓'); setIterPrompt(''); }
    } catch (e) {
      toast?.('Erreur : ' + e.message);
    } finally {
      setIsGenerating(false);
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(mermaidCode);
    toast?.('Code Mermaid copié');
  }

  function downloadSvg() {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: 'image/svg+xml;charset=utf-8' });
    window.downloadBlob(blob, `schema-${new Date().toISOString().slice(0,10)}.svg`);
    toast?.('SVG téléchargé');
  }

  function downloadPng() {
    if (!svgOutput) return;
    const svgBlob = new Blob([svgOutput], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2; // 2x pour bonne résolution
      canvas.width = img.naturalWidth * scale || 800;
      canvas.height = img.naturalHeight * scale || 600;
      const ctx2d = canvas.getContext('2d');
      ctx2d.scale(scale, scale);
      ctx2d.fillStyle = '#faf5e9';
      ctx2d.fillRect(0, 0, canvas.width, canvas.height);
      ctx2d.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => {
        window.downloadBlob(blob, `schema-${new Date().toISOString().slice(0,10)}.png`);
        toast?.('PNG téléchargé (2×)');
      }, 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast?.('Échec export PNG'); };
    img.src = url;
  }

  const selCount = sel.size;

  return (
    <div className="studio-card">
      <div className="studio-card-head">
        <div>
          <h3>Schéma actif</h3>
          <p className="dim small">
            Sélectionne des articles qualifiés, donne un angle, génère un diagramme Mermaid via Claude.
            Itère jusqu'à ce que le schéma soit exploitable pour une production.
          </p>
        </div>
        <span className="mono small muted">{done.length} article{done.length > 1 ? 's' : ''} qualifié{done.length > 1 ? 's' : ''}</span>
      </div>

      {done.length === 0 ? (
        <div className="empty" style={{ padding: '40px 0' }}>
          <div className="empty-title">Aucun contenu qualifié disponible.</div>
          <p className="small">Analyse au moins un article en Phase 03 pour générer un schéma.</p>
        </div>
      ) : (
        <div className="schema-layout">

          {/* ── Colonne gauche : sélection articles ── */}
          <div className="schema-left">
            <div className="schema-col-label mono small muted">
              Sélection · {selCount}/{done.length}
            </div>
            <div style={{ marginBottom: 8, display: 'flex', gap: 6 }}>
              <button className="btn-inline" onClick={selectAll}>Tout</button>
              <span className="muted">·</span>
              <button className="btn-inline" onClick={clearSel}>Aucun</button>
            </div>
            <div className="schema-item-list">
              {done.map(it => {
                const bloc = ctx.blocs.find(b => b.id === it.result.bloc_id);
                const on = sel.has(it.id);
                return (
                  <button key={it.id} className={`schema-item ${on ? 'on' : ''}`} onClick={() => toggleItem(it.id)}>
                    <span className={`schema-check ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
                    <div className="schema-item-body">
                      <div className="small" style={{ fontWeight: 500, lineHeight: 1.3 }}>{it.result.title}</div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>
                        {bloc?.code} · {it.result.score}/100
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Colonne droite : contrôles + diagramme ── */}
          <div className="schema-right">

            {/* Type de schéma */}
            <div className="schema-col-label mono small muted">Type de schéma</div>
            <div className="schema-type-row">
              {SCHEMA_TYPES.map(t => (
                <button
                  key={t.id}
                  className={`schema-type-btn ${schemaType === t.id ? 'on' : ''}`}
                  onClick={() => setSchemaType(t.id)}
                  title={t.desc}
                >
                  <span className="schema-type-glyph">{t.glyph}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Angle éditorial */}
            <div className="schema-col-label mono small muted" style={{ marginTop: 14 }}>
              Angle ou question directrice <span className="muted">(optionnel)</span>
            </div>
            <textarea
              className="la-textarea"
              rows={2}
              placeholder="Ex : comment ces signaux se connectent-ils à la transition ? Quelles tensions émergent ?"
              value={angle}
              onChange={e => setAngle(e.target.value)}
              style={{ marginBottom: 12, fontSize: 13 }}
            />

            {/* Bouton Générer */}
            <button
              className="btn"
              onClick={() => generate(false)}
              disabled={isGenerating || selCount === 0}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {isGenerating
                ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◌</span>&nbsp; Génération en cours…</>
                : <><span className="btn-arrow">⬡</span> Générer le schéma ({selCount} article{selCount > 1 ? 's' : ''})</>
              }
            </button>

            {/* Zone de rendu SVG */}
            {svgOutput && (
              <div className="schema-diagram" dangerouslySetInnerHTML={{ __html: svgOutput }} />
            )}

            {/* Erreur de rendu Mermaid */}
            {hasError && mermaidCode && (
              <div className="schema-error">
                <span className="mono small" style={{ color: 'var(--red)' }}>⚠ Schéma Mermaid invalide.</span>
                <button className="btn-inline" onClick={() => setShowCode(true)} style={{ marginLeft: 10 }}>
                  Voir le code pour corriger
                </button>
              </div>
            )}

            {/* Zone d'itération */}
            {mermaidCode && !isGenerating && (
              <div className="schema-iter-zone">
                <div className="schema-col-label mono small muted">
                  Affiner le schéma
                  {historyLen > 1 && (
                    <span className="muted" style={{ marginLeft: 8, fontWeight: 400 }}>
                      · {historyLen} version{historyLen > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="schema-iter-row">
                  <textarea
                    className="la-textarea"
                    rows={2}
                    placeholder="Ex : simplifie en 5 noeuds · ajoute les tensions · reformule en questions · inverse les axes du quadrant…"
                    value={iterPrompt}
                    onChange={e => setIterPrompt(e.target.value)}
                    style={{ flex: 1, fontSize: 13 }}
                  />
                  <button
                    className="btn btn-ghost"
                    onClick={() => generate(true)}
                    disabled={isGenerating || !iterPrompt.trim()}
                    style={{ flexShrink: 0 }}
                  >
                    Affiner →
                  </button>
                </div>
              </div>
            )}

            {/* Code + export */}
            {mermaidCode && (
              <div className="studio-card-actions" style={{ marginTop: 14 }}>
                <button className="btn btn-ghost small" onClick={() => setShowCode(v => !v)}>
                  {showCode ? '▲ Masquer code' : '▼ Éditer code'}
                </button>
                <div className="grow" />
                <button className="btn btn-ghost small" onClick={copyCode}>⎘ Copier</button>
                {svgOutput && (
                  <>
                    <button className="btn btn-ghost small" onClick={downloadSvg}>↓ SVG</button>
                    <button className="btn btn-ghost small" onClick={downloadPng}>↓ PNG</button>
                  </>
                )}
              </div>
            )}

            {showCode && mermaidCode && (
              <div className="schema-code-block">
                <textarea
                  className="la-textarea mono small"
                  style={{ width: "100%", minHeight: 140, fontSize: 11, fontFamily: "var(--mono)" }}
                  value={mermaidCode}
                  onChange={e => setMermaidCode(e.target.value)}
                />
                <button
                  className="btn btn-ghost small"
                  style={{ marginTop: 6 }}
                  onClick={() => renderMermaid(mermaidCode)}
                >
                  ↺ Ré-afficher le schéma
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Studio container ─────────────────────────────────────────────────
function StudioView({ items, ctx, gardefous, goPrev, toast }) {
  const [tool, setTool] = useStateS("mindmap"); // mindmap | storyboard | infographic | lecture | schema
  const [level, setLevel] = useStateS("intermédiaire");

  return (
    <div>
      <div className="page-head">
        <div className="page-head-label">Phase 06 · Studio</div>
        <h1>L'IA prépare, <em>tu crées</em></h1>
        <p className="sub">
          Squelettes de production générés depuis ta veille qualifiée. Cartes mentales, storyboards,
          infographies : auto-remplis, à terminer à la main (<strong>le geste reste le tien</strong>).
          C'est le geste humain qui rend la production tienne.
        </p>
      </div>

      <div className="studio-toolbar">
        <button className={`studio-tool ${tool === "mindmap" ? "on" : ""}`} onClick={() => setTool("mindmap")}>
          <span className="studio-tool-glyph">◌</span>
          <div>
            <div className="studio-tool-name">Carte mentale</div>
            <div className="studio-tool-desc">Vue radiale par bloc</div>
          </div>
        </button>
        <button className={`studio-tool ${tool === "storyboard" ? "on" : ""}`} onClick={() => setTool("storyboard")}>
          <span className="studio-tool-glyph">▭</span>
          <div>
            <div className="studio-tool-name">Storyboard</div>
            <div className="studio-tool-desc">Squelette vidéo / podcast</div>
          </div>
        </button>
        <button className={`studio-tool ${tool === "infographic" ? "on" : ""}`} onClick={() => setTool("infographic")}>
          <span className="studio-tool-glyph">▤</span>
          <div>
            <div className="studio-tool-name">Infographie</div>
            <div className="studio-tool-desc">Gabarit A4 partageable</div>
          </div>
        </button>
        <button className={`studio-tool ${tool === "lecture" ? "on" : ""}`} onClick={() => setTool("lecture")}>
          <span className="studio-tool-glyph">✦</span>
          <div>
            <div className="studio-tool-name">Lecture Active</div>
            <div className="studio-tool-desc">Ancrer · extraire · utiliser</div>
          </div>
        </button>
        <button className={`studio-tool ${tool === "schema" ? "on" : ""}`} onClick={() => setTool("schema")}>
          <span className="studio-tool-glyph">⬡</span>
          <div>
            <div className="studio-tool-name">Schéma actif</div>
            <div className="studio-tool-desc">Multi-select → Mermaid via IA</div>
          </div>
        </button>
      </div>

      <div className="studio-stage">
        {tool === "mindmap" && <MindMap items={items} ctx={ctx} toast={toast} />}
        {tool === "storyboard" && <Storyboard items={items} ctx={ctx} level={level} setLevel={setLevel} toast={toast} />}
        {tool === "infographic" && <Infographic items={items} ctx={ctx} gardefous={gardefous} toast={toast} />}
        {tool === "lecture" && <LectureActive items={items} ctx={ctx} toast={toast} />}
        {tool === "schema" && <SchemaActif items={items} ctx={ctx} toast={toast} />}
      </div>

      <div className="studio-foot">
        <div className="studio-foot-mark">⌖</div>
        <div>
          <strong className="cream">Principe.</strong>{" "}
          <span className="dim">Le Studio ne monte pas, ne rédige pas l'article, ne dessine pas l'infographie. Il prépare un squelette défalquable et te laisse la main sur le geste, la couleur, le ton, l'ombre.</span>
        </div>
      </div>

      <div className="gap-12" style={{marginTop: 24}}>
        <button className="btn" onClick={goPrev}>
          <span className="btn-arrow">←</span> Dashboard
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { StudioView });
