import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Clientes
  getClientes: () => axios.get(`${API_URL}/clientes`),
  createCliente: (data: any) => {
    console.log('Fazendo requisição POST para criar cliente:', `${API_URL}/clientes`, data);
    return axios.post(`${API_URL}/clientes`, data);
  },
  getCliente: (id: number) => axios.get(`${API_URL}/clientes/${id}`),
  updateCliente: (id: number, data: any) => axios.put(`${API_URL}/clientes/${id}`, data),
  deleteCliente: (id: number) => axios.delete(`${API_URL}/clientes/${id}`),

  // Assistencias
  getAssistencias: () => axios.get(`${API_URL}/assistencias`),
  createAssistencia: (data: any) => axios.post(`${API_URL}/assistencias`, data),
  getAssistencia: (id: number) => axios.get(`${API_URL}/assistencias/${id}`),
  updateAssistencia: (id: number, data: any) => axios.put(`${API_URL}/assistencias/${id}`, data),
  deleteAssistencia: (id: number) => axios.delete(`${API_URL}/assistencias/${id}`),
};

console.log('API_URL:', API_URL);