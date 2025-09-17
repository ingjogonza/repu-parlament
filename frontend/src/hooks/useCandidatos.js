import { useState, useCallback } from 'react';
import { candidatosAPI } from '../services/api';

export const useCandidatos = () => {
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [candidatos, setCandidatos] = useState(null);
  const [loading, setLoading] = useState({
    regiones: false,
    comunas: false,
    candidatos: false
  });
  const [error, setError] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const cargarRegiones = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, regiones: true }));
      setError(null);
      
      const regionesData = await candidatosAPI.obtenerRegiones();
      setRegiones(regionesData);
    } catch (err) {
      setError(err.message);
      setRegiones([]);
    } finally {
      setLoading(prev => ({ ...prev, regiones: false }));
    }
  }, []);

  const cargarComunas = useCallback(async (nombreRegion) => {
    if (!nombreRegion) {
      setComunas([]);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, comunas: true }));
      setError(null);
      setCandidatos(null); // Limpiar candidatos al cambiar región
      
      const comunasData = await candidatosAPI.obtenerComunasPorRegion(nombreRegion);
      setComunas(comunasData);
    } catch (err) {
      setError(err.message);
      setComunas([]);
    } finally {
      setLoading(prev => ({ ...prev, comunas: false }));
    }
  }, []);

  const cargarCandidatos = useCallback(async (nombreComuna) => {
    if (!nombreComuna) {
      setCandidatos(null);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, candidatos: true }));
      setError(null);
      
      const candidatosData = await candidatosAPI.obtenerCandidatosPorComuna(nombreComuna);
      setCandidatos(candidatosData);
    } catch (err) {
      setError(err.message);
      setCandidatos(null);
    } finally {
      setLoading(prev => ({ ...prev, candidatos: false }));
    }
  }, []);

  return {
    regiones,
    comunas,
    candidatos,
    loading,
    error,
    cargarRegiones,
    cargarComunas,
    cargarCandidatos,
    clearError
  };
};
