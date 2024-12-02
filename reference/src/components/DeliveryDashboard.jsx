import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue, update, serverTimestamp } from 'firebase/database';
import { SearchBar } from './SearchBar';
import { SortSelect } from './SortSelect';
import { DeliveryHistory } from './DeliveryHistory';
import { ExcelImport } from './ExcelImport';
import { TreeSizeFlag } from './TreeSizeFlag';

const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return cleaned.length === 10 ? cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5') : phoneNumber;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const ScoutBadge = () => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
    <span className="mr-1">⚜️</span>
    Scout
  </span>
);

export function DeliveryDashboard({ user }) {
  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [shouldAutoSort, setShouldAutoSort] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const deliveriesRef = ref(db, 'deliveries');

    const unsubscribe = onValue(deliveriesRef, (snapshot) => {
      const data = snapshot.val();
      const deliveriesList = data ? Object.entries(data).map(([id, values]) => ({
        id,
        ...values,
        scoutDeliveryRequested: values.scoutDeliveryRequested || false
      })) : [];

      if (shouldAutoSort) {
        const sortedDeliveries = applySort(deliveriesList, sortBy);
        setDeliveries(sortedDeliveries);
      } else {
        setDeliveries(deliveriesList);
      }
    });

    return () => unsubscribe();
  }, [sortBy, shouldAutoSort]);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const handleStatusChange = async (delivery) => {
    setShouldAutoSort(false);
    const db = getDatabase();
    const deliveryRef = ref(db, `deliveries/${delivery.id}`);
    const newStatus = !delivery.isDelivered;

    try {
      await update(deliveryRef, {
        isDelivered: newStatus,
        deliveryDate: newStatus ? serverTimestamp() : null,
        [`history/${Date.now()}`]: {
          userId: user.email,
          timestamp: serverTimestamp(),
          action: newStatus ? 'Marqué comme livré' : 'Marqué comme non livré',
          previousStatus: delivery.isDelivered,
          newStatus: newStatus
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const applySort = (deliveriesToSort, sortType) => {
    return [...deliveriesToSort].sort((a, b) => {
      switch (sortType) {
        case 'name':
          return a.customerName.localeCompare(b.customerName);
        case 'status':
          return (a.isDelivered === b.isDelivered) ? 0 : a.isDelivered ? 1 : -1;
        case 'size':
          const getNumericSize = (size) => parseFloat(size.replace('m', ''));
          return getNumericSize(a.treeSize) - getNumericSize(b.treeSize);
        case 'date':
          return (a.requestedDeliveryDate || '').localeCompare(b.requestedDeliveryDate || '');
        case 'scout':
          return (a.scoutDeliveryRequested === b.scoutDeliveryRequested) ? 0 : a.scoutDeliveryRequested ? -1 : 1;
        default:
          return 0;
      }
    });
  };

  const handleSortChange = (newSortType) => {
    setSortBy(newSortType);
    setShouldAutoSort(true);
    const sortedDeliveries = applySort([...deliveries], newSortType);
    setDeliveries(sortedDeliveries);
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const searchLower = searchTerm.toLowerCase();
    return (
      delivery.customerName.toLowerCase().includes(searchLower) ||
      delivery.phoneNumber.replace(/\s/g, '').includes(searchTerm.replace(/\s/g, ''))
    );
  });

  const remainingDeliveries = filteredDeliveries.filter(d => !d.isDelivered).length;
  const totalDeliveries = filteredDeliveries.length;
  const scoutDeliveries = filteredDeliveries.filter(d => d.scoutDeliveryRequested && !d.isDelivered).length;
  const totalScoutDeliveries = filteredDeliveries.filter(d => d.scoutDeliveryRequested).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-4 sm:mb-0">
              🎄 Les Sapins de Saint Roch
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowImport(!showImport)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                {showImport ? 'Masquer l\'import' : 'Importer des commandes'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Se déconnecter
              </button>
            </div>
          </div>

          {showImport && (
            <div className="mb-8">
              <ExcelImport />
            </div>
          )}

          <div className="grid gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-lg font-bold text-green-800 mb-2">Résumé des livraisons</h2>
              <div className="space-y-2">
                <p>
                  <strong>{remainingDeliveries}</strong> sapins restant à livrer sur {totalDeliveries} commandes
                </p>
                <p className="flex items-center gap-2">
                  <span className="inline-block">⚜️</span>
                  <span>
                    <strong>{scoutDeliveries}</strong> livraisons scouts en attente sur {totalScoutDeliveries} demandées
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 mb-6 sm:grid-cols-2">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <SortSelect sortBy={sortBy} onSortChange={handleSortChange} />
          </div>

          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className={`p-4 rounded-lg shadow transition-colors duration-200 ${
                  delivery.isDelivered 
                    ? 'bg-green-50' 
                    : delivery.scoutDeliveryRequested 
                      ? 'bg-yellow-50 border border-yellow-200' 
                      : 'bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {delivery.customerName}
                      </h3>
                      {delivery.scoutDeliveryRequested && <ScoutBadge />}
                    </div>
                    <p className="text-gray-600">{delivery.address}</p>
                    <p className="text-gray-600">Tél: {formatPhoneNumber(delivery.phoneNumber)}</p>
                    <div className="text-gray-600 flex items-center gap-2 mt-2">
                      <span>Taille:</span>
                      <TreeSizeFlag size={delivery.treeSize} />
                    </div>
                    <p className="text-gray-600 mt-2">
                      <strong>Date souhaitée:</strong> {formatDate(delivery.requestedDeliveryDate)}
                    </p>
                    <button
                      onClick={() => setSelectedDelivery(delivery)}
                      className="text-sm text-green-600 hover:text-green-800 mt-2"
                    >
                      Voir l'historique
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleStatusChange(delivery)}
                      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        delivery.isDelivered
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {delivery.isDelivered ? 'Annuler' : 'Marquer comme livré'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDelivery && (
        <DeliveryHistory
          delivery={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
        />
      )}
    </div>
  );
}