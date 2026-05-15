// manifesto.jsx — landing / page de présentation du concept

const {
  useState: useStateM
} = React;
function Manifesto({
  onEnter
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "manifesto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "manifesto-inner"
  }, /*#__PURE__*/React.createElement("header", {
    className: "m-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-eyebrow"
  }, "Manifeste \xB7 v0.2"), /*#__PURE__*/React.createElement("h1", {
    className: "m-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-the"
  }, "Le"), /*#__PURE__*/React.createElement("span", {
    className: "m-mark"
  }, " Filtre")), /*#__PURE__*/React.createElement("p", {
    className: "m-tag"
  }, "Un outil de triage \xE9ditorial", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "sobre, inclusif, et qui respire"), "."), /*#__PURE__*/React.createElement("div", {
    className: "m-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-meta-item"
  }, "\xB7 Local-first"), /*#__PURE__*/React.createElement("span", {
    className: "m-meta-item"
  }, "\xB7 Open-source vis\xE9"), /*#__PURE__*/React.createElement("span", {
    className: "m-meta-item"
  }, "\xB7 Frugal \xB7 low-tech"), /*#__PURE__*/React.createElement("span", {
    className: "m-meta-item"
  }, "\xB7 Accessible"))), /*#__PURE__*/React.createElement("section", {
    className: "m-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-section-label"
  }, "\xB7 L'id\xE9e"), /*#__PURE__*/React.createElement("div", {
    className: "m-grid-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "m-h2"
  }, "Pourquoi cet outil ?"), /*#__PURE__*/React.createElement("p", null, "On est noy\xE9s sous l'info : newsletters, podcasts, articles, reels, threads. On lit mal, on garde tout, on ne fait rien. Les outils existants (NotebookLM, Notion AI, l'autre) capturent tout mais trient peu, et nous rendent ", /*#__PURE__*/React.createElement("em", null, "d\xE9pendants"), " d'une intelligence qui n'est pas la n\xF4tre."), /*#__PURE__*/React.createElement("p", null, "Le Filtre fait l'inverse : il ", /*#__PURE__*/React.createElement("strong", null, "te"), " demande tes blocs, tes projets, ton vocabulaire. Puis il met l'IA au service de ", /*#__PURE__*/React.createElement("em", null, "ta"), "grille de lecture, pas l'inverse. Et il s'efface d\xE8s que tu d\xE9cides d'\xE9crire \xE0 la main, de dessiner ton storyboard, de monter ta vid\xE9o.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "m-h2"
  }, "Pourquoi ce nom ?"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Filtre"), " au sens du caf\xE9 : on garde l'essence, on jette le marc. Pas au sens algorithmique d'Instagram, qui d\xE9cide \xE0 ta place."), /*#__PURE__*/React.createElement("p", null, "Le ", /*#__PURE__*/React.createElement("strong", null, "\xAB Le \xBB"), ", d\xE9fini, assume un objet unique, pos\xE9 sur la table. Pas un service. Un objet. Comme un carnet, ou un tamis.")))), /*#__PURE__*/React.createElement("section", {
    className: "m-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-section-label"
  }, "\xB7 Le geste"), /*#__PURE__*/React.createElement("ol", {
    className: "m-flow"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "m-flow-num"
  }, "01"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Tu calibres"), /*#__PURE__*/React.createElement("p", null, "Tes projets, tes blocs th\xE9matiques, les sources que tu re\xE7ois souvent."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "m-flow-num"
  }, "02"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Tu verses la mati\xE8re"), /*#__PURE__*/React.createElement("p", null, "Colle, d\xE9pose un fichier, un lien, une photo de carnet, une vid\xE9o < 4min."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "m-flow-num"
  }, "03"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "L'analyse passe"), /*#__PURE__*/React.createElement("p", null, "Source d\xE9tect\xE9e, bloc choisi, score multicrit\xE8res, r\xE9sum\xE9 en 2-3 phrases."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "m-flow-num"
  }, "04"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Tu tries"), /*#__PURE__*/React.createElement("p", null, "Liste, fiches, synth\xE8se par bloc. Top 5, verbatims class\xE9s (peurs / questions / valeurs)."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "m-flow-num"
  }, "05"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Tu pilotes"), /*#__PURE__*/React.createElement("p", null, "Dashboard modulaire : rythme, stack, co\xFBts, alternatives frugales."))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "m-flow-num"
  }, "06"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Tu cr\xE9es"), /*#__PURE__*/React.createElement("p", null, "Studio : carte mentale, storyboard, infographie. Le geste reste humain."))))), /*#__PURE__*/React.createElement("section", {
    className: "m-section m-section-rules"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-section-label"
  }, "\xB7 Principes (non n\xE9gociables)"), /*#__PURE__*/React.createElement("div", {
    className: "m-rules"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-rule"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-rule-mark"
  }, "\u2460"), /*#__PURE__*/React.createElement("h3", null, "Local d'abord"), /*#__PURE__*/React.createElement("p", null, "Tes donn\xE9es restent sur ta machine. Pas de cloud par d\xE9faut. L'IA est appel\xE9e, jamais entra\xEEn\xE9e sur toi.")), /*#__PURE__*/React.createElement("div", {
    className: "m-rule"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-rule-mark"
  }, "\u2461"), /*#__PURE__*/React.createElement("h3", null, "Sobre, pas pauvre"), /*#__PURE__*/React.createElement("p", null, "Une seule action par \xE9cran. Pas d'animation gratuite. Pas de dark pattern. CSS < 60ko, z\xE9ro tracker.")), /*#__PURE__*/React.createElement("div", {
    className: "m-rule"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-rule-mark"
  }, "\u2462"), /*#__PURE__*/React.createElement("h3", null, "Inclusif par d\xE9faut"), /*#__PURE__*/React.createElement("p", null, "Contraste AAA disponible, texte ajustable, navigation clavier, alternatives texte aux m\xE9dias.")), /*#__PURE__*/React.createElement("div", {
    className: "m-rule"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-rule-mark"
  }, "\u2463"), /*#__PURE__*/React.createElement("h3", null, "Transparent sur soi"), /*#__PURE__*/React.createElement("p", null, "Le Dashboard montre la stack utilis\xE9e, les co\xFBts API, les alternatives frugales. Pas de bo\xEEte noire.")), /*#__PURE__*/React.createElement("div", {
    className: "m-rule"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-rule-mark"
  }, "\u2464"), /*#__PURE__*/React.createElement("h3", null, "Le geste humain compte"), /*#__PURE__*/React.createElement("p", null, "L'IA pr\xE9pare, classe, sugg\xE8re. Elle ne monte pas, n'\xE9crit pas \xE0 ta place, ne d\xE9cide pas pour toi.")), /*#__PURE__*/React.createElement("div", {
    className: "m-rule"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-rule-mark"
  }, "\u2465"), /*#__PURE__*/React.createElement("h3", null, "Garde-fous explicites"), /*#__PURE__*/React.createElement("p", null, "Le scoring n'est pas une v\xE9rit\xE9. Les commentaires bruyants ne sont pas repr\xE9sentatifs. Le silence est une donn\xE9e.")))), /*#__PURE__*/React.createElement("section", {
    className: "m-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-section-label"
  }, "\xB7 Limites assum\xE9es"), /*#__PURE__*/React.createElement("ul", {
    className: "m-limits"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Ce n'est pas un outil de productivit\xE9."), " Si tu veux tout faire vite, prends Notion."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Ce n'est pas un agr\xE9gateur."), " Tu ouvres et fermes la mati\xE8re toi-m\xEAme."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Ce n'est pas un service."), " C'est un fichier HTML. Tu peux le copier, le forker, le casser."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Ce n'est pas magique."), " Sans calibrage soign\xE9, le filtre rend du bruit avec confiance."))), /*#__PURE__*/React.createElement("div", {
    className: "m-cta"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-large",
    onClick: onEnter
  }, "Entrer dans l'outil ", /*#__PURE__*/React.createElement("span", {
    className: "btn-arrow"
  }, "\u2192")), /*#__PURE__*/React.createElement("p", {
    className: "m-cta-note"
  }, "Tu peux revenir ici \xE0 tout moment via la sidebar.", /*#__PURE__*/React.createElement("br", null), "Aucun compte, rien \xE0 installer."))));
}
Object.assign(window, {
  Manifesto
});