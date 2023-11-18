const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const DiskStorage = require('../providers/DiskStorage');

class DishImageController {
  async update(request, response) {
    const productId = request.params.id;

    let dishImageFileName;
    try {
      dishImageFileName = request.file.filename;
    } catch {
      return response.json();
    }

    const diskStorage = new DiskStorage();

    const product = await knex('products').where({ id: productId }).first();

    if (!product) {
      throw new AppError('O prato não existe!');
    }

    if (product.image) {
      await diskStorage.deleteFile(product.image);
    }

    const filename = await diskStorage.saveFile(dishImageFileName);
    product.image = filename;

    await knex('products').update(product).where({ id: productId });

    return response.json(product);
  }
}

module.exports = DishImageController;
