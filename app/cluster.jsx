// cluster.jsx — Verbatim/concept cluster · v2 "neural flow"
// Extraction unigrammes + bigrammes (fr+en, stopwords),
// co-occurrence, layout force-directed live (rAF),
// rendu SVG avec filtres de lueur par bloc.
// Aucun Three.js — stack frugale.
/* global React */

const {
  useState: useStateC,
  useMemo: useMemoC,
  useEffect: useEffectC,
  useRef: useRefC,
  useCallback: useCallbackC,
} = React;

// ─── Palette bloc ──────────────────────────────────────────────────────
const BLOC_COLORS = {
  B1: "#5fa84f",  // RSE — vert
  B2: "#5a9ec4",  // Épistémologie — bleu
  B3: "#9b72c8",  // Tech/IA — violet
  B4: "#c8a83a",  // Géopolitique — ocre
  B5: "#c46060",  // Cognitif — rouge
  B6: "#d4853a",  // Création — orange
};
const BLOC_LABELS = {
  B1: "RSE", B2: "Épistémologie", B3: "Tech/IA",
  B4: "Géopolitique", B5: "Cognitif", B6: "Création",
};
function blocColor(b) { return BLOC_COLORS[b] || "#8aab8a"; }

// ─── Stopwords (fr + en, liste légère) ────────────────────────────────
const STOPWORDS = new Set((
  "alors ainsi avec avoir aussi avant ceux cette comme dans dont depuis donc " +
  "elle elles encore ensuite entre était etait etre être faire faut fait " +
  "juste leur leurs lors mais même meme nous parce peut plus pour pourquoi " +
  "quand quel quelle quels quoi sans selon sera serait seul seule sont sous " +
  "sur tout tous toute toutes très tres une uns vers votre vos vous chez " +
  "aient cela celui celle ceci chaque faisons font lorsque malgré mes moins " +
  "notre par parmi pendant ses tandis tels telle toi vais allez " +
  "depuis tellement vraiment beaucoup peu davantage environ chacun chacune " +
  "mille milliers million millions percent pourcent percentage " +
  "this that with from have been they them their what when where which " +
  "while would should could about after again also before below between " +
  "during into more other such than then there very your yours just like " +
  "will here over only some most each every much many even still both " +
  "article texte content newsletter semaine semaines mois jours année " +
  "partie point chose idée fois lieu cas type nouveau faire fait font " +
  "peuvent doivent doit pouvoir voir vu vue parlent parler dit dire " +
  "dont avait avoir ayant été êtes vais allons allez depuis vraiment " +
  "tous toute toutes chacun chacune environ pourcent percentage"
).split(/\s+/));

