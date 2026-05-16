// app.jsx — Le Filtre v0.2 — main app
/* global React, ReactDOM */

var {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} = React;
var {
  Manifesto,
  Sidebar,
  SetupView,
  CaptureView,
  AnalyseView,
  TriageView,
  DashboardView,
  StudioView,
  TrackerView,
  TweaksPanel,
  useTweaks,
  TweakSection,
  TweakSlider,
  TweakButton,
  TweakRadio
} = window;
const STORAGE_KEY = "le-filtre-v0.2";
const DEFAULT_WEIGHTS = /*EDITMODE-BEGIN*/{
  "pertinence": 25,
  "fraicheur": 15,
  "profondeur": 20,
  "actionnable": 25,
  "originalite": 15,
  "concurrency": 3,
  "fontSize": 16,
  "accent": "green"
} /*EDITMODE-END*/;
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
function saveState(state) {
  try {
    // On strip imageData avant de persister (évite de dépasser la limite 5 MB localStorage)
    // L'item garde imageData en mémoire pour l'analyse, mais pas entre les sessions.
    const toSave = {
      ...state,
      items: (state.items || []).map(item => {
        if (item.imageData) {
          const {
            imageData,
            imageMediaType,
            ...rest
          } = item;
          return {
            ...rest,
            _hadVisionData: true
          };
        }
        return item;
      })
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {}
}
function Toast({
  messages
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, messages.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.id,
    className: "toast"
  }, m.text)));
}

