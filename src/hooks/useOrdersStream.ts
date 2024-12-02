import { useState, useEffect } from 'react';
import { TreeOrder } from '../types/order';

export function useOrdersStream(apiUrl: string) {
  const [orders, setOrders] = useState<TreeOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${apiUrl}/orders/stream`);

    eventSource.onmessage = (event) => {
      try {
        const orders = JSON.parse(event.data) as TreeOrder[];
        setOrders(orders);
      } catch (err) {
        console.error('Erreur lors du parsing des données:', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Erreur SSE:', error);
      setError('Erreur de connexion au serveur');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [apiUrl]);

  return { orders, error };
}
