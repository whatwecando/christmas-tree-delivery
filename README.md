# Christmas Tree Delivery App

Application mobile pour la gestion et le suivi des livraisons de sapins de Noël.

## Fonctionnalités

- Suivi en temps réel des livraisons de sapins
- Interface mobile réactive
- Synchronisation des données via Cloudflare
- Base de données en temps réel

## Technologies utilisées

- React Native pour l'application mobile
- TypeScript pour un code robuste et typé
- Cloudflare Workers pour l'API
- Cloudflare D1 (SQLite) pour la base de données
- GitHub Actions pour le CI/CD

## Installation

```bash
npm install
```

## Configuration Cloudflare

1. Créer un compte Cloudflare Workers
2. Configurer Wrangler pour le déploiement
3. Initialiser la base de données D1

## Développement

```bash
npm run dev
```

## Déploiement

Le déploiement est automatisé via GitHub Actions vers Cloudflare Workers.
