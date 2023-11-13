const { Router } = require('express');

const IngredientsControllers = require('../controllers/IngredientsControllers.js');

const IngredientsRoutes = Router();

const ingredientsControllers = new IngredientsControllers();

IngredientsRoutes.get('/', ingredientsControllers.index);

module.exports = IngredientsRoutes;
