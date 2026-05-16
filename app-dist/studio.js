// studio.jsx — Phase 06 : Studio — carte mentale, storyboard, infographie

const {
  useState: useStateS,
  useMemo: useMemoS,
  useRef: useRefS
} = React;

// ─── Mind map mockup (carte mentale) ──────────────────────────────────
function MindMap({
  items,
  ctx,
  toast
}) {
  const svgRef = useRefS(null);
  const done = items.filter(i => i.result).slice(0, 24);
  const byBloc = {};
  ctx.blocs.forEach(b => {
    byBloc[b.id] = [];
  });
  done.forEach(i => {
    if (byBloc[i.result.bloc_id]) byBloc[i.result.bloc_id].push(i);
  });

  // SVG layout — radial, 6 sectors
  const cx = 360,
    cy = 280,
    R = 220;
  const blocs = ctx.blocs;
  return /*#__PURE__*/React.createElement("div", {
    className: "studio-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "studio-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Carte mentale : rayonnement par bloc"), /*#__PURE__*/React.createElement("p", {
    className: "dim small"
  }, "Vue radiale automatique de tes contenus qualifi\xE9s. Les rayons indiquent le nombre de signaux par bloc.")), /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, done.length, " signaux mapp\xE9s")), /*#__PURE__*/React.createElement("svg", {
    ref: svgRef,
    viewBox: "0 0 720 560",
    className: "mindmap-svg",
    preserveAspectRatio: "xMidYMid meet"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: R,
    className: "mm-ring"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: R * 0.66,
    className: "mm-ring"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: R * 0.33,
    className: "mm-ring"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: 36,
    className: "mm-core"
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy - 3,
    textAnchor: "middle",
    className: "mm-core-label"
  }, "Le"), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + 12,
    textAnchor: "middle",
    className: "mm-core-label-em"
  }, "Filtre"), blocs.map((b, idx) => {
    const angle = idx / blocs.length * Math.PI * 2 - Math.PI / 2;
    const bx = cx + Math.cos(angle) * R;
    const by = cy + Math.sin(angle) * R;
    const blocItems = byBloc[b.id] || [];
    const count = blocItems.length;
    const size = 24 + Math.min(count, 6) * 6;
    return /*#__PURE__*/React.createElement("g", {
      key: b.id
    }, /*#__PURE__*/React.createElement("line", {
      x1: cx,
      y1: cy,
      x2: bx,
      y2: by,
      className: `mm-ray mm-${b.id}`
    }), /*#__PURE__*/React.createElement("circle", {
      cx: bx,
      cy: by,
      r: size,
      className: `mm-node mm-${b.id}`
    }), /*#__PURE__*/React.createElement("text", {
      x: bx,
      y: by - 2,
      textAnchor: "middle",
      className: "mm-node-label"
    }, b.code), /*#__PURE__*/React.createElement("text", {
      x: bx,
      y: by + 13,
      textAnchor: "middle",
      className: "mm-node-count"
    }, count), blocItems.slice(0, 3).map((it, k) => {
      const sub = angle + (k - 1) * 0.22;
      const sx = bx + Math.cos(sub) * 80;
      const sy = by + Math.sin(sub) * 80;
      return /*#__PURE__*/React.createElement("g", {
        key: it.id
      }, /*#__PURE__*/React.createElement("line", {
        x1: bx,
        y1: by,
        x2: sx,
        y2: sy,
        className: "mm-link"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: sx,
        cy: sy,
        r: 6,
        className: `mm-sat mm-${b.id}`
      }));
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "mm-legend"
  }, blocs.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.id,
    className: "mm-leg-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: `bloc-dot dot-${b.id}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "small"
  }, b.code, " \xB7 ", b.theme)))), /*#__PURE__*/React.createElement("div", {
    className: "studio-card-actions"
  }, /*#__PURE__*/React.createElement("span", {
    className: "small dim"
  }, "Le geste reste manuel : exporte le squelette, compl\xE8te \xE0 la main, dessine les liens qui ne se voient pas ici."), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: () => {
      const svg = svgRef.current;
      if (!svg) return;
      const blob = new Blob([window.svgString(svg)], {
        type: "image/svg+xml;charset=utf-8"
      });
      window.downloadBlob(blob, `mindmap-${new Date().toISOString().slice(0, 10)}.svg`);
      toast?.("SVG téléchargé · ouvre dans Canva / Illustrator / Figma");
    }
  }, "\u2398 Copier le SVG"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: async () => {
      const svg = svgRef.current;
      if (!svg) return;
      try {
        const blob = await window.svgToPng(svg, 2);
        window.downloadBlob(blob, `mindmap-${new Date().toISOString().slice(0, 10)}.png`);
        toast?.("PNG téléchargé");
      } catch (e) {
        toast?.("Échec export PNG : " + e.message);
      }
    }
  }, "\u2193 Exporter PNG")));
}

