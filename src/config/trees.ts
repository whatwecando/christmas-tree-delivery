import { TreeSize } from '../types/tree';

export const TREE_SIZES: TreeSize[] = [
  {
    value: 1,
    label: '1m - Petit',
    colorCode: '#90EE90', // Vert clair
    description: 'Parfait pour les petits espaces'
  },
  {
    value: 1.5,
    label: '1.5m - Moyen-',
    colorCode: '#228B22', // Vert forêt
    description: 'Idéal pour les appartements'
  },
  {
    value: 2,
    label: '2m - Moyen',
    colorCode: '#006400', // Vert foncé
    description: 'Taille standard pour maison'
  },
  {
    value: 2.5,
    label: '2.5m - Grand-',
    colorCode: '#B8860B', // Marron doré
    description: 'Pour les grands salons'
  },
  {
    value: 3,
    label: '3m - Grand',
    colorCode: '#8B4513', // Marron
    description: 'Pour les très grands espaces'
  },
  {
    value: 4,
    label: '4m - Géant',
    colorCode: '#800000', // Bordeaux
    description: 'Pour les espaces exceptionnels'
  }
];