// ─── Tokenisation ─────────────────────────────────────────────────────
function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[''"""«»]/g, " ")
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .filter(w => w.length >= 4 && !/^\d+$/.test(w));
}

// ─── Extraction termes + arêtes ──────────────────────────────────────
function extractTermsFromItems(items, opts = {}) {
  const minDocFreq = opts.minDocFreq ?? 2;
  const topN = opts.topN ?? 30;

  const qualified = items.filter(i => i.result).slice(0, 60);
  if (qualified.length === 0) return { terms: [], edges: [], perItem: [] };

  const perItem = qualified.map(i => {
    const r = i.result;
    const text = [
      r.title || "",
      r.summary || "",
      (r.verbatim_cles || []).join(" "),
      r.angle_editorial || "",
      (r.questions_ouvertes || []).join(" "),
    ].join(" ");
    const tokens = tokenize(text).filter(t => !STOPWORDS.has(t));
    const set = new Set();
    tokens.forEach(t => { if (t.length >= 4) set.add(t); });
    for (let k = 0; k < tokens.length - 1; k++) {
      const a = tokens[k], b = tokens[k + 1];
      if (a.length >= 4 && b.length >= 4 && !STOPWORDS.has(a) && !STOPWORDS.has(b)) {
        set.add(a + " " + b);
      }
    }
    return { itemId: i.id, item: i, terms: set };
  });

  const counts = new Map();
  perItem.forEach(({ itemId, terms }) => {
    terms.forEach(t => {
      let c = counts.get(t);
      if (!c) { c = { term: t, freq: 0, items: [] }; counts.set(t, c); }
      c.freq++;
      c.items.push(itemId);
    });
  });

  let candidates = [...counts.values()].filter(t => t.freq >= minDocFreq);
  candidates.sort((a, b) => b.freq - a.freq);
  candidates = candidates.slice(0, topN * 2);

  // Dedoublonnage : si un unigramme est absorbé par un bigramme de freq similaire, on drop l'unigramme
  const bigrams = candidates.filter(t => t.term.includes(" "));
  const drop = new Set();
  bigrams.forEach(bg => {
    bg.term.split(" ").forEach(w => {
      const uni = candidates.find(t => t.term === w);
      if (uni && uni.freq <= bg.freq * 1.5) drop.add(uni.term);
    });
  });
  const cleaned = candidates.filter(t => !drop.has(t.term)).slice(0, topN);

  // Bloc dominant par terme
  const itemsById = {};
  items.forEach(it => { itemsById[it.id] = it; });
  cleaned.forEach(t => {
    const blocs = {};
    t.items.forEach(id => {
      const b = itemsById[id]?.result?.bloc_id;
      if (b) blocs[b] = (blocs[b] || 0) + 1;
    });
    t.bloc = Object.entries(blocs).sort((a, b) => b[1] - a[1])[0]?.[0] || "B1";
  });

  // Arêtes de co-occurrence
  const edges = [];
  for (let i = 0; i < cleaned.length; i++) {
    const a = new Set(cleaned[i].items);
    for (let j = i + 1; j < cleaned.length; j++) {
      const co = cleaned[j].items.filter(id => a.has(id));
      if (co.length >= 2) edges.push({ a: i, b: j, weight: co.length, items: co });
    }
  }

  return { terms: cleaned, edges, perItem };
}

// ─── Hook physique live (requestAnimationFrame) ───────────────────────
// Simule un ressort de Fruchterman-Reingold en continu.
// Les nœuds se stabilisent puis dérivent doucement (bruit).
function useSpringLayout(terms, edges, edgeFilter) {
  const W = 720, H = 460;
  const posRef = useRefC(null);
  const velRef = useRefC(null);
  const rafRef = useRefC(null);
  const [tick, setTick] = useStateC(0);

  // Réinitialise quand les termes changent
  useEffectC(() => {
    const N = terms.length;
    if (N === 0) { posRef.current = []; return; }

    // Positions initiales : spirale large pour minimiser les chevauchements initiaux
    posRef.current = terms.map((_, i) => {
      const ang = (i / N) * Math.PI * 2;
      // Rayon variable (spirale) pour éviter que tout parte du même point
      const rr = 0.28 + (i % 3) * 0.06;
      return {
        x: W / 2 + Math.cos(ang) * W * rr,
        y: H / 2 + Math.sin(ang) * H * rr * 0.8,
      };
    });
    velRef.current = terms.map(() => ({ vx: 0, vy: 0 }));

    let frame = 0;
    // k plus large = noeuds plus espacés. On booste selon la densité.
    const k = Math.sqrt((W * H) / Math.max(N, 1)) * 1.2;
    const filteredEdges = edges.filter(e => e.weight >= edgeFilter);

    const step = () => {
      const pos = posRef.current;
      const vel = velRef.current;
      if (!pos || !vel) return;

      // Refroidissement progressif puis léger bruit
      const cooling = Math.max(0.3, 4.5 - frame * 0.04);
      const damping = 0.82;

      const fx = new Float32Array(N);
      const fy = new Float32Array(N);

      // Répulsion
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pos[i].x - pos[j].x;
          const dy = pos[i].y - pos[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.5;
          const fr = (k * k) / dist;
          const ux = dx / dist, uy = dy / dist;
          fx[i] += ux * fr; fy[i] += uy * fr;
          fx[j] -= ux * fr; fy[j] -= uy * fr;
        }
      }

      // Attraction (arêtes)
      filteredEdges.forEach(e => {
        const dx = pos[e.a].x - pos[e.b].x;
        const dy = pos[e.a].y - pos[e.b].y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.5;
        const fa = (dist * dist) / k * (0.5 + e.weight * 0.15);
        const ux = dx / dist, uy = dy / dist;
        fx[e.a] -= ux * fa; fy[e.a] -= uy * fa;
        fx[e.b] += ux * fa; fy[e.b] += uy * fa;
      });

      // Rappel vers centre
      for (let i = 0; i < N; i++) {
        fx[i] += (W / 2 - pos[i].x) * 0.012;
        fy[i] += (H / 2 - pos[i].y) * 0.012;
      }

      // Micro-bruit après stabilisation (donne vie)
      const noise = frame > 80 ? 0.4 : 0;

      for (let i = 0; i < N; i++) {
        const m = Math.sqrt(fx[i] * fx[i] + fy[i] * fy[i]);
        const cap = Math.min(m || 0, cooling);
        vel[i].vx = (vel[i].vx + (m > 0 ? (fx[i] / m) * cap : 0)) * damping;
        vel[i].vy = (vel[i].vy + (m > 0 ? (fy[i] / m) * cap : 0)) * damping;
        if (noise > 0) {
          vel[i].vx += (Math.random() - 0.5) * noise;
          vel[i].vy += (Math.random() - 0.5) * noise;
        }
        pos[i].x = Math.max(40, Math.min(W - 40, pos[i].x + vel[i].vx));
        pos[i].y = Math.max(40, Math.min(H - 40, pos[i].y + vel[i].vy));
      }

      frame++;
      // Render toutes les 3 frames (économie CPU sans sacrifier la fluidité apparente)
      if (frame % 3 === 0) setTick(t => t + 1);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [terms, edges, edgeFilter]);

  return { posRef, tick };
}

// ─── Composant principal ──────────────────────────────────────────────
function ClusterWidget({ items, ctx, toast }) {
  const [edgeFilter, setEdgeFilter] = useStateC(2);
  const [selected, setSelected] = useStateC(null);
  const [mechOpen, setMechOpen] = useStateC(false);
  const svgRef = useRefC(null);

  const { terms, edges } = useMemoC(() => extractTermsFromItems(items), [items]);
  const filteredEdges = useMemoC(() => edges.filter(e => e.weight >= edgeFilter), [edges, edgeFilter]);
  const maxFreq = useMemoC(() => Math.max(...terms.map(t => t.freq), 1), [terms]);

  const { posRef, tick } = useSpringLayout(terms, filteredEdges, edgeFilter);

  const W = 720, H = 460;

  // Map items par id pour le panneau de détail
  const itemsById = useMemoC(() => {
    const m = {};
    items.forEach(it => { m[it.id] = it; });
    return m;
  }, [items]);

  // Connexions du nœud sélectionné
  const connectedTo = useMemoC(() => {
    if (selected === null) return [];
    return filteredEdges
      .filter(e => e.a === selected || e.b === selected)
      .map(e => ({ idx: e.a === selected ? e.b : e.a, weight: e.weight }))
      .sort((a, b) => b.weight - a.weight);
  }, [selected, filteredEdges]);

  if (terms.length === 0) {
    return (
      <div className="cluster-empty">
        <div className="empty-title">Pas encore assez de signaux qualifiés.</div>
        <p className="small">Qualifie au moins 3 contenus pour que le cluster apparaisse. Les termes répétés à travers tes sources construisent les noeuds.</p>
      </div>
    );
  }

  const pos = posRef.current || [];

  // ─── SVG defs : filtres de lueur par bloc ─────────────────────────
  const svgDefs = (
    <defs>
      {Object.entries(BLOC_COLORS).map(([b, col]) => {
        // Convertir hex en composantes RGB pour feColorMatrix
        const r = parseInt(col.slice(1, 3), 16) / 255;
        const g = parseInt(col.slice(3, 5), 16) / 255;
        const bv = parseInt(col.slice(5, 7), 16) / 255;
        return (
          <filter key={b} id={`glow-${b}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${bv}  0 0 0 0.75 0`}
              in="blur"
              result="colored"
            />
            <feMerge>
              <feMergeNode in="colored" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        );
      })}
      {/* Filtre de lueur douce pour les arêtes */}
      <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      {/* Vignette radiale */}
      <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
      </radialGradient>
      {/* Grille de fond */}
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#a8d5b5" strokeWidth="0.4" />
      </pattern>
    </defs>
  );

  return (
    <div className="cv2-root">
      {/* Barre de contrôles */}
      <div className="cv2-toolbar">
        <div className="cv2-stats">
          <span className="cv2-stat"><span className="cv2-num">{terms.length}</span> termes</span>
          <span className="cv2-stat"><span className="cv2-num">{filteredEdges.length}</span> liens</span>
          <span className="cv2-stat"><span className="cv2-num">{items.filter(i => i.result).length}</span> sources</span>
        </div>
        <span className="cv2-grow" />
        <label className="cv2-slider">
          <span className="mono small muted">Co-occurrence ≥</span>
          <input
            type="range"
            min={2}
            max={Math.max(2, Math.max(...filteredEdges.map(e => e.weight), 2))}
            value={edgeFilter}
            onChange={e => { setEdgeFilter(parseInt(e.target.value)); setSelected(null); }}
          />
          <span className="mono small">{edgeFilter}</span>
        </label>
        <button className="btn btn-ghost small" onClick={() => {
          const svg = svgRef.current;
          if (!svg) return;
          const blob = new Blob([window.svgString(svg)], { type: "image/svg+xml;charset=utf-8" });
          window.downloadBlob(blob, `cluster-${new Date().toISOString().slice(0, 10)}.svg`);
          toast?.("SVG téléchargé — transposable Canva / Illustrator");
        }}>↓ SVG</button>
        <button className="btn btn-ghost small" onClick={async () => {
          const svg = svgRef.current;
          if (!svg) return;
          try {
            const blob = await window.svgToPng(svg, 2);
            window.downloadBlob(blob, `cluster-${new Date().toISOString().slice(0, 10)}.png`);
            toast?.("PNG haute résolution téléchargé");
          } catch { toast?.("Échec export PNG"); }
        }}>↓ PNG</button>
      </div>

      {/* Figures dominantes — lecture rapide avant de plonger dans le graphe */}
      {terms.length >= 3 && (() => {
        // Top 5 termes, bloc dominant global, concentration thématique
        const top5 = terms.slice(0, 5);
        const blocTotals = {};
        terms.forEach(t => { blocTotals[t.bloc] = (blocTotals[t.bloc] || 0) + t.freq; });
        const topBlocId = Object.entries(blocTotals).sort((a, b) => b[1] - a[1])[0]?.[0];
        const topBlocLabel = BLOC_LABELS[topBlocId] || topBlocId;
        const topBlocColor = blocColor(topBlocId);
        const concentration = Math.round((blocTotals[topBlocId] || 0) / Object.values(blocTotals).reduce((s, v) => s + v, 0) * 100);
        return (
          <div className="cv2-figures">
            <div className="cv2-fig-title">
              <span className="mono small" style={{ color: "var(--green)" }}>◈</span>
              <span className="small muted" style={{ marginLeft: 6 }}>Figures dominantes</span>
            </div>
            <div className="cv2-fig-body">
              <div className="cv2-fig-col">
                <div className="cv2-fig-label">Termes les plus récurrents</div>
                <div className="cv2-fig-chips">
                  {top5.map((t, i) => (
                    <button
                      key={t.term}
                      className="cv2-conn-chip"
                      style={{ borderColor: blocColor(t.bloc), opacity: selected === i ? 1 : 0.85 }}
                      onClick={() => setSelected(selected === i ? null : i)}
                    >
                      {t.term}
                      <span className="cv2-badge">{t.freq}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="cv2-fig-col">
                <div className="cv2-fig-label">Bloc dominant</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: topBlocColor }} />
                  <span className="small" style={{ color: topBlocColor, fontWeight: 600 }}>{topBlocId} · {topBlocLabel}</span>
                  <span className="mono small muted">({concentration}% du signal)</span>
                </div>
                <div className="cv2-fig-label" style={{ marginTop: 10 }}>Connexions actives</div>
                <div className="mono small" style={{ color: "var(--cream)", marginTop: 2 }}>
                  {filteredEdges.length} liens sur {terms.length} noeuds
                  <span className="muted"> (seuil : {edgeFilter}+)</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Zone SVG */}
      <div className="cv2-stage">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="cv2-svg"
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          {svgDefs}

          {/* Fond sombre */}
          <rect width={W} height={H} fill="#0c0e0b" rx="10" />
          {/* Grille subtile */}
          <rect width={W} height={H} fill="url(#grid)" opacity="0.04" rx="10" />
          {/* Vignette */}
          <rect width={W} height={H} fill="url(#vignette)" rx="10" />

          {/* Arêtes */}
          <g>
            {filteredEdges.map((e, k) => {
              const na = pos[e.a], nb = pos[e.b];
              if (!na || !nb) return null;
              const isSel = selected === e.a || selected === e.b;
              const dim = selected !== null && !isSel;
              const col = blocColor(terms[e.a]?.bloc);
              const w = Math.min(3, 0.5 + e.weight * 0.4);
              return (
                <line
                  key={k}
                  x1={na.x} y1={na.y}
                  x2={nb.x} y2={nb.y}
                  stroke={col}
                  strokeWidth={isSel ? w + 1 : w}
                  opacity={dim ? 0.06 : isSel ? 0.75 : 0.25}
                  filter={isSel ? "url(#glow-edge)" : undefined}
                />
              );
            })}
          </g>

          {/* Noeuds */}
          <g>
            {terms.map((term, i) => {
              const p = pos[i];
              if (!p) return null;
              const r = 5 + Math.sqrt(term.freq) * 2.8;
              const col = blocColor(term.bloc);
              const isTop = term.freq >= maxFreq * 0.7;
              const isSel = selected === i;
              const dim = selected !== null && !isSel;
              const fontSize = Math.max(9, Math.min(13, 9 + term.freq * 0.4));

              return (
                <g
                  key={i}
                  transform={`translate(${p.x},${p.y})`}
                  onClick={() => setSelected(selected === i ? null : i)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Anneau de pulse pour les termes dominants */}
                  {isTop && (
                    <circle r={r + 8} fill="none" stroke={col} strokeWidth="1" opacity={dim ? 0.03 : 0.4}>
                      <animate attributeName="r" values={`${r + 6};${r + 16};${r + 6}`} dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values={`${dim ? 0.02 : 0.4};0;${dim ? 0.02 : 0.4}`} dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Halo sélection */}
                  {isSel && (
                    <circle r={r + 10} fill="none" stroke={col} strokeWidth="2" opacity="0.6" />
                  )}
                  {/* Noeud */}
                  <circle
                    r={r}
                    fill={col}
                    fillOpacity={dim ? 0.2 : isSel ? 1.0 : 0.85}
                    filter={`url(#glow-${term.bloc})`}
                  />
                  {/* Label : côté droit si noeud dans la moitié gauche, gauche sinon */}
                  {(() => {
                    const onRight = !p || p.x < W * 0.55;
                    return (
                      <text
                        x={onRight ? r + 6 : -(r + 6)}
                        y={4}
                        textAnchor={onRight ? "start" : "end"}
                        fill={dim ? "#444" : "#e8f0e4"}
                        fontSize={fontSize}
                        fontFamily="'IBM Plex Mono', monospace"
                        fontWeight={isSel || isTop ? "600" : "400"}
                        paintOrder="stroke"
                        stroke="#0c0e0b"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        style={{ userSelect: "none", pointerEvents: "none" }}
                      >
                        {term.term}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Panneau détail noeud sélectionné */}
      {selected !== null && terms[selected] && (
        <div className="cv2-detail">
          <div className="cv2-detail-head">
            <span
              style={{
                display: "inline-block", width: 10, height: 10, borderRadius: "50%",
                background: blocColor(terms[selected].bloc), marginRight: 8, flexShrink: 0,
              }}
            />
            <strong>«{terms[selected].term}»</strong>
            <span className="mono small muted" style={{ marginLeft: 8 }}>
              {terms[selected].freq} source{terms[selected].freq > 1 ? "s" : ""}
            </span>
            <span className="cv2-grow" />
            <button className="cv2-close" onClick={() => setSelected(null)}>✕</button>
          </div>
          {/* Termes liés */}
          {connectedTo.length > 0 && (
            <div className="cv2-connections">
              {connectedTo.slice(0, 8).map(({ idx, weight }) => (
                <button
                  key={idx}
                  className="cv2-conn-chip"
                  style={{ borderColor: blocColor(terms[idx]?.bloc) }}
                  onClick={() => setSelected(idx)}
                >
                  {terms[idx]?.term}
                  <span className="cv2-badge">{weight}</span>
                </button>
              ))}
            </div>
          )}
          {/* Sources */}
          <div className="cv2-detail-items">
            {terms[selected].items.slice(0, 5).map(id => {
              const it = itemsById[id];
              if (!it?.result) return null;
              return (
                <div key={id} className="cv2-detail-item">
                  <span
                    style={{
                      display: "inline-block", width: 7, height: 7, borderRadius: "50%",
                      background: blocColor(it.result.bloc_id), marginRight: 6, flexShrink: 0,
                    }}
                  />
                  <span className="small dim">{it.result.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legende blocs */}
      <div className="cv2-legend">
        {Object.entries(BLOC_LABELS).map(([b, label]) => (
          <span key={b} className="cv2-legend-item">
            <span className="cv2-legend-dot" style={{ background: blocColor(b) }} />
            <span className="small muted">{b} {label}</span>
          </span>
        ))}
      </div>

      {/* Section mecanismes transparents */}
      <div className="cv2-mech">
        <button className="cv2-mech-toggle" onClick={() => setMechOpen(o => !o)}>
          <span className="mono small" style={{ color: "var(--green)" }}>⚙</span>
          <span className="small muted" style={{ marginLeft: 6 }}>
            Mécanismes du cluster {mechOpen ? "▲" : "▼"}
          </span>
        </button>
        {mechOpen && (
          <ol className="cv2-steps">
            <li className="cv2-step">
              <span className="cv2-stage-label">Extraction</span>
              Chaque signal qualifié est tokenisé : titre, résumé, verbatims, angle éditorial. Unigrammes (1 mot) et bigrammes (2 mots consécutifs) sont extraits, les mots courants filtrés (liste de ~200 stopwords fr+en).
            </li>
            <li className="cv2-step">
              <span className="cv2-stage-label">Fréquence</span>
              Seuls les termes présents dans au moins {edgeFilter} sources distinctes sont retenus. Le rayon de chaque noeud est proportionnel à cette fréquence documentaire.
            </li>
            <li className="cv2-step">
              <span className="cv2-stage-label">Co-occurrence</span>
              Deux termes sont reliés s'ils apparaissent dans au moins {edgeFilter} sources communes. Le filtre "Co-occurrence ≥ N" contrôle le seuil minimal de connexion.
            </li>
            <li className="cv2-step">
              <span className="cv2-stage-label">Déduplication</span>
              Si un unigramme est absorbé par un bigramme de fréquence similaire (ex. "sobriété" vs "sobriété énergétique"), l'unigramme est supprimé pour éviter les doublons.
            </li>
            <li className="cv2-step">
              <span className="cv2-stage-label">Layout physique</span>
              Les noeuds se repoussent (force inversement proportionnelle à la distance) et les arêtes les attirent (ressort proportionnel au poids). La simulation tourne en continu via <code>requestAnimationFrame</code> avec refroidissement progressif, puis micro-bruit pour maintenir la vie.
            </li>
            <li className="cv2-step">
              <span className="cv2-stage-label">Couleur</span>
              Chaque noeud prend la couleur du bloc dominant (le bloc qui apparaît le plus souvent dans les sources portant ce terme). Les noeuds en pulsation apparaissent dans au moins 70% des sources les plus fréquentes.
            </li>
          </ol>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ClusterWidget, extractTermsFromItems });
