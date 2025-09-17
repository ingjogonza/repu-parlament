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
    const { comuna } = event.queryStringParameters || {};
    
    if (!comuna) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Parámetro comuna requerido'
        }),
      };
    }

    const candidatos = await candidatosService.obtenerCandidatosPorComuna(decodeURIComponent(comuna));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: candidatos
      }),
    };
  } catch (error) {
    console.error('Error en /candidatos:', error);
    
    if (error.message.includes('No se encontró')) {
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
