import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Check, ChevronDown, CircleAlert, Clock3, ExternalLink, Leaf, LoaderCircle, RotateCcw, Send, SlidersHorizontal, X } from "lucide-react";
import ResultWorkspace from "./components/ResultWorkspace";
import { estimatePrompt, getHealth } from "./services/estimation";
import type { EnergyModel, EnergySource, EstimateResponse, HealthResponse } from "./types/estimation";

const methods: { id: EnergyModel; label: string }[] = [
  { id: "power-law", label: "V0.2 · Loi de puissance" },
  { id: "input-output", label: "V0.2 · Régression additive" },
  { id: "output-only", label: "V0.1 · Sortie seule" },
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [source, setSource] = useState<EnergySource>("compareai");
  const [method, setMethod] = useState<EnergyModel>("power-law");
  const [minReactions, setMinReactions] = useState(100);
  const [reactionThreshold, setReactionThreshold] = useState(0.65);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [checking, setChecking] = useState(true);
  const [disconnected, setDisconnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const requestController = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getHealth(controller.signal).then(value => {
      setHealth(value); setDisconnected(false);
    }).catch((reason: unknown) => {
      if (!(reason instanceof Error && reason.name === "AbortError")) setDisconnected(true);
    }).finally(() => { if (!controller.signal.aborted) setChecking(false); });
    return () => { controller.abort(); requestController.current?.abort(); };
  }, []);

  async function refresh() {
    setChecking(true); setDisconnected(false);
    try { setHealth(await getHealth()); }
    catch { setDisconnected(true); setHealth(null); }
    finally { setChecking(false); }
  }
  function resetResult() {
    requestController.current?.abort();
    requestController.current = null;
    setLoading(false); setError(null); setResult(null);
  }
  function cancel() { requestController.current?.abort(); requestController.current = null; setLoading(false); }

  async function runEstimation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    if (!prompt.trim()) { setError("Saisissez un prompt pour démarrer une estimation."); return; }
    resetResult();
    const controller = new AbortController();
    requestController.current = controller;
    setLoading(true);
    try {
      const response = await estimatePrompt({
        prompt: prompt.trim(), energy_source: source,
        energy_model: source === "mlenergy" ? "output-only" : method,
        min_reactions: minReactions,
        reaction_threshold: reactionThreshold,
        top: 8,
      }, controller.signal);
      if (!controller.signal.aborted) setResult(response);
    } catch (reason) {
      if (!controller.signal.aborted) setError(reason instanceof TypeError
        ? "Impossible de contacter l'API locale. Vérifiez le démarrage du serveur FastAPI."
        : reason instanceof Error ? reason.message : "Une erreur inattendue est survenue.");
    } finally {
      if (!controller.signal.aborted) { setLoading(false); requestController.current = null; }
    }
  }

  const missingCompareAI = health?.compareai_available === false;
  const missingReactions = health?.reactions_available === false;
  const missingMLEnergy = source === "mlenergy" && health?.mlenergy_available === false;
  const blocked = checking || disconnected || missingCompareAI || missingReactions || missingMLEnergy;
  const approxTokens = prompt.length ? Math.max(1, Math.ceil(prompt.length / 4)) : 0;

  return <div className="application" id="haut">
    <header className="app-header">
      <a className="logo" href="#haut" aria-label="Éco-routage, retour en haut"><span className="logo-icon"><Leaf size={19} strokeWidth={2.1}/></span><span>éco<span className="logo-divider">/</span>routage</span></a>
      <span className="logo-subline">ENERGY INTELLIGENCE LAB</span>
      <nav className="header-links" aria-label="Navigation de l'application"><a className="current" href="#resultats">Observatoire</a><a href="#composer">Simulateur</a><a href="#methode">Méthode</a></nav>
      <span className="header-version"><span className="header-bullet"/> PROTOTYPE V0.2</span>
    </header>
    <main className="split-layout">
      <ResultWorkspace result={result} loading={loading} error={error} />
      <aside className="composer-column" id="composer" aria-labelledby="composer-title">
        <div className="composer-inner">
          <div className="composer-top"><span>01 / SIMULATEUR</span><span className="composer-top-icon"><SlidersHorizontal size={17}/></span></div>
          <div className="composer-heading"><span className="composer-kicker">VOTRE ESPACE D'EXPÉRIMENTATION</span><h2 id="composer-title">Posez la question.<br/><em>Mesurez l'impact.</em></h2><p>Décrivez ce que vous demanderiez à une IA. Le moteur comparera l'énergie que différents modèles pourraient mobiliser.</p></div>
          <form className="prompt-form" onSubmit={runEstimation}>
            <div className="form-section-heading"><label htmlFor="prompt">01 <span>LE PROMPT À ANALYSER</span></label><span className="form-hint-light">MAX. 4 000 CARACTÈRES</span></div>
            <div className="prompt-field">
              <textarea id="prompt" name="prompt" value={prompt} maxLength={4000} rows={7} required aria-describedby="prompt-counter" onChange={event => { setPrompt(event.target.value); resetResult(); }} placeholder="Ex. Explique en quelques phrases les avantages et les limites des modèles de langage…" />
              <div className="prompt-counter" id="prompt-counter"><span>{prompt.length} / 4 000 CARACTÈRES</span><span>≈ {approxTokens} TOKENS</span></div>
            </div>
            <div className="form-section-heading source-title"><span>02 <span>LES DONNÉES DE RÉFÉRENCE</span></span></div>
            <div className="source-picker" role="group" aria-label="Source des facteurs énergétiques">
              <button type="button" className={source === "compareai" ? "source-option active" : "source-option"} aria-pressed={source === "compareai"} onClick={() => { setSource("compareai"); resetResult(); }}><span className="source-radio">{source === "compareai" && <Check size={12}/>}</span><span><strong>CompareAI</strong><small>Référence énergétique estimée</small></span></button>
              <button type="button" className={source === "mlenergy" ? "source-option active" : "source-option"} aria-pressed={source === "mlenergy"} onClick={() => { setSource("mlenergy"); resetResult(); }}><span className="source-radio">{source === "mlenergy" && <Check size={12}/>}</span><span><strong>ML.ENERGY</strong><small>Facteurs GPU agrégés</small></span></button>
            </div>
            <div className="select-label"><label htmlFor="method">MODÈLE DE CALCUL</label><span>03</span></div>
            <div className="select-shell"><select id="method" name="method" value={source === "mlenergy" ? "output-only" : method} disabled={source === "mlenergy"} onChange={event => {setMethod(event.target.value as EnergyModel);resetResult();}}>{methods.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</select><ChevronDown size={17} aria-hidden="true"/></div>
            {source === "mlenergy" && <p className="form-helper">ML.ENERGY impose le calcul « sortie seule ».</p>}
            <details className="advanced"><summary><span>Affiner le filtre de qualité</span><span>OPTIONNEL <ChevronDown size={16}/></span></summary><div className="advanced-content"><label htmlFor="reactions-min">Réactions historiques minimales</label><input id="reactions-min" type="number" min="1" max="10000" step="1" required value={minReactions} onChange={event=>{setMinReactions(Number(event.target.value));resetResult();}}/><label htmlFor="reaction-threshold">Seuil de score de réactions <strong>{Math.round(reactionThreshold * 100)} %</strong></label><input id="reaction-threshold" type="range" min="0" max="1" step="0.01" value={reactionThreshold} onChange={event=>{setReactionThreshold(Number(event.target.value));resetResult();}} /><p>Le score repose sur les réactions des utilisateurs historiques ; ce n'est pas une garantie de qualité.</p></div></details>
            <div className="api-status" role="status"><span className={checking ? "status-light pending" : blocked ? "status-light offline" : "status-light available"}/><span>{checking ? "Connexion au moteur en cours…" : disconnected ? "API Python inaccessible." : missingCompareAI ? "Jeu de données CompareAI manquant sur le serveur." : missingReactions ? "Fichier de réactions CompareAI manquant." : missingMLEnergy ? "Données ML.ENERGY manquantes." : "Moteur disponible — calcul sur données locales."}</span>{!checking && blocked && <button type="button" onClick={refresh} aria-label="Vérifier à nouveau la disponibilité du moteur"><RotateCcw size={15}/></button>}</div>
            {blocked && !checking && <p className="api-help">{disconnected ? <>Démarrez l'API avec <code>python -m uvicorn api.main:app --reload --port 8000</code>.</> : missingCompareAI ? <>Ajoutez <code>source_données/compareAI/conversations.parquet</code> sur le serveur.</> : missingReactions ? <>Ajoutez <code>source_données/compareAI/reactions.parquet</code> sur le serveur.</> : <>Vérifiez la présence des fichiers Parquet ML.ENERGY.</>}</p>}
            {error && <div className="error-banner" role="alert"><CircleAlert size={17}/><span>{error}</span></div>}
            <div className="action-wrap">{loading ? <button type="button" className="submit-button abort" onClick={cancel}><X size={18}/> Annuler l'attente</button> : <button type="submit" className="submit-button" disabled={blocked || !prompt.trim()}><span>Lancer l'estimation</span><span className="submit-arrow">{blocked ? <Clock3 size={19}/> : <Send size={19}/>}</span></button>}</div>
            {loading && <div className="loading-indicator" role="status"><LoaderCircle size={16} className="rotate" /> Traitement en cours ; le premier calcul peut prendre du temps.</div>}
          </form>
          <div className="composer-notice"><div className="notice-icon"><InfoIcon/></div><p><strong>À savoir.</strong> Aucune réponse n'est générée par l'IA. Le prompt reste dans votre environnement local ; seules des estimations issues des jeux de données sont calculées.</p></div>
          <div className="composer-bottom"><span>ÉCO-ROUTAGE · PROTOTYPE EXPÉRIMENTAL</span><a href="https://github.com/AngeGo11/eco-routage-llm" target="_blank" rel="noopener noreferrer">SOURCE <ExternalLink size={13}/></a></div>
        </div>
      </aside>
    </main>
    <footer className="global-footer"><span>© 2026 ÉCO-ROUTAGE · RECHERCHE SUR LA SOBRIÉTÉ DE L'IA</span><span>LES CHIFFRES SONT DES ESTIMATIONS, PAS DES MESURES GPU DIRECTES. <ArrowUpRight size={13}/></span></footer>
  </div>;
}

function InfoIcon() { return <CircleAlert size={19} strokeWidth={1.8}/> }
