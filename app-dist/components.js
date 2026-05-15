// components.jsx — Sidebar, Setup, Capture, Analyse
/* global React */

var {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback
} = React;

// ─────── BLOC CHIP ───────
function BlocChip({
  blocId,
  label,
  withDot = true
}) {
  if (!blocId) return null;
  return /*#__PURE__*/React.createElement("span", {
    className: `bloc-chip bloc-${blocId}`
  }, withDot && /*#__PURE__*/React.createElement("span", {
    className: `bloc-dot dot-${blocId}`
  }), blocId, label ? ` · ${label}` : "");
}

// ─────── SCORE PILL ───────
function ScorePill({
  score
}) {
  const cls = window.scoreClass(score);
  return /*#__PURE__*/React.createElement("span", {
    className: `score-pill ${cls}`
  }, score, "/100");
}

// ─────── SIDEBAR ───────
function Sidebar({
  phase,
  setPhase,
  counts,
  openManifesto,
  theme,
  setTheme
}) {
  const phases = [{
    id: "setup",
    num: "01",
    title: "Calibrage",
    meta: `${counts.projects} projets · ${counts.blocs} blocs`
  }, {
    id: "capture",
    num: "02",
    title: "Capture",
    meta: `${counts.items} contenu(s)`
  }, {
    id: "analyse",
    num: "03",
    title: "Analyse",
    meta: counts.analyzing ? "en cours…" : counts.pending ? `${counts.pending} en attente` : "—"
  }, {
    id: "triage",
    num: "04",
    title: "Triage",
    meta: `${counts.done} qualifié(s)`
  }, {
    id: "dashboard",
    num: "05",
    title: "Dashboard",
    meta: "stack · rythme · garde-fous"
  }, {
    id: "studio",
    num: "06",
    title: "Studio",
    meta: "carte · story · info · lecture"
  }, {
    id: "tracker",
    num: "07",
    title: "Projets",
    meta: `${counts.trackerProjects || 0} projet(s)`
  }];
  return /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand-label"
  }, "v0.2 \xB7 2026"), /*#__PURE__*/React.createElement("div", {
    className: "brand-title"
  }, "Le ", /*#__PURE__*/React.createElement("em", null, "Filtre")), /*#__PURE__*/React.createElement("div", {
    className: "brand-sub"
  }, "Triage \xE9ditorial sobre & local.", /*#__PURE__*/React.createElement("br", null), "Calibrer \xB7 capter \xB7 trier \xB7 piloter \xB7 cr\xE9er."), /*#__PURE__*/React.createElement("button", {
    className: "manifest-link",
    onClick: openManifesto
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "\u2197"), " Lire le manifeste")), /*#__PURE__*/React.createElement("div", {
    className: "phases"
  }, /*#__PURE__*/React.createElement("div", {
    className: "phase-head"
  }, "\u2014 Parcours"), phases.map((p, i) => {
    const isActive = phase === p.id;
    const isDone = phases.findIndex(x => x.id === phase) > i;
    return /*#__PURE__*/React.createElement("button", {
      key: p.id,
      className: `phase ${isActive ? "active" : ""} ${isDone ? "done" : ""}`,
      onClick: () => setPhase(p.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "phase-num"
    }, p.num), /*#__PURE__*/React.createElement("span", {
      className: "phase-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "phase-title"
    }, p.title), /*#__PURE__*/React.createElement("div", {
      className: "phase-meta"
    }, p.meta)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "theme-switch",
    role: "group",
    "aria-label": "Th\xE8me"
  }, /*#__PURE__*/React.createElement("button", {
    className: `theme-btn ${theme === "light" ? "on" : ""}`,
    onClick: () => setTheme("light")
  }, "\u25D0 Clair"), /*#__PURE__*/React.createElement("button", {
    className: `theme-btn ${theme === "dark" ? "on" : ""}`,
    onClick: () => setTheme("dark")
  }, "\u25D1 Sombre")), /*#__PURE__*/React.createElement("div", {
    className: "mono small muted",
    style: {
      marginTop: 10,
      lineHeight: 1.5
    }
  }, "Local \xB7 ", counts.trackerProjects || 0, " projet(s)", /*#__PURE__*/React.createElement("br", null), counts.items || 0, " items en m\xE9moire")));
}