// ─── Storyboard mockup ────────────────────────────────────────────────
function Storyboard({
  items,
  ctx,
  level,
  setLevel,
  toast
}) {
  const top = items.filter(i => i.result).sort((a, b) => (b.result.score || 0) - (a.result.score || 0)).slice(0, 6);
  const levels = ["débutant", "intermédiaire", "avancé"];
  return /*#__PURE__*/React.createElement("div", {
    className: "studio-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "studio-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Storyboard : squelette de production"), /*#__PURE__*/React.createElement("p", {
    className: "dim small"
  }, "Auto-g\xE9n\xE9r\xE9 depuis tes signaux les mieux scor\xE9s. \xC0 toi de dessiner les vignettes, choisir le ton, monter.")), /*#__PURE__*/React.createElement("div", {
    className: "level-switch"
  }, /*#__PURE__*/React.createElement("span", {
    className: "small muted mono"
  }, "Niveau\xA0:"), levels.map(l => /*#__PURE__*/React.createElement("button", {
    key: l,
    className: `level-btn ${level === l ? "on" : ""}`,
    onClick: () => setLevel(l)
  }, l)))), /*#__PURE__*/React.createElement("div", {
    className: "storyboard-track"
  }, top.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty",
    style: {
      padding: "40px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-title"
  }, "Pas encore de signaux \xE0 monter."), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, "Reviens quand au moins 3 contenus sont qualifi\xE9s.")), top.map((it, i) => {
    const blocs = ctx.blocs.find(b => b.id === it.result.bloc_id);
    return /*#__PURE__*/React.createElement("div", {
      key: it.id,
      className: "storyboard-cell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sb-thumb"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sb-num"
    }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("div", {
      className: "sb-placeholder",
      "aria-label": "zone visuel \xE0 dessiner"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono small"
    }, "[visuel \xB7 ", level, "]"))), /*#__PURE__*/React.createElement("div", {
      className: "sb-meta"
    }, blocs && /*#__PURE__*/React.createElement(window.BlocChip, {
      blocId: blocs.id
    }), /*#__PURE__*/React.createElement(window.ScorePill, {
      score: it.result.score
    })), /*#__PURE__*/React.createElement("div", {
      className: "sb-title"
    }, it.result.title), /*#__PURE__*/React.createElement("div", {
      className: "sb-narration"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sb-label"
    }, "Voix-off / accroche"), /*#__PURE__*/React.createElement("div", {
      className: "sb-text"
    }, it.result.summary?.slice(0, 110), "\u2026")), it.result.angle_editorial && /*#__PURE__*/React.createElement("div", {
      className: "sb-angle"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sb-label"
    }, "Angle"), /*#__PURE__*/React.createElement("div", {
      className: "sb-text",
      style: {
        fontStyle: "italic"
      }
    }, it.result.angle_editorial)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "studio-card-actions"
  }, /*#__PURE__*/React.createElement("span", {
    className: "small dim"
  }, "Niveau ", /*#__PURE__*/React.createElement("strong", {
    className: "cream"
  }, level), " : la complexit\xE9 narrative s'adapte au lecteur. Toujours laisser visibles : sources, doutes, m\xE9thode."), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: () => {
      const md = [`# Storyboard · niveau ${level}`, `_Généré le ${new Date().toLocaleString("fr-FR")}_`, "", ...top.map((it, i) => {
        const blocs = ctx.blocs.find(b => b.id === it.result.bloc_id);
        return [`## ${String(i + 1).padStart(2, "0")} · ${it.result.title}`, `**Bloc** : ${blocs?.code} · ${blocs?.theme || ""} · **Score** : ${it.result.score}/100`, "", `### Voix-off / accroche`, it.result.summary || "", "", it.result.angle_editorial ? `### Angle\n_${it.result.angle_editorial}_` : "", "", `### Visuel à dessiner — niveau ${level}`, `_[ à compléter à la main ]_`, "\n---\n"].filter(Boolean).join("\n");
      })].join("\n");
      navigator.clipboard.writeText(md);
      toast?.("Squelette storyboard copié en markdown");
    }
  }, "\u2398 Copier le squelette MD")));
}

