import React from 'react';
import { TreeSizeFlag } from './TreeSizeFlag';

export function DeliveryCard({ delivery, onStatusUpdate }) {
  return (
    <div
      className={`p-6 rounded-lg shadow-md ${
        delivery.isDelivered ? 'bg-green-50' : 'bg-white'
      }`}
    >
      <h2 className="text-xl font-bold text-gray-800">{delivery.customerName}</h2>
      <p className="text-gray-600 mt-2">{delivery.address}</p>
      <p className="text-gray-600">{delivery.phoneNumber}</p>
      <p className="text-gray-600 flex items-center gap-2">
        <span>Taille:</span>
        <TreeSizeFlag size={delivery.treeSize} />
      </p>
      
      <div className="mt-4 flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full ${
          delivery.isDelivered 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {delivery.isDelivered ? '✅ Livré' : '🚚 En attente'}
        </span>
        
        <button
          onClick={() => onStatusUpdate(delivery.id, !delivery.isDelivered)}
          className={`px-4 py-2 rounded-md ${
            delivery.isDelivered
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {delivery.isDelivered ? 'Annuler' : 'Marquer livré'}
        </button>
      </div>
    </div>
  );
}