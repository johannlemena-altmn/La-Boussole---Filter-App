// tracker.jsx — Le Filtre v0.2 — Phase 07 : Projets & Suivi
/* global React */

const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;

// ─── Gamification — niveaux de maturité ───────────────────────────────
const MATURITY_LEVELS = [{
  id: 'graine',
  label: 'Graine',
  icon: '○',
  xpMin: 0,
  xpMax: 99,
  color: 'var(--muted)',
  desc: 'Les premières graines sont plantées.'
}, {
  id: 'pousse',
  label: 'Pousse',
  icon: '◔',
  xpMin: 100,
  xpMax: 299,
  color: 'var(--gold)',
  desc: 'Le projet prend racine.'
}, {
  id: 'arbre',
  label: 'Arbre',
  icon: '◑',
  xpMin: 300,
  xpMax: 599,
  color: 'var(--green)',
  desc: 'Pensée structurée, connexions solides.'
}, {
  id: 'foret',
  label: 'Forêt',
  icon: '●',
  xpMin: 600,
  xpMax: Infinity,
  color: 'var(--terra)',
  desc: 'Maîtrise et impact.'
}];
function getMaturityLevel(xp) {
  return [...MATURITY_LEVELS].reverse().find(l => xp >= l.xpMin) || MATURITY_LEVELS[0];
}
function getNextLevel(xp) {
  return MATURITY_LEVELS.find(l => l.xpMin > xp) || null;
}

// ─── Données ───────────────────────────────────────────────────────────
const TRACKER_KEY = 'lf-tracker-v1';
const STATUSES = [{
  id: 'idee',
  label: 'Idée',
  color: 'var(--muted)',
  bg: 'var(--bg3)'
}, {
  id: 'en_cours',
  label: 'En cours',
  color: 'var(--gold)',
  bg: 'var(--gold-dim)'
}, {
  id: 'bloque',
  label: 'Bloqué',
  color: 'var(--red)',
  bg: 'var(--red-dim)'
}, {
  id: 'livre',
  label: 'Livré',
  color: 'var(--green)',
  bg: 'var(--green-dim)'
}];
const PROJECT_COLORS = ['#4a7a3e', '#3a6e8a', '#6b4a8a', '#9c7e1a', '#a64038', '#c46d2e'];
function loadTracker() {
  try {
    return JSON.parse(localStorage.getItem(TRACKER_KEY)) || {
      projects: []
    };
  } catch {
    return {
      projects: []
    };
  }
}
function saveTracker(data) {
  try {
    localStorage.setItem(TRACKER_KEY, JSON.stringify(data));
  } catch {}
}
function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function computeProgress(project) {
  if (!project.tasks?.length) return 0;
  return Math.round(project.tasks.filter(t => t.done).length / project.tasks.length * 100);
}
function snapshotHistory(history, tasks) {
  const d = todayStr();
  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const existing = (history || []).findIndex(h => h.date === d);
  if (existing >= 0) {
    return history.map((h, i) => i === existing ? {
      ...h,
      done,
      total
    } : h);
  }
  return [...(history || []).slice(-29), {
    date: d,
    done,
    total
  }];
}

// ─── Mini sparkline de progression ────────────────────────────────────
function ProgressGraph({
  history,
  color
}) {
  if (!history || history.length < 2) {
    return /*#__PURE__*/React.createElement("div", {
      className: "tr-graph-empty mono small muted"
    }, "Graphe disponible apr\xE8s la 2e session de travail.");
  }
  const H = 52;
  const W = 320;
  const n = history.length;
  const pts = history.map((h, i) => ({
    x: Math.round(i / (n - 1) * W),
    y: h.total > 0 ? Math.round(H - h.done / h.total * (H - 6)) : H,
    done: h.done,
    total: h.total,
    date: h.date
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H} L 0 ${H} Z`;
  const gradId = `tr-grad-${color.replace(/[^a-z0-9]/gi, '_')}`;
  return /*#__PURE__*/React.createElement("div", {
    className: "tr-graph"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    height: H,
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: gradId,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.25"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: areaD,
    fill: `url(#${gradId})`
  }), /*#__PURE__*/React.createElement("path", {
    d: pathD,
    stroke: color,
    strokeWidth: "1.5",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), pts.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: p.x,
    cy: p.y,
    r: "2.5",
    fill: color,
    stroke: "var(--card)",
    strokeWidth: "1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "tr-graph-labels mono",
    style: {
      fontSize: 9,
      color: 'var(--muted)',
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 3
    }
  }, /*#__PURE__*/React.createElement("span", null, history[0]?.date), /*#__PURE__*/React.createElement("span", null, history[history.length - 1]?.date)));
}