// ── Onboarding wizard (première session) ────────────────────────────────
function OnboardingWizard({
  onDone,
  defaultProjects
}) {
  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState(defaultProjects[0]?.name || "");
  const steps = [{
    icon: "⊙",
    title: "Bienvenue dans Le Filtre",
    body: "En 3 étapes, configure ton premier projet de veille pour que l'IA cible ses analyses sur ce qui compte vraiment pour toi.",
    action: null
  }, {
    icon: "◎",
    title: "Ton premier projet",
    body: "Un projet = un territoire éditorial (ex : veille RSE, newsletter, Projet Z). Tu pourras en ajouter d'autres dans Calibrage.",
    action: /*#__PURE__*/React.createElement("input", {
      className: "setup-input",
      value: projectName,
      onChange: e => setProjectName(e.target.value),
      placeholder: "Ex : Veille Boussole, Lettre FNE, Projet Z\u2026",
      autoFocus: true,
      style: {
        width: "100%",
        marginTop: 12,
        padding: "10px 14px",
        fontSize: 15
      }
    })
  }, {
    icon: "⬡",
    title: "Maintenant, capture ton premier contenu",
    body: "Colle un article, une newsletter, ou un email dans la Phase 02 · Capture. L'analyse IA fait le reste.",
    action: null
  }];
  const current = steps[step];
  const isLast = step === steps.length - 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 500,
      background: "rgba(10,26,16,0.85)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "40px 36px",
      maxWidth: 480,
      width: "100%",
      boxShadow: "0 24px 64px rgba(0,0,0,0.4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 28
    }
  }, steps.map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      height: 3,
      flex: 1,
      borderRadius: 2,
      background: i <= step ? "var(--green)" : "var(--border)",
      transition: "background 0.3s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 16
    }
  }, current.icon), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--serif)",
      fontWeight: 800,
      fontSize: 22,
      marginBottom: 10,
      color: "var(--text)"
    }
  }, current.title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-dim)",
      lineHeight: 1.6,
      marginBottom: 20
    }
  }, current.body), current.action, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 28,
      justifyContent: "flex-end"
    }
  }, step > 0 && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => setStep(s => s - 1)
  }, "\u2190 Retour"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      if (isLast) {
        onDone(projectName);
      } else setStep(s => s + 1);
    },
    disabled: step === 1 && !projectName.trim()
  }, isLast ? "Commencer →" : "Suivant →")), /*#__PURE__*/React.createElement("button", {
    className: "btn-inline small muted",
    onClick: () => onDone(null),
    style: {
      marginTop: 16,
      display: "block",
      textAlign: "center",
      width: "100%"
    }
  }, "Passer \u2014 je configure moi-m\xEAme dans Calibrage")));
}
function App() {
  const initial = loadState();

  // landing: vu le manifeste au moins une fois ?
  const [showManifesto, setShowManifesto] = useState(initial?.seenManifesto !== true);
  // onboarding: première session (pas de state sauvegardé ET manifeste déjà vu)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return !localStorage.getItem('lf-onboarding-v1') && !!localStorage.getItem('le-filtre-v0.2') === false;
    } catch {
      return false;
    }
  });
  const [phase, setPhase] = useState(initial?.phase || "setup");
  const [projects, setProjects] = useState(initial?.projects || window.DEFAULTS.projects);
  const [blocs, setBlocs] = useState(initial?.blocs || window.DEFAULTS.blocs);
  const [sources, setSources] = useState(initial?.sources || window.DEFAULTS.sources);
  const [stack, setStack] = useState(initial?.stack || window.DEFAULTS.stack);
  const [networks, setNetworks] = useState(initial?.networks || window.DEFAULTS.networks);
  const [gardefous] = useState(window.DEFAULTS.gardefous);
  const [inspirations] = useState(window.DEFAULTS.inspirations);
  const [items, setItems] = useState(initial?.items || []);
  const [theme, setTheme] = useState(initial?.theme || "dark");
  const [isRunning, setIsRunning] = useState(false);
  const [t, setTweak] = useTweaks(DEFAULT_WEIGHTS);

  // ── active prisme ──
  const [activeFrameworkId, setActiveFrameworkId] = useState(() => {
    try {
      return localStorage.getItem('lf-prisme-v1') || null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    try {
      if (activeFrameworkId) localStorage.setItem('lf-prisme-v1', activeFrameworkId);else localStorage.removeItem('lf-prisme-v1');
    } catch {}
  }, [activeFrameworkId]);

  // ── apply theme + font size to <html> ──
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-accent", t.accent || "green");
    document.documentElement.style.setProperty("--base-font-size", (t.fontSize || 16) + "px");
  }, [theme, t.accent, t.fontSize]);

  // ── persist ──
  useEffect(() => {
    saveState({
      phase,
      projects,
      blocs,
      sources,
      stack,
      networks,
      items,
      theme,
      seenManifesto: !showManifesto
    });
  }, [phase, projects, blocs, sources, stack, networks, items, theme, showManifesto]);

  // ── toasts ──
  const [toasts, setToasts] = useState([]);
  const toast = useCallback(text => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, {
      id,
      text
    }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  }, []);

  // ── items ops ──
  function addItem({
    text,
    sourceHint,
    type,
    imageData = null,
    imageMediaType = null
  }) {
    setItems(prev => [...prev, {
      id: `i_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      text,
      sourceHint,
      type,
      imageData,
      // base64 de l'image — présent uniquement en mémoire (strippé au save)
      imageMediaType,
      addedAt: Date.now(),
      status: "pending",
      result: null,
      error: null
    }]);
  }
  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }
  function loadSample() {
    addItem({
      text: window.DEFAULTS.sample,
      sourceHint: "Time To Sign Off (TTSO)",
      type: "newsletter"
    });
    toast("Exemple TTSO ajouté à la pile");
  }
  function resetAll() {
    if (!confirm("Restaurer projets / blocs / sources aux défauts Boussole+ ?")) return;
    setProjects(window.DEFAULTS.projects);
    setBlocs(window.DEFAULTS.blocs);
    setSources(window.DEFAULTS.sources);
    toast("Défauts restaurés");
  }

  // ── run analysis ──
  async function runAnalysis() {
    setIsRunning(true);
    const ctx = {
      projects,
      blocs,
      sources,
      weights: {
        pertinence: t.pertinence,
        fraicheur: t.fraicheur,
        profondeur: t.profondeur,
        actionnable: t.actionnable,
        originalite: t.originalite
      }
    };
    const pending = items.filter(i => i.status === "pending" || i.status === "error");
    if (pending.length === 0) {
      setIsRunning(false);
      toast("Rien à analyser");
      return;
    }
    const concurrency = Math.max(1, Math.min(5, t.concurrency || 3));
    let cursor = 0;
    async function worker() {
      while (cursor < pending.length) {
        const myIdx = cursor++;
        if (myIdx >= pending.length) return;
        const target = pending[myIdx];
        const id = target.id;
        setItems(prev => prev.map(i => i.id === id ? {
          ...i,
          status: "analyzing",
          error: null
        } : i));
        const res = await window.analyzeItem(target, ctx);
        setItems(prev => prev.map(i => i.id === id ? {
          ...i,
          status: res.ok ? "done" : "error",
          result: res.ok ? res.result : null,
          error: res.ok ? null : res.error
        } : i));
      }
    }
    const workers = Array.from({
      length: concurrency
    }, () => worker());
    await Promise.all(workers);
    setIsRunning(false);
    toast(`Analyse terminée — ${pending.length} contenu(s) traité(s)`);
  }

  // ── counts (sidebar) ──
  const [trackerCount, setTrackerCount] = useState(() => {
    try {
      return (JSON.parse(localStorage.getItem('lf-tracker-v1')) || {}).projects?.length || 0;
    } catch {
      return 0;
    }
  });

  // Refresh tracker count whenever tracker phase is visited
  useEffect(() => {
    if (phase === 'tracker') {
      try {
        const c = (JSON.parse(localStorage.getItem('lf-tracker-v1')) || {}).projects?.length || 0;
        setTrackerCount(c);
      } catch {}
    }
  }, [phase]);
  const counts = {
    projects: projects.length,
    blocs: blocs.length,
    items: items.length,
    pending: items.filter(i => i.status === "pending").length,
    analyzing: items.filter(i => i.status === "analyzing").length,
    done: items.filter(i => i.status === "done").length,
    trackerProjects: trackerCount
  };
  const ctx = useMemo(() => ({
    projects,
    blocs,
    sources,
    weights: {
      pertinence: t.pertinence,
      fraicheur: t.fraicheur,
      profondeur: t.profondeur,
      actionnable: t.actionnable,
      originalite: t.originalite
    }
  }), [projects, blocs, sources, t.pertinence, t.fraicheur, t.profondeur, t.actionnable, t.originalite]);
  const sum = t.pertinence + t.fraicheur + t.profondeur + t.actionnable + t.originalite;

  // ── landing: manifeste plein écran ──
  if (showManifesto) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Manifesto, {
      onEnter: () => {
        setShowManifesto(false);
        // Show onboarding if it's the very first time
        try {
          if (!localStorage.getItem('lf-onboarding-v1') && !localStorage.getItem('le-filtre-v0.2')) {
            setShowOnboarding(true);
          }
        } catch {}
      }
    }), /*#__PURE__*/React.createElement(Toast, {
      messages: toasts
    }));
  }
  function handleOnboardingDone(customProjectName) {
    try {
      localStorage.setItem('lf-onboarding-v1', '1');
    } catch {}
    setShowOnboarding(false);
    if (customProjectName && customProjectName.trim()) {
      setProjects(prev => {
        const updated = [...prev];
        if (updated[0]) updated[0] = {
          ...updated[0],
          name: customProjectName.trim()
        };
        return updated;
      });
    }
    setPhase("capture");
    toast("C'est parti ! Capture ton premier contenu ↓");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, showOnboarding && /*#__PURE__*/React.createElement(OnboardingWizard, {
    onDone: handleOnboardingDone,
    defaultProjects: projects
  }), /*#__PURE__*/React.createElement(Sidebar, {
    phase: phase,
    setPhase: setPhase,
    counts: counts,
    openManifesto: () => setShowManifesto(true),
    theme: theme,
    setTheme: setTheme
  }), /*#__PURE__*/React.createElement("main", {
    className: "main"
  }, phase === "setup" && /*#__PURE__*/React.createElement(SetupView, {
    projects: projects,
    setProjects: setProjects,
    blocs: blocs,
    setBlocs: setBlocs,
    sources: sources,
    setSources: setSources,
    goNext: () => setPhase("capture"),
    resetAll: resetAll,
    activeFrameworkId: activeFrameworkId,
    setActiveFrameworkId: setActiveFrameworkId
  }), phase === "capture" && /*#__PURE__*/React.createElement(CaptureView, {
    items: items,
    addItem: addItem,
    removeItem: removeItem,
    sources: sources,
    loadSample: loadSample,
    goPrev: () => setPhase("setup"),
    goNext: () => setPhase("analyse"),
    toast: toast
  }), phase === "analyse" && /*#__PURE__*/React.createElement(AnalyseView, {
    items: items,
    runAnalysis: runAnalysis,
    isRunning: isRunning,
    goPrev: () => setPhase("capture"),
    goNext: () => setPhase("triage"),
    activeFrameworkId: activeFrameworkId
  }), phase === "triage" && /*#__PURE__*/React.createElement(TriageView, {
    items: items,
    ctx: ctx,
    gardefous: gardefous,
    goPrev: () => setPhase("analyse"),
    goNext: () => setPhase("dashboard"),
    toast: toast,
    removeItem: removeItem,
    activeFrameworkId: activeFrameworkId
  }), phase === "dashboard" && /*#__PURE__*/React.createElement(DashboardView, {
    items: items,
    ctx: ctx,
    stack: stack,
    setStack: setStack,
    networks: networks,
    setNetworks: setNetworks,
    gardefous: gardefous,
    inspirations: inspirations,
    goPrev: () => setPhase("triage"),
    goNext: () => setPhase("studio"),
    toast: toast
  }), phase === "studio" && /*#__PURE__*/React.createElement(StudioView, {
    items: items,
    ctx: ctx,
    gardefous: gardefous,
    goPrev: () => setPhase("dashboard"),
    toast: toast
  }), phase === "tracker" && /*#__PURE__*/React.createElement(TrackerView, {
    items: items,
    goPrev: () => setPhase("studio"),
    toast: toast
  })), /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Le Filtre \xB7 r\xE9glages"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Apparence"
  }, /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Th\xE8me",
    value: theme,
    options: [{
      value: "light",
      label: "Clair"
    }, {
      value: "dark",
      label: "Sombre"
    }],
    onChange: v => setTheme(v)
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Accent",
    value: t.accent || "green",
    options: [{
      value: "green",
      label: "Vert"
    }, {
      value: "terra",
      label: "Terre"
    }, {
      value: "blue",
      label: "Bleu"
    }],
    onChange: v => setTweak("accent", v)
  }), /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Taille texte (px)",
    value: t.fontSize || 16,
    min: 14,
    max: 20,
    step: 1,
    onChange: v => setTweak("fontSize", v)
  })), /*#__PURE__*/React.createElement(TweakSection, {
    label: `Pondération score · somme ${sum}/100`
  }, /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Pertinence",
    value: t.pertinence,
    min: 0,
    max: 40,
    step: 1,
    onChange: v => setTweak("pertinence", v)
  }), /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Fra\xEEcheur",
    value: t.fraicheur,
    min: 0,
    max: 40,
    step: 1,
    onChange: v => setTweak("fraicheur", v)
  }), /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Profondeur",
    value: t.profondeur,
    min: 0,
    max: 40,
    step: 1,
    onChange: v => setTweak("profondeur", v)
  }), /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Actionnable",
    value: t.actionnable,
    min: 0,
    max: 40,
    step: 1,
    onChange: v => setTweak("actionnable", v)
  }), /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Originalit\xE9",
    value: t.originalite,
    min: 0,
    max: 40,
    step: 1,
    onChange: v => setTweak("originalite", v)
  }), /*#__PURE__*/React.createElement(TweakButton, {
    label: "\u21BB Restaurer pond\xE9rations Boussole+",
    onClick: () => setTweak({
      pertinence: 25,
      fraicheur: 15,
      profondeur: 20,
      actionnable: 25,
      originalite: 15
    })
  })), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Moteur"
  }, /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Parall\xE9lisme",
    value: t.concurrency,
    min: 1,
    max: 5,
    step: 1,
    onChange: v => setTweak("concurrency", v)
  })), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Donn\xE9es locales"
  }, /*#__PURE__*/React.createElement(TweakButton, {
    label: "Revoir le manifeste",
    onClick: () => setShowManifesto(true)
  }), /*#__PURE__*/React.createElement(TweakButton, {
    label: "Vider la pile de contenus",
    onClick: () => {
      if (confirm("Supprimer tous les contenus capturés et leurs fiches ?")) {
        setItems([]);
        toast("Pile vidée");
      }
    }
  }), /*#__PURE__*/React.createElement(TweakButton, {
    label: "Reset complet",
    onClick: () => {
      if (confirm("Effacer toutes les données locales (projets, blocs, items, dashboard) ?")) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("le-filtre-dashboard-layout-v0.2");
        location.reload();
      }
    }
  }))), /*#__PURE__*/React.createElement(Toast, {
    messages: toasts
  }));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));