// ─── Infographie ─────────────────────────────────────────────────────
function Infographic({
  items,
  ctx,
  gardefous,
  toast
}) {
  const sheetRef = useRefS(null);
  const [titleEdit, setTitleEdit] = useStateS("Ce que la semaine nous a dit");
  const done = items.filter(i => i.result);

  // Distribution par bloc
  const byBloc = {};
  ctx.blocs.forEach(b => {
    byBloc[b.id] = [];
  });
  done.forEach(i => {
    if (byBloc[i.result.bloc_id]) byBloc[i.result.bloc_id].push(i);
  });
  const max = Math.max(1, ...Object.values(byBloc).map(a => a.length));

  // Top 3 sources (score le plus élevé)
  const top3 = [...done].sort((a, b) => (b.result.score || 0) - (a.result.score || 0)).slice(0, 3);

  // Top 5 termes récurrents via extractTermsFromItems (réutilise le même algo que le cluster)
  const topTerms = (() => {
    try {
      const {
        terms
      } = window.extractTermsFromItems ? window.extractTermsFromItems(done, {
        minDocFreq: 2,
        topN: 5
      }) : {
        terms: []
      };
      return terms.slice(0, 5);
    } catch {
      return [];
    }
  })();

  // Bloc dominant
  const blocTotals = {};
  done.forEach(i => {
    blocTotals[i.result.bloc_id] = (blocTotals[i.result.bloc_id] || 0) + 1;
  });
  const topBlocEntry = Object.entries(blocTotals).sort((a, b) => b[1] - a[1])[0];
  const topBlocDef = topBlocEntry ? ctx.blocs.find(b => b.id === topBlocEntry[0]) : null;
  function copyMarkdown() {
    const md = [`# ${titleEdit}`, `*${new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })} · Le Filtre v0.2*`, ``, `## Distribution par bloc`, ...ctx.blocs.map(b => {
      const n = byBloc[b.id]?.length || 0;
      if (n === 0) return null;
      return `- **${b.code} ${b.theme.split("/")[0].trim()}** : ${n} signal${n > 1 ? "s" : ""}`;
    }).filter(Boolean), ``, topTerms.length ? `## Termes récurrents\n${topTerms.map(t => `- ${t.term} (${t.freq} sources)`).join("\n")}` : "", ``, top3.length ? `## Sources pivot (top scores)\n${top3.map((it, i) => `${i + 1}. **${it.result.title}** — score ${it.result.score}/100`).join("\n")}` : "", ``, gardefous[0] ? `## Garde-fou\n> ${gardefous[0].title}. ${gardefous[0].body}` : ""].filter(l => l !== null).join("\n");
    navigator.clipboard.writeText(md);
    toast?.("Synthèse copiée en Markdown");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "studio-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "studio-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Infographie : gabarit de partage"), /*#__PURE__*/React.createElement("p", {
    className: "dim small"
  }, "Format A4 \xE9ditable. Personnalise le titre, exporte en PDF ou copie le Markdown.")), /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, "Format A4 \xB7 sobre")), /*#__PURE__*/React.createElement("div", {
    className: "info-sheet",
    ref: sheetRef
  }, /*#__PURE__*/React.createElement("header", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-eyebrow"
  }, "Le Filtre \xB7 synth\xE8se"), /*#__PURE__*/React.createElement("div", {
    className: "info-title",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: e => setTitleEdit(e.target.innerText),
    style: {
      outline: "none",
      cursor: "text",
      borderBottom: "1px dashed rgba(95,168,79,0.3)"
    },
    title: "Clique pour modifier le titre"
  }, titleEdit), /*#__PURE__*/React.createElement("div", {
    className: "info-date small mono dim"
  }, new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })), topBlocDef && /*#__PURE__*/React.createElement("div", {
    className: "info-dominant"
  }, /*#__PURE__*/React.createElement("span", {
    className: `bloc-dot dot-${topBlocDef.id}`,
    style: {
      marginRight: 6
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "small"
  }, "Bloc dominant : ", /*#__PURE__*/React.createElement("strong", null, topBlocDef.code, " \xB7 ", topBlocDef.theme.split("/")[0].trim())), /*#__PURE__*/React.createElement("span", {
    className: "mono small muted",
    style: {
      marginLeft: 8
    }
  }, done.length, " signaux qualifi\xE9s"))), /*#__PURE__*/React.createElement("div", {
    className: "info-cols"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-col-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-section-label"
  }, "\xB7 Distribution par bloc"), ctx.blocs.map(b => {
    const n = byBloc[b.id]?.length || 0;
    const w = n / max * 100;
    return /*#__PURE__*/React.createElement("div", {
      key: b.id,
      className: "info-bar-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "info-bar-name"
    }, /*#__PURE__*/React.createElement("span", {
      className: `bloc-dot dot-${b.id}`
    }), /*#__PURE__*/React.createElement("span", {
      className: "small"
    }, b.code, " \xB7 ", b.theme.split("/")[0].trim())), /*#__PURE__*/React.createElement("div", {
      className: "info-bar-track"
    }, /*#__PURE__*/React.createElement("div", {
      className: `info-bar-fill bg-${b.id}`,
      style: {
        width: w + "%"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "info-bar-count mono small"
    }, n));
  })), /*#__PURE__*/React.createElement("div", {
    className: "info-col-side"
  }, topTerms.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-section-label"
  }, "\xB7 Termes r\xE9currents"), /*#__PURE__*/React.createElement("div", {
    className: "info-terms"
  }, topTerms.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: t.term,
    className: "info-term-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "info-term-rank mono small muted"
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    className: "small",
    style: {
      fontWeight: i === 0 ? 600 : 400
    }
  }, t.term), /*#__PURE__*/React.createElement("span", {
    className: "info-term-freq mono small muted"
  }, t.freq, "\xD7"))))), top3.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "info-section-label"
  }, "\xB7 Sources pivot"), top3.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "info-source-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: `bloc-dot dot-${it.result.bloc_id}`,
    style: {
      flexShrink: 0,
      marginTop: 3
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "small",
    style: {
      fontWeight: 500,
      lineHeight: 1.3
    }
  }, it.result.title), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--text-dim)",
      marginTop: 2
    }
  }, "score ", it.result.score, "/100"))))))), /*#__PURE__*/React.createElement("div", {
    className: "info-callout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-section-label"
  }, "\xB7 Garde-fou de la semaine"), /*#__PURE__*/React.createElement("div", {
    className: "info-callout-body"
  }, gardefous[0] && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "info-callout-mark"
  }, gardefous[0].icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "cream"
  }, gardefous[0].title, "."), " ", /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, gardefous[0].body))))), (() => {
    const angles = done.filter(i => i.result?.angle_editorial).slice(0, 4);
    if (!angles.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "14px 20px",
        borderTop: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "info-section-label"
    }, "\xB7 Angles \xE9ditoriaux \xE0 creuser"), angles.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: it.id,
      style: {
        display: "flex",
        gap: 8,
        marginTop: 8,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: `bloc-dot dot-${it.result.bloc_id}`,
      style: {
        flexShrink: 0,
        marginTop: 4
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "small",
      style: {
        fontStyle: "italic",
        color: "var(--green)",
        lineHeight: 1.4
      }
    }, it.result.angle_editorial), it.result.format_potentiel?.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: "var(--text-dim)",
        marginTop: 3
      }
    }, "\u2192 ", it.result.format_potentiel.join(" · "))))));
  })(), (() => {
    const allQ = [];
    done.forEach(it => (it.result?.questions_ouvertes || []).slice(0, 1).forEach(q => allQ.push(q)));
    if (!allQ.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "14px 20px",
        borderTop: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "info-section-label"
    }, "\xB7 Questions qui restent ouvertes"), allQ.slice(0, 4).map((q, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "small",
      style: {
        marginTop: 6,
        paddingLeft: 14,
        position: "relative",
        color: "var(--text-dim)",
        lineHeight: 1.5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        color: "var(--gold)"
      }
    }, "?"), q)));
  })(), /*#__PURE__*/React.createElement("div", {
    className: "info-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, "Le Filtre \xB7 v0.2 \xB7 local-first \xB7 ", done.length, " signaux qualifi\xE9s"), /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, "\xC0 compl\xE9ter \xE0 la main \u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "studio-card-actions"
  }, /*#__PURE__*/React.createElement("span", {
    className: "small dim"
  }, "Le squelette est pr\xEAt. La mise en image (illustration, dessin, photo sobre) reste ton geste."), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: copyMarkdown
  }, "\u2398 Copier Markdown"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: () => {
      window.print();
      toast?.("Boîte d'impression ouverte : choisir « Enregistrer en PDF »");
    }
  }, "\u2193 PDF")));
}

