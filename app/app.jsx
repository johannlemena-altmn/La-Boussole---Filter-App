// app.jsx — Le Filtre v0.2 — main app
/* global React, ReactDOM */

var { useState, useEffect, useRef, useCallback, useMemo } = React;
var {
  Manifesto, Sidebar, SetupView, CaptureView, AnalyseView, TriageView,
  DashboardView, StudioView, TrackerView,
  TweaksPanel, useTweaks, TweakSection, TweakSlider, TweakButton, TweakRadio
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
}/*EDITMODE-END*/;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function saveState(state) {
  try {
    // On strip imageData avant de persister (évite de dépasser la limite 5 MB localStorage)
    // L'item garde imageData en mémoire pour l'analyse, mais pas entre les sessions.
    const toSave = {
      ...state,
      items: (state.items || []).map(item => {
        if (item.imageData) {
          const { imageData, imageMediaType, ...rest } = item;
          return { ...rest, _hadVisionData: true };
        }
        return item;
      }),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {}
}

function Toast({ messages }) {
  return (
    <>
      {messages.map(m => (
        <div key={m.id} className="toast">{m.text}</div>
      ))}
    </>
  );
}

function App() {
  const initial = loadState();

  // landing: vu le manifeste au moins une fois ?
  const [showManifesto, setShowManifesto] = useState(initial?.seenManifesto !== true);
  const [phase, setPhase] = useState(initial?.phase || "setup");
  const [projects, setProjects] = useState(initial?.projects || window.DEFAULTS.projects);
  const [blocs, setBlocs] = useState(initial?.blocs || window.DEFAULTS.blocs);
  const [sources, setSources] = useState(initial?.sources || window.DEFAULTS.sources);
  const [stack, setStack] = useState(initial?.stack || window.DEFAULTS.stack);
  const [networks, setNetworks] = useState(initial?.networks || window.DEFAULTS.networks);
  const [gardefous] = useState(window.DEFAULTS.gardefous);
  const [inspirations] = useState(window.DEFAULTS.inspirations);
  const [items, setItems] = useState(initial?.items || []);
  const [theme, setTheme] = useState(initial?.theme || "light");
  const [isRunning, setIsRunning] = useState(false);

  const [t, setTweak] = useTweaks(DEFAULT_WEIGHTS);

  // ── active prisme ──
  const [activeFrameworkId, setActiveFrameworkId] = useState(() => {
    try { return localStorage.getItem('lf-prisme-v1') || null; } catch { return null; }
  });
  useEffect(() => {
    try {
      if (activeFrameworkId) localStorage.setItem('lf-prisme-v1', activeFrameworkId);
      else localStorage.removeItem('lf-prisme-v1');
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
    saveState({ phase, projects, blocs, sources, stack, networks, items, theme, seenManifesto: !showManifesto });
  }, [phase, projects, blocs, sources, stack, networks, items, theme, showManifesto]);

  // ── toasts ──
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((text) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, text }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  }, []);

  // ── items ops ──
  function addItem({ text, sourceHint, type, imageData = null, imageMediaType = null }) {
    setItems(prev => [...prev, {
      id: `i_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      text, sourceHint, type,
      imageData,        // base64 de l'image — présent uniquement en mémoire (strippé au save)
      imageMediaType,
      addedAt: Date.now(),
      status: "pending",
      result: null,
      error: null,
    }]);
  }
  function removeItem(id) { setItems(prev => prev.filter(i => i.id !== id)); }

  function loadSample() {
    addItem({ text: window.DEFAULTS.sample, sourceHint: "Time To Sign Off (TTSO)", type: "newsletter" });
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
      projects, blocs, sources,
      weights: {
        pertinence: t.pertinence, fraicheur: t.fraicheur, profondeur: t.profondeur,
        actionnable: t.actionnable, originalite: t.originalite,
      },
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
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: "analyzing", error: null } : i));
        const res = await window.analyzeItem(target, ctx);
        setItems(prev => prev.map(i => i.id === id ? {
          ...i,
          status: res.ok ? "done" : "error",
          result: res.ok ? res.result : null,
          error: res.ok ? null : res.error,
        } : i));
      }
    }
    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);
    setIsRunning(false);
    toast(`Analyse terminée — ${pending.length} contenu(s) traité(s)`);
  }

  // ── counts (sidebar) ──
  const [trackerCount, setTrackerCount] = useState(() => {
    try { return (JSON.parse(localStorage.getItem('lf-tracker-v1')) || {}).projects?.length || 0; }
    catch { return 0; }
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
    trackerProjects: trackerCount,
  };

  const ctx = useMemo(() => ({
    projects, blocs, sources,
    weights: {
      pertinence: t.pertinence, fraicheur: t.fraicheur, profondeur: t.profondeur,
      actionnable: t.actionnable, originalite: t.originalite,
    },
  }), [projects, blocs, sources, t.pertinence, t.fraicheur, t.profondeur, t.actionnable, t.originalite]);

  const sum = t.pertinence + t.fraicheur + t.profondeur + t.actionnable + t.originalite;

  // ── landing: manifeste plein écran ──
  if (showManifesto) {
    return (
      <>
        <Manifesto onEnter={() => setShowManifesto(false)} />
        <Toast messages={toasts} />
      </>
    );
  }

  return (
    <div className="app">
      <Sidebar
        phase={phase} setPhase={setPhase} counts={counts}
        openManifesto={() => setShowManifesto(true)}
        theme={theme} setTheme={setTheme}
      />

      <main className="main">
        {phase === "setup" && (
          <SetupView
            projects={projects} setProjects={setProjects}
            blocs={blocs} setBlocs={setBlocs}
            sources={sources} setSources={setSources}
            goNext={() => setPhase("capture")}
            resetAll={resetAll}
            activeFrameworkId={activeFrameworkId}
            setActiveFrameworkId={setActiveFrameworkId}
          />
        )}
        {phase === "capture" && (
          <CaptureView
            items={items}
            addItem={addItem} removeItem={removeItem}
            sources={sources}
            loadSample={loadSample}
            goPrev={() => setPhase("setup")}
            goNext={() => setPhase("analyse")}
            toast={toast}
          />
        )}
        {phase === "analyse" && (
          <AnalyseView
            items={items}
            runAnalysis={runAnalysis} isRunning={isRunning}
            goPrev={() => setPhase("capture")}
            goNext={() => setPhase("triage")}
            activeFrameworkId={activeFrameworkId}
          />
        )}
        {phase === "triage" && (
          <TriageView
            items={items}
            ctx={ctx}
            gardefous={gardefous}
            goPrev={() => setPhase("analyse")}
            goNext={() => setPhase("dashboard")}
            toast={toast}
            removeItem={removeItem}
            activeFrameworkId={activeFrameworkId}
          />
        )}
        {phase === "dashboard" && (
          <DashboardView
            items={items}
            ctx={ctx}
            stack={stack} setStack={setStack}
            networks={networks} setNetworks={setNetworks}
            gardefous={gardefous}
            inspirations={inspirations}
            goPrev={() => setPhase("triage")}
            goNext={() => setPhase("studio")}
            toast={toast}
          />
        )}
        {phase === "studio" && (
          <StudioView
            items={items}
            ctx={ctx}
            gardefous={gardefous}
            goPrev={() => setPhase("dashboard")}
            toast={toast}
          />
        )}
        {phase === "tracker" && (
          <TrackerView
            items={items}
            goPrev={() => setPhase("studio")}
            toast={toast}
          />
        )}
      </main>

      <TweaksPanel title="Le Filtre · réglages">
        <TweakSection label="Apparence">
          <TweakRadio label="Thème" value={theme} options={[
            { value: "light", label: "Clair" },
            { value: "dark", label: "Sombre" },
          ]} onChange={v => setTheme(v)} />
          <TweakRadio label="Accent" value={t.accent || "green"} options={[
            { value: "green", label: "Vert" },
            { value: "terra", label: "Terre" },
            { value: "blue", label: "Bleu" },
          ]} onChange={v => setTweak("accent", v)} />
          <TweakSlider label="Taille texte (px)" value={t.fontSize || 16} min={14} max={20} step={1}
            onChange={v => setTweak("fontSize", v)} />
        </TweakSection>

        <TweakSection label={`Pondération score · somme ${sum}/100`}>
          <TweakSlider label="Pertinence" value={t.pertinence} min={0} max={40} step={1}
            onChange={v => setTweak("pertinence", v)} />
          <TweakSlider label="Fraîcheur" value={t.fraicheur} min={0} max={40} step={1}
            onChange={v => setTweak("fraicheur", v)} />
          <TweakSlider label="Profondeur" value={t.profondeur} min={0} max={40} step={1}
            onChange={v => setTweak("profondeur", v)} />
          <TweakSlider label="Actionnable" value={t.actionnable} min={0} max={40} step={1}
            onChange={v => setTweak("actionnable", v)} />
          <TweakSlider label="Originalité" value={t.originalite} min={0} max={40} step={1}
            onChange={v => setTweak("originalite", v)} />
          <TweakButton label="↻ Restaurer pondérations Boussole+"
            onClick={() => setTweak({
              pertinence: 25, fraicheur: 15, profondeur: 20, actionnable: 25, originalite: 15
            })} />
        </TweakSection>

        <TweakSection label="Moteur">
          <TweakSlider label="Parallélisme" value={t.concurrency} min={1} max={5} step={1}
            onChange={v => setTweak("concurrency", v)} />
        </TweakSection>

        <TweakSection label="Données locales">
          <TweakButton label="Revoir le manifeste"
            onClick={() => setShowManifesto(true)} />
          <TweakButton label="Vider la pile de contenus"
            onClick={() => {
              if (confirm("Supprimer tous les contenus capturés et leurs fiches ?")) {
                setItems([]); toast("Pile vidée");
              }
            }} />
          <TweakButton label="Reset complet"
            onClick={() => {
              if (confirm("Effacer toutes les données locales (projets, blocs, items, dashboard) ?")) {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem("le-filtre-dashboard-layout-v0.2");
                location.reload();
              }
            }} />
        </TweakSection>
      </TweaksPanel>

      <Toast messages={toasts} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
