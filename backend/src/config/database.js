const { MongoClient } = require('mongodb');
require('dotenv').config();

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI no está definida en las variables de entorno');
      }

      // ✅ Configuración moderna - Solo opciones compatibles con driver 6.x
      this.client = new MongoClient(process.env.MONGODB_URI, {
        // Pool de conexiones
        maxPoolSize: 10,
        minPoolSize: 2,
        
        // Timeouts
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        
        // Heartbeat y monitoring
        heartbeatFrequencyMS: 10000,
        
        // Compresión (opcional)
        compressors: ['zlib'],
        
        // Configuración de retry
        retryWrites: true,
        retryReads: true
      });

      await this.client.connect();
      this.db = this.client.db();
      
      console.log('✅ Conectado exitosamente a MongoDB Atlas');
      
      // Verificar la conexión
      await this.db.admin().ping();
      console.log('✅ Ping a MongoDB exitoso');
      
      return this.db;
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error.message);
      throw error;
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Base de datos no conectada. Llama a connect() primero.');
    }
    return this.db;
  }

  async close() {
    if (this.client) {
      await this.client.close();
      console.log('🔐 Conexión a MongoDB cerrada');
    }
  }

  // ✅ Método para verificar el estado de conexión
  isConnected() {
    return this.client && this.db;
  }

  // ✅ Método para manejo de eventos de conexión
  setupEventListeners() {
    if (this.client) {
      this.client.on('open', () => {
        console.log('🔗 Conexión a MongoDB abierta');
      });

      this.client.on('close', () => {
        console.log('🔒 Conexión a MongoDB cerrada');
      });

      this.client.on('error', (error) => {
        console.error('❌ Error de conexión MongoDB:', error);
      });

      this.client.on('reconnect', () => {
        console.log('🔄 Reconexión exitosa a MongoDB');
      });
    }
  }
}

module.exports = new Database();