// ─── Lecture Active (méthode 3 étapes) ───────────────────────────────
const LECTURES_KEY = 'lf-lectures-v1';
function loadLectures() {
  try {
    return JSON.parse(localStorage.getItem(LECTURES_KEY)) || {};
  } catch {
    return {};
  }
}
function saveLectures(data) {
  try {
    localStorage.setItem(LECTURES_KEY, JSON.stringify(data));
  } catch {}
}
const LA_USAGES = [{
  id: 'enseigner',
  label: 'Enseigner',
  icon: '◦',
  desc: "expliquer à quelqu'un"
}, {
  id: 'experimenter',
  label: 'Expérimenter',
  icon: '◉',
  desc: 'appliquer à un vrai problème'
}, {
  id: 'contenu',
  label: 'Créer du contenu',
  icon: '▲',
  desc: 'article, vidéo, thread, note'
}, {
  id: 'documenter',
  label: 'Documenter',
  icon: '▣',
  desc: "noter là où je l'utiliserai"
}];
function LectureActive({
  items,
  ctx,
  toast
}) {
  const done = items.filter(i => i.result);
  const [selectedId, setSelectedId] = useStateS(done[0]?.id || null);
  const [lectures, setLectures] = useStateS(() => loadLectures());
  const selected = done.find(i => i.id === selectedId);
  const emptyNote = {
    etape1: '',
    extrait: '',
    paraphrase: '',
    reaction: '',
    usages: [],
    usageNotes: ''
  };
  const note = lectures[selectedId] || emptyNote;
  function updateNote(field, value) {
    const updated = {
      ...lectures,
      [selectedId]: {
        ...(lectures[selectedId] || emptyNote),
        [field]: value
      }
    };
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
    const md = [`# Lecture Active : ${selected.result.title}`, `_${new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })} · Le Filtre v0.2_`, ``, `## Étape 1 · Ancrage`, n.etape1 || '—', ``, `## Étape 2 · Extraction`, ``, `**Extrait exact**`, `> ${(n.extrait || '—').replace(/\n/g, '\n> ')}`, ``, `**En mes mots**`, n.paraphrase || '—', ``, `**Ma réaction**`, n.reaction || '—', ``, `## Étape 3 · Usage`, `**Modes choisis :** ${(n.usages || []).map(u => LA_USAGES.find(x => x.id === u)?.label || u).join(', ') || '—'}`, n.usageNotes ? `\n${n.usageNotes}` : ''].filter(l => l !== null).join('\n');
    navigator.clipboard.writeText(md);
    toast?.('Note Lecture Active copiée en Markdown');
  }
  const completedCount = done.filter(i => isComplete(i.id)).length;
  return /*#__PURE__*/React.createElement("div", {
    className: "studio-card la-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "studio-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Lecture Active"), /*#__PURE__*/React.createElement("p", {
    className: "dim small"
  }, "M\xE9thode 3 \xE9tapes : ancrer ce qui accroche \u2192 extraire et reformuler \u2192 d\xE9cider comment l'utiliser. Chaque note produit un bloc Markdown exportable.")), /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, done.length, " signaux \xB7 ", completedCount, " not\xE9", completedCount > 1 ? 's' : '')), done.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty",
    style: {
      padding: '40px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-title"
  }, "Aucun contenu qualifi\xE9 disponible."), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, "Reviens apr\xE8s avoir analys\xE9 au moins un item en Phase 03.")) : /*#__PURE__*/React.createElement("div", {
    className: "la-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "la-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "la-sidebar-label mono small muted"
  }, "S\xE9lectionne un contenu"), done.map(it => {
    const done_ = isComplete(it.id);
    const bloc = ctx.blocs.find(b => b.id === it.result.bloc_id);
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      className: `la-item ${selectedId === it.id ? 'on' : ''} ${done_ ? 'done' : ''}`,
      onClick: () => setSelectedId(it.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: `bloc-dot dot-${it.result.bloc_id}`,
      style: {
        flexShrink: 0,
        marginTop: 3
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "la-item-text"
    }, /*#__PURE__*/React.createElement("div", {
      className: "small",
      style: {
        fontWeight: 500,
        lineHeight: 1.3
      }
    }, it.result.title), /*#__PURE__*/React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--text-dim)',
        marginTop: 2
      }
    }, bloc?.code, " \xB7 score ", it.result.score, "/100")), done_ && /*#__PURE__*/React.createElement("span", {
      className: "la-check"
    }, "\u2713"));
  })), selected ? /*#__PURE__*/React.createElement("div", {
    className: "la-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "la-item-head"
  }, /*#__PURE__*/React.createElement(window.BlocChip, {
    blocId: selected.result.bloc_id
  }), /*#__PURE__*/React.createElement(window.ScorePill, {
    score: selected.result.score
  }), /*#__PURE__*/React.createElement("span", {
    className: "small dim",
    style: {
      marginLeft: 4,
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, selected.result.title)), /*#__PURE__*/React.createElement("div", {
    className: "la-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "la-step-num"
  }, "1"), /*#__PURE__*/React.createElement("div", {
    className: "la-step-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "la-step-title"
  }, "Ancrage"), /*#__PURE__*/React.createElement("div", {
    className: "la-step-hint dim small"
  }, "Ce qui m'accroche \xB7 ce qui me questionne \xB7 ce qui r\xE9siste. Vite, sans peser les mots."), /*#__PURE__*/React.createElement("textarea", {
    className: "la-textarea",
    rows: 3,
    placeholder: "Note rapide : ce que \xE7a r\xE9veille, ce que \xE7a contredit, une question ouverte\u2026",
    value: note.etape1,
    onChange: e => updateNote('etape1', e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "la-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "la-step-num"
  }, "2"), /*#__PURE__*/React.createElement("div", {
    className: "la-step-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "la-step-title"
  }, "Extraction"), /*#__PURE__*/React.createElement("div", {
    className: "la-step-hint dim small"
  }, "Trois gestes distincts : copier tel quel \u2192 r\xE9\xE9crire avec tes mots \u2192 dire ce que tu en penses."), /*#__PURE__*/React.createElement("div", {
    className: "la-field-label mono small"
  }, "Extrait exact *"), /*#__PURE__*/React.createElement("textarea", {
    className: "la-textarea",
    rows: 3,
    placeholder: "Copie le passage qui t'a frapp\xE9, mot pour mot. L'exactitude oblige l'attention.",
    value: note.extrait,
    onChange: e => updateNote('extrait', e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "la-field-label mono small",
    style: {
      marginTop: 12
    }
  }, "En mes mots *"), /*#__PURE__*/React.createElement("textarea", {
    className: "la-textarea",
    rows: 3,
    placeholder: "Reformule ce que l'auteur dit \u2014 sans reprendre son vocabulaire. C'est la preuve que tu as compris.",
    value: note.paraphrase,
    onChange: e => updateNote('paraphrase', e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "la-field-label mono small",
    style: {
      marginTop: 12
    }
  }, "Ma r\xE9action *"), /*#__PURE__*/React.createElement("textarea", {
    className: "la-textarea",
    rows: 2,
    placeholder: "Tu es d'accord ? Tu r\xE9sistes ? Il manque quelque chose ? Laisse parler ton instinct \xE9ditorial.",
    value: note.reaction,
    onChange: e => updateNote('reaction', e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "la-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "la-step-num"
  }, "3"), /*#__PURE__*/React.createElement("div", {
    className: "la-step-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "la-step-title"
  }, "Usage"), /*#__PURE__*/React.createElement("div", {
    className: "la-step-hint dim small"
  }, "L'info qui reste dans le carnet reste de la trivia. Choisis au moins un mode d'int\xE9gration."), /*#__PURE__*/React.createElement("div", {
    className: "la-usages"
  }, LA_USAGES.map(u => /*#__PURE__*/React.createElement("button", {
    key: u.id,
    className: `la-usage-btn ${(note.usages || []).includes(u.id) ? 'on' : ''}`,
    onClick: () => toggleUsage(u.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "la-usage-icon"
  }, u.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "small",
    style: {
      fontWeight: 500
    }
  }, u.label), /*#__PURE__*/React.createElement("div", {
    className: "la-usage-desc"
  }, u.desc))))), /*#__PURE__*/React.createElement("div", {
    className: "la-field-label mono small",
    style: {
      marginTop: 12
    }
  }, "O\xF9 et comment"), /*#__PURE__*/React.createElement("textarea", {
    className: "la-textarea",
    rows: 2,
    placeholder: "Contexte pr\xE9cis : quel projet, quel atelier, quelle prise de parole ? Sois sp\xE9cifique.",
    value: note.usageNotes,
    onChange: e => updateNote('usageNotes', e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "studio-card-actions",
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "small dim"
  }, isComplete(selectedId) ? '✓ Note complète. Exporte-la ou passe au contenu suivant.' : '* Complète les champs marqués pour ancrer durablement.'), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: exportMarkdown
  }, "\u2398 Copier Markdown"))) : /*#__PURE__*/React.createElement("div", {
    className: "la-form la-empty-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-title"
  }, "S\xE9lectionne un contenu \xE0 gauche."))));
}

