const { Router } = require('express');

const usersRoutes = require('./users.routes');
const sessionsRouter = require('./sessions.routes.js');
const productsRoutes = require('./products.routes');
const ingredientsRoutes = require('./ingredients.routes.js');

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRouter);

routes.use('/products', productsRoutes);
routes.use('/ingredients', ingredientsRoutes);

module.exports = routes;
