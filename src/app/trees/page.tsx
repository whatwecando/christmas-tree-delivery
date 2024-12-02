'use client';

import React from 'react';
import { TreeGrid } from '../../components/TreeGrid';
import { TREE_SIZES } from '../../config/trees';
import { ChristmasTree } from '../../types/tree';

// Données de démonstration
const DEMO_TREES: ChristmasTree[] = [
  {
    id: '1',
    size: 1,
    colorCode: '#90EE90',
    name: 'Sapin Nordmann Compact',
    description: 'Petit sapin touffu, idéal pour les espaces réduits',
    price: 49.99,
    stock: 15,
  },
  {
    id: '2',
    size: 1.5,
    colorCode: '#228B22',
    name: 'Sapin Nordmann Classic',
    description: 'Notre bestseller pour appartement',
    price: 69.99,
    stock: 25,
  },
  {
    id: '3',
    size: 2,
    colorCode: '#006400',
    name: 'Sapin Nordmann Familial',
    description: 'Le sapin parfait pour toute la famille',
    price: 89.99,
    stock: 20,
  },
  {
    id: '4',
    size: 2.5,
    colorCode: '#B8860B',
    name: 'Sapin Nordmann Luxe',
    description: 'Un grand sapin majestueux',
    price: 119.99,
    stock: 10,
  },
  {
    id: '5',
    size: 3,
    colorCode: '#8B4513',
    name: 'Sapin Nordmann Premium',
    description: 'Pour les grandes occasions',
    price: 149.99,
    stock: 5,
  },
  {
    id: '6',
    size: 4,
    colorCode: '#800000',
    name: 'Sapin Nordmann Exceptionnel',
    description: 'Notre plus grand sapin pour les lieux d\'exception',
    price: 299.99,
    stock: 3,
  },
];

export default function TreesPage() {
  const handleTreeSelect = (tree: ChristmasTree) => {
    console.log('Sapin sélectionné:', tree);
    // Ici vous pourrez ajouter la logique pour le panier
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Nos Sapins de Noël
      </h1>
      
      <TreeGrid
        trees={DEMO_TREES}
        sizes={TREE_SIZES}
        onTreeSelect={handleTreeSelect}
      />
    </div>
  );
}
