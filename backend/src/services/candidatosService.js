const database = require('../config/database');

class CandidatosService {
  constructor() {
    this.collectionName = 'candidatos';
  }

  getCollection() {
    const db = database.getDb();
    return db.collection(this.collectionName);
  }

  async obtenerRegiones() {
    try {
      const collection = this.getCollection();
      
      const regiones = await collection.distinct('nombre_region');
      
      if (!regiones || regiones.length === 0) {
        throw new Error('No se encontraron regiones en la base de datos');
      }

      return regiones.sort();
    } catch (error) {
      console.error('Error en obtenerRegiones:', error);
      throw new Error(`Error al obtener regiones: ${error.message}`);
    }
  }

  async obtenerComunasPorRegion(nombreRegion) {
    try {
      const collection = this.getCollection();
      
      const resultado = await collection.findOne(
        { nombre_region: new RegExp(`^${nombreRegion}$`, 'i') },
        { projection: { circunscripciones_senatoriales: 1 } }
      );

      if (!resultado) {
        throw new Error(`No se encontró la región: ${nombreRegion}`);
      }

      const comunas = new Set();
      
      resultado.circunscripciones_senatoriales.forEach(circunscripcion => {
        circunscripcion.distritos.forEach(distrito => {
          distrito.comunas.forEach(comuna => {
            comunas.add(comuna);
          });
        });
      });

      return Array.from(comunas).sort();
    } catch (error) {
      console.error('Error en obtenerComunasPorRegion:', error);
      throw new Error(`Error al obtener comunas: ${error.message}`);
    }
  }

  async obtenerCandidatosPorComuna(nombreComuna) {
    try {
      const collection = this.getCollection();
      
      const resultado = await collection.findOne({
        'circunscripciones_senatoriales.distritos.comunas': new RegExp(`^${nombreComuna}$`, 'i')
      });

      if (!resultado) {
        throw new Error(`No se encontró información para la comuna: ${nombreComuna}`);
      }

      let candidatosInfo = null;

      // Buscar la circunscripción y distrito correspondiente
      for (const circunscripcion of resultado.circunscripciones_senatoriales) {
        for (const distrito of circunscripcion.distritos) {
          const comunaEncontrada = distrito.comunas.find(
            comuna => comuna.toLowerCase() === nombreComuna.toLowerCase()
          );
          
          if (comunaEncontrada) {
            candidatosInfo = {
              region: resultado.nombre_region,
              comuna: comunaEncontrada,
              circunscripcion: {
                numero: circunscripcion.numero_circunscripcion,
                candidatos: circunscripcion.candidatos_senador.map(candidato => ({
                  nombre: candidato.nombre,
                  lugar_papeleta: candidato.lugar_papeleta,
                  partido: candidato.rss?.partido || 'No especificado'
                }))
              },
              distrito: {
                numero: distrito.numero_distrito,
                candidatos: distrito.candidatos_diputado.map(candidato => ({
                  nombre: candidato.nombre,
                  lugar_papeleta: candidato.lugar_papeleta,
                  partido: candidato.rss?.partido || 'No especificado'
                }))
              }
            };
            break;
          }
        }
        if (candidatosInfo) break;
      }

      if (!candidatosInfo) {
        throw new Error(`No se encontraron candidatos para la comuna: ${nombreComuna}`);
      }

      return candidatosInfo;
    } catch (error) {
      console.error('Error en obtenerCandidatosPorComuna:', error);
      throw new Error(`Error al obtener candidatos: ${error.message}`);
    }
  }
}

module.exports = new CandidatosService();
