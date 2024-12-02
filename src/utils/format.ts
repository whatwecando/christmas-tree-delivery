export const formatPhoneNumber = (phoneNumber: string): string => {
  // Nettoie le numéro en ne gardant que les chiffres
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Si le numéro a 10 chiffres, on le formate en XX XX XX XX XX
  return cleaned.length === 10 
    ? cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5') 
    : phoneNumber;
};
