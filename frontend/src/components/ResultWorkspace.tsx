import { useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, ChevronDown, Info, Leaf, Lightbulb, LoaderCircle } from "lucide-react";
import type { EstimateResponse, ModelResult } from "../types/estimation";

type Props = { result: EstimateResponse | null; loading: boolean; error: string | null };
const wh = (value: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 6, maximumSignificantDigits: 5 }).format(value);
const percentage = (value: number | null) => value == null ? "n.d." : new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 1 }).format(value);

function Detail({ model, result }: { model: ModelResult; result: EstimateResponse }) {
  return <div className="model-detail">
    <div><span>Référence énergétique</span><strong>{model.factor_source || "Non renseignée"}</strong></div>
    <div><span>Sortie prévue</span><strong>{model.output_tokens_est == null ? "Indisponible" : `≈ ${Math.round(model.output_tokens_est)} tokens`}</strong></div>
    <div><span>Réactions historiques</span><strong>{percentage(model.reaction_quality)} · {model.reaction_count ?? "n.d."} réactions</strong></div>
    {result.energy_model === "input-output" && <div><span>Base / entrée / sortie</span><strong>{wh(model.base_energy_wh ?? 0)} / {wh(model.input_energy_wh ?? 0)} / {wh(model.output_energy_wh ?? 0)} Wh</strong></div>}
    {result.energy_model === "power-law" && <div><span>Exposants entrée / sortie</span><strong>{model.input_exponent == null ? "n.d." : model.input_exponent.toFixed(3)} / {model.output_exponent == null ? "n.d." : model.output_exponent.toFixed(3)}</strong></div>}
    {result.energy_source === "mlenergy" && <div><span>Dispersion P10 à P90 (configurations)</span><strong>{model.config_p10_wh == null ? "n.d." : wh(model.config_p10_wh)} à {model.config_p90_wh == null ? "n.d." : wh(model.config_p90_wh)} Wh</strong></div>}
  </div>;
}

function Chart({ result }: { result: EstimateResponse }) {
  const [open, setOpen] = useState<string | null>(null);
  const max = Math.max(0.00000001, ...result.results.map(item => item.estimated_wh));
  return <section className="ranking-section" aria-labelledby="ranking-title">
    <div className="section-title"><div><span className="eyebrow dark">02 / COMPARAISON</span><h2 id="ranking-title">Tous les chemins.<br/><em>Une autre perspective.</em></h2></div><span className="caption-tag">Wh PAR REQUÊTE</span></div>
    <div className="chart-legend"><span><i className="key-dot" /> Modèle recommandé</span><span><i className="key-line" /> Autres modèles</span></div>
    <div className="chart-head"><span>MODÈLE</span><span>ÉNERGIE ESTIMÉE</span></div>
    <ol className="chart-list">
      {result.results.map((item, i) => <li key={item.name} className={item.recommended ? "chart-item selected" : "chart-item"}>
        <button type="button" className="chart-row" onClick={() => setOpen(prev => prev === item.name ? null : item.name)} aria-expanded={open === item.name} aria-label={`Afficher les détails du modèle ${item.name}`}>
          <span className="chart-label"><span className="chart-order">{String(i+1).padStart(2,"0")}</span><span>{item.name}{item.recommended && <small>RECOMMANDÉ</small>}</span></span>
          <span className="chart-value">{wh(item.estimated_wh)} <small>Wh</small><ChevronDown size={14} className={open === item.name ? "chevron rotated" : "chevron"}/></span>
        </button>
        <div className="bar-base" aria-hidden="true"><div className="bar-value" style={{width:`${Math.max(0.7, item.estimated_wh / max * 100)}%`}} /></div>
        {open === item.name && <Detail model={item} result={result} />}
      </li>)}
    </ol>
    <div className="chart-footnote"><Info size={16}/><p>Longueur de sortie et énergie <strong>estimées</strong>, pas mesurées directement sur une requête. Les scores de réactions reflètent des retours historiques, sans garantir la qualité d'une réponse future.</p></div>
  </section>;
}

