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
    const { title, ingredients, category } = request.query;
    let products;

    const tableProducts = await knex('products');
    const tableCategory = await knex('category').where({ name: category });
    if (category) {
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
    } else if (ingredients) {
      const filterIngredients = ingredients.split(',').map((tag) => tag.trim());
      // Transforme em array a partir de ,

      products = await knex('ingredients')
        .select(['products.id', 'products.title'])
        .whereLike('products.title', `%${title}%`)
        .whereIn('name', filterIngredients)
        .innerJoin('products', 'products.id', 'ingredients.product_id')
        .orderBy('products.title');
      console.log(products);
    } else {
      products = await knex('products')
        .whereLike('products.title', `%${title}%`) // Tanto antes quanto depois, se houver title %%
        .orderBy('products.title');
    }

    const tableIngredients = await knex('ingredients');
    const productsWithTags = products.map((product) => {
      const productTags = tableIngredients.filter(
        (ingredient) => ingredient.product_id == product.id
      );
      return {
        ...product,
        ingredients: productTags,
      };
    });
    return response.json(productsWithTags);
  }
}

module.exports = ProductsControllers;
