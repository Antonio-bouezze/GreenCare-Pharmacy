import { apiRequest } from './apiClient.js';

export const orderApi = {
  createOrder: (payload) => apiRequest('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  myOrders: () => apiRequest('/orders/my-orders'),
  getOrder: (id) => apiRequest(`/orders/${id}`),
};
