const candidatosService = require('../netlify-candidatos-service');

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Método no permitido'
      }),
    };
  }

  try {
    const regiones = await candidatosService.obtenerRegiones();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: regiones,
        count: regiones.length
      }),
    };
  } catch (error) {
    console.error('Error en /regiones:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: error.message
      }),
    };
  }
};
