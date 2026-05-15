// frameworks.jsx — Boîte à outils prismes (6 frameworks)
/* global React */

var { useState, useMemo } = React;

const PRISME_KEY = 'lf-prisme-v1';

const FRAMEWORKS = [
  {
    id: "double-diamond",
    label: "Double Diamond",
    icon: "◇◇",
    desc: "Diverger avant de converger : explorer le vrai problème, puis la bonne solution.",
    phases: ["Découvrir", "Définir", "Développer", "Livrer"],
    questions: [
      "Quel est le vrai problème derrière ce contenu, pas celui énoncé en surface ?",
      "Quelles perspectives ou voix sont absentes de cette source ?",
      "Quels patterns émergent si je regroupe ce contenu avec d'autres signaux du même bloc ?",
      "Quelle solution concrète ce contenu rend-il pensable ou désirable ?",
    ]
  },
  {
    id: "6-portes",
    label: "6 Portes · Campus Transition",
    icon: "⬡",
    desc: "6 entrées systémiques pour lire tout changement social, politique ou écologique.",
    phases: ["Sobriété", "Systémique", "Récit", "Soin", "Communs", "Gouvernance"],
    questions: [
      "Sobriété : ce contenu questionne-t-il nos modes de consommation ou production ?",
      "Systémique : quelles interdépendances sont révélées ou délibérément ignorées ?",
      "Récit : quel imaginaire ce contenu construit-il, légitime-t-il ou déconstruit-il ?",
      "Soin : à quelles vulnérabilités ou besoins ce contenu s'adresse-t-il ?",
      "Communs : ce contenu nourrit-il une logique de partage ou d'appropriation ?",
      "Gouvernance : qui décide, qui bénéficie, qui est exclu du récit ?",
    ]
  },
  {
    id: "aarrr",
    label: "AARRR",
    icon: "▲",
    desc: "Cadre de croissance appliqué à la diffusion d'idées et de contenus.",
    phases: ["Acquisition", "Activation", "Rétention", "Recommandation", "Revenu"],
    questions: [
      "Acquisition : comment ce contenu atteint-il une audience nouvelle ou élargie ?",
      "Activation : quel premier geste, réflexion ou émotion déclenche-t-il chez le lecteur ?",
      "Rétention : pourquoi reviendrais-je vers cette source ou ce sujet ?",
      "Recommandation : est-ce assez fort pour être partagé spontanément — et pour quelle raison ?",
      "Revenu : quelle valeur économique, symbolique ou relationnelle ce contenu génère-t-il ?",
    ]
  },
  {
    id: "why-how-what",
    label: "WHY · HOW · WHAT",
    icon: "○",
    desc: "Le cercle doré : commencer par le pourquoi pour aligner vision, méthode et action.",
    phases: ["WHY", "HOW", "WHAT"],
    questions: [
      "WHY : quelle conviction profonde ou raison d'être ce contenu exprime-t-il ?",
      "HOW : par quels principes, valeurs ou méthodes cette conviction se traduit-elle ?",
      "WHAT : quelle offre, proposition ou résultat tangible en découle concrètement ?",
    ]
  },
  {
    id: "simac",
    label: "SIMAC",
    icon: "▣",
    desc: "Structure rhétorique pour analyser ou construire un message persuasif.",
    phases: ["Situation", "Intérêt", "Message", "Action", "Conclusion"],
    questions: [
      "Situation : quel contexte ou état des lieux ce contenu pose-t-il en point de départ ?",
      "Intérêt : pourquoi cela devrait-il m'importer maintenant, à moi spécifiquement ?",
      "Message : quelle est l'affirmation centrale, la thèse défendue ?",
      "Action : quel comportement, décision ou prise de position ce contenu cherche-t-il à provoquer ?",
      "Conclusion : quel souvenir ou sentiment cherche-t-il à laisser ?",
    ]
  },
  {
    id: "lecture-active",
    label: "Méthode Lecture Active",
    icon: "✦",
    desc: "Lire pour ancrer, extraire et réutiliser : la méthode des 3 étapes.",
    phases: ["Ancrage", "Extraction", "Usage"],
    questions: [
      "Ancrage : qu'est-ce qui me touche, me résiste ou me surprend dans ce texte ?",
      "Extraction : quelle phrase exacte résume l'essentiel que je veux retenir ?",
      "Paraphrase : comment dire la même chose avec mes propres mots, dans mon contexte ?",
      "Usage : où et comment vais-je concrètement réutiliser cette idée ?",
    ]
  },
];

