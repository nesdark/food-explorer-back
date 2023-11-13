exports.up = (knex) =>
  knex.schema.createTable('products', (table) => {
    table.increments('id');
    table.text('title').notNullable();
    table.text('description').notNullable();
    table.decimal('price').notNullable();
    table.text('image').notNullable();
  });

exports.down = (knex) => knex.schema.dropTable('products');
