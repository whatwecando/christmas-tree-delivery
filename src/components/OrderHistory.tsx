import React from 'react';
import { TreeOrder } from '../types/order';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface OrderHistoryProps {
  order: TreeOrder;
  onClose: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ order, onClose }) => {
  const history = order.history?.sort((a, b) => b.timestamp - a.timestamp) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto z-50">
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200"
          aria-label="Fermer"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="mt-2">
          <h2 className="text-2xl font-bold text-gray-800 pr-8">
            Historique des modifications - {order.customer.firstName} {order.customer.lastName}
          </h2>
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-gray-600">Aucun historique disponible</p>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className="border-l-4 border-green-500 pl-4 py-2"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <p className="font-medium text-gray-800">{entry.action}</p>
                    </div>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Statut: {entry.previousStatus} → {entry.newStatus}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