// ─────── SETUP PHASE ───────
function SetupView({
  projects,
  setProjects,
  blocs,
  setBlocs,
  sources,
  setSources,
  goNext,
  resetAll,
  activeFrameworkId,
  setActiveFrameworkId
}) {
  const [tab, setTab] = useState("projects");
  function addProject() {
    setProjects([...projects, {
      id: `p_${Date.now()}`,
      name: "Nouveau projet",
      objective: "Objectif de veille…",
      keywords: "",
      rhythm: ""
    }]);
  }
  function updateProject(id, field, value) {
    setProjects(projects.map(p => p.id === id ? {
      ...p,
      [field]: value
    } : p));
  }
  function removeProject(id) {
    setProjects(projects.filter(p => p.id !== id));
  }
  function addBloc() {
    const ids = blocs.map(b => parseInt(b.code.slice(1))).filter(n => !isNaN(n));
    const next = ids.length ? Math.max(...ids) + 1 : 1;
    const code = `B${next}`;
    setBlocs([...blocs, {
      id: code,
      code,
      theme: "Nouveau bloc",
      description: "Définition du périmètre thématique…",
      color: "B1"
    }]);
  }
  function updateBloc(id, field, value) {
    setBlocs(blocs.map(b => b.id === id ? {
      ...b,
      [field]: value
    } : b));
  }
  function removeBloc(id) {
    setBlocs(blocs.filter(b => b.id !== id));
  }
  function addSource() {
    setSources([...sources, {
      id: `s_${Date.now()}`,
      name: "Nouvelle source",
      protocol: "Protocole de traitement…",
      defaultBloc: "B1"
    }]);
  }
  function updateSource(id, field, value) {
    setSources(sources.map(s => s.id === id ? {
      ...s,
      [field]: value
    } : s));
  }
  function removeSource(id) {
    setSources(sources.filter(s => s.id !== id));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head-label"
  }, "Phase 01"), /*#__PURE__*/React.createElement("h1", null, "Calibre le filtre \xE0 ta ", /*#__PURE__*/React.createElement("em", null, "main")), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Tes projets, tes blocs, les sources que tu re\xE7ois souvent. Tu peux tout garder par d\xE9faut et commencer tout de suite, ou ajuster maintenant \u2014 tu reviens quand tu veux.")), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: `tab ${tab === "projects" ? "active" : ""}`,
    onClick: () => setTab("projects")
  }, "Projets ", /*#__PURE__*/React.createElement("span", {
    className: "tab-count"
  }, projects.length)), /*#__PURE__*/React.createElement("button", {
    className: `tab ${tab === "blocs" ? "active" : ""}`,
    onClick: () => setTab("blocs")
  }, "Blocs ", /*#__PURE__*/React.createElement("span", {
    className: "tab-count"
  }, blocs.length)), /*#__PURE__*/React.createElement("button", {
    className: `tab ${tab === "sources" ? "active" : ""}`,
    onClick: () => setTab("sources")
  }, "Sources r\xE9currentes ", /*#__PURE__*/React.createElement("span", {
    className: "tab-count"
  }, sources.length)), /*#__PURE__*/React.createElement("button", {
    className: `tab ${tab === "prismes" ? "active" : ""}`,
    onClick: () => setTab("prismes"),
    style: {
      position: "relative"
    }
  }, "Prismes", activeFrameworkId && /*#__PURE__*/React.createElement("span", {
    className: "tab-dot",
    title: "Prisme actif"
  }, "\u25C9"))), tab === "projects" && /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "Projets nourris par la veille"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "Chaque contenu sera scor\xE9 pour sa pertinence vis-\xE0-vis de ces projets.")), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: addProject
  }, "+ Ajouter")), /*#__PURE__*/React.createElement("div", {
    className: "setup-grid"
  }, projects.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "row-flex",
    style: {
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "block-area"
  }, /*#__PURE__*/React.createElement("div", {
    className: "project-edit-grid"
  }, /*#__PURE__*/React.createElement("input", {
    className: "inline-edit cream",
    style: {
      fontWeight: 600
    },
    value: p.name,
    onChange: e => updateProject(p.id, "name", e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    className: "inline-edit dim small",
    value: p.objective,
    onChange: e => updateProject(p.id, "objective", e.target.value),
    placeholder: "Objectif de veille"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn danger",
    onClick: () => removeProject(p.id),
    title: "Supprimer"
  }, "\xD7"))), /*#__PURE__*/React.createElement("input", {
    className: "inline-edit muted small mono",
    value: p.keywords,
    onChange: e => updateProject(p.id, "keywords", e.target.value),
    placeholder: "mots-cl\xE9s (s\xE9par\xE9s par virgules)",
    style: {
      marginTop: 4
    }
  })))), projects.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-title"
  }, "Aucun projet."), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, "Ajoute-en un pour calibrer le moteur.")))), tab === "blocs" && /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "Blocs th\xE9matiques (Boussole+)"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "Le filtre classera chaque contenu dans UN bloc dominant. Adapte les libell\xE9s \xE0 ton vocabulaire.")), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: addBloc
  }, "+ Ajouter")), /*#__PURE__*/React.createElement("div", {
    className: "setup-grid"
  }, blocs.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.id,
    className: "row-flex",
    style: {
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(BlocChip, {
    blocId: b.id
  }), /*#__PURE__*/React.createElement("div", {
    className: "block-area"
  }, /*#__PURE__*/React.createElement("input", {
    className: "inline-edit cream",
    style: {
      fontWeight: 600
    },
    value: b.theme,
    onChange: e => updateBloc(b.id, "theme", e.target.value)
  }), /*#__PURE__*/React.createElement("textarea", {
    className: "inline-edit dim small",
    value: b.description,
    onChange: e => updateBloc(b.id, "description", e.target.value),
    rows: 2,
    style: {
      marginTop: 2,
      resize: "vertical"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "row-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn danger",
    onClick: () => removeBloc(b.id),
    title: "Supprimer"
  }, "\xD7"))))), /*#__PURE__*/React.createElement("p", {
    className: "helper",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: "var(--green)"
    }
  }, "\u2192"), " ", "6 blocs Boussole+ par d\xE9faut. Tu peux en ajouter, mais reste sous 8 pour garder une signal/bruit propre.")), tab === "sources" && /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "Sources avec protocole sp\xE9cifique"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "Quand le filtre reconna\xEEt une source (TTSO, Hallu World\u2026), il applique son protocole de traitement.")), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: addSource
  }, "+ Ajouter")), /*#__PURE__*/React.createElement("div", {
    className: "setup-grid"
  }, sources.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "row-flex",
    style: {
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "block-area"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gap-12",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "inline-edit cream",
    style: {
      fontWeight: 600,
      maxWidth: 260
    },
    value: s.name,
    onChange: e => updateSource(s.id, "name", e.target.value)
  }), /*#__PURE__*/React.createElement("select", {
    className: "select",
    style: {
      maxWidth: 200
    },
    value: s.defaultBloc,
    onChange: e => updateSource(s.id, "defaultBloc", e.target.value)
  }, blocs.map(b => /*#__PURE__*/React.createElement("option", {
    key: b.id,
    value: b.id
  }, b.code, " \xB7 ", b.theme)))), /*#__PURE__*/React.createElement("textarea", {
    className: "inline-edit dim small",
    value: s.protocol,
    onChange: e => updateSource(s.id, "protocol", e.target.value),
    rows: 2,
    style: {
      resize: "vertical"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "row-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn danger",
    onClick: () => removeSource(s.id),
    title: "Supprimer"
  }, "\xD7")))))), tab === "prismes" && /*#__PURE__*/React.createElement(window.FrameworksPanel, {
    activeId: activeFrameworkId,
    setActiveId: setActiveFrameworkId
  }), /*#__PURE__*/React.createElement("div", {
    className: "gap-12",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn",
    onClick: resetAll,
    title: "Restaurer les d\xE9fauts"
  }, "\u21BB Restaurer les d\xE9fauts"), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: goNext
  }, "Passer \xE0 la capture ", /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2192"))));
}

