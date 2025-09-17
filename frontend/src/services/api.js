import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configuración de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 429) {
      throw new Error('Demasiadas solicitudes. Intenta de nuevo más tarde.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Error del servidor. Intenta de nuevo más tarde.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Tiempo de espera agotado. Verifica tu conexión.');
    }
    
    throw error;
  }
);

export const candidatosAPI = {
  // Obtener todas las regiones
  obtenerRegiones: async () => {
    try {
      const response = await api.get('/regiones');
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo regiones:', error);
      throw new Error(error.response?.data?.message || error.message || 'Error obteniendo regiones');
    }
  },

  // Obtener comunas por región
  obtenerComunasPorRegion: async (nombreRegion) => {
    try {
      if (!nombreRegion || typeof nombreRegion !== 'string') {
        throw new Error('Nombre de región inválido');
      }
      
      const response = await api.get(`/comunas/${encodeURIComponent(nombreRegion)}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo comunas:', error);
      throw new Error(error.response?.data?.message || error.message || 'Error obteniendo comunas');
    }
  },

  // Obtener candidatos por comuna
  obtenerCandidatosPorComuna: async (nombreComuna) => {
    try {
      if (!nombreComuna || typeof nombreComuna !== 'string') {
        throw new Error('Nombre de comuna inválido');
      }
      
      const response = await api.get(`/candidatos/${encodeURIComponent(nombreComuna)}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo candidatos:', error);
      throw new Error(error.response?.data?.message || error.message || 'Error obteniendo candidatos');
    }
  }
};

export default api;
