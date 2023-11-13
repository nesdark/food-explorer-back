exports.up = (knex) =>
  knex.schema.createTable('category', (table) => {
    table.increments('id');
    table.text('name').notNullable();
    table.integer('product_id').references('id').inTable('products');
  });

exports.down = (knex) => knex.schema.dropTable('category');
