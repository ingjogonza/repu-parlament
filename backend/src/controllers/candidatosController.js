const candidatosService = require('../services/candidatosService');
const { validationResult } = require('express-validator');

class CandidatosController {
  async obtenerRegiones(req, res, next) {
    try {
      const regiones = await candidatosService.obtenerRegiones();
      
      res.json({
        success: true,
        data: regiones,
        count: regiones.length
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerComunasPorRegion(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Parámetros inválidos',
          errors: errors.array()
        });
      }

      const { nombreRegion } = req.params;
      const comunas = await candidatosService.obtenerComunasPorRegion(nombreRegion);
      
      res.json({
        success: true,
        data: comunas,
        region: nombreRegion,
        count: comunas.length
      });
    } catch (error) {
      if (error.message.includes('No se encontró la región')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  async obtenerCandidatosPorComuna(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Parámetros inválidos',
          errors: errors.array()
        });
      }

      const { nombreComuna } = req.params;
      const candidatos = await candidatosService.obtenerCandidatosPorComuna(nombreComuna);
      
      res.json({
        success: true,
        data: candidatos
      });
    } catch (error) {
      if (error.message.includes('No se encontró') || error.message.includes('No se encontraron')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new CandidatosController();
