// Configuration des colonnes pour l'import Excel
export const requiredColumns = {
  customerName: ['nom', 'client', 'nom client', 'customer', 'customer name'],
  address: ['adresse', 'address', 'adresse client'],
  phoneNumber: ['telephone', 'téléphone', 'tel', 'tél', 'phone', 'numéro'],
  treeSize: ['taille', 'size', 'taille sapin', 'tree size'],
  requestedDeliveryDate: ['date', 'date souhaitée', 'date livraison', 'delivery date']
};

export const optionalColumns = {
  scoutDeliveryRequested: [
    'scout',
    'livraison scout',
    'scout delivery',
    'livraison par scout',
    'demande scout',
    'scout demandé'
  ]
};

export const findColumnMapping = (headers) => {
  const mapping = {};
  const lowercaseHeaders = headers.map(h => h?.toLowerCase().trim() || '');
  
  // Vérifier les colonnes requises
  Object.entries(requiredColumns).forEach(([key, possibleNames]) => {
    const columnIndex = lowercaseHeaders.findIndex(header => 
      possibleNames.some(name => header.includes(name))
    );
    
    if (columnIndex === -1) {
      throw new Error(`Colonne obligatoire manquante: ${key}`);
    }
    
    mapping[key] = headers[columnIndex];
  });

  // Ajouter les colonnes optionnelles si elles existent
  Object.entries(optionalColumns).forEach(([key, possibleNames]) => {
    const columnIndex = lowercaseHeaders.findIndex(header => 
      possibleNames.some(name => header.includes(name))
    );
    
    if (columnIndex !== -1) {
      mapping[key] = headers[columnIndex];
    } else {
      console.log(`Info: Colonne optionnelle non trouvée: ${key}. Une valeur par défaut sera utilisée.`);
    }
  });
  
  return mapping;
};