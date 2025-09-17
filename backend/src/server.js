const app = require('./app');
const database = require('./config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Conectar a la base de datos
    await database.connect();

    // Iniciar el servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });

    // Manejo graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n📡 Recibida señal ${signal}. Cerrando servidor...`);
      
      server.close(async () => {
        console.log('🔒 Servidor HTTP cerrado.');
        
        try {
          await database.close();
          console.log('✅ Aplicación cerrada exitosamente');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error durante el cierre:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
}

startServer();
