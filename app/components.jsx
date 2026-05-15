// components.jsx — Sidebar, Setup, Capture, Analyse
/* global React */

var { useState, useEffect, useMemo, useRef, useCallback } = React;

// ─────── BLOC CHIP ───────
function BlocChip({ blocId, label, withDot = true }) {
  if (!blocId) return null;
  return (
    <span className={`bloc-chip bloc-${blocId}`}>
      {withDot && <span className={`bloc-dot dot-${blocId}`}></span>}
      {blocId}{label ? ` · ${label}` : ""}
    </span>
  );
}

// ─────── SCORE PILL ───────
function ScorePill({ score }) {
  const cls = window.scoreClass(score);
  return <span className={`score-pill ${cls}`}>{score}/100</span>;
}

// ─────── SIDEBAR ───────
function Sidebar({ phase, setPhase, counts, openManifesto, theme, setTheme }) {
  const phases = [
    { id: "setup",     num: "01", title: "Calibrage", meta: `${counts.projects} projets · ${counts.blocs} blocs` },
    { id: "capture",   num: "02", title: "Capture",   meta: `${counts.items} contenu(s)` },
    { id: "analyse",   num: "03", title: "Analyse",   meta: counts.analyzing ? "en cours…" : (counts.pending ? `${counts.pending} en attente` : "—") },
    { id: "triage",    num: "04", title: "Triage",    meta: `${counts.done} qualifié(s)` },
    { id: "dashboard", num: "05", title: "Dashboard", meta: "stack · rythme · garde-fous" },
    { id: "studio",    num: "06", title: "Studio",    meta: "carte · story · info · lecture" },
    { id: "tracker",   num: "07", title: "Projets",   meta: `${counts.trackerProjects || 0} projet(s)` },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-label">v0.2 · 2026</div>
        <div className="brand-title">Le <em>Filtre</em></div>
        <div className="brand-sub">Triage éditorial sobre & local.<br/>Calibrer · capter · trier · piloter · créer.</div>
        <button className="manifest-link" onClick={openManifesto}>
          <span className="mono">↗</span> Lire le manifeste
        </button>
      </div>

      <div className="phases">
        <div className="phase-head">— Parcours</div>
        {phases.map((p, i) => {
          const isActive = phase === p.id;
          const isDone = phases.findIndex(x => x.id === phase) > i;
          return (
            <button
              key={p.id}
              className={`phase ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
              onClick={() => setPhase(p.id)}
            >
              <span className="phase-num">{p.num}</span>
              <span className="phase-body">
                <div className="phase-title">{p.title}</div>
                <div className="phase-meta">{p.meta}</div>
              </span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-foot">
        <div className="theme-switch" role="group" aria-label="Thème">
          <button className={`theme-btn ${theme === "light" ? "on" : ""}`} onClick={() => setTheme("light")}>◐ Clair</button>
          <button className={`theme-btn ${theme === "dark" ? "on" : ""}`} onClick={() => setTheme("dark")}>◑ Sombre</button>
        </div>
        <div className="mono small muted" style={{marginTop: 10, lineHeight: 1.5}}>
          Local · {counts.trackerProjects || 0} projet(s)<br/>
          {(counts.items || 0)} items en mémoire
        </div>
      </div>
    </aside>
  );
}

// ─────── SETUP PHASE ───────
function SetupView({ projects, setProjects, blocs, setBlocs, sources, setSources, goNext, resetAll, activeFrameworkId, setActiveFrameworkId }) {
  const [tab, setTab] = useState("projects");

  function addProject() {
    setProjects([...projects, { id: `p_${Date.now()}`, name: "Nouveau projet", objective: "Objectif de veille…", keywords: "", rhythm: "" }]);
  }
  function updateProject(id, field, value) {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  }
  function removeProject(id) { setProjects(projects.filter(p => p.id !== id)); }

  function addBloc() {
    const ids = blocs.map(b => parseInt(b.code.slice(1))).filter(n => !isNaN(n));
    const next = ids.length ? Math.max(...ids) + 1 : 1;
    const code = `B${next}`;
    setBlocs([...blocs, { id: code, code, theme: "Nouveau bloc", description: "Définition du périmètre thématique…", color: "B1" }]);
  }
  function updateBloc(id, field, value) {
    setBlocs(blocs.map(b => b.id === id ? { ...b, [field]: value } : b));
  }
  function removeBloc(id) { setBlocs(blocs.filter(b => b.id !== id)); }

  function addSource() {
    setSources([...sources, { id: `s_${Date.now()}`, name: "Nouvelle source", protocol: "Protocole de traitement…", defaultBloc: "B1" }]);
  }
  function updateSource(id, field, value) {
    setSources(sources.map(s => s.id === id ? { ...s, [field]: value } : s));
  }
  function removeSource(id) { setSources(sources.filter(s => s.id !== id)); }

  return (
    <div>
      <div className="page-head">
        <div className="page-head-label">Phase 01</div>
        <h1>Calibre le filtre à ta <em>main</em></h1>
        <p className="sub">
          Tes projets, tes blocs, les sources que tu reçois souvent. Tu peux tout garder par défaut
          et commencer tout de suite, ou ajuster maintenant — tu reviens quand tu veux.
        </p>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "projects" ? "active" : ""}`} onClick={() => setTab("projects")}>
          Projets <span className="tab-count">{projects.length}</span>
        </button>
        <button className={`tab ${tab === "blocs" ? "active" : ""}`} onClick={() => setTab("blocs")}>
          Blocs <span className="tab-count">{blocs.length}</span>
        </button>
        <button className={`tab ${tab === "sources" ? "active" : ""}`} onClick={() => setTab("sources")}>
          Sources récurrentes <span className="tab-count">{sources.length}</span>
        </button>
        <button className={`tab ${tab === "prismes" ? "active" : ""}`} onClick={() => setTab("prismes")} style={{position: "relative"}}>
          Prismes
          {activeFrameworkId && <span className="tab-dot" title="Prisme actif">◉</span>}
        </button>
      </div>

      {tab === "projects" && (
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">Projets nourris par la veille</div>
              <div className="panel-sub">Chaque contenu sera scoré pour sa pertinence vis-à-vis de ces projets.</div>
            </div>
            <button className="btn" onClick={addProject}>+ Ajouter</button>
          </div>
          <div className="setup-grid">
            {projects.map(p => (
              <div key={p.id} className="row-flex" style={{alignItems: "stretch"}}>
                <div className="block-area">
                  <div className="project-edit-grid">
                    <input className="inline-edit cream" style={{fontWeight: 600}} value={p.name} onChange={e => updateProject(p.id, "name", e.target.value)} />
                    <input className="inline-edit dim small" value={p.objective} onChange={e => updateProject(p.id, "objective", e.target.value)} placeholder="Objectif de veille" />
                    <div className="row-actions">
                      <button className="icon-btn danger" onClick={() => removeProject(p.id)} title="Supprimer">×</button>
                    </div>
                  </div>
                  <input className="inline-edit muted small mono" value={p.keywords} onChange={e => updateProject(p.id, "keywords", e.target.value)} placeholder="mots-clés (séparés par virgules)" style={{marginTop: 4}} />
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="empty">
                <div className="empty-title">Aucun projet.</div>
                <p className="small">Ajoute-en un pour calibrer le moteur.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "blocs" && (
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">Blocs thématiques (Boussole+)</div>
              <div className="panel-sub">Le filtre classera chaque contenu dans UN bloc dominant. Adapte les libellés à ton vocabulaire.</div>
            </div>
            <button className="btn" onClick={addBloc}>+ Ajouter</button>
          </div>
          <div className="setup-grid">
            {blocs.map(b => (
              <div key={b.id} className="row-flex" style={{alignItems: "flex-start"}}>
                <BlocChip blocId={b.id} />
                <div className="block-area">
                  <input className="inline-edit cream" style={{fontWeight: 600}} value={b.theme} onChange={e => updateBloc(b.id, "theme", e.target.value)} />
                  <textarea className="inline-edit dim small" value={b.description} onChange={e => updateBloc(b.id, "description", e.target.value)} rows={2} style={{marginTop: 2, resize: "vertical"}} />
                </div>
                <div className="row-actions">
                  <button className="icon-btn danger" onClick={() => removeBloc(b.id)} title="Supprimer">×</button>
                </div>
              </div>
            ))}
          </div>
          <p className="helper" style={{marginTop: 16}}>
            <span className="mono" style={{color: "var(--green)"}}>→</span>{" "}
            6 blocs Boussole+ par défaut. Tu peux en ajouter, mais reste sous 8 pour garder une signal/bruit propre.
          </p>
        </div>
      )}

      {tab === "sources" && (
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">Sources avec protocole spécifique</div>
              <div className="panel-sub">Quand le filtre reconnaît une source (TTSO, Hallu World…), il applique son protocole de traitement.</div>
            </div>
            <button className="btn" onClick={addSource}>+ Ajouter</button>
          </div>
          <div className="setup-grid">
            {sources.map(s => (
              <div key={s.id} className="row-flex" style={{alignItems: "flex-start"}}>
                <div className="block-area">
                  <div className="gap-12" style={{marginBottom: 6}}>
                    <input className="inline-edit cream" style={{fontWeight: 600, maxWidth: 260}} value={s.name} onChange={e => updateSource(s.id, "name", e.target.value)} />
                    <select className="select" style={{maxWidth: 200}} value={s.defaultBloc} onChange={e => updateSource(s.id, "defaultBloc", e.target.value)}>
                      {blocs.map(b => <option key={b.id} value={b.id}>{b.code} · {b.theme}</option>)}
                    </select>
                  </div>
                  <textarea className="inline-edit dim small" value={s.protocol} onChange={e => updateSource(s.id, "protocol", e.target.value)} rows={2} style={{resize: "vertical"}} />
                </div>
                <div className="row-actions">
                  <button className="icon-btn danger" onClick={() => removeSource(s.id)} title="Supprimer">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "prismes" && (
        <window.FrameworksPanel activeId={activeFrameworkId} setActiveId={setActiveFrameworkId} />
      )}

      <div className="gap-12" style={{marginTop: 24}}>
        <button className="btn-ghost btn" onClick={resetAll} title="Restaurer les défauts">↻ Restaurer les défauts</button>
        <div className="grow"></div>
        <button className="btn btn-primary" onClick={goNext}>
          Passer à la capture <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

// ─────── CAPTURE PHASE ───────
function CaptureView({ items, addItem, removeItem, sources, loadSample, goPrev, goNext, toast }) {
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
    addItem({ text: text.trim(), sourceHint: sourceHint.trim(), type });
    setText(""); setSourceHint("");
    if (textareaRef.current) textareaRef.current.focus();
  }
  function quickLoadSample() { loadSample(); setText(""); setSourceHint(""); }
  function handleKey(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); submit(); }
  }

  async function processFile(f) {
    const name = f.name;
    const sizeKb = Math.round(f.size/1024);

    // Plain text / markdown
    if (f.type.startsWith("text/") || /\.(md|txt|rtf|csv|json)$/i.test(name)) {
      const text = await f.text();
      addItem({ text, sourceHint: name, type: "article" });
      return;
    }

    // PDF — real extraction
    if (f.type === "application/pdf" || /\.pdf$/i.test(name)) {
      setProgress({ label: `PDF · ${name}`, pct: 0 });
      try {
        const { text, pages } = await window.extractPdfText(f, (p) => setProgress({ label: `PDF · ${name}`, pct: p }));
        setProgress(null);
        if (text && text.trim().length > 50) {
          addItem({
            text: `[Source : ${name} · ${pages} pages]\n\n${text}`,
            sourceHint: name, type: "article"
          });
          toast?.(`PDF extrait (${pages} pages, ${text.length.toLocaleString("fr-FR")} car.)`);
        } else {
          // probably scanned — try OCR on page 1
          addItem({
            text: `[PDF ${name} · ${pages} pages — peu de texte extrait, probablement scanné]\n\nUtilise le mode Photo pour faire l'OCR page par page.`,
            sourceHint: name, type: "note"
          });
          toast?.("PDF peu textuel — bascule en mode Photo pour OCR");
        }
      } catch (e) {
        setProgress(null);
        addItem({ text: `[PDF ${name} · échec extraction : ${e.message}]`, sourceHint: name, type: "note" });
        toast?.("Échec extraction PDF — placeholder créé");
      }
      return;
    }

    // DOCX — minimal extraction
    if (/\.docx$/i.test(name)) {
      const res = await window.extractDocxText(f);
      if (res?.text && res.text.length > 50) {
        addItem({ text: `[Source : ${name}]\n\n${res.text}`, sourceHint: name, type: "article" });
        toast?.(`DOCX extrait (${res.text.length.toLocaleString("fr-FR")} car.) — extraction simplifiée`);
      } else {
        addItem({ text: `[DOCX ${name} · ${sizeKb} ko — extraction simplifiée non concluante. Convertir en .txt ou .pdf pour de meilleurs résultats]`, sourceHint: name, type: "note" });
      }
      return;
    }

    // Image — Vision Claude (+ OCR Tesseract en complément texte)
    if (f.type.startsWith("image/")) {
      setProgress({ label: `Chargement · ${name}`, pct: 5 });
      try {
        // 1. Convertir en base64 pour Vision Claude
        const mediaType = (f.type && f.type.startsWith("image/")) ? f.type : "image/jpeg";
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
          setProgress({ label: `OCR · ${name}`, pct: 20 });
          const { text, confidence } = await window.ocrImage(f, (p) => setProgress({ label: `OCR · ${name}`, pct: 20 + p * 0.7 }));
          ocrText = (text || "").trim();
          ocrConf = Math.round(confidence || 0);
        } catch (_) { /* OCR facultatif — Vision prend le relais */ }

        setProgress(null);
        const hasGoodOCR = ocrText.length > 30 && ocrConf >= 55;

        addItem({
          text: hasGoodOCR
            ? `[Image : ${name} · OCR ${ocrConf}% · Vision Claude activé]\n\n${ocrText}`
            : `[Image : ${name} · Vision Claude activé — analyse directe par l'IA]`,
          sourceHint: name,
          type: "note",
          imageData: base64,
          imageMediaType: mediaType,
        });
        toast?.(`📷 ${name} — Vision Claude activé${hasGoodOCR ? ` (OCR ${ocrConf}% en complément)` : ""}`);
      } catch (e) {
        setProgress(null);
        addItem({ text: `[Image ${name} · erreur chargement : ${e.message}]`, sourceHint: name, type: "note" });
      }
      return;
    }

    // Audio file
    if (f.type.startsWith("audio/") || /\.(mp3|m4a|ogg|wav|webm)$/i.test(name)) {
      addItem({
        text: `[Audio déposé : ${name} · ${sizeKb} ko]\n\nLa transcription se fait via Web Speech API en mode Audio (Chrome/Safari), ou via Whisper.cpp local hors ligne.\n\nPour cette démo, l'enregistrement direct (mode Audio) ouvre la transcription en direct.`,
        sourceHint: name, type: "podcast"
      });
      return;
    }

    // Video
    if (f.type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(name)) {
      addItem({
        text: `[Vidéo déposée : ${name} · ${sizeKb} ko]\n\nLa lecture audio (Whisper) + extraction d'images-clés (CLIP) tournent en local.\nPour la démo : place ici le transcript .txt à part, ou colle l'URL YouTube en mode Lien.`,
        sourceHint: name, type: "video"
      });
      return;
    }

    // Fallback
    addItem({
      text: `[Fichier déposé : ${name} · ${sizeKb} ko · ${f.type || "type inconnu"}]\n\nType non géré pour extraction automatique.`,
      sourceHint: name, type: "autre"
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
    if (files.length) handleFileSelect({ target: { files } });
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
    setLink(""); setLinkPreview(null);
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
    setLiveText(""); setLiveInterim("");
    // start Web Speech recognition if available
    const recog = window.getSpeechRecognition?.();
    if (recog) {
      recognitionRef.current = recog;
      recog.onresult = (e) => {
        let final = "", interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += t + " "; else interim += t;
        }
        if (final) setLiveText(prev => prev + final);
        setLiveInterim(interim);
      };
      recog.onerror = () => {};
      try { recog.start(); } catch (e) {}
    }
    try {
      const r = await window.recordAudio({
        onStop: (blob) => {
          const sizeKb = Math.round(blob.size / 1024);
          const finalTranscript = liveText.trim() || "(pas de transcription — réessaie avec Chrome)";
          addItem({
            text: `[Mémo vocal · ${sizeKb} ko · enregistré le ${new Date().toLocaleString("fr-FR")}]\n\n${finalTranscript}`,
            sourceHint: "Mémo vocal",
            type: "note"
          });
          toast?.("Mémo vocal empilé avec transcription");
          setLiveText(""); setLiveInterim("");
        },
      });
      recorderRef.current = r;
      setRecording(true);
    } catch (e) {
      toast?.("Accès micro refusé : " + e.message);
    }
  }
  function stopRecording() {
    setRecording(false);
    try { recognitionRef.current?.stop(); } catch (e) {}
    try { recorderRef.current?.stop(); } catch (e) {}
    recognitionRef.current = null;
    recorderRef.current = null;
  }

  return (
    <div>
      <div className="page-head">
        <div className="page-head-label">Phase 02</div>
        <h1>Verse ta <em>matière brute</em></h1>
        <p className="sub">
          Texte, fichier, lien, photo de carnet, mémo vocal. Un canal par item.
          Tu empiles autant que tu veux avant l'analyse. <strong>Tout reste local.</strong>
        </p>
      </div>

      <div className="capture-modes">
        <button className={`cap-mode ${mode === "text" ? "on" : ""}`} onClick={() => setMode("text")}>
          <span className="cap-mode-glyph">¶</span>
          <div className="cap-mode-name">Texte</div>
          <div className="cap-mode-desc">Coller</div>
        </button>
        <button className={`cap-mode ${mode === "file" ? "on" : ""}`} onClick={() => setMode("file")}>
          <span className="cap-mode-glyph">⎙</span>
          <div className="cap-mode-name">Fichier</div>
          <div className="cap-mode-desc">.txt .md .pdf .docx</div>
        </button>
        <button className={`cap-mode ${mode === "link" ? "on" : ""}`} onClick={() => setMode("link")}>
          <span className="cap-mode-glyph">↗</span>
          <div className="cap-mode-name">Lien</div>
          <div className="cap-mode-desc">URL · YouTube · IG</div>
        </button>
        <button className={`cap-mode ${mode === "photo" ? "on" : ""}`} onClick={() => setMode("photo")}>
          <span className="cap-mode-glyph">▣</span>
          <div className="cap-mode-name">Photo</div>
          <div className="cap-mode-desc">OCR carnet · dessin</div>
        </button>
        <button className={`cap-mode ${mode === "audio" ? "on" : ""}`} onClick={() => setMode("audio")}>
          <span className="cap-mode-glyph">◍</span>
          <div className="cap-mode-name">Audio</div>
          <div className="cap-mode-desc">Mémo + transcription</div>
        </button>
      </div>

      <div className="capture-grid">
        <div className="panel capture-input">
          {mode === "text" && (
            <>
              <div className="panel-head">
                <div>
                  <div className="panel-title">Coller du texte</div>
                  <div className="panel-sub">Cmd/Ctrl + Entrée pour empiler</div>
                </div>
                <button className="btn btn-ghost" onClick={quickLoadSample} title="Charger un exemple TTSO">⌁ Exemple</button>
              </div>
              <textarea ref={textareaRef} className="textarea" value={text}
                onChange={e => setText(e.target.value)} onKeyDown={handleKey}
                placeholder="Colle le contenu intégral ici&#10;&#10;— newsletter avec headers&#10;— article complet&#10;— transcription de podcast&#10;— note libre" />
              <div style={{marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>
                <div>
                  <label className="label">Source (optionnelle)</label>
                  <input className="input" value={sourceHint} onChange={e => setSourceHint(e.target.value)} placeholder="ex: TTSO, Bien ou bien, LinkedIn…" />
                  {sources.length > 0 && (
                    <div className="source-suggest">
                      {sources.map(s => (
                        <button key={s.id} className={`source-suggest-chip ${sourceHint === s.name ? "active" : ""}`} onClick={() => setSourceHint(s.name)}>
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="select" value={type} onChange={e => setType(e.target.value)}>
                    <option value="newsletter">Newsletter</option>
                    <option value="article">Article</option>
                    <option value="video">Transcription vidéo</option>
                    <option value="podcast">Transcription podcast</option>
                    <option value="note">Note libre</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
              <div className="gap-12" style={{marginTop: 18}}>
                <span className="small muted mono">{text.length.toLocaleString("fr-FR")} caractères</span>
                <div className="grow"></div>
                <button className="btn btn-primary" onClick={submit} disabled={!text.trim()}>+ Empiler</button>
              </div>
            </>
          )}

          {mode === "file" && (
            <>
              <div className="panel-head">
                <div>
                  <div className="panel-title">Déposer des fichiers</div>
                  <div className="panel-sub">PDF, texte, markdown, DOCX, image, audio, vidéo. Extraction en local.</div>
                </div>
              </div>
              <div className="dropzone"
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("drag"); }}
                onDragLeave={e => e.currentTarget.classList.remove("drag")}
                onDrop={e => { e.currentTarget.classList.remove("drag"); handleDrop(e); }}
                onClick={() => fileRef.current?.click()}
                role="button" tabIndex={0}>
                <div className="dropzone-glyph">⎙</div>
                <div className="dropzone-title">Dépose ici, ou clique pour parcourir</div>
                <div className="dropzone-hint small dim">
                  <strong>PDF</strong> → texte extrait via pdfjs<br/>
                  <strong>Image</strong> → OCR (Tesseract fr+en)<br/>
                  <strong>.txt .md .csv .json</strong> → lus directement<br/>
                  <strong>Audio · vidéo</strong> → placeholder (transcription en mode Audio)
                </div>
                <input ref={fileRef} type="file" multiple onChange={handleFileSelect} hidden />
              </div>
              {progress && (
                <div className="extract-progress">
                  <span className="extract-progress-label">{progress.label}</span>
                  <div className="extract-progress-bar"><div className="extract-progress-fill" style={{width: Math.round(progress.pct * 100) + "%"}}></div></div>
                  <span className="extract-progress-pct">{Math.round(progress.pct * 100)}%</span>
                </div>
              )}
              <p className="helper" style={{marginTop: 14}}>
                <span className="mono" style={{color: "var(--green)"}}>→</span>{" "}
                Aucune donnée n'est envoyée. PDF.js et Tesseract.js tournent dans ton navigateur (chargés à la demande, ~2 Mo).
              </p>
            </>
          )}

          {mode === "link" && (
            <>
              <div className="panel-head">
                <div>
                  <div className="panel-title">Importer depuis un lien</div>
                  <div className="panel-sub">Métadonnées récupérées via oEmbed — aperçu avant empilement</div>
                </div>
              </div>
              <label className="label">URL</label>
              <input className="input" value={link} onChange={e => setLink(e.target.value)}
                placeholder="https://… (YouTube, Substack, article, podcast…)"
                onKeyDown={e => { if (e.key === "Enter") submitLink(); }} />
              {linkLoading && (
                <div className="extract-progress" style={{marginTop: 10}}>
                  <span className="extract-progress-label">Récupération…</span>
                  <div className="extract-progress-bar"><div className="extract-progress-fill" style={{width: "60%", animation: "pulse 1.5s ease-in-out infinite"}}></div></div>
                </div>
              )}
              {linkPreview && linkPreview.ok && (
                <div className="link-preview">
                  {linkPreview.thumbnail && (
                    <div className="link-preview-thumb" style={{backgroundImage: `url("${linkPreview.thumbnail}")`}}></div>
                  )}
                  <div className="link-preview-body">
                    <div className="link-preview-title">{linkPreview.title || "(sans titre)"}</div>
                    <div className="link-preview-meta">
                      {linkPreview.provider || "—"}{linkPreview.author ? ` · ${linkPreview.author}` : ""}
                    </div>
                  </div>
                </div>
              )}
              {linkPreview && !linkPreview.ok && link && (
                <div className="helper" style={{marginTop: 10, color: "var(--gold)"}}>
                  ⚠ Aperçu indisponible. Le lien sera empilé tel quel — l'extraction se fera au lancement de l'analyse.
                </div>
              )}
              <div style={{marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>
                <div>
                  <label className="label">Type attendu</label>
                  <select className="select" value={linkKind} onChange={e => setLinkKind(e.target.value)}>
                    <option value="article">Article web</option>
                    <option value="video">Vidéo</option>
                    <option value="podcast">Podcast</option>
                    <option value="newsletter">Newsletter en ligne</option>
                  </select>
                </div>
                <div className="link-hints small dim" style={{paddingTop: 28}}>
                  YouTube · IG · TikTok · Substack détectés automatiquement.<br/>
                  Vidéos &gt; 4min : YouTube uniquement.
                </div>
              </div>
              <div className="gap-12" style={{marginTop: 18}}>
                <span className="small muted mono">{link.length ? "URL prête" : "Vide"}</span>
                <div className="grow"></div>
                <button className="btn btn-primary" onClick={submitLink} disabled={!link.trim()}>+ Empiler</button>
              </div>
            </>
          )}

          {mode === "photo" && (
            <>
              <div className="panel-head">
                <div>
                  <div className="panel-title">Photo de carnet, dessin, schéma manuscrit</div>
                  <div className="panel-sub">OCR via Tesseract.js (fr + en) — tourne dans ton navigateur</div>
                </div>
              </div>
              <div className="dropzone"
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("drag"); }}
                onDragLeave={e => e.currentTarget.classList.remove("drag")}
                onDrop={e => { e.currentTarget.classList.remove("drag"); handleDrop(e); }}
                onClick={() => fileRef.current?.click()}>
                <div className="dropzone-glyph">▣</div>
                <div className="dropzone-title">Dépose une photo, ou parcours</div>
                <div className="dropzone-hint small dim">
                  jpeg · png · heic · webp<br/>
                  L'OCR reconnaît textes manuscrits propres et imprimés
                </div>
                <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFileSelect} hidden />
              </div>
              {progress && (
                <div className="extract-progress">
                  <span className="extract-progress-label">{progress.label}</span>
                  <div className="extract-progress-bar"><div className="extract-progress-fill" style={{width: Math.round(progress.pct * 100) + "%"}}></div></div>
                  <span className="extract-progress-pct">{Math.round(progress.pct * 100)}%</span>
                </div>
              )}
              <p className="helper" style={{marginTop: 14}}>
                <span className="mono" style={{color: "var(--green)"}}>→</span>{" "}
                Cas d'usage : reconstituer un brainstorm carnet · transcrire une page d'idées · récupérer un schéma à intégrer dans le Studio.
              </p>
            </>
          )}

          {mode === "audio" && (
            <>
              <div className="panel-head">
                <div>
                  <div className="panel-title">Mémo vocal — transcription live</div>
                  <div className="panel-sub">Web Speech API (Chrome/Safari) — l'audio reste sur ta machine</div>
                </div>
              </div>
              <div className="audio-mock">
                {!recording ? (
                  <button className="audio-record" onClick={startRecording}>
                    <span className="audio-dot"></span> Démarrer un mémo
                  </button>
                ) : (
                  <button className="audio-record recording" onClick={stopRecording}>
                    <span className="audio-dot"></span> ⏹ Arrêter & empiler
                  </button>
                )}
                <div className="dim small" style={{marginTop: 10}}>
                  — ou dépose un fichier audio (mp3, m4a, ogg, wav)
                </div>
              </div>
              {(recording || liveText) && (
                <div className="audio-live">
                  <div className="audio-live-label">Transcription en direct</div>
                  <div className="audio-live-text">
                    {liveText}
                    {liveInterim && <span className="audio-live-interim"> {liveInterim}</span>}
                    {!liveText && !liveInterim && <span className="muted">parle…</span>}
                  </div>
                </div>
              )}
              <div className="dropzone slim" onClick={() => fileRef.current?.click()}>
                <span className="mono small">+ Déposer un .mp3 / .m4a / .ogg</span>
                <input ref={fileRef} type="file" multiple accept="audio/*" onChange={handleFileSelect} hidden />
              </div>
              <p className="helper" style={{marginTop: 14}}>
                <span className="mono" style={{color: "var(--green)"}}>→</span>{" "}
                Web Speech API : reconnaissance fr-FR, en direct. Si non disponible (Firefox), bascule sur Whisper.cpp local en post-traitement.
              </p>
            </>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">Pile en attente</div>
              <div className="panel-sub">{items.length} contenu(s) prêt(s) pour analyse</div>
            </div>
          </div>
          {items.length === 0 ? (
            <div className="empty">
              <div className="empty-title">La pile est vide.</div>
              <p className="small">Choisis un mode à gauche, ou clique <em>⌁ Exemple</em>.</p>
            </div>
          ) : (
            <div style={{display: "flex", flexDirection: "column", gap: 8}}>
              {items.map((it, i) => (
                <div key={it.id} className="item-card" style={{cursor: "default"}}>
                  <div className="item-meta">
                    <span className="mono" style={{color: "var(--green)"}}>#{String(i+1).padStart(2,"0")}</span>
                    <span>{it.type || "—"}</span>
                    {it.sourceHint && <span>· {it.sourceHint}</span>}
                    <span>· {it.text.length.toLocaleString("fr-FR")} car.</span>
                    <div className="grow"></div>
                    <button className="icon-btn danger" onClick={() => removeItem(it.id)}>×</button>
                  </div>
                  <div className="item-preview">{it.text.slice(0, 180)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="gap-12" style={{marginTop: 24}}>
        <button className="btn" onClick={goPrev}><span className="btn-arrow">←</span> Calibrage</button>
        <div className="grow"></div>
        <button className="btn btn-primary" onClick={goNext} disabled={items.length === 0}>
          Lancer l'analyse <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

// ─────── ANALYSE PHASE ───────
function AnalyseView({ items, runAnalysis, isRunning, goPrev, goNext, activeFrameworkId }) {
  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter(i => i.status === "pending").length,
    done: items.filter(i => i.status === "done").length,
    error: items.filter(i => i.status === "error").length,
    analyzing: items.filter(i => i.status === "analyzing").length,
  }), [items]);

  const progress = stats.total ? Math.round((stats.done + stats.error) / stats.total * 100) : 0;
  const canTriage = stats.done > 0 && stats.pending === 0 && stats.analyzing === 0;

  return (
    <div>
      <div className="page-head">
        <div className="page-head-label">Phase 03</div>
        <h1>Le filtre <em>travaille</em></h1>
        <p className="sub">
          Chaque contenu est qualifié : source détectée, bloc choisi, <strong>résumé en 2-3 phrases</strong>,
          score multicritères, angle exploitable. Le résumé est visible directement dans la liste pour
          que tu puisses juger de la pertinence sans cliquer.
        </p>
      </div>

      {activeFrameworkId && <window.ActivePrismeBar activeId={activeFrameworkId} />}

      <div className="analyse-stat">
        <div className="stat-block">
          <div className="stat-val">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-block">
          <div className="stat-val" style={{color: "var(--green)"}}>{stats.done}</div>
          <div className="stat-label">Qualifiés</div>
        </div>
        <div className="stat-block">
          <div className="stat-val" style={{color: "var(--gold)"}}>{stats.analyzing}</div>
          <div className="stat-label">En cours</div>
        </div>
        <div className="stat-block">
          <div className="stat-val" style={{color: "var(--muted)"}}>{stats.pending}</div>
          <div className="stat-label">En attente</div>
        </div>
        {stats.error > 0 && (
          <div className="stat-block">
            <div className="stat-val" style={{color: "var(--red)"}}>{stats.error}</div>
            <div className="stat-label">Erreurs</div>
          </div>
        )}
        <div className="grow"></div>
        <button
          className="btn btn-primary"
          onClick={runAnalysis}
          disabled={isRunning || stats.pending === 0}
        >
          {isRunning ? "Analyse en cours…" : (stats.done > 0 ? "Relancer non-traités" : "▷ Lancer l'analyse")}
        </button>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{width: `${progress}%`}}></div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">File d'attente</div>
            <div className="panel-sub">Résumé visible dès qualification — justifie le score</div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="empty">
            <div className="empty-title">Aucun contenu à analyser.</div>
            <p className="small">Reviens à la capture pour empiler des items.</p>
          </div>
        ) : (
          <div style={{display: "flex", flexDirection: "column", gap: 8}}>
            {items.map((it, i) => (
              <div key={it.id} className="item-card" style={{cursor: "default"}}>
                <div className="item-meta">
                  <span className="mono" style={{color: "var(--muted)"}}>#{String(i+1).padStart(2,"0")}</span>
                  <span>{it.type}</span>
                  {it.sourceHint && <span>· {it.sourceHint}</span>}
                  <div className="grow"></div>
                  <span className={`status-pill status-${it.status}`}>
                    {it.status === "pending" && "En attente"}
                    {it.status === "analyzing" && "Analyse…"}
                    {it.status === "done" && "Qualifié"}
                    {it.status === "error" && "Erreur"}
                  </span>
                  {it.result && <ScorePill score={it.result.score} />}
                  {it.result && <BlocChip blocId={it.result.bloc_id} />}
                </div>
                {it.imageData && (
                  <div className="item-meta" style={{marginBottom: 2}}>
                    <span className="mono small" style={{color: "var(--blue)"}}>📷 Vision Claude</span>
                  </div>
                )}
                <div className="item-title">
                  {it.result?.title || it.text.slice(0, 80) + (it.text.length > 80 ? "…" : "")}
                </div>
                {it.result?.summary && (
                  <div className="item-summary">
                    <span className="mono small" style={{color: "var(--green)"}}>{"// résumé"}</span>{" "}
                    {it.result.summary}
                  </div>
                )}
                {it.error && <div className="item-preview" style={{color: "var(--red)"}}>⚠ {it.error}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="gap-12" style={{marginTop: 24}}>
        <button className="btn" onClick={goPrev}>
          <span className="btn-arrow">←</span> Capture
        </button>
        <div className="grow"></div>
        <button className="btn btn-primary" onClick={goNext} disabled={!canTriage}>
          Voir le triage <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { BlocChip, ScorePill, Sidebar, SetupView, CaptureView, AnalyseView });