// ─────── CAPTURE PHASE ───────
function CaptureView({
  items,
  addItem,
  removeItem,
  sources,
  loadSample,
  goPrev,
  goNext,
  toast
}) {
  const [mode, setMode] = useState("text"); // text | file | link | photo | audio
  const [text, setText] = useState("");
  const [sourceHint, setSourceHint] = useState("");
  const [type, setType] = useState("newsletter");
  const [link, setLink] = useState("");
  const [linkKind, setLinkKind] = useState("article");
  const [linkPreview, setLinkPreview] = useState(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [progress, setProgress] = useState(null); // { label, pct }
  const [recording, setRecording] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [liveInterim, setLiveInterim] = useState("");
  const textareaRef = useRef(null);
  const fileRef = useRef(null);
  const recorderRef = useRef(null);
  const recognitionRef = useRef(null);
  function submit() {
    if (!text.trim()) return;
    addItem({
      text: text.trim(),
      sourceHint: sourceHint.trim(),
      type
    });
    setText("");
    setSourceHint("");
    if (textareaRef.current) textareaRef.current.focus();
  }
  function quickLoadSample() {
    loadSample();
    setText("");
    setSourceHint("");
  }
  function handleKey(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }
  async function processFile(f) {
    const name = f.name;
    const sizeKb = Math.round(f.size / 1024);

    // Plain text / markdown
    if (f.type.startsWith("text/") || /\.(md|txt|rtf|csv|json)$/i.test(name)) {
      const text = await f.text();
      addItem({
        text,
        sourceHint: name,
        type: "article"
      });
      return;
    }

    // PDF — real extraction
    if (f.type === "application/pdf" || /\.pdf$/i.test(name)) {
      setProgress({
        label: `PDF · ${name}`,
        pct: 0
      });
      try {
        const {
          text,
          pages
        } = await window.extractPdfText(f, p => setProgress({
          label: `PDF · ${name}`,
          pct: p
        }));
        setProgress(null);
        if (text && text.trim().length > 50) {
          addItem({
            text: `[Source : ${name} · ${pages} pages]\n\n${text}`,
            sourceHint: name,
            type: "article"
          });
          toast?.(`PDF extrait (${pages} pages, ${text.length.toLocaleString("fr-FR")} car.)`);
        } else {
          // probably scanned — try OCR on page 1
          addItem({
            text: `[PDF ${name} · ${pages} pages — peu de texte extrait, probablement scanné]\n\nUtilise le mode Photo pour faire l'OCR page par page.`,
            sourceHint: name,
            type: "note"
          });
          toast?.("PDF peu textuel — bascule en mode Photo pour OCR");
        }
      } catch (e) {
        setProgress(null);
        addItem({
          text: `[PDF ${name} · échec extraction : ${e.message}]`,
          sourceHint: name,
          type: "note"
        });
        toast?.("Échec extraction PDF — placeholder créé");
      }
      return;
    }

    // DOCX — minimal extraction
    if (/\.docx$/i.test(name)) {
      const res = await window.extractDocxText(f);
      if (res?.text && res.text.length > 50) {
        addItem({
          text: `[Source : ${name}]\n\n${res.text}`,
          sourceHint: name,
          type: "article"
        });
        toast?.(`DOCX extrait (${res.text.length.toLocaleString("fr-FR")} car.) — extraction simplifiée`);
      } else {
        addItem({
          text: `[DOCX ${name} · ${sizeKb} ko — extraction simplifiée non concluante. Convertir en .txt ou .pdf pour de meilleurs résultats]`,
          sourceHint: name,
          type: "note"
        });
      }
      return;
    }

    // Image — Vision Claude (+ OCR Tesseract en complément texte)
    if (f.type.startsWith("image/")) {
      setProgress({
        label: `Chargement · ${name}`,
        pct: 5
      });
      try {
        // 1. Convertir en base64 pour Vision Claude
        const mediaType = f.type && f.type.startsWith("image/") ? f.type : "image/jpeg";
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result.split(",")[1]); // strip "data:...;base64,"
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });

        // 2. OCR Tesseract en parallèle (texte de secours visible dans la pile)
        let ocrText = "";
        let ocrConf = 0;
        try {
          setProgress({
            label: `OCR · ${name}`,
            pct: 20
          });
          const {
            text,
            confidence
          } = await window.ocrImage(f, p => setProgress({
            label: `OCR · ${name}`,
            pct: 20 + p * 0.7
          }));
          ocrText = (text || "").trim();
          ocrConf = Math.round(confidence || 0);
        } catch (_) {/* OCR facultatif — Vision prend le relais */}
        setProgress(null);
        const hasGoodOCR = ocrText.length > 30 && ocrConf >= 55;
        addItem({
          text: hasGoodOCR ? `[Image : ${name} · OCR ${ocrConf}% · Vision Claude activé]\n\n${ocrText}` : `[Image : ${name} · Vision Claude activé — analyse directe par l'IA]`,
          sourceHint: name,
          type: "note",
          imageData: base64,
          imageMediaType: mediaType
        });
        toast?.(`📷 ${name} — Vision Claude activé${hasGoodOCR ? ` (OCR ${ocrConf}% en complément)` : ""}`);
      } catch (e) {
        setProgress(null);
        addItem({
          text: `[Image ${name} · erreur chargement : ${e.message}]`,
          sourceHint: name,
          type: "note"
        });
      }
      return;
    }

    // Audio file
    if (f.type.startsWith("audio/") || /\.(mp3|m4a|ogg|wav|webm)$/i.test(name)) {
      addItem({
        text: `[Audio déposé : ${name} · ${sizeKb} ko]\n\nLa transcription se fait via Web Speech API en mode Audio (Chrome/Safari), ou via Whisper.cpp local hors ligne.\n\nPour cette démo, l'enregistrement direct (mode Audio) ouvre la transcription en direct.`,
        sourceHint: name,
        type: "podcast"
      });
      return;
    }

    // Video
    if (f.type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(name)) {
      addItem({
        text: `[Vidéo déposée : ${name} · ${sizeKb} ko]\n\nLa lecture audio (Whisper) + extraction d'images-clés (CLIP) tournent en local.\nPour la démo : place ici le transcript .txt à part, ou colle l'URL YouTube en mode Lien.`,
        sourceHint: name,
        type: "video"
      });
      return;
    }

    // Fallback
    addItem({
      text: `[Fichier déposé : ${name} · ${sizeKb} ko · ${f.type || "type inconnu"}]\n\nType non géré pour extraction automatique.`,
      sourceHint: name,
      type: "autre"
    });
  }
  async function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    for (const f of files) {
      await processFile(f);
    }
    toast?.(`${files.length} fichier(s) traité(s)`);
    if (fileRef.current) fileRef.current.value = "";
  }
  function handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) handleFileSelect({
      target: {
        files
      }
    });
  }

  // ─── Link mode ────────────────────────────────────────────────────
  async function fetchPreview() {
    if (!link.trim()) return;
    setLinkLoading(true);
    setLinkPreview(null);
    const meta = await window.fetchLinkMeta(link.trim());
    setLinkLoading(false);
    setLinkPreview(meta);
  }
  function submitLink() {
    if (!link.trim()) return;
    const url = link.trim();
    const isYT = /youtube\.com|youtu\.be/.test(url);
    const isIG = /instagram\.com/.test(url);
    const isTT = /tiktok\.com/.test(url);
    const isSub = /substack\.com/.test(url);
    let kind = linkKind;
    if (isYT || isIG || isTT) kind = "video";
    if (isSub) kind = "newsletter";
    const sourceLabel = linkPreview?.provider || (isYT ? "YouTube" : isIG ? "Instagram" : isTT ? "TikTok" : isSub ? "Substack" : "Lien web");
    const lines = [];
    lines.push(`[Lien : ${url}]`);
    lines.push("");
    if (linkPreview?.title) lines.push(`Titre : ${linkPreview.title}`);
    if (linkPreview?.author) lines.push(`Auteur : ${linkPreview.author}`);
    if (linkPreview?.provider) lines.push(`Source : ${linkPreview.provider}`);
    if (linkPreview?.description) {
      lines.push("");
      lines.push(linkPreview.description);
    } else if (!linkPreview?.ok) {
      lines.push("");
      lines.push("(Métadonnées non récupérables — proxy oEmbed n'a pas couvert ce domaine.)");
      lines.push("L'extraction complète (audio + images-clés pour vidéo) se fait au lancement de l'analyse, en local.");
    }
    addItem({
      text: lines.join("\n"),
      sourceHint: sourceLabel,
      type: kind
    });
    setLink("");
    setLinkPreview(null);
    toast?.(`Lien empilé (${sourceLabel})`);
  }
  useEffect(() => {
    setLinkPreview(null);
    if (!link.trim()) return;
    if (!/^https?:\/\//i.test(link)) return;
    const t = setTimeout(() => fetchPreview(), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [link]);

  // ─── Audio mode ───────────────────────────────────────────────────
  async function startRecording() {
    setLiveText("");
    setLiveInterim("");
    // start Web Speech recognition if available
    const recog = window.getSpeechRecognition?.();
    if (recog) {
      recognitionRef.current = recog;
      recog.onresult = e => {
        let final = "",
          interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += t + " ";else interim += t;
        }
        if (final) setLiveText(prev => prev + final);
        setLiveInterim(interim);
      };
      recog.onerror = () => {};
      try {
        recog.start();
      } catch (e) {}
    }
    try {
      const r = await window.recordAudio({
        onStop: blob => {
          const sizeKb = Math.round(blob.size / 1024);
          const finalTranscript = liveText.trim() || "(pas de transcription — réessaie avec Chrome)";
          addItem({
            text: `[Mémo vocal · ${sizeKb} ko · enregistré le ${new Date().toLocaleString("fr-FR")}]\n\n${finalTranscript}`,
            sourceHint: "Mémo vocal",
            type: "note"
          });
          toast?.("Mémo vocal empilé avec transcription");
          setLiveText("");
          setLiveInterim("");
        }
      });
      recorderRef.current = r;
      setRecording(true);
    } catch (e) {
      toast?.("Accès micro refusé : " + e.message);
    }
  }
  function stopRecording() {
    setRecording(false);
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
    try {
      recorderRef.current?.stop();
    } catch (e) {}
    recognitionRef.current = null;
    recorderRef.current = null;
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head-label"
  }, "Phase 02"), /*#__PURE__*/React.createElement("h1", null, "Verse ta ", /*#__PURE__*/React.createElement("em", null, "mati\xE8re brute")), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Texte, fichier, lien, photo de carnet, m\xE9mo vocal. Un canal par item. Tu empiles autant que tu veux avant l'analyse. ", /*#__PURE__*/React.createElement("strong", null, "Tout reste local."))), /*#__PURE__*/React.createElement("div", {
    className: "capture-modes"
  }, /*#__PURE__*/React.createElement("button", {
    className: `cap-mode ${mode === "text" ? "on" : ""}`,
    onClick: () => setMode("text")
  }, /*#__PURE__*/React.createElement("span", {
    className: "cap-mode-glyph"
  }, "\xB6"), /*#__PURE__*/React.createElement("div", {
    className: "cap-mode-name"
  }, "Texte"), /*#__PURE__*/React.createElement("div", {
    className: "cap-mode-desc"
  }, "Coller")), /*#__PURE__*/React.createElement("button", {
    className: `cap-mode ${mode === "file" ? "on" : ""}`,
    onClick: () => setMode("file")
  }, /*#__PURE__*/React.createElement("span", {
    className: "cap-mode-glyph"
  }, "\u2399"), /*#__PURE__*/React.createElement("div", {
    className: "cap-mode-name"
  }, "Fichier"), /*#__PURE__*/React.createElement("div", {
    className: "cap-mode-desc"
  }, ".txt .md .pdf .docx")), /*#__PURE__*/React.createElement("button", {
    className: `cap-mode ${mode === "link" ? "on" : ""}`,
    onClick: () => setMode("link")
  }, /*#__PURE__*/React.createElement("span", {
    className: "cap-mode-glyph"
  }, "\u2197"), /*#__PURE__*/React.createElement("div", {
    className: "cap-mode-name"
  }, "Lien"), /*#__PURE__*/React.createElement("div", {
    className: "cap-mode-desc"
  }, "URL \xB7 YouTube \xB7 IG")), /*#__PURE__*/React.createElement("button", {
    className: `cap-mode ${mode === "photo" ? "on" : ""}`,
    onClick: () => setMode("photo")
  }, /*#__PURE__*/React.createElement("span", {
    className: "cap-mode-glyph"
  }, "\u25A3"), /*#__PURE__*/React.createElement("div", {
    className: "cap-mode-name"
  }, "Photo"), /*#__PURE__*/React.createElement("div", {
    className: "cap-mode-desc"
  }, "OCR carnet \xB7 dessin")), /*#__PURE__*/React.createElement("button", {
    className: `cap-mode ${mode === "audio" ? "on" : ""}`,
    onClick: () => setMode("audio")
  }, /*#__PURE__*/React.createElement("span", {
    className: "cap-mode-glyph"
  }, "\u25CD"), /*#__PURE__*/React.createElement("div", {
    className: "cap-mode-name"
  }, "Audio"), /*#__PURE__*/React.createElement("div", {
    className: "cap-mode-desc"
  }, "M\xE9mo + transcription"))), /*#__PURE__*/React.createElement("div", {
    className: "capture-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel capture-input"
  }, mode === "text" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "Coller du texte"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "Cmd/Ctrl + Entr\xE9e pour empiler")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: quickLoadSample,
    title: "Charger un exemple TTSO"
  }, "\u2301 Exemple")), /*#__PURE__*/React.createElement("textarea", {
    ref: textareaRef,
    className: "textarea",
    value: text,
    onChange: e => setText(e.target.value),
    onKeyDown: handleKey,
    placeholder: "Colle le contenu int\xE9gral ici \u2014 newsletter avec headers\n\u2014 article complet\n\u2014 transcription de podcast\n\u2014 note libre"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Source (optionnelle)"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    value: sourceHint,
    onChange: e => setSourceHint(e.target.value),
    placeholder: "ex: TTSO, Bien ou bien, LinkedIn\u2026"
  }), sources.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "source-suggest"
  }, sources.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: `source-suggest-chip ${sourceHint === s.name ? "active" : ""}`,
    onClick: () => setSourceHint(s.name)
  }, s.name)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Type"), /*#__PURE__*/React.createElement("select", {
    className: "select",
    value: type,
    onChange: e => setType(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "newsletter"
  }, "Newsletter"), /*#__PURE__*/React.createElement("option", {
    value: "article"
  }, "Article"), /*#__PURE__*/React.createElement("option", {
    value: "video"
  }, "Transcription vid\xE9o"), /*#__PURE__*/React.createElement("option", {
    value: "podcast"
  }, "Transcription podcast"), /*#__PURE__*/React.createElement("option", {
    value: "note"
  }, "Note libre"), /*#__PURE__*/React.createElement("option", {
    value: "autre"
  }, "Autre")))), /*#__PURE__*/React.createElement("div", {
    className: "gap-12",
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "small muted mono"
  }, text.length.toLocaleString("fr-FR"), " caract\xE8res"), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: submit,
    disabled: !text.trim()
  }, "+ Empiler"))), mode === "file" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "D\xE9poser des fichiers"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "PDF, texte, markdown, DOCX, image, audio, vid\xE9o. Extraction en local."))), /*#__PURE__*/React.createElement("div", {
    className: "dropzone",
    onDragOver: e => {
      e.preventDefault();
      e.currentTarget.classList.add("drag");
    },
    onDragLeave: e => e.currentTarget.classList.remove("drag"),
    onDrop: e => {
      e.currentTarget.classList.remove("drag");
      handleDrop(e);
    },
    onClick: () => fileRef.current?.click(),
    role: "button",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement("div", {
    className: "dropzone-glyph"
  }, "\u2399"), /*#__PURE__*/React.createElement("div", {
    className: "dropzone-title"
  }, "D\xE9pose ici, ou clique pour parcourir"), /*#__PURE__*/React.createElement("div", {
    className: "dropzone-hint small dim"
  }, /*#__PURE__*/React.createElement("strong", null, "PDF"), " \u2192 texte extrait via pdfjs", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Image"), " \u2192 OCR (Tesseract fr+en)", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, ".txt .md .csv .json"), " \u2192 lus directement", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Audio \xB7 vid\xE9o"), " \u2192 placeholder (transcription en mode Audio)"), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    multiple: true,
    onChange: handleFileSelect,
    hidden: true
  })), progress && /*#__PURE__*/React.createElement("div", {
    className: "extract-progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "extract-progress-label"
  }, progress.label), /*#__PURE__*/React.createElement("div", {
    className: "extract-progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "extract-progress-fill",
    style: {
      width: Math.round(progress.pct * 100) + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "extract-progress-pct"
  }, Math.round(progress.pct * 100), "%")), /*#__PURE__*/React.createElement("p", {
    className: "helper",
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: "var(--green)"
    }
  }, "\u2192"), " ", "Aucune donn\xE9e n'est envoy\xE9e. PDF.js et Tesseract.js tournent dans ton navigateur (charg\xE9s \xE0 la demande, ~2 Mo).")), mode === "link" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "Importer depuis un lien"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "M\xE9tadonn\xE9es r\xE9cup\xE9r\xE9es via oEmbed \u2014 aper\xE7u avant empilement"))), /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "URL"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    value: link,
    onChange: e => setLink(e.target.value),
    placeholder: "https://\u2026 (YouTube, Substack, article, podcast\u2026)",
    onKeyDown: e => {
      if (e.key === "Enter") submitLink();
    }
  }), linkLoading && /*#__PURE__*/React.createElement("div", {
    className: "extract-progress",
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "extract-progress-label"
  }, "R\xE9cup\xE9ration\u2026"), /*#__PURE__*/React.createElement("div", {
    className: "extract-progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "extract-progress-fill",
    style: {
      width: "60%",
      animation: "pulse 1.5s ease-in-out infinite"
    }
  }))), linkPreview && linkPreview.ok && /*#__PURE__*/React.createElement("div", {
    className: "link-preview"
  }, linkPreview.thumbnail && /*#__PURE__*/React.createElement("div", {
    className: "link-preview-thumb",
    style: {
      backgroundImage: `url("${linkPreview.thumbnail}")`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "link-preview-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "link-preview-title"
  }, linkPreview.title || "(sans titre)"), /*#__PURE__*/React.createElement("div", {
    className: "link-preview-meta"
  }, linkPreview.provider || "—", linkPreview.author ? ` · ${linkPreview.author}` : ""))), linkPreview && !linkPreview.ok && link && /*#__PURE__*/React.createElement("div", {
    className: "helper",
    style: {
      marginTop: 10,
      color: "var(--gold)"
    }
  }, "\u26A0 Aper\xE7u indisponible. Le lien sera empil\xE9 tel quel \u2014 l'extraction se fera au lancement de l'analyse."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, "Type attendu"), /*#__PURE__*/React.createElement("select", {
    className: "select",
    value: linkKind,
    onChange: e => setLinkKind(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "article"
  }, "Article web"), /*#__PURE__*/React.createElement("option", {
    value: "video"
  }, "Vid\xE9o"), /*#__PURE__*/React.createElement("option", {
    value: "podcast"
  }, "Podcast"), /*#__PURE__*/React.createElement("option", {
    value: "newsletter"
  }, "Newsletter en ligne"))), /*#__PURE__*/React.createElement("div", {
    className: "link-hints small dim",
    style: {
      paddingTop: 28
    }
  }, "YouTube \xB7 IG \xB7 TikTok \xB7 Substack d\xE9tect\xE9s automatiquement.", /*#__PURE__*/React.createElement("br", null), "Vid\xE9os > 4min : YouTube uniquement.")), /*#__PURE__*/React.createElement("div", {
    className: "gap-12",
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "small muted mono"
  }, link.length ? "URL prête" : "Vide"), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: submitLink,
    disabled: !link.trim()
  }, "+ Empiler"))), mode === "photo" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "Photo de carnet, dessin, sch\xE9ma manuscrit"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "OCR via Tesseract.js (fr + en) \u2014 tourne dans ton navigateur"))), /*#__PURE__*/React.createElement("div", {
    className: "dropzone",
    onDragOver: e => {
      e.preventDefault();
      e.currentTarget.classList.add("drag");
    },
    onDragLeave: e => e.currentTarget.classList.remove("drag"),
    onDrop: e => {
      e.currentTarget.classList.remove("drag");
      handleDrop(e);
    },
    onClick: () => fileRef.current?.click()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dropzone-glyph"
  }, "\u25A3"), /*#__PURE__*/React.createElement("div", {
    className: "dropzone-title"
  }, "D\xE9pose une photo, ou parcours"), /*#__PURE__*/React.createElement("div", {
    className: "dropzone-hint small dim"
  }, "jpeg \xB7 png \xB7 heic \xB7 webp", /*#__PURE__*/React.createElement("br", null), "L'OCR reconna\xEEt textes manuscrits propres et imprim\xE9s"), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    multiple: true,
    accept: "image/*",
    onChange: handleFileSelect,
    hidden: true
  })), progress && /*#__PURE__*/React.createElement("div", {
    className: "extract-progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "extract-progress-label"
  }, progress.label), /*#__PURE__*/React.createElement("div", {
    className: "extract-progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "extract-progress-fill",
    style: {
      width: Math.round(progress.pct * 100) + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "extract-progress-pct"
  }, Math.round(progress.pct * 100), "%")), /*#__PURE__*/React.createElement("p", {
    className: "helper",
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: "var(--green)"
    }
  }, "\u2192"), " ", "Cas d'usage : reconstituer un brainstorm carnet \xB7 transcrire une page d'id\xE9es \xB7 r\xE9cup\xE9rer un sch\xE9ma \xE0 int\xE9grer dans le Studio.")), mode === "audio" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "M\xE9mo vocal \u2014 transcription live"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "Web Speech API (Chrome/Safari) \u2014 l'audio reste sur ta machine"))), /*#__PURE__*/React.createElement("div", {
    className: "audio-mock"
  }, !recording ? /*#__PURE__*/React.createElement("button", {
    className: "audio-record",
    onClick: startRecording
  }, /*#__PURE__*/React.createElement("span", {
    className: "audio-dot"
  }), " D\xE9marrer un m\xE9mo") : /*#__PURE__*/React.createElement("button", {
    className: "audio-record recording",
    onClick: stopRecording
  }, /*#__PURE__*/React.createElement("span", {
    className: "audio-dot"
  }), " \u23F9 Arr\xEAter & empiler"), /*#__PURE__*/React.createElement("div", {
    className: "dim small",
    style: {
      marginTop: 10
    }
  }, "\u2014 ou d\xE9pose un fichier audio (mp3, m4a, ogg, wav)")), (recording || liveText) && /*#__PURE__*/React.createElement("div", {
    className: "audio-live"
  }, /*#__PURE__*/React.createElement("div", {
    className: "audio-live-label"
  }, "Transcription en direct"), /*#__PURE__*/React.createElement("div", {
    className: "audio-live-text"
  }, liveText, liveInterim && /*#__PURE__*/React.createElement("span", {
    className: "audio-live-interim"
  }, " ", liveInterim), !liveText && !liveInterim && /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "parle\u2026"))), /*#__PURE__*/React.createElement("div", {
    className: "dropzone slim",
    onClick: () => fileRef.current?.click()
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono small"
  }, "+ D\xE9poser un .mp3 / .m4a / .ogg"), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    multiple: true,
    accept: "audio/*",
    onChange: handleFileSelect,
    hidden: true
  })), /*#__PURE__*/React.createElement("p", {
    className: "helper",
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: "var(--green)"
    }
  }, "\u2192"), " ", "Web Speech API : reconnaissance fr-FR, en direct. Si non disponible (Firefox), bascule sur Whisper.cpp local en post-traitement."))), /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "Pile en attente"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, items.length, " contenu(s) pr\xEAt(s) pour analyse"))), items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-title"
  }, "La pile est vide."), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, "Choisis un mode \xE0 gauche, ou clique ", /*#__PURE__*/React.createElement("em", null, "\u2301 Exemple"), ".")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
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
      color: "var(--green)"
    }
  }, "#", String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", null, it.type || "—"), it.sourceHint && /*#__PURE__*/React.createElement("span", null, "\xB7 ", it.sourceHint), /*#__PURE__*/React.createElement("span", null, "\xB7 ", it.text.length.toLocaleString("fr-FR"), " car."), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn danger",
    onClick: () => removeItem(it.id)
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "item-preview"
  }, it.text.slice(0, 180))))))), /*#__PURE__*/React.createElement("div", {
    className: "gap-12",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: goPrev
  }, /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2190"), " Calibrage"), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: goNext,
    disabled: items.length === 0
  }, "Lancer l'analyse ", /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2192"))));
}

