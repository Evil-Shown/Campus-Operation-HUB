import API from './axios';

export const listTickets = (params) => API.get('/tickets', { params });
export const getTicket = (id) => API.get(`/tickets/${id}`);
export const createTicket = (data) => API.post('/tickets', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const addComment = (id, text) => API.post(`/tickets/${id}/comments`, { text });
export const updateTicketStatus = (id, status) => API.patch(`/tickets/${id}/status`, { status });

export default {
  listTickets,
  getTicket,
  createTicket,
  addComment,
  updateTicketStatus
};
