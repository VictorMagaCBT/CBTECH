import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const apiService = {
  // Clientes
  getClientes: () => api.get('/clientes'),
  createCliente: (data: any) => {
    console.log('Fazendo requisição POST para criar cliente:', `${API_URL}/clientes`, data);
    return api.post('/clientes', data);
  },
  getCliente: (id: number) => api.get(`/clientes/${id}`),
  updateCliente: (id: number, data: any) => api.put(`/clientes/${id}`, data),
  deleteCliente: (id: number) => api.delete(`/clientes/${id}`),

  // Assistencias
  getAssistencias: () => api.get('/assistencias'),
  createAssistencia: (data: any) => api.post('/assistencias', data),
  getAssistencia: (id: number) => api.get(`/assistencias/${id}`),
  updateAssistencia: (id: number, data: any) => api.put(`/assistencias/${id}`, data),
  deleteAssistencia: (id: number) => api.delete(`/assistencias/${id}`),
};

export { api };