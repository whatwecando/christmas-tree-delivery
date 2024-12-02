// Utilitaires de parsing pour l'import Excel
export const formatPhoneNumber = (value) => {
  if (!value) return '';
  const cleaned = String(value).replace(/\D/g, '');
  const withLeadingZero = cleaned.length === 9 ? `0${cleaned}` : cleaned;
  return withLeadingZero.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
};

export const parseExcelDate = (value) => {
  if (!value) return null;
  
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return value;
  }

  try {
    if (typeof value === 'number') {
      const date = new Date((value - 25569) * 86400 * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    if (typeof value === 'string') {
      const [day, month, year] = value.split('/');
      if (day && month && year) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    return null;
  } catch (error) {
    console.error('Erreur lors du parsing de la date:', error);
    return null;
  }
};

export const parseScoutDelivery = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  
  const strValue = String(value).toLowerCase().trim();
  return ['true', 'oui', 'yes', '1', 'vrai', 'x'].includes(strValue);
};