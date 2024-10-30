import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://cbtech-f.onrender.com/api';

console.log('API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Data:', error.response.data);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Clientes
  getClientes: async () => {
    try {
      const response = await api.get('/clientes');
      return response.data;
    } catch (error) {
      console.error('Error fetching clientes:', error);
      throw error;
    }
  },

  getClienteById: async (id: number) => {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cliente ${id}:`, error);
      throw error;
    }
  },

  createCliente: async (data: any) => {
    try {
      const response = await api.post('/clientes', data);
      return response.data;
    } catch (error) {
      console.error('Error creating cliente:', error);
      throw error;
    }
  },

  updateCliente: async (id: number, data: any) => {
    try {
      const response = await api.put(`/clientes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating cliente:', error);
      throw error;
    }
  },

  deleteCliente: async (id: number) => {
    try {
      const response = await api.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting cliente:', error);
      throw error;
    }
  },

  searchClientes: async (query: { nome?: string; telefone?: string }) => {
    try {
      const response = await api.get('/clientes/search', { params: query });
      return response.data;
    } catch (error) {
      console.error('Error searching clientes:', error);
      throw error;
    }
  },

  // Assistências
  getAssistencias: async () => {
    try {
      const response = await api.get('/assistencias');
      return response.data;
    } catch (error) {
      console.error('Error fetching assistências:', error);
      throw error;
    }
  },

  getAssistenciaById: async (id: number) => {
    try {
      const response = await api.get(`/assistencias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching assistência ${id}:`, error);
      throw error;
    }
  },

  createAssistencia: async (data: any) => {
    try {
      const response = await api.post('/assistencias', data);
      return response.data;
    } catch (error) {
      console.error('Error creating assistência:', error);
      throw error;
    }
  },

  updateAssistencia: async (id: number, data: any) => {
    try {
      const response = await api.put(`/assistencias/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating assistência:', error);
      throw error;
    }
  },

  deleteAssistencia: async (id: number) => {
    try {
      const response = await api.delete(`/assistencias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting assistência:', error);
      throw error;
    }
  },

  searchAssistencias: async (query: { marca?: string; modelo?: string }) => {
    try {
      const response = await api.get('/assistencias/search', { params: query });
      return response.data;
    } catch (error) {
      console.error('Error searching assistências:', error);
      throw error;
    }
  }
};

export { api };