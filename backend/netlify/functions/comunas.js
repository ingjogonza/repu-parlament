const candidatosService = require('../netlify-candidatos-service');

exports.handler = async (event, context) => {
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
    const { region } = event.queryStringParameters || {};
    
    if (!region) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Parámetro región requerido'
        }),
      };
    }

    const comunas = await candidatosService.obtenerComunasPorRegion(decodeURIComponent(region));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: comunas,
        region: decodeURIComponent(region),
        count: comunas.length
      }),
    };
  } catch (error) {
    console.error('Error en /comunas:', error);
    
    if (error.message.includes('No se encontró la región')) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: error.message
        }),
      };
    }
    
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
