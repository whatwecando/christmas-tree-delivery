import React, { useState } from 'react';
import { TreeCard } from './TreeCard';
import { ChristmasTree, TreeSize } from '../types/tree';

interface TreeGridProps {
  trees: ChristmasTree[];
  sizes: TreeSize[];
  onTreeSelect?: (tree: ChristmasTree) => void;
}

export const TreeGrid: React.FC<TreeGridProps> = ({ trees, sizes, onTreeSelect }) => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const filteredTrees = selectedSize
    ? trees.filter(tree => tree.size === selectedSize)
    : trees;

  return (
    <div className="space-y-6">
      {/* Filtres de taille */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedSize(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${!selectedSize 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Toutes les tailles
        </button>
        {sizes.map((size) => (
          <button
            key={size.value}
            onClick={() => setSelectedSize(size.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedSize === size.value 
                ? 'text-white' 
                : 'text-gray-700 hover:bg-gray-200'
              }`}
            style={{
              backgroundColor: selectedSize === size.value ? size.colorCode : '#f3f4f6',
              color: selectedSize === size.value && isLightColor(size.colorCode) ? '#000' : undefined
            }}
          >
            {size.label}
          </button>
        ))}
      </div>

      {/* Grille de sapins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrees.map((tree) => (
          <TreeCard
            key={tree.id}
            tree={tree}
            onSelect={onTreeSelect}
          />
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredTrees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucun sapin ne correspond à ces critères
          </p>
        </div>
      )}
    </div>
  );
};

// Fonction utilitaire pour déterminer si une couleur est claire
function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness > 155;
}
