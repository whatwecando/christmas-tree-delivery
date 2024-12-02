# Application de Livraison de Sapins de Noël

Cette application mobile-first permet de gérer la livraison de sapins de Noël, offrant une expérience utilisateur fluide pour les clients et les livreurs.

## Fonctionnalités principales

- 🎄 Catalogue de sapins avec différentes tailles et variétés
- 📅 Système de réservation avec choix de la date de livraison
- 📍 Suivi en temps réel des livraisons
- 💳 Paiement sécurisé
- 📱 Interface responsive adaptée aux mobiles

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

## Technologies utilisées

- Next.js 13 avec App Router
- TypeScript
- Tailwind CSS
- Prisma (pour la base de données)
- NextAuth.js (pour l'authentification)

## Structure du projet

```
src/
  ├── app/              # Routes et pages de l'application
  ├── components/       # Composants réutilisables
  ├── lib/             # Utilitaires et configurations
  ├── models/          # Types et interfaces TypeScript
  └── styles/          # Styles globaux
```
