'use client'

import { useState } from 'react'

interface Delivery {
  id: number
  customerName: string
  phone: string
  address: string
  treeSize: 'small' | 'medium' | 'large'
  isDelivered: boolean
  requestedDeliveryDate: string
  requestedTimeSlot: string
  notes?: string
}

const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 1,
    customerName: "Marie Dupont",
    phone: "06 12 34 56 78",
    address: "123 rue des Sapins, 75001 Paris",
    treeSize: "medium",
    isDelivered: false,
    requestedDeliveryDate: "2023-12-15",
    requestedTimeSlot: "14:00-16:00",
    notes: "Code entrée: 1234"
  },
  {
    id: 2,
    customerName: "Jean Martin",
    phone: "06 98 76 54 32",
    address: "45 avenue des Pins, 75002 Paris",
    treeSize: "large",
    isDelivered: false,
    requestedDeliveryDate: "2023-12-15",
    requestedTimeSlot: "10:00-12:00",
    notes: "Sonner à l'interphone"
  },
]

const formatPhoneNumber = (phone: string) => {
  return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
}

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

const getSizeColor = (size: string) => {
  switch (size) {
    case 'small':
      return 'bg-blue-100 text-blue-800'
    case 'medium':
      return 'bg-green-100 text-green-800'
    case 'large':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(MOCK_DELIVERIES)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase())
  }

  const handleStatusChange = (deliveryId: number) => {
    setDeliveries(deliveries.map(delivery => 
      delivery.id === deliveryId 
        ? { 
            ...delivery, 
            isDelivered: !delivery.isDelivered,
          }
        : delivery
    ))
  }

  const filteredDeliveries = deliveries
    .filter(delivery => 
      delivery.customerName.toLowerCase().includes(searchTerm) ||
      delivery.address.toLowerCase().includes(searchTerm) ||
      delivery.phone.includes(searchTerm)
    )
    .sort((a, b) => {
      // D'abord par date
      const dateCompare = a.requestedDeliveryDate.localeCompare(b.requestedDeliveryDate)
      if (dateCompare !== 0) return dateCompare
      // Puis par horaire
      return a.requestedTimeSlot.localeCompare(b.requestedTimeSlot)
    })

  return (
    <div className="pb-16">
      {/* Barre de recherche fixe */}
      <div className="sticky top-[72px] bg-white z-40 px-4 py-2 shadow-sm">
        <input
          type="text"
          placeholder="Rechercher un client..."
          className="w-full rounded-full border-0 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600"
          onChange={handleSearch}
        />
      </div>

      {/* Statistiques en cards scrollables horizontalement */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          <div className="bg-white rounded-lg shadow px-4 py-3 w-32">
            <p className="text-xs text-gray-500">Aujourd'hui</p>
            <p className="text-2xl font-semibold text-gray-900">
              {deliveries.filter(d => d.requestedDeliveryDate === new Date().toISOString().split('T')[0]).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow px-4 py-3 w-32">
            <p className="text-xs text-gray-500">En attente</p>
            <p className="text-2xl font-semibold text-gray-900">
              {deliveries.filter(d => !d.isDelivered).length}
            </p>
          </div>
          {['small', 'medium', 'large'].map(size => (
            <div key={size} className="bg-white rounded-lg shadow px-4 py-3 w-32">
              <p className="text-xs text-gray-500">Sapins {size}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {deliveries.filter(d => !d.isDelivered && d.treeSize === size).length}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des livraisons */}
      <div className="px-4">
        <div className="space-y-4">
          {filteredDeliveries.map((delivery) => (
            <div 
              key={delivery.id}
              className={`bg-white rounded-lg shadow p-4 ${
                delivery.isDelivered ? 'bg-gray-50' : ''
              }`}
              onClick={() => setSelectedDelivery(delivery)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{delivery.customerName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{formatPhoneNumber(delivery.phone)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStatusChange(delivery.id)
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    delivery.isDelivered 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {delivery.isDelivered ? 'Livré' : 'À livrer'}
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">{delivery.address}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getSizeColor(delivery.treeSize)}`}>
                    {delivery.treeSize}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(delivery.requestedDeliveryDate)} • {delivery.requestedTimeSlot}
                  </span>
                </div>
                {delivery.notes && (
                  <p className="mt-2 text-sm text-gray-500">
                    📝 {delivery.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de détails (à implémenter si nécessaire) */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-xl w-full p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{selectedDelivery.customerName}</h2>
              <button 
                onClick={() => setSelectedDelivery(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            {/* Ajouter plus de détails et d'actions ici */}
            <button 
              onClick={() => setSelectedDelivery(null)}
              className="w-full bg-green-600 text-white rounded-lg py-2 font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
