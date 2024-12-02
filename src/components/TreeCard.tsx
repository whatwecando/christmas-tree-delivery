import React from 'react';
import Image from 'next/image';
import { ChristmasTree } from '../types/tree';

interface TreeCardProps {
  tree: ChristmasTree;
  onSelect?: (tree: ChristmasTree) => void;
}

export const TreeCard: React.FC<TreeCardProps> = ({ tree, onSelect }) => {
  return (
    <div 
      className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={() => onSelect?.(tree)}
    >
      <div className="absolute top-2 right-2 z-10">
        <span 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: tree.colorCode,
            color: isLightColor(tree.colorCode) ? '#000' : '#fff'
          }}
        >
          {tree.size}m
        </span>
      </div>
      
      <div className="relative h-48 w-full">
        {tree.imageUrl ? (
          <Image
            src={tree.imageUrl}
            alt={tree.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg
              className="h-20 w-20 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3L4 15h16L12 3z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{tree.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{tree.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">
            {tree.price.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}
          </span>
          <span className={`text-sm font-medium ${
            tree.stock > 5 ? 'text-green-500' : 'text-orange-500'
          }`}>
            {tree.stock} en stock
          </span>
        </div>
      </div>
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
