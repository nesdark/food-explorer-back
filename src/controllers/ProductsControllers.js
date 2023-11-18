const knex = require('../database/knex');

class ProductsControllers {
  async create(request, response) {
    const { title, description, price, image, ingredients, category } =
      request.body;
    const [product_id] = await knex('products').insert({
      title,
      description,
      price,
      image,
      category,
    });

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        product_id,
        name: ingredient,
      };
    });

    await knex('ingredients').insert(ingredientsInsert);

    return response.json({ id: product_id });
  }
  async delete(request, response) {
    const { id } = request.params;
    await knex('products').where({ id }).delete();
    return response.json();
  }

  async update(request, response) {
    const { title, description, price, ingredients, category } = request.body;
    const { id } = request.params;

    const dish = await knex('products').where({ id });

    if (!dish) {
      throw new AppError('Prato não encontrado!');
    }

    dish.title = title ?? dish.title;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;
    dish.category = category ?? dish.category;

    await knex('products')
      .where({ id })
      .update({ title, description, price, category });

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        product_id: id,
        name: ingredient,
      };
    });

    await knex('ingredients').where({ product_id: id }).delete();
    await knex('ingredients').insert(ingredientsInsert);

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;
    const product = await knex('products').where({ id }).first();
    const ingredients = await knex('ingredients')
      .where({ product_id: id })
      .orderBy('name');
    return response.json({ ...product, ingredients });
  }

  async index(request, response) {
    const { search, returnAll } = request.query;
    let products;

    const ingredients = await knex('ingredients').whereLike(
      'name',
      `%${search}%`
    );

    const tableProducts = await knex('products');
    if (returnAll) {
      products = await knex('products').orderBy('category');
    } else if (ingredients.length != 0) {
      products = await knex('ingredients')
        .select([
          'products.id',
          'products.title',
          'products.price',
          'products.image',
          'products.description',
          'products.category',
        ])
        .whereLike('name', `%${search}%`)
        .innerJoin('products', 'products.id', 'ingredients.product_id')
        .groupBy('products.id')
        .orderBy('products.title');
    } else {
      products = await knex('products')
        .whereLike('products.title', `%${search}%`) // Tanto antes quanto depois, se houver title %%
        .orderBy('products.title');
    }

    const tableIngredients = await knex('ingredients');
    const productsWithIngredients = products.map((product) => {
      const productIngredients = tableIngredients.filter(
        (ingredient) => ingredient.product_id == product.id
      );
      return {
        ...product,
        ingredients: productIngredients,
      };
    });
    return response.json(productsWithIngredients);
  }
}

module.exports = ProductsControllers;
