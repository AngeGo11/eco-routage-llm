import { ArrowRight, BarChart3, Leaf, Route, SlidersHorizontal } from "lucide-react";

const sections = [
  { name: "Estimer un prompt", description: "Comparer les modèles et leurs consommations estimées.", icon: Route },
  { name: "Explorer les résultats", description: "Visualiser les compromis énergie et qualité.", icon: BarChart3 },
  { name: "Paramètres", description: "Choisir les sources de données et les méthodes.", icon: SlidersHorizontal },
];

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navigation principale">
        <a className="brand" href="/" aria-label="Éco-routage, accueil"><span className="brand-icon"><Leaf size={21} strokeWidth={2.2}/></span><span>éco<span className="brand-accent">route</span><small>LABORATOIRE IA</small></span></a>
        <div className="nav-label">ESPACE DE TRAVAIL</div>
        <nav aria-label="Fonctionnalités à venir"><span className="nav-link current"><Route size={18}/> Vue d’ensemble</span><span className="nav-link muted"><BarChart3 size={18}/> Analyse <span className="soon">Bientôt</span></span><span className="nav-link muted"><SlidersHorizontal size={18}/> Configuration <span className="soon">Bientôt</span></span></nav>
        <div className="sidebar-foot">Prototype scientifique <strong>v0.2</strong><p>Les résultats sont des estimations, pas des mesures GPU directes.</p></div>
      </aside>
      <main className="main-content">
        <div className="eyebrow"><span className="pulse" /> ENVIRONNEMENT DE RECHERCHE</div>
        <header className="page-header"><div><h1>Vers une IA plus sobre<span className="period">.</span></h1><p>Comparez l’empreinte énergétique estimée des modèles d’IA et choisissez en connaissance de cause.</p></div><span className="status">Structure du frontend prête</span></header>
        <section className="intro" aria-labelledby="intro-title"><span className="intro-kicker">ÉTAPE 01 — FONDATIONS</span><h2 id="intro-title">Un espace clair pour prendre de meilleures décisions.</h2><p>Cette première version installe l’architecture et les bases visuelles. Les fonctionnalités de calcul seront connectées dans les prochaines étapes.</p><span className="intro-note">Aucune estimation n’est exécutée sur cet écran.</span></section>
        <section className="section" aria-labelledby="upcoming"><div className="section-head"><h2 id="upcoming">Prochainement dans l’application</h2><span>3 MODULES</span></div><div className="feature-grid">{sections.map(({name,description,icon:Icon},index)=><article className="feature" key={name}><div className="feature-top"><span className="feature-icon"><Icon size={21}/></span><span className="feature-number">0{index+1}</span></div><h3>{name}</h3><p>{description}</p><span className="feature-footer">Prévu pour une prochaine étape <ArrowRight size={15}/></span></article>)}</div></section>
        <footer className="footer">Éco-routage · Recherche & efficacité énergétique <span>Conçu pour comparer, pas pour surpromettre.</span></footer>
      </main>
    </div>
  );
}