// ─────── FRAMEWORKS PANEL (onglet Prismes dans SetupView) ───────
function FrameworksPanel({ activeId, setActiveId }) {
  const [expandedId, setExpandedId] = useState(null);

  function toggle(id) {
    setExpandedId(prev => prev === id ? null : id);
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">Boîte à outils · 6 prismes</div>
          <div className="panel-sub">
            Active un cadre de lecture avant d'analyser. Les questions du prisme choisi
            apparaîtront en référence dans les phases Analyse et Triage pour orienter
            ta lecture critique.
          </div>
        </div>
        {activeId && (
          <button className="btn-ghost btn" onClick={() => setActiveId(null)}>
            × Désactiver
          </button>
        )}
      </div>

      <div className="framework-grid">
        {FRAMEWORKS.map(fw => {
          const isActive = activeId === fw.id;
          const isExpanded = expandedId === fw.id;
          return (
            <div key={fw.id} className={`framework-card ${isActive ? "active" : ""}`}>

              <div className="framework-card-top" onClick={() => toggle(fw.id)} style={{cursor: "pointer"}}>
                <div className="framework-icon">{fw.icon}</div>
                <div className="framework-info">
                  <div className="framework-label">{fw.label}</div>
                  <div className="framework-desc">{fw.desc}</div>
                </div>
                <div className="framework-expand mono small">{isExpanded ? "▴" : "▾"}</div>
              </div>

              <div className="framework-phases">
                {fw.phases.map(p => (
                  <span key={p} className="framework-phase-chip">{p}</span>
                ))}
              </div>

              {isExpanded && (
                <div className="framework-questions">
                  {fw.questions.map((q, i) => (
                    <div key={i} className="framework-question">
                      <span className="framework-q-num mono">{i + 1}</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="framework-actions">
                {isActive ? (
                  <span className="framework-active-badge">◉ Prisme actif en Analyse + Triage</span>
                ) : (
                  <button
                    className="btn btn-sm"
                    onClick={() => setActiveId(fw.id)}
                  >
                    Activer ce prisme
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!activeId && (
        <p className="helper" style={{marginTop: 16}}>
          <span className="mono" style={{color: "var(--green)"}}>→</span>{" "}
          Sans prisme actif, Le Filtre analyse sans grille de lecture explicite — utile pour une première passe neutre.
        </p>
      )}
    </div>
  );
}

// ─────── ACTIVE PRISME BAR (Analyse + Triage) ───────
function ActivePrismeBar({ activeId }) {
  const [open, setOpen] = useState(false);
  const fw = useMemo(() => FRAMEWORKS.find(f => f.id === activeId), [activeId]);
  if (!fw) return null;

  return (
    <div className={`prisme-bar ${open ? "open" : ""}`}>
      <button className="prisme-bar-toggle" onClick={() => setOpen(o => !o)}>
        <span className="prisme-bar-icon">{fw.icon}</span>
        <span className="prisme-bar-label">
          Prisme actif : <strong>{fw.label}</strong>
        </span>
        <span className="prisme-bar-phases">
          {fw.phases.map(p => (
            <span key={p} className="prisme-mini-chip">{p}</span>
          ))}
        </span>
        <span className="prisme-bar-caret mono small">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="prisme-bar-questions">
          {fw.questions.map((q, i) => (
            <div key={i} className="prisme-bar-q">
              <span className="prisme-bar-q-num mono">{i + 1}</span>
              <span>{q}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { FRAMEWORKS, FrameworksPanel, ActivePrismeBar });
