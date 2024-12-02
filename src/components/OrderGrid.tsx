import React, { useState, useEffect } from 'react';
import { OrderCard } from './OrderCard';
import { TreeOrder, DeliveryStatus } from '../types/order';
import { TreeSize } from '../types/tree';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ExcelImport } from './ExcelImport';
import { useOrdersStream } from '../hooks/useOrdersStream';
import { useAuth } from '../contexts/AuthContext';

interface OrderGridProps {
  sizes: TreeSize[];
  onOrderSelect?: (order: TreeOrder) => void;
}

export const OrderGrid: React.FC<OrderGridProps> = ({ sizes, onOrderSelect }) => {
  const { token } = useAuth();
  const { orders, error } = useOrdersStream(process.env.NEXT_PUBLIC_API_URL || '');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [showScoutDeliveryOnly, setShowScoutDeliveryOnly] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(null);
  const [showImport, setShowImport] = useState(false);

  const updateOrderStatus = async (orderId: string, status: DeliveryStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedSize && order.treeSize !== selectedSize) return false;
    if (showScoutDeliveryOnly && !order.requestScoutDelivery) return false;
    if (searchName) {
      const fullName = `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase();
      if (!fullName.includes(searchName.toLowerCase())) return false;
    }
    if (deliveryStatus !== null && order.deliveryStatus !== deliveryStatus) return false;
    return true;
  });

  const deliveredCount = orders.filter(o => o.deliveryStatus === DeliveryStatus.DELIVERED).length;
  const pendingCount = orders.filter(o => o.deliveryStatus === DeliveryStatus.PENDING).length;

  if (error) {
    return <div className="text-red-500">Erreur de connexion: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filtres principaux */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          {/* Filtre de statut de livraison */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Statut de livraison</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setDeliveryStatus(null)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors border
                  ${!deliveryStatus
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                Tous ({orders.length})
              </button>
              <button
                onClick={() => setDeliveryStatus(DeliveryStatus.PENDING)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors border
                  ${deliveryStatus === DeliveryStatus.PENDING
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                À livrer ({pendingCount})
              </button>
              <button
                onClick={() => setDeliveryStatus(DeliveryStatus.DELIVERED)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors border
                  ${deliveryStatus === DeliveryStatus.DELIVERED
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                Livrés ({deliveredCount})
              </button>
            </div>
          </div>

          {/* Recherche par nom */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Rechercher par nom</h3>
            <div className="relative">
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Nom du client..."
                className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Filtres de taille */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Taille du sapin</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSize(null)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border
                    ${!selectedSize 
                      ? 'bg-gray-900 text-white border-gray-900' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  Toutes les tailles
                </button>
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border
                      ${selectedSize === size.value ? 'text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    style={{
                      backgroundColor: selectedSize === size.value ? size.colorCode : undefined
                    }}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtre livraison scout */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Type de livraison</h3>
              <button
                onClick={() => setShowScoutDeliveryOnly(!showScoutDeliveryOnly)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border
                  ${showScoutDeliveryOnly
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                🚚 Livraison Scout ({orders.filter(o => o.requestScoutDelivery).length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* En-tête avec les filtres */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Filtres existants... */}
        </div>
        <button
          onClick={() => setShowImport(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Importer Excel
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total commandes</div>
          <div className="text-2xl font-bold">{filteredOrders.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Livraisons Scout</div>
          <div className="text-2xl font-bold">
            {filteredOrders.filter(o => o.requestScoutDelivery).length}
          </div>
        </div>
      </div>

      {/* Grille des commandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onSelect={onOrderSelect}
            onStatusChange={(status) => updateOrderStatus(order.id, status)}
          />
        ))}
      </div>

      {showImport && (
        <ExcelImport
          onImport={(newOrders) => {
            // Ici, vous devrez implémenter la logique pour ajouter les nouvelles commandes
            // à votre système de stockage
            setShowImport(false);
          }}
          onClose={() => setShowImport(false)}
        />
      )}

      {/* Message si aucun résultat */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucune commande ne correspond à ces critères
          </p>
        </div>
      )}
    </div>
  );
};
