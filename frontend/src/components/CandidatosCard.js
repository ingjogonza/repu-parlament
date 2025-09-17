import React from 'react';

const CandidatosCard = ({ candidatos }) => {
  if (!candidatos) return null;

  const { region, comuna, circunscripcion, distrito } = candidatos;

  return (
    <div className="space-y-6">
      {/* Header con información de ubicación */}
      <div className="text-center bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Candidatos para {comuna}
        </h2>
        <p className="text-lg text-slate-600">
          Región: <span className="font-semibold text-slate-800">{region}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Candidatos a Senador */}
        <div className="card">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m0 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-2a1 1 0 011-1h1a1 1 0 011 1v2M7 21h10" />
            </svg>
            <h3 className="text-xl font-bold text-slate-800">
              Senadores
            </h3>
          </div>
          
          <div className="mb-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm font-semibold text-slate-700">
              Circunscripción Senatorial: {circunscripcion.numero}
            </p>
          </div>

          <div className="space-y-3">
            {circunscripcion.candidatos.length > 0 ? (
              circunscripcion.candidatos.map((candidato, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 mb-1">
                        {candidato.nombre}
                      </h4>
                      <p className="text-sm text-slate-600">
                        Partido: {candidato.partido}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {candidato.lugar_papeleta}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">
                No se encontraron candidatos a senador
              </p>
            )}
          </div>
        </div>

        {/* Candidatos a Diputado */}
        <div className="card">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-bold text-slate-800">
              Diputados
            </h3>
          </div>
          
          <div className="mb-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm font-semibold text-slate-700">
              Distrito: {distrito.numero}
            </p>
          </div>

          <div className="space-y-3">
            {distrito.candidatos.length > 0 ? (
              distrito.candidatos.map((candidato, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 mb-1">
                        {candidato.nombre}
                      </h4>
                      <p className="text-sm text-slate-600">
                        Partido: {candidato.partido}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {candidato.lugar_papeleta}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">
                No se encontraron candidatos a diputado
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatosCard;
