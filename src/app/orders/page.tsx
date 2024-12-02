'use client';

import React from 'react';
import { OrderGrid } from '../../components/OrderGrid';
import { TREE_SIZES } from '../../config/trees';
import { TreeOrder, DeliveryStatus, PaymentStatus } from '../../types/order';
import { DELIVERY_DATE, formatDeliveryDate } from '../../config/delivery';

// Données de démonstration
const DEMO_ORDERS: TreeOrder[] = [
  {
    id: '1',
    customer: {
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      address: '123 Rue de Paris, 75001 Paris',
      phoneNumber: '06 12 34 56 78',
      email: 'jean.dupont@email.com'
    },
    treeSize: 2,
    colorCode: '#006400',
    orderDate: '2023-12-01',
    requestScoutDelivery: true,
    deliveryStatus: DeliveryStatus.DELIVERED,
    price: 89.99,
    paymentStatus: PaymentStatus.PAID,
    notes: 'Livraison souhaitée le weekend'
  },
  {
    id: '2',
    customer: {
      id: '2',
      firstName: 'Marie',
      lastName: 'Martin',
      address: '45 Avenue des Champs-Élysées, 75008 Paris',
      phoneNumber: '06 98 76 54 32',
    },
    treeSize: 1.5,
    colorCode: '#228B22',
    orderDate: '2023-12-02',
    requestScoutDelivery: false,
    deliveryStatus: DeliveryStatus.PENDING,
    price: 69.99,
    paymentStatus: PaymentStatus.PENDING
  },
  {
    id: '3',
    customer: {
      id: '3',
      firstName: 'Pierre',
      lastName: 'Bernard',
      address: '78 Boulevard Saint-Germain, 75006 Paris',
      phoneNumber: '06 11 22 33 44',
      email: 'pierre.b@email.com'
    },
    treeSize: 3,
    colorCode: '#8B4513',
    orderDate: '2023-12-03',
    requestScoutDelivery: true,
    deliveryStatus: DeliveryStatus.IN_PROGRESS,
    price: 149.99,
    paymentStatus: PaymentStatus.PAID,
    notes: 'Accès par l\'arrière du bâtiment'
  },
  {
    id: '4',
    customer: {
      id: '4',
      firstName: 'Sophie',
      lastName: 'Petit',
      address: '15 Rue de la République, 69001 Lyon',
      phoneNumber: '06 55 44 33 22',
    },
    treeSize: 2.5,
    colorCode: '#B8860B',
    orderDate: '2023-12-04',
    requestScoutDelivery: true,
    deliveryStatus: DeliveryStatus.ASSIGNED,
    price: 119.99,
    paymentStatus: PaymentStatus.PAID
  },
  {
    id: '5',
    customer: {
      id: '5',
      firstName: 'Lucas',
      lastName: 'Roux',
      address: '92 Route de la Plage, 06000 Nice',
      phoneNumber: '06 99 88 77 66',
      email: 'lucas.r@email.com'
    },
    treeSize: 4,
    colorCode: '#800000',
    orderDate: '2023-12-05',
    requestScoutDelivery: true,
    deliveryStatus: DeliveryStatus.PENDING,
    price: 299.99,
    paymentStatus: PaymentStatus.PENDING,
    notes: 'Pour le hall d\'entrée de l\'hôtel'
  }
];

export default function OrdersPage() {
  const handleOrderSelect = (order: TreeOrder) => {
    console.log('Commande sélectionnée:', order);
    // Ici vous pourrez ajouter la logique pour afficher les détails de la commande
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Liste des commandes
      </h1>
      
      <OrderGrid
        orders={DEMO_ORDERS}
        sizes={TREE_SIZES}
        onOrderSelect={handleOrderSelect}
      />
    </div>
  );
}
