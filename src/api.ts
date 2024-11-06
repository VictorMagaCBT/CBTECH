import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://cbtech-f.onrender.com/api';

console.log('API_URL:', API_URL);

interface SearchAssistenciaParams {
  marca?: string;
  modelo?: string;
  dataInicio?: string;
  dataFim?: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response; // Return only the data part of the response
  },
  error => {
    console.error('Response Error:', error);
    if (error.response) {
      console.error('Error Data:', error.response.data);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error Request:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  getClientes: async () => {
    try {
      return await api.get('/clientes');
    } catch (error) {
      console.error('Error fetching clientes:', error);
      throw error;
    }
  },

  getClienteById: async (id: number) => {
    try {
      return await api.get(`/clientes/${id}`);
    } catch (error) {
      console.error(`Error fetching cliente ${id}:`, error);
      throw error;
    }
  },

  createCliente: async (data: any) => {
    try {
      return await api.post('/clientes', data);
    } catch (error) {
      console.error('Error creating cliente:', error);
      throw error;
    }
  },

  updateCliente: async (id: number, data: any) => {
    try {
      return await api.put(`/clientes/${id}`, data);
    } catch (error) {
      console.error('Error updating cliente:', error);
      throw error;
    }
  },

  deleteCliente: async (id: number) => {
    try {
      return await api.delete(`/clientes/${id}`);
    } catch (error) {
      console.error('Error deleting cliente:', error);
      throw error;
    }
  },

  searchClientes: async (query: { nome?: string; telefone?: string }) => {
    try {
      return await api.get('/clientes/search', { params: query });
    } catch (error) {
      console.error('Error searching clientes:', error);
      throw error;
    }
  },

  getAssistencias: async () => {
    try {
      return await api.get('/assistencias');
    } catch (error) {
      console.error('Error fetching assistências:', error);
      throw error;
    }
  },

  getAssistenciaById: async (id: number) => {
    try {
      const response = await api.get(`/assistencias/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error(`Error fetching assistência ${id}:`, error);
      throw error;
    }
  },

  createAssistencia: async (data: any) => {
    try {
      return await api.post('/assistencias', data);
    } catch (error) {
      console.error('Error creating assistência:', error);
      throw error;
    }
  },

  updateAssistencia: async (id: number, data: any) => {
    try {
      console.log('Updating assistência with data:', data);
      const response = await api.put(`/assistencias/${id}`, data);
      return { data: response.data };
    } catch (error) {
      console.error('Error updating assistência:', error);
      throw error;
    }
  },

  deleteAssistencia: async (id: number) => {
    try {
      return await api.delete(`/assistencias/${id}`);
    } catch (error) {
      console.error('Error deleting assistência:', error);
      throw error;
    }
  },

  searchAssistencias: async (query: SearchAssistenciaParams) => {
    try {
      const response = await api.get('/assistencias/search', { params: query });
      return { data: response.data || [] }; // Garante que sempre retorna um array
    } catch (error) {
      console.error('Error searching assistências:', error);
      throw error;
    }
  }
};


export { api };