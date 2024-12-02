import React, { useState, useRef } from 'react';
import { read, utils } from 'xlsx';
import { ref, get, set } from 'firebase/database';
import { db } from '../utils/firebase';
import { findColumnMapping } from '../utils/columnMapping';
import { validateDelivery } from '../utils/deliveryValidator';

export function ExcelImport() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    try {
      setError(null);
      setSuccess(null);
      
      const file = event.target.files[0];
      if (!file) return;

      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      if (!jsonData || jsonData.length === 0) {
        throw new Error("Le fichier Excel est vide ou mal formaté");
      }

      console.log('Données Excel brutes:', jsonData);

      const columnMap = findColumnMapping(Object.keys(jsonData[0]));
      console.log('Mapping des colonnes:', columnMap);
      
      const deliveriesRef = ref(db, 'deliveries');
      const snapshot = await get(deliveriesRef);
      const existingDeliveries = snapshot.val() || {};
      
      const existingDeliveriesSet = new Set(
        Object.values(existingDeliveries).map(d => 
          `${d.customerName}-${d.phoneNumber}-${d.treeSize}`
        )
      );

      const newDeliveries = {};
      const skippedDeliveries = [];
      const errors = [];
      
      for (const [index, row] of jsonData.entries()) {
        try {
          console.log(`Traitement ligne ${index + 2}:`, row);
          const delivery = validateDelivery(row, columnMap);
          console.log('Livraison validée:', delivery);

          const deliveryKey = `${delivery.customerName}-${delivery.phoneNumber}-${delivery.treeSize}`;
          
          if (existingDeliveriesSet.has(deliveryKey)) {
            skippedDeliveries.push(delivery.customerName);
            continue;
          }
          
          const newDeliveryId = `delivery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          newDeliveries[newDeliveryId] = {
            ...delivery,
            history: {
              [`${Date.now()}`]: {
                userId: 'import_excel',
                timestamp: Date.now(),
                action: 'Import depuis Excel',
                previousStatus: false,
                newStatus: false
              }
            }
          };
        } catch (error) {
          console.error(`Erreur ligne ${index + 2}:`, error);
          errors.push(`Ligne ${index + 2}: ${error.message}`);
        }
      }

      if (errors.length > 0) {
        throw new Error("Erreurs lors de l'import:\n" + errors.join("\n"));
      }

      if (Object.keys(newDeliveries).length === 0 && skippedDeliveries.length === 0) {
        throw new Error("Aucune donnée valide à importer");
      }

      if (Object.keys(newDeliveries).length > 0) {
        await set(ref(db, 'deliveries'), {
          ...existingDeliveries,
          ...newDeliveries
        });
      }

      setSuccess(`${Object.keys(newDeliveries).length} livraisons importées avec succès.${
        skippedDeliveries.length > 0 
          ? `\n${skippedDeliveries.length} doublons ignorés.`
          : ''
      }`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Importer des commandes depuis Excel</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Format du fichier Excel :</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li><strong>Nom client</strong> ou <strong>Client</strong> (obligatoire)</li>
            <li><strong>Adresse</strong> (obligatoire)</li>
            <li><strong>Téléphone</strong> ou <strong>Tél</strong> (obligatoire)</li>
            <li><strong>Taille sapin</strong> (obligatoire) - La couleur du drapeau sera automatiquement assignée :
              <ul className="ml-6 mt-1 space-y-1 list-none text-sm">
                <li>• 1m - 1m25 : 🔴 Rouge</li>
                <li>• 1m25 - 1m50 : 🟢 Vert</li>
                <li>• 1m50 - 1m75 : 🔵 Bleu</li>
                <li>• 1m75 - 2m : ⚪ Blanc</li>
                <li>• 2m - 2m50 : 🔴 Rouge</li>
                <li>• 2m50 - 3m : 💗 Rose</li>
              </ul>
            </li>
            <li><strong>Date souhaitée</strong> (obligatoire, format JJ/MM/AAAA)</li>
            <li><strong>Scout</strong> (optionnel, valeurs acceptées : oui, non, true, false, x)</li>
          </ul>
          <p className="text-sm text-gray-500 mt-2">
            Note : Les en-têtes de colonnes peuvent varier légèrement mais doivent contenir les mots-clés ci-dessus.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100
              cursor-pointer"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md">
            <p className="font-semibold">Erreur :</p>
            <p className="whitespace-pre-line">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md">
            <p className="font-semibold">Succès :</p>
            <p className="whitespace-pre-line">{success}</p>
          </div>
        )}
      </div>
    </div>
  );
}