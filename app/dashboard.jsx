// dashboard.jsx — Phase 05 : pilotage modulaire (stack, rythme, garde-fous)

const { useState: useStateD, useMemo: useMemoD, useEffect: useEffectD } = React;

// ─── Widget registry ───────────────────────────────────────────────────
// Chaque widget est une carte indépendante. On peut les masquer.
const WIDGETS = [
  { id: "w_pulse", title: "Pouls de la semaine", desc: "Volume, scores moyens, blocs dominants" },
  { id: "w_cluster", title: "Cluster verbatim · 2D → 3D", desc: "Arbre de pensées : termes récurrents et corrélations entre sources" },
  { id: "w_stack", title: "Stack & frugalité", desc: "Outils utilisés, coûts, alternatives plus frugales" },
  { id: "w_networks", title: "Réseaux écoutés", desc: "Scope du social listening" },
  { id: "w_gardefous", title: "Garde-fous éditoriaux", desc: "Rappels avant publication" },
  { id: "w_inspi", title: "Inspirations & garants", desc: "Références design, méthodo, cadres officiels" },
];

function StatChip({ label, value, hint, accent }) {
  return (
    <div className="dash-stat">
      <div className="dash-stat-val" style={accent ? { color: accent } : {}}>{value}</div>
      <div className="dash-stat-label">{label}</div>
      {hint && <div className="dash-stat-hint">{hint}</div>}
    </div>
  );
}

function PulseWidget({ items, ctx }) {
  const done = items.filter(i => i.result);
  const avgScore = done.length ? Math.round(done.reduce((s,i) => s + (i.result.score||0), 0) / done.length) : 0;

  const blocCounts = {};
  done.forEach(i => { blocCounts[i.result.bloc_id] = (blocCounts[i.result.bloc_id] || 0) + 1; });
  const top = Object.entries(blocCounts).sort((a,b) => b[1]-a[1])[0];
  const topBloc = top ? ctx.blocs.find(b => b.id === top[0]) : null;

  const high = done.filter(i => (i.result.score||0) >= 75).length;
  const low = done.filter(i => (i.result.score||0) < 50).length;

  return (
    <div className="dash-row">
      <StatChip label="Qualifiés" value={done.length} hint={items.length ? `sur ${items.length} captés` : "—"} />
      <StatChip label="Score moyen" value={avgScore + "/100"} accent={avgScore >= 70 ? "var(--green)" : avgScore >= 50 ? "var(--gold)" : "var(--muted)"} />
      <StatChip label="Hauts signaux" value={high} hint="score ≥ 75" accent="var(--green)" />
      <StatChip label="À recadrer" value={low} hint="score < 50" accent="var(--muted)" />
      <StatChip label="Bloc dominant" value={topBloc ? topBloc.code : "—"} hint={topBloc?.theme.slice(0,28) || ""} />
    </div>
  );
}

const COSTS_KEY = 'lf-costs-v2';

function useCostsData() {
  const [costs, setCosts] = useStateD(() => {
    try { return JSON.parse(localStorage.getItem(COSTS_KEY)) || { monthlyLimit: 10, history: [] }; }
    catch { return { monthlyLimit: 10, history: [] }; }
  });
  // Refresh every 10s to pick up live API usage
  useEffectD(() => {
    const t = setInterval(() => {
      try {
        const d = JSON.parse(localStorage.getItem(COSTS_KEY)) || { monthlyLimit: 10, history: [] };
        setCosts(d);
      } catch {}
    }, 10000);
    return () => clearInterval(t);
  }, []);
  return { costs, setCosts };
}

