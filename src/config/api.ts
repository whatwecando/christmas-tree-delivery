export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://christmas-tree-api.pcarontelders.workers.dev';

export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  ORDERS: `${API_URL}/orders`,
  ORDERS_STREAM: `${API_URL}/orders/stream`,
} as const;