// ─────── ANALYSE PHASE ───────
function AnalyseView({
  items,
  runAnalysis,
  isRunning,
  goPrev,
  goNext,
  activeFrameworkId
}) {
  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter(i => i.status === "pending").length,
    done: items.filter(i => i.status === "done").length,
    error: items.filter(i => i.status === "error").length,
    analyzing: items.filter(i => i.status === "analyzing").length
  }), [items]);
  const progress = stats.total ? Math.round((stats.done + stats.error) / stats.total * 100) : 0;
  const canTriage = stats.done > 0 && stats.pending === 0 && stats.analyzing === 0;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head-label"
  }, "Phase 03"), /*#__PURE__*/React.createElement("h1", null, "Le filtre ", /*#__PURE__*/React.createElement("em", null, "travaille")), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Chaque contenu est qualifi\xE9 : source d\xE9tect\xE9e, bloc choisi, ", /*#__PURE__*/React.createElement("strong", null, "r\xE9sum\xE9 en 2-3 phrases"), ", score multicrit\xE8res, angle exploitable. Le r\xE9sum\xE9 est visible directement dans la liste pour que tu puisses juger de la pertinence sans cliquer.")), activeFrameworkId && /*#__PURE__*/React.createElement(window.ActivePrismeBar, {
    activeId: activeFrameworkId
  }), /*#__PURE__*/React.createElement("div", {
    className: "analyse-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-val"
  }, stats.total), /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, "Total")), /*#__PURE__*/React.createElement("div", {
    className: "stat-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      color: "var(--green)"
    }
  }, stats.done), /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, "Qualifi\xE9s")), /*#__PURE__*/React.createElement("div", {
    className: "stat-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      color: "var(--gold)"
    }
  }, stats.analyzing), /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, "En cours")), /*#__PURE__*/React.createElement("div", {
    className: "stat-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      color: "var(--muted)"
    }
  }, stats.pending), /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, "En attente")), stats.error > 0 && /*#__PURE__*/React.createElement("div", {
    className: "stat-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-val",
    style: {
      color: "var(--red)"
    }
  }, stats.error), /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, "Erreurs")), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: runAnalysis,
    disabled: isRunning || stats.pending === 0
  }, isRunning ? "Analyse en cours…" : stats.done > 0 ? "Relancer non-traités" : "▷ Lancer l'analyse")), /*#__PURE__*/React.createElement("div", {
    className: "progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-fill",
    style: {
      width: `${progress}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "panel-title"
  }, "File d'attente"), /*#__PURE__*/React.createElement("div", {
    className: "panel-sub"
  }, "R\xE9sum\xE9 visible d\xE8s qualification \u2014 justifie le score"))), items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-title"
  }, "Aucun contenu \xE0 analyser."), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, "Reviens \xE0 la capture pour empiler des items.")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
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
      color: "var(--muted)"
    }
  }, "#", String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", null, it.type), it.sourceHint && /*#__PURE__*/React.createElement("span", null, "\xB7 ", it.sourceHint), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("span", {
    className: `status-pill status-${it.status}`
  }, it.status === "pending" && "En attente", it.status === "analyzing" && "Analyse…", it.status === "done" && "Qualifié", it.status === "error" && "Erreur"), it.result && /*#__PURE__*/React.createElement(ScorePill, {
    score: it.result.score
  }), it.result && /*#__PURE__*/React.createElement(BlocChip, {
    blocId: it.result.bloc_id
  })), it.imageData && /*#__PURE__*/React.createElement("div", {
    className: "item-meta",
    style: {
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono small",
    style: {
      color: "var(--blue)"
    }
  }, "\uD83D\uDCF7 Vision Claude")), /*#__PURE__*/React.createElement("div", {
    className: "item-title"
  }, it.result?.title || it.text.slice(0, 80) + (it.text.length > 80 ? "…" : "")), it.result?.summary && /*#__PURE__*/React.createElement("div", {
    className: "item-summary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono small",
    style: {
      color: "var(--green)"
    }
  }, "// résumé"), " ", it.result.summary), it.error && /*#__PURE__*/React.createElement("div", {
    className: "item-preview",
    style: {
      color: "var(--red)"
    }
  }, "\u26A0 ", it.error))))), /*#__PURE__*/React.createElement("div", {
    className: "gap-12",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: goPrev
  }, /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2190"), " Capture"), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: goNext,
    disabled: !canTriage
  }, "Voir le triage ", /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2192"))));
}
Object.assign(window, {
  BlocChip,
  ScorePill,
  Sidebar,
  SetupView,
  CaptureView,
  AnalyseView
});