// ─── Hermès · Agent pensée critique ──────────────────────────────────
function HermesPanel({
  project,
  allItems,
  onUpdate,
  toast
}) {
  const hermes = project.hermes || {
    xp: 0,
    streak: 0,
    lastActivityDate: null,
    sessions: [],
    pendingQuestion: null
  };
  const [answer, setAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [open, setOpen] = useState(false);
  const answerRef = useRef(null);
  const level = getMaturityLevel(hermes.xp);
  const nextLevel = getNextLevel(hermes.xp);
  const xpProgress = nextLevel ? Math.round((hermes.xp - level.xpMin) / (nextLevel.xpMin - level.xpMin) * 100) : 100;
  const linkedSources = (project.linkedItems || []).map(id => allItems.find(i => i.id === id)).filter(Boolean).filter(i => i.result);
  function buildSourcesBlock() {
    if (!linkedSources.length) return '(aucune source liée)';
    return linkedSources.map(it => [`### ${it.result.title} [${it.result.bloc_id} · ${it.result.score}/100]`, it.result.summary ? it.result.summary.slice(0, 200) : '', it.result.verbatim_cles?.length ? `Verbatims : ${it.result.verbatim_cles.slice(0, 2).join(' | ')}` : '', it.result.questions_ouvertes?.length ? `Questions : ${it.result.questions_ouvertes.slice(0, 2).join(' · ')}` : ''].filter(Boolean).join('\n')).join('\n\n');
  }
  async function generateQuestion() {
    setIsGenerating(true);
    const pastSessions = (hermes.sessions || []).slice(-3);
    const historyBlock = pastSessions.length ? '\nÉCHANGES RÉCENTS (évite de répéter) :\n' + pastSessions.map(s => `Q: ${s.question}`).join('\n') : '';
    const tasksBlock = (project.tasks || []).length ? `\nTÂCHES DU PROJET :\n${(project.tasks || []).slice(0, 6).map(t => `- [${t.done ? '✓' : ' '}] ${t.text}`).join('\n')}` : '';
    const prompt = `Tu es Hermès, un agent de pensée critique au service d'un créateur de contenu éditorial. Tu poses des questions qui forcent la réflexion profonde et empêchent le travail superficiel.

PROJET : "${project.title}"
${project.description ? `Description : ${project.description}` : ''}
${tasksBlock}

SOURCES LIÉES :
${buildSourcesBlock()}
${historyBlock}

MISSION : Pose UNE seule question de pensée critique en français. Choisis le type le plus utile au projet :
- Synthèse : "Quelles tensions vois-tu entre [source A] et [source B] ?"
- Application : "Comment cette idée de [source] change concrètement ta façon de [tâche] ?"
- Avocat du diable : "Pourquoi l'argument central de [source] pourrait-il être complètement faux ?"
- Connexion : "Quelle connexion inattendue vois-tu entre [idée X] et [ton projet] ?"

Règles : question courte (1-2 lignes), ancrée dans les sources réelles, ton sobre et stimulant. Renvoie UNIQUEMENT la question.`;
    try {
      const raw = await window.claude.complete(prompt);
      const q = raw.trim().replace(/^["«""]|["»""]$/g, '').trim();
      onUpdate({
        hermes: {
          ...hermes,
          pendingQuestion: q
        }
      });
      setFeedback(null);
      setTimeout(() => answerRef.current?.focus(), 100);
    } catch (e) {
      toast?.('Hermès indisponible : ' + e.message);
    } finally {
      setIsGenerating(false);
    }
  }
  async function submitAnswer() {
    const txt = answer.trim();
    if (!txt || !hermes.pendingQuestion) return;
    setIsSubmitting(true);
    const XP_ANSWER = 15;
    const today = todayStr();
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const lastDate = hermes.lastActivityDate;
    const newStreak = lastDate === today ? hermes.streak : lastDate === yesterday ? hermes.streak + 1 : 1;
    const newXp = hermes.xp + XP_ANSWER;
    const prevLevel = getMaturityLevel(hermes.xp);
    const newLevel = getMaturityLevel(newXp);
    const leveledUp = newLevel.id !== prevLevel.id;
    const session = {
      id: `hs_${uid()}`,
      question: hermes.pendingQuestion,
      answer: txt,
      xpGained: XP_ANSWER,
      date: today
    };
    const updatedHermes = {
      xp: newXp,
      streak: newStreak,
      lastActivityDate: today,
      sessions: [...(hermes.sessions || []), session],
      pendingQuestion: null
    };
    onUpdate({
      hermes: updatedHermes
    });
    setAnswer('');

    // Une seule requête : feedback + prochaine question en une fois
    const prompt = `Tu es Hermès, agent de pensée critique. L'utilisateur vient de répondre à une question sur son projet.

PROJET : "${project.title}"
SOURCES : ${linkedSources.length ? linkedSources.map(i => i.result.title).join(', ') : '(aucune)'}

Question posée : "${session.question}"
Réponse de l'utilisateur : "${txt}"

Fais deux choses :
1. REACTION: Une seule phrase (max 20 mots) de réaction sobre et stimulante à la réponse. Commence directement sans "Très bien" ni "Excellente réponse".
2. QUESTION: Une nouvelle question de pensée critique différente, ancrée dans les sources.

Format exact :
REACTION: [ta réaction]
QUESTION: [ta prochaine question]`;
    try {
      const raw = await window.claude.complete(prompt);
      // Parse REACTION + QUESTION
      const reactionMatch = raw.match(/REACTION:\s*(.+?)(?=\nQUESTION:|$)/si);
      const questionMatch = raw.match(/QUESTION:\s*(.+?)$/si);
      const reactionText = reactionMatch ? reactionMatch[1].trim() : null;
      const nextQuestion = questionMatch ? questionMatch[1].trim().replace(/^["«""]|["»""]$/g, '') : null;
      setFeedback({
        text: reactionText,
        leveledUp,
        newLevel: leveledUp ? newLevel : null,
        xpGained: XP_ANSWER
      });
      if (nextQuestion) {
        onUpdate({
          hermes: {
            ...updatedHermes,
            pendingQuestion: nextQuestion
          }
        });
      }
    } catch {
      setFeedback({
        text: null,
        leveledUp,
        newLevel: leveledUp ? newLevel : null,
        xpGained: XP_ANSWER
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  const sessions = hermes.sessions || [];
  return /*#__PURE__*/React.createElement("div", {
    className: "hermes-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hermes-header",
    onClick: () => setOpen(v => !v),
    role: "button",
    tabIndex: 0,
    onKeyDown: e => e.key === 'Enter' && setOpen(v => !v)
  }, /*#__PURE__*/React.createElement("span", {
    className: "hermes-header-label"
  }, "Herm\xE8s \xB7 Second cerveau"), /*#__PURE__*/React.createElement("div", {
    className: "hermes-level-badge"
  }, /*#__PURE__*/React.createElement("span", {
    className: `hermes-level-icon ${level.id}`,
    style: {
      color: level.color
    }
  }, level.icon), /*#__PURE__*/React.createElement("span", {
    className: "mono small",
    style: {
      color: level.color
    }
  }, level.label), /*#__PURE__*/React.createElement("span", {
    className: "hermes-xp-small"
  }, hermes.xp, " XP")), hermes.streak >= 2 && /*#__PURE__*/React.createElement("span", {
    className: "hermes-streak-badge"
  }, "\u27F3 ", hermes.streak, "j"), /*#__PURE__*/React.createElement("span", {
    className: "hermes-toggle"
  }, open ? '▲' : '▼')), open && /*#__PURE__*/React.createElement("div", {
    className: "hermes-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hermes-xp-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hermes-xp-meta"
  }, /*#__PURE__*/React.createElement("span", null, level.desc), nextLevel && /*#__PURE__*/React.createElement("span", null, hermes.xp, "/", nextLevel.xpMin, " XP \u2192 ", nextLevel.label), !nextLevel && /*#__PURE__*/React.createElement("span", null, "Niveau maximum atteint")), /*#__PURE__*/React.createElement("div", {
    className: "hermes-xp-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: `hermes-xp-fill ${level.id}`,
    style: {
      width: xpProgress + '%'
    }
  }))), linkedSources.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "hermes-empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dim"
  }, "Lie au moins une source qualifi\xE9e \xE0 ce projet pour activer Herm\xE8s. Herm\xE8s pose des questions ancr\xE9es dans tes contenus de veille.")) : /*#__PURE__*/React.createElement("div", {
    className: "hermes-question-zone"
  }, isGenerating && /*#__PURE__*/React.createElement("div", {
    className: "hermes-generating"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hermes-spin"
  }, "\u25CC"), " Herm\xE8s r\xE9fl\xE9chit\u2026"), !hermes.pendingQuestion && !isGenerating && /*#__PURE__*/React.createElement("button", {
    className: "btn hermes-gen-btn",
    onClick: generateQuestion,
    disabled: isGenerating
  }, /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u25C9"), sessions.length === 0 ? 'Activer Hermès — 1ère question' : 'Générer une nouvelle question'), hermes.pendingQuestion && !isGenerating && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "hermes-question-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hermes-question-label"
  }, "Question de Herm\xE8s"), hermes.pendingQuestion), /*#__PURE__*/React.createElement("div", {
    className: "hermes-answer-row"
  }, /*#__PURE__*/React.createElement("textarea", {
    ref: answerRef,
    className: "la-textarea",
    rows: 3,
    placeholder: "Ta r\xE9ponse \u2014 sois pr\xE9cis, ancre-toi dans les sources\u2026",
    value: answer,
    onChange: e => setAnswer(e.target.value),
    style: {
      flex: 1,
      fontSize: 13
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: submitAnswer,
    disabled: isSubmitting || !answer.trim()
  }, isSubmitting ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "hermes-spin"
  }, "\u25CC"), "\xA0 Analyse\u2026") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "+", 15), " Soumettre (+15 XP)")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: generateQuestion,
    disabled: isGenerating || isSubmitting,
    title: "Passer cette question"
  }, "Autre question \u2192"))), feedback && /*#__PURE__*/React.createElement(React.Fragment, null, feedback.leveledUp && feedback.newLevel && /*#__PURE__*/React.createElement("div", {
    className: "hermes-levelup"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, feedback.newLevel.icon), "Niveau atteint : ", /*#__PURE__*/React.createElement("strong", null, feedback.newLevel.label), " \u2014 ", feedback.newLevel.desc), feedback.text && /*#__PURE__*/React.createElement("div", {
    className: "hermes-feedback"
  }, feedback.text))), sessions.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "hermes-history"
  }, /*#__PURE__*/React.createElement("button", {
    className: "hermes-history-toggle",
    onClick: () => setShowHistory(v => !v)
  }, showHistory ? '▲ Masquer' : `▼ Historique (${sessions.length} session${sessions.length > 1 ? 's' : ''})`), showHistory && /*#__PURE__*/React.createElement("div", {
    className: "hermes-history-list"
  }, [...sessions].reverse().map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "hermes-history-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hermes-history-q"
  }, s.question), /*#__PURE__*/React.createElement("div", {
    className: "hermes-history-a"
  }, s.answer), /*#__PURE__*/React.createElement("div", {
    className: "hermes-history-meta"
  }, s.date, " \xB7 +", s.xpGained, " XP")))))));
}

