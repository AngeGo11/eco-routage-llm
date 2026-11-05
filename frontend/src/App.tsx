import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, Command, Leaf, Menu, MoveUpRight, X } from "lucide-react";

const models = ["CompareAI", "ML.ENERGY"] as const;

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [source, setSource] = useState<(typeof models)[number]>("CompareAI");
  const [menuOpen, setMenuOpen] = useState(false);
  const count = Math.ceil(prompt.length / 4);
  return (
    <div className="site">
      <header className="topbar">
        <a href="#accueil" className="identity" aria-label="Éco-routage, accueil">
          <span className="identity-symbol"><Leaf size={19} strokeWidth={2.3}/></span>
          <span>éco<span className="identity-slash">/</span>routage</span>
          <span className="identity-edition">RESEARCH EDITION</span>
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Navigation principale">
          <a className="nav-active" href="#atelier" onClick={() => setMenuOpen(false)}>L'atelier <span>01</span></a>
          <a href="#methode" onClick={() => setMenuOpen(false)}>La méthode <span>02</span></a>
          <a href="#about" onClick={() => setMenuOpen(false)}>À propos <span>03</span></a>
        </nav>
        <span className="topbar-label"><span className="signal"/> PROTOTYPE · V0.2</span>
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
      </header>

      <main id="accueil">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-topline"><span>UN LABORATOIRE POUR L'IA RESPONSABLE</span><span>48°06′N / 01°40′W <span className="topline-sep">·</span> RENNES, FR</span></div>
          <div className="hero-body">
            <div className="hero-copy">
              <span className="kicker"><span className="kicker-line"/> ÉTUDE N° 001 — EFFICACITÉ ÉNERGÉTIQUE</span>
              <h1 id="hero-title">Chaque prompt<br/>a une <em>empreinte.</em></h1>
              <p className="hero-description">Tous les modèles d'IA ne consomment pas la même énergie. Comprendre la différence, c'est déjà mieux choisir.</p>
              <a className="explore-link" href="#atelier"><span>Explorer l'atelier</span><span className="explore-icon"><ArrowDownRight size={19}/></span></a>
            </div>
            <div className="visual" aria-label="Illustration abstraite de chemins d'acheminement vers plusieurs modèles d'IA" role="img">
              <div className="visual-grid"/>
              <span className="visual-corner top-left">FIG. 01</span><span className="visual-corner top-right">ROUTAGE INTELLIGENT</span>
              <svg className="network" viewBox="0 0 520 440" fill="none" aria-hidden="true">
                <path d="M52 218 H164 C211 218 206 98 278 98 H465" className="path secondary"/>
                <path d="M52 218 H196 C236 218 230 218 278 218 H465" className="path primary"/>
                <path d="M52 218 H164 C211 218 206 337 278 337 H465" className="path secondary"/>
                <path d="M52 218 H164 C211 218 206 98 278 98 H465" className="path flow"/>
                <circle cx="52" cy="218" r="10" fill="#EBE6DB" stroke="#203E32" strokeWidth="3"/>
                <circle cx="465" cy="98" r="8" fill="#D3D7CA" stroke="#304D3F" strokeWidth="2"/>
                <circle cx="465" cy="218" r="11" fill="#E87747" stroke="#E87747" strokeWidth="2"/>
                <circle cx="465" cy="337" r="8" fill="#D3D7CA" stroke="#304D3F" strokeWidth="2"/>
                <circle cx="465" cy="218" r="18" stroke="#E87747" strokeOpacity=".45"/>
              </svg>
              <span className="network-source">PROMPT <span>ENTRÉE</span></span>
              <span className="network-dest one">MODÈLE A <span>TRAJET 01</span></span>
              <span className="network-dest two">MODÈLE B <span>TRAJET 02</span></span>
              <span className="network-dest three">MODÈLE C <span>TRAJET 03</span></span>
              <div className="visual-caption"><span className="caption-cross">✳</span> Un même besoin.<br/>Plusieurs chemins possibles.</div>
              <span className="visual-corner bottom-right">SCHÉMA CONCEPTUEL · NON MESURÉ</span>
            </div>
          </div>
          <div className="hero-baseline"><span><span className="asterisk">✳</span> LA SOBRIÉTÉ COMME VARIABLE DE DÉCISION</span><span>SCROLL TO EXPLORE <ArrowDownRight size={13}/></span></div>
        </section>

        <section className="workspace" id="atelier" aria-labelledby="workspace-title">
          <div className="section-meta"><span>01 / L'ATELIER</span><span>VOTRE POINT DE DÉPART <ArrowUpRight size={14}/></span></div>
          <div className="workspace-layout">
            <div className="workspace-heading">
              <h2 id="workspace-title">Et si on commençait<br/><em>par votre question ?</em></h2>
              <p>Posez les bases d'une estimation. L'interface de calcul sera reliée au moteur Python dans la prochaine étape.</p>
              <div className="annotation"><span className="annotation-index">NOTE / 01</span><p>Une estimation n'est pas une mesure électrique réelle. Les limites méthodologiques restent visibles.</p></div>
            </div>
            <div className="prompt-panel">
              <div className="panel-heading"><span><span className="panel-dot"/> LE BANC D'ESSAI</span><span>MODULE EN PRÉPARATION</span></div>
              <label htmlFor="prompt" className="field-label">01 — Votre prompt</label>
              <textarea id="prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} maxLength={4000} placeholder="Ex. Explique-moi le fonctionnement des réseaux de neurones en trois points simples…" rows={5}/>
              <div className="field-details"><span><Command size={13}/> {prompt.length} caractères</span><span>≈ {count} tokens d'entrée <span className="subtle">(approximation)</span></span></div>
              <div className="divider"/>
              <fieldset><legend className="field-label">02 — Source des données</legend><div className="segment">{models.map(m=><button key={m} type="button" aria-pressed={source===m} onClick={()=>setSource(m)} className={source===m?"selected":""}>{source===m && <Check size={14}/>} {m}</button>)}</div></fieldset>
              <div className="panel-foot"><span>Estimation énergétique <strong>non encore connectée</strong></span><button type="button" className="estimate-button" disabled aria-describedby="estimate-help">Calcul bientôt disponible <MoveUpRight size={17}/></button></div>
              <p className="screen-reader-only" id="estimate-help">Le calcul des estimations sera ajouté lors de l'intégration du moteur Python.</p>
            </div>
          </div>
        </section>

        <section className="method" id="methode" aria-labelledby="method-title">
          <div className="section-meta"><span>02 / LA MÉTHODE</span><span>DU PROMPT À LA DÉCISION</span></div>
          <div className="method-layout"><div><span className="method-eyebrow">L'IDÉE EN TROIS TEMPS</span><h2 id="method-title">Moins d'intuition.<br/><em>Plus de contexte.</em></h2></div><div className="method-steps"><article><span>01</span><div><h3>Comprendre la demande</h3><p>Approcher le volume de tokens pour caractériser le prompt.</p></div></article><article><span>02</span><div><h3>Estimer, sans surpromettre</h3><p>Utiliser les données et les méthodes disponibles pour comparer les consommations estimées.</p></div></article><article><span>03</span><div><h3>Choisir avec discernement</h3><p>Lire les compromis entre consommation énergétique et signaux de qualité.</p></div></article></div></div>
        </section>
      </main>
      <footer className="bottom" id="about"><span className="footer-brand">éco<span>/</span>routage</span><span>Explorer le coût invisible de l'intelligence artificielle.</span><span>PROJET EXPÉRIMENTAL · 2026 <ChevronDown size={14}/></span></footer>
    </div>
  );
}
