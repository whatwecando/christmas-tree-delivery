import { TreeOrder, Customer, DeliveryStatus } from '../types/order';

interface ColumnMapping {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email?: string;
  treeSize: string;
  requestScoutDelivery: string;
}

const POSSIBLE_COLUMN_NAMES: Record<keyof ColumnMapping, string[]> = {
  firstName: ['prénom', 'prenom', 'firstname', 'first name', 'first_name'],
  lastName: ['nom', 'lastname', 'last name', 'last_name', 'nom de famille'],
  address: ['adresse', 'address', 'addresse'],
  phoneNumber: ['téléphone', 'telephone', 'phone', 'tel', 'tél', 'numéro', 'numero'],
  email: ['email', 'e-mail', 'courriel', 'mail'],
  treeSize: ['taille', 'size', 'hauteur', 'height', 'taille du sapin', 'tree size'],
  requestScoutDelivery: ['scout', 'livraison scout', 'scout delivery', 'livraison par scout']
};

export const findColumnMapping = (headers: string[]): ColumnMapping => {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  const mapping: Partial<ColumnMapping> = {};

  Object.entries(POSSIBLE_COLUMN_NAMES).forEach(([key, possibleNames]) => {
    const matchingHeader = normalizedHeaders.find(header =>
      possibleNames.some(name => header.includes(name))
    );
    if (matchingHeader) {
      mapping[key as keyof ColumnMapping] = headers[normalizedHeaders.indexOf(matchingHeader)];
    }
  });

  // Vérifier les colonnes obligatoires
  const requiredColumns: (keyof ColumnMapping)[] = ['firstName', 'lastName', 'address', 'phoneNumber', 'treeSize'];
  const missingColumns = requiredColumns.filter(col => !mapping[col]);

  if (missingColumns.length > 0) {
    throw new Error(`Colonnes manquantes : ${missingColumns.join(', ')}`);
  }

  return mapping as ColumnMapping;
};

export const validatePhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) {
    throw new Error(`Numéro de téléphone invalide : ${phone}`);
  }
  return cleaned;
};

export const validateTreeSize = (size: string): number => {
  const normalized = size.replace(',', '.').replace(/[^\d.]/g, '');
  const numSize = parseFloat(normalized);
  
  if (isNaN(numSize) || numSize < 1 || numSize > 3) {
    throw new Error(`Taille de sapin invalide : ${size}`);
  }
  
  return numSize;
};

export const processExcelRow = (
  row: any,
  mapping: ColumnMapping
): Omit<TreeOrder, 'id'> => {
  try {
    const customer: Customer = {
      id: Math.random().toString(36).substring(2, 15),
      firstName: row[mapping.firstName]?.trim() || '',
      lastName: row[mapping.lastName]?.trim() || '',
      address: row[mapping.address]?.trim() || '',
      phoneNumber: validatePhoneNumber(row[mapping.phoneNumber] || ''),
      email: row[mapping.email]?.trim()
    };

    if (!customer.firstName || !customer.lastName || !customer.address) {
      throw new Error('Informations client incomplètes');
    }

    const requestScoutDelivery = row[mapping.requestScoutDelivery]
      ? ['oui', 'yes', '1', 'true', 'x'].includes(row[mapping.requestScoutDelivery].toString().toLowerCase().trim())
      : false;

    return {
      customer,
      treeSize: validateTreeSize(row[mapping.treeSize] || ''),
      colorCode: Math.random().toString(16).substring(2, 8),
      orderDate: new Date().toISOString(),
      requestScoutDelivery,
      deliveryStatus: DeliveryStatus.PENDING,
      history: [{
        timestamp: Date.now(),
        action: 'Commande créée via import Excel',
        previousStatus: DeliveryStatus.PENDING,
        newStatus: DeliveryStatus.PENDING
      }]
    };
  } catch (error) {
    throw new Error(`Erreur ligne ${JSON.stringify(row)}: ${error.message}`);
  }
};