// ─── Panel sources liées ───────────────────────────────────────────────
function LinkedItemsPanel({
  projectId,
  allItems,
  linkedIds,
  onLink
}) {
  const [showPicker, setShowPicker] = useStateS(false);
  const qualified = allItems.filter(i => i.result);
  const linked = qualified.filter(i => (linkedIds || []).includes(i.id));
  const unlinked = qualified.filter(i => !(linkedIds || []).includes(i.id));
  if (qualified.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "small dim"
    }, "Aucun contenu qualifi\xE9 \xE0 lier. Compl\xE8te la Phase 03 d'abord.");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "tr-linked"
  }, linked.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "small dim",
    style: {
      marginBottom: 8
    }
  }, "Aucune source li\xE9e \xE0 ce projet."), linked.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "tr-linked-item on"
  }, /*#__PURE__*/React.createElement("span", {
    className: `bloc-dot dot-${it.result.bloc_id}`,
    style: {
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "small tr-linked-title"
  }, it.result.title), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--muted)',
      marginLeft: 'auto',
      flexShrink: 0
    }
  }, it.result.score, "/100"), /*#__PURE__*/React.createElement("button", {
    className: "tr-linked-btn",
    onClick: () => onLink(projectId, it.id),
    title: "D\xE9lier"
  }, "\xD7"))), unlinked.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      marginTop: 8,
      marginBottom: showPicker ? 8 : 0
    },
    onClick: () => setShowPicker(!showPicker)
  }, showPicker ? '▲ Replier' : `+ Lier des sources (${unlinked.length} disponible${unlinked.length > 1 ? 's' : ''})`), showPicker && unlinked.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "tr-linked-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: `bloc-dot dot-${it.result.bloc_id}`,
    style: {
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "small tr-linked-title"
  }, it.result.title), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--muted)',
      marginLeft: 'auto',
      flexShrink: 0
    }
  }, it.result.score, "/100"), /*#__PURE__*/React.createElement("button", {
    className: "tr-linked-btn add",
    onClick: () => onLink(projectId, it.id)
  }, "Lier")))));
}

