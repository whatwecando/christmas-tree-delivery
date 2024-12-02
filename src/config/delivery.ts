export const DELIVERY_DATE = '2023-12-16'; // Format YYYY-MM-DD

export const formatDeliveryDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
