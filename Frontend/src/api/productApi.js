import { apiRequest } from './apiClient.js';

const toQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return query.toString();
};

export const productApi = {
  getProducts: (params = {}) => apiRequest(`/products?${toQuery(params)}`),
  getProduct: (id) => apiRequest(`/products/${id}`),
  getCategories: () => apiRequest('/categories'),
  adminProducts: (params = {}) => apiRequest(`/products/admin/all?${toQuery(params)}`),
  createProduct: (payload) => apiRequest('/products/admin', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduct: (id, payload) => apiRequest(`/products/admin/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProduct: (id) => apiRequest(`/products/admin/${id}`, { method: 'DELETE' }),
};
