import React from 'react';
import { TreeOrder, DeliveryStatus } from '../types/order';
import { formatPhoneNumber } from '../utils/format';

interface OrderCardProps {
  order: TreeOrder;
  onSelect?: (order: TreeOrder) => void;
  onStatusChange: (status: DeliveryStatus) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onSelect, onStatusChange }) => {
  const handleStatusChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusChange(DeliveryStatus.DELIVERED);
  };

  return (
    <div 
      onClick={() => onSelect?.(order)}
      className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer
        ${order.deliveryStatus === DeliveryStatus.DELIVERED ? 'bg-green-50' : 'bg-white'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{order.customer.firstName} {order.customer.lastName}</h3>
        {order.requestScoutDelivery && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Scout</span>
        )}
      </div>
      
      <div className="space-y-1 text-gray-600">
        <p>📞 {formatPhoneNumber(order.customer.phoneNumber)}</p>
        <p>📍 {order.customer.address}</p>
        <p>🎄 Taille: {order.treeSize}m</p>
      </div>

      {order.deliveryStatus !== DeliveryStatus.DELIVERED && (
        <button
          onClick={handleStatusChange}
          className="mt-3 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          Marquer comme livré
        </button>
      )}

      {order.deliveryStatus === DeliveryStatus.DELIVERED && (
        <div className="mt-3 text-green-600 font-medium text-center">
          ✓ Livré
        </div>
      )}
    </div>
  );
};
