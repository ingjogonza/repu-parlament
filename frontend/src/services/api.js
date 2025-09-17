import axios from 'axios';

// URL dinámica para Netlify Functions
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://candidatos-chile-backend.netlify.app/.netlify/functions'
  : 'http://localhost:5000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,  // Aumentado para Netlify Functions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors con logging mejorado
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('El servidor está tardando en responder. Intenta de nuevo.');
    }
    
    if (error.response?.status === 502) {
      throw new Error('Función temporalmente no disponible. Intenta de nuevo.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Error del servidor. Intenta de nuevo más tarde.');
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

  // Obtener comunas por región (adaptado para query parameters)
  obtenerComunasPorRegion: async (nombreRegion) => {
    try {
      if (!nombreRegion || typeof nombreRegion !== 'string') {
        throw new Error('Nombre de región inválido');
      }
      
      const response = await api.get(`/comunas?region=${encodeURIComponent(nombreRegion)}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo comunas:', error);
      throw new Error(error.response?.data?.message || error.message || 'Error obteniendo comunas');
    }
  },

  // Obtener candidatos por comuna (adaptado para query parameters)
  obtenerCandidatosPorComuna: async (nombreComuna) => {
    try {
      if (!nombreComuna || typeof nombreComuna !== 'string') {
        throw new Error('Nombre de comuna inválido');
      }
      
      const response = await api.get(`/candidatos?comuna=${encodeURIComponent(nombreComuna)}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo candidatos:', error);
      throw new Error(error.response?.data?.message || error.message || 'Error obteniendo candidatos');
    }
  }
};

export default api;
