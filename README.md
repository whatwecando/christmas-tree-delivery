# Christmas Tree Delivery App

Application web responsive pour la gestion des livraisons de sapins de Noël.

## Workflow de Développement

1. **Développement Local (Windsurf)**
   - Développement dans l'IDE Windsurf
   - Tests locaux avec `npm run dev`
   - Commit et push des changements vers GitHub

2. **Intégration Continue (GitHub)**
   - Les push sur `main` déclenchent automatiquement :
     - Build de l'application
     - Tests (si configurés)
     - Déploiement vers Netlify

3. **Déploiement (Netlify)**
   - Déploiement automatique après succès du build
   - Preview des Pull Requests
   - Rollback facile en cas de problème

## Configuration Requise

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Scripts Disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Build l'application pour la production
- `npm run preview` : Preview la version de production en local
- `npm run lint` : Vérifie le code avec ESLint

## Structure du Projet

```
christmas-tree-delivery/
├── src/               # Code source
├── public/           # Fichiers statiques
├── dist/            # Build de production
└── .github/         # Configuration GitHub Actions
```

## Technologies Utilisées

- React 18
- TypeScript
- Vite
- Firebase
- Material UI
- TailwindCSS
