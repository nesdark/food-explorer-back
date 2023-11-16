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
    });

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        product_id,
        name: ingredient,
      };
    });

    await knex('ingredients').insert(ingredientsInsert);

    const name = category;

    console.log(name);

    await knex('category').insert({ product_id, name });

    return response.json({ id: product_id });
  }
  async delete(request, response) {
    const { id } = request.params;
    await knex('ingredients').where({ id }).delete();
    await knex('products').where({ id }).delete();
    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;
    const product = await knex('products').where({ id }).first();
    const ingredients = await knex('ingredients')
      .where({ product_id: id })
      .orderBy('name');
    const category = await knex('category')
      .where({ product_id: id })
      .orderBy('name');
    return response.json({ ...product, ingredients, category });
  }

  async index(request, response) {
    const { search, category } = request.query;
    let products;

    const ingredients = await knex('ingredients').where({ name: search });

    const tableProducts = await knex('products');
    if (category) {
      const tableCategory = await knex('category').where({ name: category });
      products = tableProducts.map((product) => {
        if (
          tableCategory.map((category) => {
            return product.id == category.product_id;
          })
        ) {
          return product;
        }
      });

      products = await knex('category')
        .select(['products.id', 'products.title'])
        .whereIn('name', category)
        .innerJoin('products', 'products.id', 'category.product_id')
        .orderBy('products.title');
    } else if (ingredients.length != 0) {
      const filterIngredients = search.split(',').map((tag) => tag.trim());
      // Transforme em array a partir de ,

      products = await knex('ingredients')
        .select([
          'products.id',
          'products.title',
          'products.price',
          'products.image',
          'products.description',
          'products.category',
        ])
        .whereLike('products.title', `%${title}%`)
        .whereIn('name', filterIngredients)
        .innerJoin('products', 'products.id', 'ingredients.dish_id')
        .groupBy('products.id')
        .orderBy('products.title');
      console.log(products);
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
