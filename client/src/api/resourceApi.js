import API from './axios';

export const listResources = (params) => API.get('/resources', { params });
export const getResource = (id) => API.get(`/resources/${id}`);
export const createResource = (data) => API.post('/resources', data);
export const updateResource = (id, data) => API.put(`/resources/${id}`, data);
export const deleteResource = (id) => API.delete(`/resources/${id}`);

export default {
  listResources,
  getResource,
  createResource,
  updateResource,
  deleteResource
};
