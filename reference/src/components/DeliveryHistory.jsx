import React from 'react';

export function DeliveryHistory({ delivery, onClose }) {
  const history = delivery.history ? Object.entries(delivery.history).map(([key, value]) => ({
    id: key,
    ...value
  })).sort((a, b) => b.timestamp - a.timestamp) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200"
          aria-label="Fermer"
        >
          ✕
        </button>

        <div className="mt-2">
          <h2 className="text-2xl font-bold text-gray-800 pr-8">
            Historique des modifications - {delivery.customerName}
          </h2>
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-gray-600">Aucun historique disponible</p>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="border-l-4 border-green-500 pl-4 py-2"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <p className="font-medium text-gray-800">{entry.action}</p>
                      <p className="text-sm text-gray-600">Par: {entry.userId}</p>
                    </div>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
                      {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Date inconnue'}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Statut: {entry.previousStatus ? 'Livré' : 'Non livré'} → {entry.newStatus ? 'Livré' : 'Non livré'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}