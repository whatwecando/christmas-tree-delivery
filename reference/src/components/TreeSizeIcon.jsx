import React from 'react';
import { getTreeSizeIcon } from '../utils/treeSizeUtils';

export function TreeSizeIcon({ size }) {
  const icon = getTreeSizeIcon(size);
  
  return (
    <div className="inline-flex items-center gap-2">
      <span className="font-extrabold text-lg">{size}</span>
      <span className="text-xl" title={`Indicateur pour sapin de ${size}`}>
        {icon}
      </span>
    </div>
  );
}