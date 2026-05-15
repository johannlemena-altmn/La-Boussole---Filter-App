// dashboard.jsx — Phase 05 : pilotage modulaire (stack, rythme, garde-fous)

const {
  useState: useStateD,
  useMemo: useMemoD,
  useEffect: useEffectD
} = React;

// ─── Widget registry ───────────────────────────────────────────────────
// Chaque widget est une carte indépendante. On peut les masquer.
const WIDGETS = [{
  id: "w_pulse",
  title: "Pouls de la semaine",
  desc: "Volume, scores moyens, blocs dominants"
}, {
  id: "w_cluster",
  title: "Cluster verbatim · 2D → 3D",
  desc: "Arbre de pensées : termes récurrents et corrélations entre sources"
}, {
  id: "w_stack",
  title: "Stack & frugalité",
  desc: "Outils utilisés, coûts, alternatives plus frugales"
}, {
  id: "w_networks",
  title: "Réseaux écoutés",
  desc: "Scope du social listening"
}, {
  id: "w_gardefous",
  title: "Garde-fous éditoriaux",
  desc: "Rappels avant publication"
}, {
  id: "w_inspi",
  title: "Inspirations & garants",
  desc: "Références design, méthodo, cadres officiels"
}];
function StatChip({
  label,
  value,
  hint,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "dash-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-stat-val",
    style: accent ? {
      color: accent
    } : {}
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "dash-stat-label"
  }, label), hint && /*#__PURE__*/React.createElement("div", {
    className: "dash-stat-hint"
  }, hint));
}
function PulseWidget({
  items,
  ctx
}) {
  const done = items.filter(i => i.result);
  const avgScore = done.length ? Math.round(done.reduce((s, i) => s + (i.result.score || 0), 0) / done.length) : 0;
  const blocCounts = {};
  done.forEach(i => {
    blocCounts[i.result.bloc_id] = (blocCounts[i.result.bloc_id] || 0) + 1;
  });
  const top = Object.entries(blocCounts).sort((a, b) => b[1] - a[1])[0];
  const topBloc = top ? ctx.blocs.find(b => b.id === top[0]) : null;
  const high = done.filter(i => (i.result.score || 0) >= 75).length;
  const low = done.filter(i => (i.result.score || 0) < 50).length;
  return /*#__PURE__*/React.createElement("div", {
    className: "dash-row"
  }, /*#__PURE__*/React.createElement(StatChip, {
    label: "Qualifi\xE9s",
    value: done.length,
    hint: items.length ? `sur ${items.length} captés` : "—"
  }), /*#__PURE__*/React.createElement(StatChip, {
    label: "Score moyen",
    value: avgScore + "/100",
    accent: avgScore >= 70 ? "var(--green)" : avgScore >= 50 ? "var(--gold)" : "var(--muted)"
  }), /*#__PURE__*/React.createElement(StatChip, {
    label: "Hauts signaux",
    value: high,
    hint: "score \u2265 75",
    accent: "var(--green)"
  }), /*#__PURE__*/React.createElement(StatChip, {
    label: "\xC0 recadrer",
    value: low,
    hint: "score < 50",
    accent: "var(--muted)"
  }), /*#__PURE__*/React.createElement(StatChip, {
    label: "Bloc dominant",
    value: topBloc ? topBloc.code : "—",
    hint: topBloc?.theme.slice(0, 28) || ""
  }));
}
const COSTS_KEY = 'lf-costs-v2';
function useCostsData() {
  const [costs, setCosts] = useStateD(() => {
    try {
      return JSON.parse(localStorage.getItem(COSTS_KEY)) || {
        monthlyLimit: 10,
        history: []
      };
    } catch {
      return {
        monthlyLimit: 10,
        history: []
      };
    }
  });
  // Refresh every 10s to pick up live API usage
  useEffectD(() => {
    const t = setInterval(() => {
      try {
        const d = JSON.parse(localStorage.getItem(COSTS_KEY)) || {
          monthlyLimit: 10,
          history: []
        };
        setCosts(d);
      } catch {}
    }, 10000);
    return () => clearInterval(t);
  }, []);
  return {
    costs,
    setCosts
  };
}
function StackWidget({
  stack,
  setStack,
  toast
}) {
  const openCount = stack.filter(t => t.value === "oui").length;
  const closedCount = stack.filter(t => t.value === "non").length;
  const {
    costs,
    setCosts
  } = useCostsData();
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
  const moisCourant = (costs.history || []).filter(h => h.date.startsWith(thisMonth)).reduce((s, h) => s + (h.eur || 0), 0);
  const limit = costs.monthlyLimit || 10;
  const pct = Math.min(100, Math.round(moisCourant / limit * 100));
  function saveLimit(val) {
    const l = parseFloat(val);
    if (isNaN(l) || l <= 0) return;
    const d = {
      ...costs,
      monthlyLimit: l
    };
    setCosts(d);
    try {
      localStorage.setItem(COSTS_KEY, JSON.stringify(d));
    } catch {}
    setEditingLimit(false);
    toast?.("Limite mise à jour");
  }
  function copyAlternatives() {
    const md = "## Alternatives frugales & RGPD\n\n" + stack.filter(t => t.frugalAlt && t.frugalAlt !== "—").map(t => `- **${t.name}** → ${t.frugalAlt}`).join("\n");
    navigator.clipboard.writeText(md);
    toast?.("Alternatives copiées en markdown");
  }
  const fmt = n => n < 0.001 ? "0.000 €" : n.toFixed(3) + " €";
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "stack-costs-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack-costs-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono small muted",
    style: {
      letterSpacing: 1.5,
      textTransform: "uppercase",
      fontSize: 9
    }
  }, "Suivi co\xFBts API \xB7 Claude"), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), editingLimit ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, "Limite/mois\xA0:"), /*#__PURE__*/React.createElement("input", {
    className: "tr-input",
    style: {
      width: 70,
      padding: "3px 7px",
      fontSize: 12
    },
    value: limitInput,
    onChange: e => setLimitInput(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") saveLimit(limitInput);
      if (e.key === "Escape") setEditingLimit(false);
    },
    autoFocus: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, "\u20AC"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm",
    onClick: () => saveLimit(limitInput)
  }, "OK"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: () => setEditingLimit(false)
  }, "\xD7")) : /*#__PURE__*/React.createElement("button", {
    className: "btn-inline",
    onClick: () => {
      setLimitInput(String(limit));
      setEditingLimit(true);
    }
  }, "Limite : ", limit, " \u20AC/mois")), /*#__PURE__*/React.createElement("div", {
    className: "stack-costs-cols"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-label"
  }, "Journalier"), /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-value"
  }, fmt(journalier)), /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-sub"
  }, "aujourd'hui")), /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-sep"
  }), /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-label"
  }, "Mois en cours"), /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-value",
    style: {
      color: pct > 80 ? "var(--red)" : pct > 50 ? "var(--gold)" : "var(--green)"
    }
  }, fmt(moisCourant)), /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-sub"
  }, "/ ", limit, " \u20AC \xB7 ", pct, "%")), /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-sep"
  }), /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-label"
  }, "Cumul total"), /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-value"
  }, fmt(cumul)), /*#__PURE__*/React.createElement("div", {
    className: "stack-cost-sub"
  }, (costs.history || []).length, " session", (costs.history || []).length > 1 ? "s" : ""))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack-limit-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack-limit-fill",
    style: {
      width: pct + "%",
      background: pct > 80 ? "var(--red)" : pct > 50 ? "var(--gold)" : "var(--green)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      color: "var(--muted)",
      marginTop: 3
    }
  }, pct < 50 ? "Sous contrôle" : pct < 80 ? "À surveiller" : "Proche de la limite"))), /*#__PURE__*/React.createElement("div", {
    className: "dash-row",
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(StatChip, {
    label: "Open source",
    value: openCount,
    hint: `sur ${stack.length} briques`,
    accent: "var(--green)"
  }), /*#__PURE__*/React.createElement(StatChip, {
    label: "Propri\xE9taire",
    value: closedCount,
    accent: closedCount > 2 ? "var(--terra)" : "var(--muted)"
  }), /*#__PURE__*/React.createElement(StatChip, {
    label: "Local / gratuit",
    value: stack.filter(t => t.cost.match(/local|gratuit/i)).length,
    accent: "var(--green)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: copyAlternatives
  }, "\u2398 Copier les alternatives")), /*#__PURE__*/React.createElement("div", {
    className: "stack-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stack-row stack-head"
  }, /*#__PURE__*/React.createElement("div", null, "Brique"), /*#__PURE__*/React.createElement("div", null, "R\xF4le"), /*#__PURE__*/React.createElement("div", null, "Mod\xE8le"), /*#__PURE__*/React.createElement("div", null, "Co\xFBt"), /*#__PURE__*/React.createElement("div", null, "Alternative RGPD")), stack.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: `stack-row stack-${t.value}`
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "stack-name"
  }, t.name), /*#__PURE__*/React.createElement("div", {
    className: "stack-layer"
  }, t.layer)), /*#__PURE__*/React.createElement("div", {
    className: "dim small"
  }, t.role), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: `os-pill os-${t.value}`
  }, t.value === "oui" ? "Open" : t.value === "partiel" ? "Mixte" : "Propriétaire")), /*#__PURE__*/React.createElement("div", {
    className: "mono small"
  }, t.cost), /*#__PURE__*/React.createElement("div", {
    className: "dim small",
    style: {
      fontStyle: t.frugalAlt === "—" ? "normal" : "italic"
    }
  }, t.frugalAlt)))));
}
function NetworksWidget({
  networks,
  setNetworks
}) {
  function toggle(id) {
    setNetworks(networks.map(n => n.id === id ? {
      ...n,
      enabled: !n.enabled
    } : n));
  }
  const active = networks.filter(n => n.enabled).length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "helper",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: "var(--green)"
    }
  }, "\u2192"), " ", "Scope du social listening : ", /*#__PURE__*/React.createElement("strong", null, "max 3 r\xE9seaux actifs simultan\xE9ment"), ", 3-4 recherches (6-8 max). Aucun acc\xE8s sans ton autorisation explicite et sans API consentie."), /*#__PURE__*/React.createElement("div", {
    className: "networks-grid"
  }, networks.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    className: `network-card ${n.enabled ? "on" : "off"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "network-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: `switch ${n.enabled ? "on" : ""}`,
    onClick: () => toggle(n.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "switch-knob"
  })), /*#__PURE__*/React.createElement("div", {
    className: "network-name"
  }, n.name)), /*#__PURE__*/React.createElement("div", {
    className: "network-scope small dim"
  }, n.scope), /*#__PURE__*/React.createElement("div", {
    className: "network-api mono small muted"
  }, n.api)))), active > 3 && /*#__PURE__*/React.createElement("div", {
    className: "alert"
  }, "\u26A0 ", active, " r\xE9seaux actifs : la limite recommand\xE9e est 3. Tu peux d\xE9passer, mais le signal/bruit baissera vite."));
}
function GardefousWidget({
  gardefous
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "gf-list"
  }, gardefous.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "gf-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gf-mark"
  }, g.icon), /*#__PURE__*/React.createElement("div", {
    className: "gf-body"
  }, /*#__PURE__*/React.createElement("h4", null, g.title), /*#__PURE__*/React.createElement("p", null, g.body)))));
}
function InspiWidget({
  inspirations
}) {
  const grouped = {};
  inspirations.forEach(i => {
    (grouped[i.category] = grouped[i.category] || []).push(i);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "inspi-grid"
  }, Object.entries(grouped).map(([cat, list]) => /*#__PURE__*/React.createElement("div", {
    key: cat,
    className: "inspi-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inspi-cat"
  }, cat), /*#__PURE__*/React.createElement("ul", null, list.map(i => /*#__PURE__*/React.createElement("li", {
    key: i.id
  }, /*#__PURE__*/React.createElement("strong", {
    className: "cream"
  }, i.name), /*#__PURE__*/React.createElement("span", {
    className: "dim small"
  }, " : ", i.note)))))));
}
function DashboardView({
  items,
  ctx,
  stack,
  setStack,
  networks,
  setNetworks,
  gardefous,
  inspirations,
  goPrev,
  goNext,
  toast
}) {
  // Tracking which widgets are visible + their order — draggable
  const STORAGE = "le-filtre-dashboard-layout-v0.2";
  const initial = (() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return WIDGETS.map(w => w.id);
  })();
  const [order, setOrder] = useStateD(initial);
  const [dragging, setDragging] = useStateD(null);
  function saveOrder(newOrder) {
    setOrder(newOrder);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(newOrder));
    } catch (e) {}
  }
  function removeWidget(id) {
    saveOrder(order.filter(x => x !== id));
  }
  function resetWidgets() {
    saveOrder(WIDGETS.map(w => w.id));
  }
  function onDragStart(id) {
    setDragging(id);
  }
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
    try {
      localStorage.setItem(STORAGE, JSON.stringify(order));
    } catch (e) {}
  }
  function renderWidget(id) {
    const def = WIDGETS.find(w => w.id === id);
    if (!def) return null;
    let body = null;
    if (id === "w_pulse") body = /*#__PURE__*/React.createElement(PulseWidget, {
      items: items,
      ctx: ctx
    });
    if (id === "w_cluster") body = /*#__PURE__*/React.createElement(window.ClusterWidget, {
      items: items,
      ctx: ctx,
      toast: toast
    });
    if (id === "w_stack") body = /*#__PURE__*/React.createElement(StackWidget, {
      stack: stack,
      setStack: setStack,
      toast: toast
    });
    if (id === "w_networks") body = /*#__PURE__*/React.createElement(NetworksWidget, {
      networks: networks,
      setNetworks: setNetworks
    });
    if (id === "w_gardefous") body = /*#__PURE__*/React.createElement(GardefousWidget, {
      gardefous: gardefous
    });
    if (id === "w_inspi") body = /*#__PURE__*/React.createElement(InspiWidget, {
      inspirations: inspirations
    });
    return /*#__PURE__*/React.createElement("div", {
      key: id,
      className: `dash-widget ${dragging === id ? "drag" : ""}`,
      draggable: true,
      onDragStart: () => onDragStart(id),
      onDragOver: e => onDragOver(e, id),
      onDragEnd: onDragEnd
    }, /*#__PURE__*/React.createElement("div", {
      className: "dash-widget-head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dash-drag",
      title: "Glisser pour r\xE9ordonner"
    }, "\u22EE\u22EE"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "dash-widget-title"
    }, def.title), /*#__PURE__*/React.createElement("div", {
      className: "dash-widget-desc"
    }, def.desc)), /*#__PURE__*/React.createElement("div", {
      className: "grow"
    }), /*#__PURE__*/React.createElement("button", {
      className: "icon-btn",
      onClick: () => removeWidget(id),
      title: "Masquer"
    }, "\xD7")), /*#__PURE__*/React.createElement("div", {
      className: "dash-widget-body"
    }, body));
  }
  const hidden = WIDGETS.filter(w => !order.includes(w.id));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head-label"
  }, "Phase 05 \xB7 Dashboard"), /*#__PURE__*/React.createElement("h1", null, "Pilote en ", /*#__PURE__*/React.createElement("em", null, "connaissance de cause")), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Vue d'ensemble du rythme, de la stack et des garde-fous. Glisse les blocs pour r\xE9organiser, masque ce qui ne te sert pas. Drag-and-drop sans code.")), /*#__PURE__*/React.createElement("div", {
    className: "toolbar",
    style: {
      marginBottom: 18
    }
  }, hidden.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "small muted mono"
  }, "+ ajouter :"), hidden.map(w => /*#__PURE__*/React.createElement("button", {
    key: w.id,
    className: "btn btn-ghost small",
    onClick: () => saveOrder([...order, w.id])
  }, "+ ", w.title))), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: resetWidgets
  }, "\u21BB R\xE9initialiser la disposition")), /*#__PURE__*/React.createElement("div", {
    className: "dash-grid"
  }, order.map(renderWidget)), /*#__PURE__*/React.createElement("div", {
    className: "gap-12",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: goPrev
  }, /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2190"), " Triage"), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: goNext
  }, "Passer au Studio ", /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2192"))));
}
Object.assign(window, {
  DashboardView
});