// ─── Schéma actif (Infographie actionnable) ──────────────────────────
const SCHEMA_TYPES = [{
  id: 'flowchart',
  label: 'Flux',
  glyph: '⟶',
  desc: 'Connexions & dépendances entre idées'
}, {
  id: 'mindmap',
  label: 'Carte',
  glyph: '◎',
  desc: 'Concept central + ramifications'
}, {
  id: 'quadrant',
  label: 'Quadrant',
  glyph: '⊞',
  desc: 'Classement selon 2 axes'
}, {
  id: 'timeline',
  label: 'Timeline',
  glyph: '⌛',
  desc: 'Progression / évolution'
}, {
  id: 'tableau',
  label: 'Tableau',
  glyph: '▦',
  desc: 'Comparaison structurée source par source'
}];
let _mermaidReady = false;
function ensureMermaid() {
  if (!_mermaidReady && window.mermaid) {
    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#d8e2c4',
          primaryTextColor: '#2a2418',
          primaryBorderColor: '#4a7a3e',
          lineColor: '#5a5040',
          background: '#faf5e9',
          edgeLabelBackground: '#f4eee2',
          tertiaryColor: '#f1ead8',
          fontSize: '14px'
        }
      });
    } catch {}
    _mermaidReady = true;
  }
}
function SchemaActif({
  items,
  ctx,
  toast
}) {
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
      if (next.has(id)) next.delete(id);else next.add(id);
      return next;
    });
  }
  const selectAll = () => setSel(new Set(done.map(i => i.id)));
  const clearSel = () => setSel(new Set());
  async function renderMermaid(code) {
    ensureMermaid();
    if (!window.mermaid) {
      toast?.('Mermaid.js non disponible');
      return false;
    }
    try {
      const uid = 'ms_' + Date.now();
      const {
        svg
      } = await window.mermaid.render(uid, code);
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
    if (selectedItems.length === 0) {
      toast?.('Sélectionne au moins un article');
      return;
    }
    setIsGenerating(true);
    setSvgOutput('');
    setHasError(false);
    const itemsBlock = selectedItems.map(it => [`### ${it.result.title} [${it.result.bloc_id} · ${it.result.score}/100]`, it.result.summary || '', it.result.verbatim_cles?.length ? `Verbatims : ${it.result.verbatim_cles.slice(0, 2).join(' | ')}` : '', it.result.questions_ouvertes?.length ? `Questions : ${it.result.questions_ouvertes.slice(0, 2).join(' · ')}` : ''].filter(Boolean).join('\n')).join('\n\n');
    const typeInstr = {
      flowchart: 'un flowchart TD (de haut en bas) montrant les connexions et dépendances entre les idées clés',
      mindmap: 'une mindmap avec le concept central et ses ramifications thématiques principales',
      quadrant: 'un quadrantChart classant les idées selon deux axes pertinents (choisis les axes qui font le plus sens)',
      timeline: 'une timeline montrant la progression ou l\'évolution des idées dans le temps',
      tableau: 'un diagramme de type "block-beta" ou "classDiagram" structurant les idées comme un tableau comparatif entre sources'
    }[schemaType];
    const anglePart = angle ? `\nAngle éditorial / question directrice : "${angle}"` : '';
    const prevPart = isIter && mermaidCode ? `\n\nDiagramme actuel à ajuster :\n${mermaidCode}` : '';
    const iterPart = isIter && iterPrompt ? `\n\nDemande de raffinement : "${iterPrompt}"` : '';
    const prompt = `Tu es un expert en visualisation d'information éditoriale. Génère ${typeInstr}.

CONTEXTE PROJETS :
${ctx.projects.slice(0, 3).map(p => `- ${p.name} : ${p.objective}`).join('\n')}

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
      let code = raw.trim().replace(/^```(?:mermaid)?\s*/i, '').replace(/```\s*$/i, '').trim();
      // Retire tout texte avant le mot-clé Mermaid
      const keywords = ['flowchart', 'mindmap', 'quadrantChart', 'timeline', 'block-beta', 'classDiagram'];
      for (const kw of keywords) {
        const idx = code.indexOf(kw);
        if (idx > 0) {
          code = code.slice(idx);
          break;
        }
      }
      setMermaidCode(code);
      setHistoryLen(n => n + 1);
      const ok = await renderMermaid(code);
      if (!ok) toast?.('Schéma généré — affiche le code pour corriger manuellement');else {
        toast?.('Schéma généré ✓');
        setIterPrompt('');
      }
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
    const blob = new Blob([svgOutput], {
      type: 'image/svg+xml;charset=utf-8'
    });
    window.downloadBlob(blob, `schema-${new Date().toISOString().slice(0, 10)}.svg`);
    toast?.('SVG téléchargé');
  }
  function downloadPng() {
    if (!svgOutput) return;
    const svgBlob = new Blob([svgOutput], {
      type: 'image/svg+xml;charset=utf-8'
    });
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
        window.downloadBlob(blob, `schema-${new Date().toISOString().slice(0, 10)}.png`);
        toast?.('PNG téléchargé (2×)');
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      toast?.('Échec export PNG');
    };
    img.src = url;
  }
  const selCount = sel.size;
  return /*#__PURE__*/React.createElement("div", {
    className: "studio-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "studio-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Sch\xE9ma actif"), /*#__PURE__*/React.createElement("p", {
    className: "dim small"
  }, "S\xE9lectionne des articles qualifi\xE9s, donne un angle, g\xE9n\xE8re un diagramme Mermaid via Claude. It\xE8re jusqu'\xE0 ce que le sch\xE9ma soit exploitable pour une production.")), /*#__PURE__*/React.createElement("span", {
    className: "mono small muted"
  }, done.length, " article", done.length > 1 ? 's' : '', " qualifi\xE9", done.length > 1 ? 's' : '')), done.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty",
    style: {
      padding: '40px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-title"
  }, "Aucun contenu qualifi\xE9 disponible."), /*#__PURE__*/React.createElement("p", {
    className: "small"
  }, "Analyse au moins un article en Phase 03 pour g\xE9n\xE9rer un sch\xE9ma.")) : /*#__PURE__*/React.createElement("div", {
    className: "schema-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "schema-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "schema-col-label mono small muted"
  }, "S\xE9lection \xB7 ", selCount, "/", done.length), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8,
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-inline",
    onClick: selectAll
  }, "Tout"), /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
    className: "btn-inline",
    onClick: clearSel
  }, "Aucun")), /*#__PURE__*/React.createElement("div", {
    className: "schema-item-list"
  }, done.map(it => {
    const bloc = ctx.blocs.find(b => b.id === it.result.bloc_id);
    const on = sel.has(it.id);
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      className: `schema-item ${on ? 'on' : ''}`,
      onClick: () => toggleItem(it.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: `schema-check ${on ? 'on' : ''}`
    }, on ? '✓' : ''), /*#__PURE__*/React.createElement("div", {
      className: "schema-item-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "small",
      style: {
        fontWeight: 500,
        lineHeight: 1.3
      }
    }, it.result.title), /*#__PURE__*/React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 10,
        color: 'var(--text-dim)',
        marginTop: 2
      }
    }, bloc?.code, " \xB7 ", it.result.score, "/100")));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "schema-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "schema-col-label mono small muted"
  }, "Type de sch\xE9ma"), /*#__PURE__*/React.createElement("div", {
    className: "schema-type-row"
  }, SCHEMA_TYPES.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: `schema-type-btn ${schemaType === t.id ? 'on' : ''}`,
    onClick: () => setSchemaType(t.id),
    title: t.desc
  }, /*#__PURE__*/React.createElement("span", {
    className: "schema-type-glyph"
  }, t.glyph), /*#__PURE__*/React.createElement("span", null, t.label)))), /*#__PURE__*/React.createElement("div", {
    className: "schema-col-label mono small muted",
    style: {
      marginTop: 14
    }
  }, "Angle ou question directrice ", /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "(optionnel)")), /*#__PURE__*/React.createElement("textarea", {
    className: "la-textarea",
    rows: 2,
    placeholder: "Ex : comment ces signaux se connectent-ils \xE0 la transition ? Quelles tensions \xE9mergent ?",
    value: angle,
    onChange: e => setAngle(e.target.value),
    style: {
      marginBottom: 12,
      fontSize: 13
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => generate(false),
    disabled: isGenerating || selCount === 0,
    style: {
      width: '100%',
      justifyContent: 'center'
    }
  }, isGenerating ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      animation: 'spin 1s linear infinite'
    }
  }, "\u25CC"), "\xA0 G\xE9n\xE9ration en cours\u2026") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2B21"), " G\xE9n\xE9rer le sch\xE9ma (", selCount, " article", selCount > 1 ? 's' : '', ")")), svgOutput && /*#__PURE__*/React.createElement("div", {
    className: "schema-diagram",
    dangerouslySetInnerHTML: {
      __html: svgOutput
    }
  }), hasError && mermaidCode && /*#__PURE__*/React.createElement("div", {
    className: "schema-error"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono small",
    style: {
      color: 'var(--red)'
    }
  }, "\u26A0 Sch\xE9ma Mermaid invalide."), /*#__PURE__*/React.createElement("button", {
    className: "btn-inline",
    onClick: () => setShowCode(true),
    style: {
      marginLeft: 10
    }
  }, "Voir le code pour corriger")), mermaidCode && !isGenerating && /*#__PURE__*/React.createElement("div", {
    className: "schema-iter-zone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "schema-col-label mono small muted"
  }, "Affiner le sch\xE9ma", historyLen > 1 && /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      marginLeft: 8,
      fontWeight: 400
    }
  }, "\xB7 ", historyLen, " version", historyLen > 1 ? 's' : '')), /*#__PURE__*/React.createElement("div", {
    className: "schema-iter-row"
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "la-textarea",
    rows: 2,
    placeholder: "Ex : simplifie en 5 noeuds \xB7 ajoute les tensions \xB7 reformule en questions \xB7 inverse les axes du quadrant\u2026",
    value: iterPrompt,
    onChange: e => setIterPrompt(e.target.value),
    style: {
      flex: 1,
      fontSize: 13
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => generate(true),
    disabled: isGenerating || !iterPrompt.trim(),
    style: {
      flexShrink: 0
    }
  }, "Affiner \u2192"))), mermaidCode && /*#__PURE__*/React.createElement("div", {
    className: "studio-card-actions",
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: () => setShowCode(v => !v)
  }, showCode ? '▲ Masquer code' : '▼ Éditer code'), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: copyCode
  }, "\u2398 Copier"), svgOutput && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: downloadSvg
  }, "\u2193 SVG"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    onClick: downloadPng
  }, "\u2193 PNG"))), showCode && mermaidCode && /*#__PURE__*/React.createElement("div", {
    className: "schema-code-block"
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "la-textarea mono small",
    style: {
      width: "100%",
      minHeight: 140,
      fontSize: 11,
      fontFamily: "var(--mono)"
    },
    value: mermaidCode,
    onChange: e => setMermaidCode(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost small",
    style: {
      marginTop: 6
    },
    onClick: () => renderMermaid(mermaidCode)
  }, "\u21BA R\xE9-afficher le sch\xE9ma")))));
}

// ─── Studio container ─────────────────────────────────────────────────
function StudioView({
  items,
  ctx,
  gardefous,
  goPrev,
  toast
}) {
  const [tool, setTool] = useStateS("mindmap"); // mindmap | storyboard | infographic | lecture | schema
  const [level, setLevel] = useStateS("intermédiaire");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head-label"
  }, "Phase 06 \xB7 Studio"), /*#__PURE__*/React.createElement("h1", null, "L'IA pr\xE9pare, ", /*#__PURE__*/React.createElement("em", null, "tu cr\xE9es")), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Squelettes de production g\xE9n\xE9r\xE9s depuis ta veille qualifi\xE9e. Cartes mentales, storyboards, infographies : auto-remplis, \xE0 terminer \xE0 la main (", /*#__PURE__*/React.createElement("strong", null, "le geste reste le tien"), "). C'est le geste humain qui rend la production tienne.")), /*#__PURE__*/React.createElement("div", {
    className: "studio-toolbar"
  }, /*#__PURE__*/React.createElement("button", {
    className: `studio-tool ${tool === "mindmap" ? "on" : ""}`,
    onClick: () => setTool("mindmap")
  }, /*#__PURE__*/React.createElement("span", {
    className: "studio-tool-glyph"
  }, "\u25CC"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "studio-tool-name"
  }, "Carte mentale"), /*#__PURE__*/React.createElement("div", {
    className: "studio-tool-desc"
  }, "Vue radiale par bloc"))), /*#__PURE__*/React.createElement("button", {
    className: `studio-tool ${tool === "storyboard" ? "on" : ""}`,
    onClick: () => setTool("storyboard")
  }, /*#__PURE__*/React.createElement("span", {
    className: "studio-tool-glyph"
  }, "\u25AD"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "studio-tool-name"
  }, "Storyboard"), /*#__PURE__*/React.createElement("div", {
    className: "studio-tool-desc"
  }, "Squelette vid\xE9o / podcast"))), /*#__PURE__*/React.createElement("button", {
    className: `studio-tool ${tool === "infographic" ? "on" : ""}`,
    onClick: () => setTool("infographic")
  }, /*#__PURE__*/React.createElement("span", {
    className: "studio-tool-glyph"
  }, "\u25A4"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "studio-tool-name"
  }, "Infographie"), /*#__PURE__*/React.createElement("div", {
    className: "studio-tool-desc"
  }, "Gabarit A4 partageable"))), /*#__PURE__*/React.createElement("button", {
    className: `studio-tool ${tool === "lecture" ? "on" : ""}`,
    onClick: () => setTool("lecture")
  }, /*#__PURE__*/React.createElement("span", {
    className: "studio-tool-glyph"
  }, "\u2726"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "studio-tool-name"
  }, "Lecture Active"), /*#__PURE__*/React.createElement("div", {
    className: "studio-tool-desc"
  }, "Ancrer \xB7 extraire \xB7 utiliser"))), /*#__PURE__*/React.createElement("button", {
    className: `studio-tool ${tool === "schema" ? "on" : ""}`,
    onClick: () => setTool("schema")
  }, /*#__PURE__*/React.createElement("span", {
    className: "studio-tool-glyph"
  }, "\u2B21"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "studio-tool-name"
  }, "Sch\xE9ma actif"), /*#__PURE__*/React.createElement("div", {
    className: "studio-tool-desc"
  }, "Multi-select \u2192 Mermaid via IA")))), /*#__PURE__*/React.createElement("div", {
    className: "studio-stage"
  }, tool === "mindmap" && /*#__PURE__*/React.createElement(MindMap, {
    items: items,
    ctx: ctx,
    toast: toast
  }), tool === "storyboard" && /*#__PURE__*/React.createElement(Storyboard, {
    items: items,
    ctx: ctx,
    level: level,
    setLevel: setLevel,
    toast: toast
  }), tool === "infographic" && /*#__PURE__*/React.createElement(Infographic, {
    items: items,
    ctx: ctx,
    gardefous: gardefous,
    toast: toast
  }), tool === "lecture" && /*#__PURE__*/React.createElement(LectureActive, {
    items: items,
    ctx: ctx,
    toast: toast
  }), tool === "schema" && /*#__PURE__*/React.createElement(SchemaActif, {
    items: items,
    ctx: ctx,
    toast: toast
  })), /*#__PURE__*/React.createElement("div", {
    className: "studio-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "studio-foot-mark"
  }, "\u2316"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "cream"
  }, "Principe."), " ", /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, "Le Studio ne monte pas, ne r\xE9dige pas l'article, ne dessine pas l'infographie. Il pr\xE9pare un squelette d\xE9falquable et te laisse la main sur le geste, la couleur, le ton, l'ombre."))), /*#__PURE__*/React.createElement("div", {
    className: "gap-12",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: goPrev
  }, /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2190"), " Dashboard")));
}
Object.assign(window, {
  StudioView
});