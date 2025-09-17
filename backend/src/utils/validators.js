const { param } = require('express-validator');

const validateRegionParam = () => {
  return param('nombreRegion')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('Nombre de región inválido')
    .customSanitizer(value => {
      return value.replace(/[<>\"'&]/g, '');
    });
};

const validateComunaParam = () => {
  return param('nombreComuna')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('Nombre de comuna inválido')
    .customSanitizer(value => {
      return value.replace(/[<>\"'&]/g, '');
    });
};

module.exports = {
  validateRegionParam,
  validateComunaParam
};
