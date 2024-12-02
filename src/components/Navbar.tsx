'use client'

import Link from 'next/link'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
import { DELIVERY_DATE, formatDeliveryDate } from '../config/delivery'

export function Navbar() {
  return (
    <nav className="bg-green-900 sticky top-0 z-50 shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-lg font-bold flex items-center gap-2">
              <span className="text-2xl">🎄</span>
              Les sapins de Saint Roch - Noël 2024
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-green-200 text-sm font-medium">
                Livraison prévue le
              </div>
              <div className="text-white font-semibold">
                {formatDeliveryDate(DELIVERY_DATE)}
              </div>
            </div>
            <button 
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-green-800 p-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
              onClick={() => window.scrollTo(0, 0)}
            >
              <span className="text-sm">↑ Haut</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
