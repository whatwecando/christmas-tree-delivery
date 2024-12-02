import React, { useState, useRef } from 'react';
import { read, utils } from 'xlsx';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { findColumnMapping, processExcelRow } from '../utils/excel';
import { TreeOrder } from '../types/order';

interface ExcelImportProps {
  onImport: (orders: Omit<TreeOrder, 'id'>[]) => void;
  onClose: () => void;
}

export const ExcelImport: React.FC<ExcelImportProps> = ({ onImport, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setSuccess(null);
      setProcessing(true);
      
      const file = event.target.files?.[0];
      if (!file) return;

      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      if (!jsonData || jsonData.length === 0) {
        throw new Error("Le fichier Excel est vide ou mal formaté");
      }

      const columnMap = findColumnMapping(Object.keys(jsonData[0]));
      const newOrders: Omit<TreeOrder, 'id'>[] = [];
      const errors: string[] = [];

      for (const row of jsonData) {
        try {
          const order = processExcelRow(row, columnMap);
          newOrders.push(order);
        } catch (error) {
          errors.push(error.message);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Erreurs lors de l'import :\n${errors.join('\n')}`);
      }

      onImport(newOrders);
      setSuccess(`${newOrders.length} commandes importées avec succès`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

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
            Importer des commandes
          </h2>
        </div>

        <div className="mt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fichier Excel (.xlsx)
              </label>
              <div className="mt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={processing}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Le fichier doit contenir les colonnes suivantes : Prénom, Nom, Adresse, Téléphone, Taille du sapin
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-800 whitespace-pre-line">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-md bg-green-50 border border-green-200">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            {processing && (
              <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-800">Traitement du fichier en cours...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
