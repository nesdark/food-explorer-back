const { hash, compare } = require('bcryptjs');
const knex = require('../database/knex');

const AppError = require('../utils/AppError');

class UsersControllers {
  async create(request, response) {
    const { name, email, password } = request.body;

    const checkUserExists = await knex('users').where({ email });

    console.log(checkUserExists != []);

    if (!checkUserExists != []) {
      throw new AppError(`Este e-mail já está em uso.`);
    }

    const hashedPassword = await hash(password, 8);
    await knex('users').insert({ name, email, password: hashedPassword });

    return response.status(201).json();
  }
}

module.exports = UsersControllers;
