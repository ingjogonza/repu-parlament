const express = require('express');
const router = express.Router();
const candidatosController = require('../controllers/candidatosController');
const { validateRegionParam, validateComunaParam } = require('../utils/validators');

// GET /api/regiones - Obtener todas las regiones
router.get('/regiones', candidatosController.obtenerRegiones);

// GET /api/comunas/:nombreRegion - Obtener comunas por región
router.get('/comunas/:nombreRegion', 
  validateRegionParam(),
  candidatosController.obtenerComunasPorRegion
);

// GET /api/candidatos/:nombreComuna - Obtener candidatos por comuna
router.get('/candidatos/:nombreComuna',
  validateComunaParam(),
  candidatosController.obtenerCandidatosPorComuna
);

module.exports = router;
