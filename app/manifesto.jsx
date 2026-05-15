// manifesto.jsx — landing / page de présentation du concept

const { useState: useStateM } = React;

function Manifesto({ onEnter }) {
  return (
    <div className="manifesto">
      <div className="manifesto-inner">

        <header className="m-head">
          <div className="m-eyebrow">Manifeste · v0.2</div>
          <h1 className="m-title">
            <span className="m-the">Le</span>
            <span className="m-mark"> Filtre</span>
          </h1>
          <p className="m-tag">
            Un outil de triage éditorial<br/>
            <em>sobre, inclusif, et qui respire</em>.
          </p>
          <div className="m-meta">
            <span className="m-meta-item">· Local-first</span>
            <span className="m-meta-item">· Open-source visé</span>
            <span className="m-meta-item">· Frugal · low-tech</span>
            <span className="m-meta-item">· Accessible</span>
          </div>
        </header>

        <section className="m-section">
          <div className="m-section-label">· L'idée</div>
          <div className="m-grid-2">
            <div>
              <h2 className="m-h2">Pourquoi cet outil ?</h2>
              <p>
                On est noyés sous l'info : newsletters, podcasts, articles, reels,
                threads. On lit mal, on garde tout, on ne fait rien. Les outils
                existants (NotebookLM, Notion AI, l'autre) capturent tout mais
                trient peu, et nous rendent <em>dépendants</em> d'une intelligence
                qui n'est pas la nôtre.
              </p>
              <p>
                Le Filtre fait l'inverse : il <strong>te</strong> demande tes blocs,
                tes projets, ton vocabulaire. Puis il met l'IA au service de <em>ta</em>
                grille de lecture, pas l'inverse. Et il s'efface dès que tu décides
                d'écrire à la main, de dessiner ton storyboard, de monter ta vidéo.
              </p>
            </div>
            <div>
              <h2 className="m-h2">Pourquoi ce nom ?</h2>
              <p>
                <strong>Filtre</strong> au sens du café : on garde l'essence, on
                jette le marc. Pas au sens algorithmique d'Instagram, qui décide à
                ta place.
              </p>
              <p>
                Le <strong>« Le »</strong>, défini, assume un objet unique, posé sur
                la table. Pas un service. Un objet. Comme un carnet, ou un tamis.
              </p>
            </div>
          </div>
        </section>

        <section className="m-section">
          <div className="m-section-label">· Le geste</div>
          <ol className="m-flow">
            <li>
              <span className="m-flow-num">01</span>
              <div>
                <h3>Tu calibres</h3>
                <p>Tes projets, tes blocs thématiques, les sources que tu reçois souvent.</p>
              </div>
            </li>
            <li>
              <span className="m-flow-num">02</span>
              <div>
                <h3>Tu verses la matière</h3>
                <p>Colle, dépose un fichier, un lien, une photo de carnet, une vidéo &lt; 4min.</p>
              </div>
            </li>
            <li>
              <span className="m-flow-num">03</span>
              <div>
                <h3>L'analyse passe</h3>
                <p>Source détectée, bloc choisi, score multicritères, résumé en 2-3 phrases.</p>
              </div>
            </li>
            <li>
              <span className="m-flow-num">04</span>
              <div>
                <h3>Tu tries</h3>
                <p>Liste, fiches, synthèse par bloc. Top 5, verbatims classés (peurs / questions / valeurs).</p>
              </div>
            </li>
            <li>
              <span className="m-flow-num">05</span>
              <div>
                <h3>Tu pilotes</h3>
                <p>Dashboard modulaire : rythme, stack, coûts, alternatives frugales.</p>
              </div>
            </li>
            <li>
              <span className="m-flow-num">06</span>
              <div>
                <h3>Tu crées</h3>
                <p>Studio : carte mentale, storyboard, infographie. Le geste reste humain.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="m-section m-section-rules">
          <div className="m-section-label">· Principes (non négociables)</div>
          <div className="m-rules">
            <div className="m-rule">
              <div className="m-rule-mark">①</div>
              <h3>Local d'abord</h3>
              <p>Tes données restent sur ta machine. Pas de cloud par défaut. L'IA est appelée, jamais entraînée sur toi.</p>
            </div>
            <div className="m-rule">
              <div className="m-rule-mark">②</div>
              <h3>Sobre, pas pauvre</h3>
              <p>Une seule action par écran. Pas d'animation gratuite. Pas de dark pattern. CSS &lt; 60ko, zéro tracker.</p>
            </div>
            <div className="m-rule">
              <div className="m-rule-mark">③</div>
              <h3>Inclusif par défaut</h3>
              <p>Contraste AAA disponible, texte ajustable, navigation clavier, alternatives texte aux médias.</p>
            </div>
            <div className="m-rule">
              <div className="m-rule-mark">④</div>
              <h3>Transparent sur soi</h3>
              <p>Le Dashboard montre la stack utilisée, les coûts API, les alternatives frugales. Pas de boîte noire.</p>
            </div>
            <div className="m-rule">
              <div className="m-rule-mark">⑤</div>
              <h3>Le geste humain compte</h3>
              <p>L'IA prépare, classe, suggère. Elle ne monte pas, n'écrit pas à ta place, ne décide pas pour toi.</p>
            </div>
            <div className="m-rule">
              <div className="m-rule-mark">⑥</div>
              <h3>Garde-fous explicites</h3>
              <p>Le scoring n'est pas une vérité. Les commentaires bruyants ne sont pas représentatifs. Le silence est une donnée.</p>
            </div>
          </div>
        </section>

        <section className="m-section">
          <div className="m-section-label">· Limites assumées</div>
          <ul className="m-limits">
            <li><strong>Ce n'est pas un outil de productivité.</strong> Si tu veux tout faire vite, prends Notion.</li>
            <li><strong>Ce n'est pas un agrégateur.</strong> Tu ouvres et fermes la matière toi-même.</li>
            <li><strong>Ce n'est pas un service.</strong> C'est un fichier HTML. Tu peux le copier, le forker, le casser.</li>
            <li><strong>Ce n'est pas magique.</strong> Sans calibrage soigné, le filtre rend du bruit avec confiance.</li>
          </ul>
        </section>

        <div className="m-cta">
          <button className="btn btn-primary btn-large" onClick={onEnter}>
            Entrer dans l'outil <span className="btn-arrow">→</span>
          </button>
          <p className="m-cta-note">
            Tu peux revenir ici à tout moment via la sidebar.
            <br/>Aucun compte, rien à installer.
          </p>
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { Manifesto });