function EmptyGraphic() {
  return <div className="empty-viz" aria-hidden="true">
    <div className="empty-grid" />
    <div className="empty-top"><span>FIG. 01</span><span>TOPOLOGIE / ROUTAGE</span></div>
    <svg viewBox="0 0 620 290" preserveAspectRatio="xMidYMid meet">
      <g fill="none" strokeWidth="1.7" strokeLinecap="round">
        <path stroke="#9caf99" strokeDasharray="5 7" d="M70 144 H176 Q210 144 234 92 T310 42 H520"/>
        <path stroke="#c2a889" strokeDasharray="5 7" d="M70 144 H188 Q214 144 244 144 H520"/>
        <path stroke="#9caf99" strokeDasharray="5 7" d="M70 144 H176 Q210 144 234 197 T310 248 H520"/>
      </g>
      <circle cx="70" cy="144" r="12" fill="#233b30"/><circle cx="70" cy="144" r="4" fill="#e5e5d8"/>
      <circle cx="520" cy="42" r="10" fill="#d8dfd1" stroke="#627d68" strokeWidth="2"/>
      <circle cx="520" cy="144" r="11" fill="#e18c60"/><circle cx="520" cy="144" r="17" fill="none" stroke="#e18c60" strokeOpacity=".45"/>
      <circle cx="520" cy="248" r="10" fill="#d8dfd1" stroke="#627d68" strokeWidth="2"/>
      <text x="35" y="177" fontSize="9" fill="#708173">PROMPT</text><text x="478" y="24" fontSize="9" fill="#708173">MODÈLE A</text><text x="478" y="120" fontSize="9" fill="#708173">MODÈLE B</text><text x="478" y="274" fontSize="9" fill="#708173">MODÈLE C</text>
    </svg>
    <div className="empty-bottom"><span><i/> EN ATTENTE DE DONNÉES</span><span>SCHÉMA CONCEPTUEL · NON MESURÉ</span></div>
  </div>;
}

export default function ResultWorkspace({ result, loading, error }: Props) {
  const recommended = result?.results.find(model => model.name === result.recommended_model);
  return <div className="results-column" id="resultats">
    <div className="page-overline"><span><span className="live-dot"/> OBSERVATOIRE DE L'IA SOBRE</span><span>ÉTUDE N° 001 / 2026</span></div>
    <div className="result-intro"><span className="eyebrow dark">LABORATOIRE D'ÉCO-ROUTAGE</span><h1>L'intelligence<br/>a un <em>coût invisible.</em></h1><p>Une question, plusieurs modèles. Explorez l'énergie qu'ils pourraient consommer et les compromis derrière chaque choix.</p></div>
    <div className="result-headline"><div><span className="eyebrow dark">01 / SYNTHÈSE DU CALCUL</span><h2>{loading ? "Analyse en cours…" : result ? "La mesure du possible." : "Votre analyse commence ici."}</h2></div><span className={result ? "result-state ready" : "result-state"}><Activity size={13}/>{result ? "ESTIMATION TERMINÉE" : loading ? "CALCUL EN COURS" : "EN ATTENTE"}</span></div>
    <div className="metric-grid">
      <div className="metric-block"><span>MODÈLE CONSEILLÉ <ArrowUpRight size={13}/></span><strong className="metric-model">{result?.recommended_model ?? "—"}</strong><small>{result ? (result.quality_filter_applied ? "Filtré par réactions" : "Classement énergétique") : "Après calcul"}</small></div>
      <div className="metric-block"><span>ÉNERGIE ESTIMÉE <Leaf size={13}/></span><strong>{recommended ? wh(recommended.estimated_wh) : "—"}<small>{recommended ? " Wh" : ""}</small></strong><small>Pour la requête · pas une mesure GPU</small></div>
      <div className="metric-block"><span>MODÈLES ÉVALUÉS <BarChart3 size={13}/></span><strong>{result ? result.models_evaluated : "—"}</strong><small>Disponibles dans le jeu de données</small></div>
    </div>
    {loading ? <div className="loading-analysis" role="status"><LoaderCircle className="rotate" size={30}/><h3>Le moteur explore les modèles…</h3><p>Lecture des données historiques et calcul des estimations. Le premier lancement peut être plus long.</p></div> : result ? <Chart result={result} /> : <section className="blank-results">
      <EmptyGraphic/>
      <div className="empty-copy"><div className="round-icon"><Lightbulb size={20}/></div><div><h3>À chaque prompt, sa trajectoire.</h3><p>Saisissez votre demande à droite pour afficher ici les estimations énergétiques, les modèles comparés et le détail des calculs. Aucun chiffre fictif n'est présenté.</p>{error && <p className="empty-error">Le calcul n'a pas abouti. Consultez le message dans le panneau de droite.</p>}</div></div>
    </section>}
    <div className="method-strip"><div><span>COMMENT LIRE CES RÉSULTATS</span><p>Tokens d'entrée ≈ caractères / 4. Les tokens de sortie sont prédits à partir de l'historique CompareAI.</p></div><a href="#methode">Comprendre la méthode <ArrowDownRight size={15}/></a></div>
    <section id="methode" className="methods"><span className="eyebrow dark">03 / TRANSPARENCE MÉTHODOLOGIQUE</span><h2>Estimer n'est pas mesurer.</h2><p>La V0.2 utilise une loi de puissance ou une régression additive selon les paramètres choisis. ML.ENERGY exploite des facteurs issus de configurations GPU hétérogènes et utilise la variante « sortie seule ». Les résultats ne permettent pas de comparer directement des mesures GPU identiques pour tous les modèles.</p></section>
  </div>;
}
