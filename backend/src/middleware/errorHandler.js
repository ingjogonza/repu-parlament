const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
  
    // Error de validación de MongoDB
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Datos inválidos'
      });
    }
  
    // Error de conexión a MongoDB
    if (err.name === 'MongoServerError' || err.name === 'MongoError') {
      return res.status(503).json({
        success: false,
        message: 'Error de base de datos temporalmente no disponible',
        error: process.env.NODE_ENV === 'development' ? err.message : null
      });
    }
  
    // Error 404
    if (err.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado'
      });
    }
  
    // Error genérico del servidor
    res.status(err.status || 500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? err.stack : null
    });
  };
  
  module.exports = errorHandler;
  