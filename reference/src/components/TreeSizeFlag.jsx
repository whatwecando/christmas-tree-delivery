import React from 'react';
import { getTreeSizeColor } from '../utils/treeSizeUtils';

const colorMap = {
  red: 'bg-red-600',
  green: 'bg-green-600',
  blue: 'bg-blue-600',
  white: 'bg-white border border-gray-300',
  pink: 'bg-pink-500'
};

export function TreeSizeFlag({ size }) {
  const color = getTreeSizeColor(size);
  const textColor = color === 'white' ? 'text-gray-900' : 'text-white';
  
  return (
    <div className="inline-flex items-center gap-2">
      <span className="font-extrabold text-lg">{size}</span>
      <div 
        className={`w-5 h-8 ${colorMap[color]} ${textColor} rounded shadow-sm relative`}
        title={`Drapeau pour sapin de ${size}`}
      >
        <div className="w-0.5 h-full absolute left-1 bg-black/10" />
      </div>
    </div>
  );
}