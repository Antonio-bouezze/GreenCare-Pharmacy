import { apiRequest } from './apiClient.js';

export const adminApi = {
  dashboardStats: () => apiRequest('/admin/dashboard-stats'),
  allOrders: () => apiRequest('/orders/admin/all'),
  updateOrderStatus: (id, status) => apiRequest(`/orders/admin/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};
