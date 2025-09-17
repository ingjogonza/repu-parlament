import React, { useEffect, useState } from 'react';
import { useCandidatos } from './hooks/useCandidatos';
import Selector from './components/Selector';
import CandidatosCard from './components/CandidatosCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const {
    regiones,
    comunas,
    candidatos,
    loading,
    error,
    cargarRegiones,
    cargarComunas,
    cargarCandidatos,
    clearError
  } = useCandidatos();

  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');

  // Cargar regiones al montar el componente
  useEffect(() => {
    cargarRegiones();
  }, [cargarRegiones]);

  // Manejar cambio de región
  const handleRegionChange = (region) => {
    setRegionSeleccionada(region);
    setComunaSeleccionada(''); // Reset comuna selection
    clearError();
    
    if (region) {
      cargarComunas(region);
    }
  };

  // Manejar cambio de comuna
  const handleComunaChange = (comuna) => {
    setComunaSeleccionada(comuna);
    clearError();
    
    if (comuna) {
      cargarCandidatos(comuna);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Consulta de Candidatos
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Encuentra información sobre candidatos a senadores y diputados según tu ubicación en Chile
            </p>
          </div>
        </header>

        {/* Selectores */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Selector
              label="1. Selecciona tu Región"
              value={regionSeleccionada}
              onChange={handleRegionChange}
              options={regiones}
              placeholder="Selecciona una región"
              loading={loading.regiones}
            />

            <Selector
              label="2. Selecciona tu Comuna"
              value={comunaSeleccionada}
              onChange={handleComunaChange}
              options={comunas}
              placeholder="Primero selecciona una región"
              disabled={!regionSeleccionada}
              loading={loading.comunas}
            />
          </div>

          {/* Indicador de progreso */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Progreso</span>
              <span>
                {regionSeleccionada && comunaSeleccionada 
                  ? '2/2 Completado' 
                  : regionSeleccionada 
                    ? '1/2 Selección de región'
                    : '0/2 Comenzar'
                }
              </span>
            </div>
            <div className="mt-2 bg-slate-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: regionSeleccionada && comunaSeleccionada 
                    ? '100%' 
                    : regionSeleccionada 
                      ? '50%' 
                      : '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            message={error}
            onRetry={() => {
              clearError();
              if (comunaSeleccionada) {
                cargarCandidatos(comunaSeleccionada);
              } else if (regionSeleccionada) {
                cargarComunas(regionSeleccionada);
              } else {
                cargarRegiones();
              }
            }}
            className="mb-8"
          />
        )}

        {/* Loading State */}
        {loading.candidatos && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <LoadingSpinner 
              size="lg" 
              message="Buscando candidatos..." 
            />
          </div>
        )}

        {/* Resultados */}
        {candidatos && !loading.candidatos && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <CandidatosCard candidatos={candidatos} />
          </div>
        )}

        {/* Estado inicial */}
        {!regionSeleccionada && !loading.regiones && !error && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Comienza tu búsqueda
              </h3>
              <p className="text-slate-600">
                Selecciona tu región para comenzar a consultar los candidatos de tu zona
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-slate-500">
          <p>
            Aplicación para consulta de candidatos • Desarrollada con React y Node.js
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
