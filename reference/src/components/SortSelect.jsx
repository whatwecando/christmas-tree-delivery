import React from 'react';

export function SortSelect({ sortBy, onSortChange }) {
  return (
    <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value)}
      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-lg transition-colors duration-200"
    >
      <option value="name">Trier par nom</option>
      <option value="status">Trier par statut</option>
      <option value="size">Trier par taille</option>
      <option value="date">Trier par date de livraison souhaitée</option>
      <option value="scout">Trier par livraison scout</option>
    </select>
  );
}