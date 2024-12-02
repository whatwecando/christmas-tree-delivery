# Application de Livraison de Sapins de Noël

Application web responsive pour la gestion et le suivi des livraisons de sapins de Noël.

## Fonctionnalités principales

- 🎄 Catalogue de sapins avec différentes tailles et variétés
- 📅 Système de réservation avec choix de la date de livraison
- 📍 Suivi en temps réel des livraisons
- 📱 Interface responsive adaptée à tous les appareils
- 🔄 Synchronisation en temps réel avec Firebase

## Technologies utilisées

- React avec TypeScript pour une application web robuste
- Material-UI pour une interface moderne et responsive
- Firebase Realtime Database pour la synchronisation en temps réel
- Vite pour un développement rapide
- GitHub Actions pour le CI/CD

## Installation

```bash
npm install
```

## Configuration Firebase

1. Créer un projet Firebase
2. Activer la Realtime Database
3. Configurer les règles de sécurité
4. Copier les informations de configuration dans `src/config/firebase.ts`

## Développement

```bash
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## Déploiement

L'application est configurée pour être déployée sur Netlify. Le déploiement se fait automatiquement à chaque push sur la branche main.