// ─── Vue principale ─────────────────────────────────────────────────────
function TrackerView({
  items,
  goPrev,
  toast
}) {
  const [data, setData] = useStateS(() => loadTracker());
  const [selectedId, setSelectedId] = useStateS(null);
  const [filterStatus, setFilterStatus] = useStateS('all');
  const [creating, setCreating] = useStateS(false);
  const [newTitle, setNewTitle] = useStateS('');
  const [newTask, setNewTask] = useStateS('');
  const newTitleRef = useRef(null);
  const newTaskRef = useRef(null);

  // Expose tracker count for sidebar
  useEffect(() => {
    if (window.__trackerCount !== undefined) {
      window.__trackerCount = data.projects.length;
    }
  }, [data.projects.length]);
  function persist(next) {
    setData(next);
    saveTracker(next);
  }

  // ── Projets ──
  function createProject() {
    const title = newTitle.trim();
    if (!title) return;
    const proj = {
      id: `p_${uid()}`,
      title,
      description: '',
      status: 'idee',
      color: PROJECT_COLORS[data.projects.length % PROJECT_COLORS.length],
      tasks: [],
      linkedItems: [],
      history: [{
        date: todayStr(),
        done: 0,
        total: 0
      }],
      createdAt: Date.now(),
      hermes: {
        xp: 0,
        streak: 0,
        lastActivityDate: null,
        sessions: [],
        pendingQuestion: null
      }
    };
    const next = {
      ...data,
      projects: [...data.projects, proj]
    };
    persist(next);
    setNewTitle('');
    setCreating(false);
    setSelectedId(proj.id);
    toast?.('Projet créé');
  }
  function updateProject(id, changes) {
    persist({
      ...data,
      projects: data.projects.map(p => p.id === id ? {
        ...p,
        ...changes
      } : p)
    });
  }
  function deleteProject(id) {
    if (!confirm('Supprimer définitivement ce projet et ses tâches ?')) return;
    persist({
      ...data,
      projects: data.projects.filter(p => p.id !== id)
    });
    if (selectedId === id) setSelectedId(null);
    toast?.('Projet supprimé');
  }

  // ── Tâches ──
  function addTask(projectId) {
    const text = newTask.trim();
    if (!text) return;
    const proj = data.projects.find(p => p.id === projectId);
    if (!proj) return;
    const task = {
      id: `t_${uid()}`,
      text,
      done: false,
      createdAt: Date.now()
    };
    const tasks = [...(proj.tasks || []), task];
    updateProject(projectId, {
      tasks,
      history: snapshotHistory(proj.history, tasks)
    });
    setNewTask('');
    newTaskRef.current?.focus();
  }
  function toggleTask(projectId, taskId) {
    const proj = data.projects.find(p => p.id === projectId);
    if (!proj) return;
    const target = (proj.tasks || []).find(t => t.id === taskId);
    const wasUndone = target && !target.done; // about to be marked done
    const tasks = (proj.tasks || []).map(t => t.id === taskId ? {
      ...t,
      done: !t.done,
      doneAt: !t.done ? Date.now() : null
    } : t);
    // +5 XP quand une tâche est cochée
    const hermes = proj.hermes || {
      xp: 0,
      streak: 0,
      lastActivityDate: null,
      sessions: [],
      pendingQuestion: null
    };
    const newHermes = wasUndone ? {
      ...hermes,
      xp: hermes.xp + 5
    } : hermes;
    updateProject(projectId, {
      tasks,
      history: snapshotHistory(proj.history, tasks),
      hermes: newHermes
    });
  }
  function deleteTask(projectId, taskId) {
    const proj = data.projects.find(p => p.id === projectId);
    if (!proj) return;
    const tasks = (proj.tasks || []).filter(t => t.id !== taskId);
    updateProject(projectId, {
      tasks,
      history: snapshotHistory(proj.history, tasks)
    });
  }
  function linkItem(projectId, itemId) {
    const proj = data.projects.find(p => p.id === projectId);
    if (!proj) return;
    const current = proj.linkedItems || [];
    const linkedItems = current.includes(itemId) ? current.filter(i => i !== itemId) : [...current, itemId];
    updateProject(projectId, {
      linkedItems
    });
    toast?.(current.includes(itemId) ? 'Source déliée' : 'Source liée');
  }

  // ── Rendu ──
  const allProjects = data.projects;
  const filtered = filterStatus === 'all' ? allProjects : allProjects.filter(p => p.status === filterStatus);
  const selected = allProjects.find(p => p.id === selectedId);
  const pct = selected ? computeProgress(selected) : 0;
  const selStatus = selected ? STATUSES.find(s => s.id === selected.status) : null;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head-label"
  }, "Phase 07 \xB7 Projets"), /*#__PURE__*/React.createElement("h1", null, "De la veille ", /*#__PURE__*/React.createElement("em", null, "aux productions")), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Relie chaque signal qualifi\xE9 \xE0 un projet, d\xE9compose en t\xE2ches concr\xE8tes, visualise la progression dans le temps. Stock\xE9 localement \u2014 aucune synchronisation, aucun tracking.")), /*#__PURE__*/React.createElement("div", {
    className: "tr-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tr-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tr-filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: `tr-filter-btn ${filterStatus === 'all' ? 'on' : ''}`,
    onClick: () => setFilterStatus('all')
  }, "Tous ", /*#__PURE__*/React.createElement("span", {
    className: "tr-badge"
  }, allProjects.length)), STATUSES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: `tr-filter-btn ${filterStatus === s.id ? 'on' : ''}`,
    onClick: () => setFilterStatus(s.id)
  }, s.label, " ", /*#__PURE__*/React.createElement("span", {
    className: "tr-badge"
  }, allProjects.filter(p => p.status === s.id).length)))), creating ? /*#__PURE__*/React.createElement("div", {
    className: "tr-new-form"
  }, /*#__PURE__*/React.createElement("input", {
    ref: newTitleRef,
    className: "tr-input",
    autoFocus: true,
    placeholder: "Titre du projet\u2026",
    value: newTitle,
    onChange: e => setNewTitle(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') createProject();
      if (e.key === 'Escape') {
        setCreating(false);
        setNewTitle('');
      }
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm",
    onClick: createProject
  }, "Cr\xE9er"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    onClick: () => {
      setCreating(false);
      setNewTitle('');
    }
  }, "Annuler"))) : /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm tr-create-btn",
    onClick: () => setCreating(true)
  }, "+ Nouveau projet"), /*#__PURE__*/React.createElement("div", {
    className: "tr-project-list"
  }, filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty small dim",
    style: {
      padding: '20px 0'
    }
  }, allProjects.length === 0 ? 'Crée ton premier projet.' : 'Aucun projet dans ce statut.'), filtered.map(proj => {
    const p = computeProgress(proj);
    const st = STATUSES.find(s => s.id === proj.status);
    const taskDone = (proj.tasks || []).filter(t => t.done).length;
    const taskTotal = (proj.tasks || []).length;
    return /*#__PURE__*/React.createElement("button", {
      key: proj.id,
      className: `tr-project-card ${selectedId === proj.id ? 'on' : ''}`,
      onClick: () => setSelectedId(proj.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "tr-project-card-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tr-project-dot",
      style: {
        background: proj.color
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "tr-project-title"
    }, proj.title), /*#__PURE__*/React.createElement("span", {
      className: "tr-status-badge",
      style: {
        color: st?.color,
        background: st?.bg
      }
    }, st?.label)), /*#__PURE__*/React.createElement("div", {
      className: "tr-project-meta mono"
    }, /*#__PURE__*/React.createElement("span", null, taskDone, "/", taskTotal, " t\xE2ches \xB7 ", proj.linkedItems?.length || 0, " source", (proj.linkedItems?.length || 0) !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--green)',
        fontWeight: 600
      }
    }, p, "%")), /*#__PURE__*/React.createElement("div", {
      className: "tr-mini-bar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tr-mini-bar-fill",
      style: {
        width: p + '%',
        background: proj.color
      }
    })));
  }))), selected ? /*#__PURE__*/React.createElement("div", {
    className: "tr-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tr-detail-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tr-project-dot lg",
    style: {
      background: selected.color
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "tr-detail-title-block"
  }, /*#__PURE__*/React.createElement("input", {
    className: "tr-title-input",
    value: selected.title,
    onChange: e => updateProject(selected.id, {
      title: e.target.value
    }),
    placeholder: "Titre du projet"
  }), /*#__PURE__*/React.createElement("textarea", {
    className: "tr-desc-input",
    placeholder: "Description (optionnel) : enjeux, audience, deadline\u2026",
    value: selected.description || '',
    onChange: e => updateProject(selected.id, {
      description: e.target.value
    }),
    rows: 2
  })), /*#__PURE__*/React.createElement("div", {
    className: "tr-detail-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tr-status-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      color: 'var(--muted)',
      letterSpacing: 1
    }
  }, "STATUT"), /*#__PURE__*/React.createElement("div", {
    className: "tr-status-btns"
  }, STATUSES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: `tr-status-opt ${selected.status === s.id ? 'on' : ''}`,
    style: selected.status === s.id ? {
      color: s.color,
      borderColor: s.color,
      background: s.bg
    } : {},
    onClick: () => updateProject(selected.id, {
      status: s.id
    })
  }, s.label)))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost btn-sm",
    style: {
      color: 'var(--red)',
      marginTop: 8,
      alignSelf: 'flex-start'
    },
    onClick: () => deleteProject(selected.id)
  }, "Supprimer le projet"))), /*#__PURE__*/React.createElement("div", {
    className: "tr-progress-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tr-progress-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, "Progression"), /*#__PURE__*/React.createElement("span", {
    className: "mono small",
    style: {
      color: selected.color,
      fontWeight: 700
    }
  }, (selected.tasks || []).filter(t => t.done).length, " / ", (selected.tasks || []).length, " t\xE2ches \xB7 ", pct, "%")), /*#__PURE__*/React.createElement("div", {
    className: "tr-progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tr-progress-fill",
    style: {
      width: pct + '%',
      background: selected.color,
      transition: 'width 0.3s'
    }
  })), /*#__PURE__*/React.createElement(ProgressGraph, {
    history: selected.history || [],
    color: selected.color
  })), /*#__PURE__*/React.createElement("div", {
    className: "tr-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tr-section-label mono small muted"
  }, "T\xE2ches"), /*#__PURE__*/React.createElement("div", {
    className: "tr-tasks"
  }, (!selected.tasks || selected.tasks.length === 0) && /*#__PURE__*/React.createElement("div", {
    className: "small dim",
    style: {
      paddingBottom: 10
    }
  }, "Aucune t\xE2che. D\xE9compose ton projet en \xE9tapes concr\xE8tes."), (selected.tasks || []).map(task => /*#__PURE__*/React.createElement("div", {
    key: task.id,
    className: `tr-task ${task.done ? 'done' : ''}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "tr-task-check",
    onClick: () => toggleTask(selected.id, task.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "tr-task-check-inner"
  }, task.done ? '✓' : '')), /*#__PURE__*/React.createElement("span", {
    className: "tr-task-text"
  }, task.text), /*#__PURE__*/React.createElement("button", {
    className: "tr-task-del",
    title: "Supprimer",
    onClick: () => deleteTask(selected.id, task.id)
  }, "\xD7")))), /*#__PURE__*/React.createElement("div", {
    className: "tr-add-task"
  }, /*#__PURE__*/React.createElement("input", {
    ref: newTaskRef,
    className: "tr-input",
    placeholder: "Nouvelle t\xE2che\u2026 (Entr\xE9e pour ajouter)",
    value: newTask,
    onChange: e => setNewTask(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') addTask(selected.id);
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm",
    onClick: () => addTask(selected.id)
  }, "Ajouter"))), /*#__PURE__*/React.createElement("div", {
    className: "tr-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tr-section-label mono small muted"
  }, "Sources li\xE9es", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      color: 'var(--muted)',
      fontWeight: 400
    }
  }, "\u2014 depuis tes contenus qualifi\xE9s en Phase 04")), /*#__PURE__*/React.createElement(LinkedItemsPanel, {
    projectId: selected.id,
    allItems: items,
    linkedIds: selected.linkedItems || [],
    onLink: linkItem
  })), /*#__PURE__*/React.createElement(HermesPanel, {
    project: selected,
    allItems: items,
    toast: toast,
    onUpdate: changes => updateProject(selected.id, changes)
  })) : /*#__PURE__*/React.createElement("div", {
    className: "tr-detail tr-detail-empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-title",
    style: {
      marginBottom: 8
    }
  }, allProjects.length === 0 ? 'Crée ton premier projet pour commencer.' : 'Sélectionne un projet dans la liste.'), /*#__PURE__*/React.createElement("p", {
    className: "small dim",
    style: {
      maxWidth: 320,
      lineHeight: 1.6
    }
  }, "Chaque projet regroupe des t\xE2ches concr\xE8tes et des sources issues de ta veille. Tout est stock\xE9 dans ", /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "lf-tracker-v1"), " \u2014 local, aucune fuite."))));
}
Object.assign(window, {
  TrackerView
});