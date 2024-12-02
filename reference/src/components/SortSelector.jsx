import React from 'react';

export function SortSelector({ value, onChange }) {
  return (
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
    >
      <option value="name">Trier par nom</option>
      <option value="status">Trier par statut</option>
      <option value="size">Trier par taille</option>
    </select>
  );
}