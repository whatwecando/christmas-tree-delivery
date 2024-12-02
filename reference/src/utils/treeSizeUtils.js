export const parseTreeSize = (size) => {
  if (!size) return null;
  
  // Nettoyer la chaîne et extraire le nombre
  const number = size.toString()
    .toLowerCase()
    .replace(',', '.')
    .replace(/[^\d.]/g, '');
  
  const value = parseFloat(number);
  return isNaN(value) ? null : value;
};

export const getTreeSizeColor = (size) => {
  const value = parseTreeSize(size);
  
  if (value === null) return 'white';
  
  // Utiliser des comparaisons strictes pour éviter les erreurs de précision
  if (value > 0 && value <= 1.25) return 'red';
  if (value > 1.25 && value <= 1.50) return 'green';
  if (value > 1.50 && value <= 1.75) return 'blue';
  if (value > 1.75 && value <= 2.00) return 'white';
  if (value > 2.00 && value <= 2.50) return 'red';
  if (value > 2.50 && value <= 3.00) return 'pink';
  
  return 'white'; // Valeur par défaut
};

export const validateTreeSize = (size) => {
  const value = parseTreeSize(size);
  return value !== null && value >= 1.0 && value <= 3.0;
};