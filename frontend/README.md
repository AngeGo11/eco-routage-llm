# Frontend Éco-routage — étape 1 : structure

Socle indépendant React + TypeScript + Vite. Cette étape ne connecte **pas** encore le calculateur Python et n’affiche **aucune estimation réelle**.

## Démarrage

Prérequis : Node.js 20.19+ ou 22.12+ et npm.

```bash
cd frontend
npm install
npm run dev
```

Puis ouvrir http://localhost:5173. Contrôles : `npm run typecheck` et `npm run build`.

## Architecture prévue

- `src/App.tsx` : accueil provisoire et navigation.
- `src/styles/` : styles globaux ; futurs tokens et thèmes.
- `src/components/` : futurs éléments UI partagés.
- `src/features/` : futurs modules estimation, comparaison et paramétrage.
- `src/services/` : futur client HTTP typé.
- `src/types/` : futurs contrats TypeScript avec l’API.

Les répertoires futurs seront créés avec leurs premières implémentations ; Git ne suit pas les dossiers vides.

## Prochaines étapes

1. Valider l’arborescence, la navigation et les principes de design.
2. Construire le formulaire d’estimation et ses états UX.
3. Exposer le calculateur existant via un backend API Python (sans inventer de résultats).
4. Connecter les résultats, évaluations et visualisations ; ajouter tests et vérifications d’accessibilité.

## Références ECC

Inspiré des compétences `frontend-design-direction`, `design-system`, `frontend-a11y`, `frontend-patterns` de [affaan-m/ECC](https://github.com/affaan-m/ECC). Les principes sont adaptés au projet, sans importer l’exécution de scripts ou hooks tiers.