function StackWidget({ stack, setStack, toast }) {
  const openCount = stack.filter(t => t.value === "oui").length;
  const closedCount = stack.filter(t => t.value === "non").length;
  const { costs, setCosts } = useCostsData();
  const [editingLimit, setEditingLimit] = useStateD(false);
  const [limitInput, setLimitInput] = useStateD(String(costs.monthlyLimit || 10));

  // Journalier = today's cost from localStorage history
  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = (costs.history || []).find(h => h.date === today);
  const journalier = todayEntry?.eur || 0;

  // Cumul = sum of all history
  const cumul = (costs.history || []).reduce((s, h) => s + (h.eur || 0), 0);

  // Mois courant = sum of history in current month
  const thisMonth = today.slice(0, 7);
  const moisCourant = (costs.history || [])
    .filter(h => h.date.startsWith(thisMonth))
    .reduce((s, h) => s + (h.eur || 0), 0);

  const limit = costs.monthlyLimit || 10;
  const pct = Math.min(100, Math.round((moisCourant / limit) * 100));

  function saveLimit(val) {
    const l = parseFloat(val);
    if (isNaN(l) || l <= 0) return;
    const d = { ...costs, monthlyLimit: l };
    setCosts(d);
    try { localStorage.setItem(COSTS_KEY, JSON.stringify(d)); } catch {}
    setEditingLimit(false);
    toast?.("Limite mise à jour");
  }

  function copyAlternatives() {
    const md = "## Alternatives frugales & RGPD\n\n" + stack
      .filter(t => t.frugalAlt && t.frugalAlt !== "—")
      .map(t => `- **${t.name}** → ${t.frugalAlt}`)
      .join("\n");
    navigator.clipboard.writeText(md);
    toast?.("Alternatives copiées en markdown");
  }

  const fmt = (n) => n < 0.001 ? "0.000 €" : n.toFixed(3) + " €";

  return (
    <div>
      {/* ── Suivi coûts API réels ── */}
      <div className="stack-costs-card">
        <div className="stack-costs-header">
          <span className="mono small muted" style={{letterSpacing: 1.5, textTransform: "uppercase", fontSize: 9}}>
            Suivi coûts API · Claude
          </span>
          <div className="grow" />
          {editingLimit ? (
            <div style={{display: "flex", gap: 6, alignItems: "center"}}>
              <span className="mono small muted">Limite/mois&nbsp;:</span>
              <input
                className="tr-input" style={{width: 70, padding: "3px 7px", fontSize: 12}}
                value={limitInput} onChange={e => setLimitInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveLimit(limitInput); if (e.key === "Escape") setEditingLimit(false); }}
                autoFocus
              />
              <span className="mono small muted">€</span>
              <button className="btn btn-sm" onClick={() => saveLimit(limitInput)}>OK</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditingLimit(false)}>×</button>
            </div>
          ) : (
            <button className="btn-inline" onClick={() => { setLimitInput(String(limit)); setEditingLimit(true); }}>
              Limite : {limit} €/mois
            </button>
          )}
        </div>
        <div className="stack-costs-cols">
          <div className="stack-cost-col">
            <div className="stack-cost-label">Journalier</div>
            <div className="stack-cost-value">{fmt(journalier)}</div>
            <div className="stack-cost-sub">aujourd'hui</div>
          </div>
          <div className="stack-cost-sep" />
          <div className="stack-cost-col">
            <div className="stack-cost-label">Mois en cours</div>
            <div className="stack-cost-value" style={{color: pct > 80 ? "var(--red)" : pct > 50 ? "var(--gold)" : "var(--green)"}}>
              {fmt(moisCourant)}
            </div>
            <div className="stack-cost-sub">/ {limit} € · {pct}%</div>
          </div>
          <div className="stack-cost-sep" />
          <div className="stack-cost-col">
            <div className="stack-cost-label">Cumul total</div>
            <div className="stack-cost-value">{fmt(cumul)}</div>
            <div className="stack-cost-sub">{(costs.history || []).length} session{(costs.history || []).length > 1 ? "s" : ""}</div>
          </div>
        </div>
        <div style={{marginTop: 10}}>
          <div className="stack-limit-bar">
            <div className="stack-limit-fill" style={{
              width: pct + "%",
              background: pct > 80 ? "var(--red)" : pct > 50 ? "var(--gold)" : "var(--green)",
            }} />
          </div>
          <div className="mono" style={{fontSize: 9, color: "var(--muted)", marginTop: 3}}>
            {pct < 50 ? "Sous contrôle" : pct < 80 ? "À surveiller" : "Proche de la limite"}
          </div>
        </div>
      </div>

      {/* ── Stats briques ── */}
      <div className="dash-row" style={{marginBottom: 18}}>
        <StatChip label="Open source" value={openCount} hint={`sur ${stack.length} briques`} accent="var(--green)" />
        <StatChip label="Propriétaire" value={closedCount} accent={closedCount > 2 ? "var(--terra)" : "var(--muted)"} />
        <StatChip label="Local / gratuit" value={stack.filter(t => t.cost.match(/local|gratuit/i)).length} accent="var(--green)" />
        <div className="grow"></div>
        <button className="btn" onClick={copyAlternatives}>⎘ Copier les alternatives</button>
      </div>

      <div className="stack-table">
        <div className="stack-row stack-head">
          <div>Brique</div>
          <div>Rôle</div>
          <div>Modèle</div>
          <div>Coût</div>
          <div>Alternative RGPD</div>
        </div>
        {stack.map(t => (
          <div key={t.id} className={`stack-row stack-${t.value}`}>
            <div>
              <div className="stack-name">{t.name}</div>
              <div className="stack-layer">{t.layer}</div>
            </div>
            <div className="dim small">{t.role}</div>
            <div>
              <span className={`os-pill os-${t.value}`}>
                {t.value === "oui" ? "Open" : t.value === "partiel" ? "Mixte" : "Propriétaire"}
              </span>
            </div>
            <div className="mono small">{t.cost}</div>
            <div className="dim small" style={{fontStyle: t.frugalAlt === "—" ? "normal" : "italic"}}>
              {t.frugalAlt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworksWidget({ networks, setNetworks }) {
  function toggle(id) {
    setNetworks(networks.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  }
  const active = networks.filter(n => n.enabled).length;
  return (
    <div>
      <p className="helper" style={{marginBottom: 14}}>
        <span className="mono" style={{color: "var(--green)"}}>→</span>{" "}
        Scope du social listening : <strong>max 3 réseaux actifs simultanément</strong>, 3-4 recherches (6-8 max).
        Aucun accès sans ton autorisation explicite et sans API consentie.
      </p>
      <div className="networks-grid">
        {networks.map(n => (
          <div key={n.id} className={`network-card ${n.enabled ? "on" : "off"}`}>
            <div className="network-head">
              <button className={`switch ${n.enabled ? "on" : ""}`} onClick={() => toggle(n.id)}>
                <span className="switch-knob"></span>
              </button>
              <div className="network-name">{n.name}</div>
            </div>
            <div className="network-scope small dim">{n.scope}</div>
            <div className="network-api mono small muted">{n.api}</div>
          </div>
        ))}
      </div>
      {active > 3 && (
        <div className="alert">
          ⚠ {active} réseaux actifs : la limite recommandée est 3. Tu peux dépasser, mais le signal/bruit baissera vite.
        </div>
      )}
    </div>
  );
}

function GardefousWidget({ gardefous }) {
  return (
    <div className="gf-list">
      {gardefous.map(g => (
        <div key={g.id} className="gf-card">
          <div className="gf-mark">{g.icon}</div>
          <div className="gf-body">
            <h4>{g.title}</h4>
            <p>{g.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InspiWidget({ inspirations }) {
  const grouped = {};
  inspirations.forEach(i => {
    (grouped[i.category] = grouped[i.category] || []).push(i);
  });
  return (
    <div className="inspi-grid">
      {Object.entries(grouped).map(([cat, list]) => (
        <div key={cat} className="inspi-block">
          <div className="inspi-cat">{cat}</div>
          <ul>
            {list.map(i => (
              <li key={i.id}>
                <strong className="cream">{i.name}</strong>
                <span className="dim small"> : {i.note}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function DashboardView({ items, ctx, stack, setStack, networks, setNetworks, gardefous, inspirations, goPrev, goNext, toast }) {
  // Tracking which widgets are visible + their order — draggable
  const STORAGE = "le-filtre-dashboard-layout-v0.2";
  const initial = (() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) return JSON.parse(raw); } catch (e) {}
    return WIDGETS.map(w => w.id);
  })();
  const [order, setOrder] = useStateD(initial);
  const [dragging, setDragging] = useStateD(null);

  function saveOrder(newOrder) {
    setOrder(newOrder);
    try { localStorage.setItem(STORAGE, JSON.stringify(newOrder)); } catch (e) {}
  }

  function removeWidget(id) {
    saveOrder(order.filter(x => x !== id));
  }
  function resetWidgets() {
    saveOrder(WIDGETS.map(w => w.id));
  }
  function onDragStart(id) { setDragging(id); }
  function onDragOver(e, overId) {
    e.preventDefault();
    if (!dragging || dragging === overId) return;
    const cur = order.filter(x => x !== dragging);
    const idx = cur.indexOf(overId);
    cur.splice(idx, 0, dragging);
    setOrder(cur);
  }
  function onDragEnd() {
    setDragging(null);
    try { localStorage.setItem(STORAGE, JSON.stringify(order)); } catch (e) {}
  }

  function renderWidget(id) {
    const def = WIDGETS.find(w => w.id === id);
    if (!def) return null;
    let body = null;
    if (id === "w_pulse") body = <PulseWidget items={items} ctx={ctx} />;
    if (id === "w_cluster") body = <window.ClusterWidget items={items} ctx={ctx} toast={toast} />;
    if (id === "w_stack") body = <StackWidget stack={stack} setStack={setStack} toast={toast} />;
    if (id === "w_networks") body = <NetworksWidget networks={networks} setNetworks={setNetworks} />;
    if (id === "w_gardefous") body = <GardefousWidget gardefous={gardefous} />;
    if (id === "w_inspi") body = <InspiWidget inspirations={inspirations} />;
    return (
      <div
        key={id}
        className={`dash-widget ${dragging === id ? "drag" : ""}`}
        draggable
        onDragStart={() => onDragStart(id)}
        onDragOver={(e) => onDragOver(e, id)}
        onDragEnd={onDragEnd}
      >
        <div className="dash-widget-head">
          <div className="dash-drag" title="Glisser pour réordonner">⋮⋮</div>
          <div>
            <div className="dash-widget-title">{def.title}</div>
            <div className="dash-widget-desc">{def.desc}</div>
          </div>
          <div className="grow"></div>
          <button className="icon-btn" onClick={() => removeWidget(id)} title="Masquer">×</button>
        </div>
        <div className="dash-widget-body">{body}</div>
      </div>
    );
  }

  const hidden = WIDGETS.filter(w => !order.includes(w.id));

  return (
    <div>
      <div className="page-head">
        <div className="page-head-label">Phase 05 · Dashboard</div>
        <h1>Pilote en <em>connaissance de cause</em></h1>
        <p className="sub">
          Vue d'ensemble du rythme, de la stack et des garde-fous. Glisse les blocs pour réorganiser,
          masque ce qui ne te sert pas. Drag-and-drop sans code.
        </p>
      </div>

      <div className="toolbar" style={{marginBottom: 18}}>
        {hidden.length > 0 && (
          <>
            <span className="small muted mono">+ ajouter :</span>
            {hidden.map(w => (
              <button key={w.id} className="btn btn-ghost small" onClick={() => saveOrder([...order, w.id])}>
                + {w.title}
              </button>
            ))}
          </>
        )}
        <div className="grow"></div>
        <button className="btn btn-ghost" onClick={resetWidgets}>↻ Réinitialiser la disposition</button>
      </div>

      <div className="dash-grid">
        {order.map(renderWidget)}
      </div>

      <div className="gap-12" style={{marginTop: 24}}>
        <button className="btn" onClick={goPrev}>
          <span className="btn-arrow">←</span> Triage
        </button>
        <div className="grow"></div>
        <button className="btn btn-primary" onClick={goNext}>
          Passer au Studio <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardView });
