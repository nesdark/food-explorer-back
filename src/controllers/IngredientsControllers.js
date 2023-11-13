const knex = require('../database/knex');

class IngredientsController {
  async index(request, response) {
    const ingredients = await knex('ingredients').orderBy('name');

    return response.json(ingredients);
  }
}

module.exports = IngredientsController;
