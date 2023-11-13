exports.up = (knex) =>
  knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.text('name').notNullable();
    table.text('email').notNullable();
    table.text('password').notNullable();

    table
      .enum('role', ['admin', 'user'], { userNative: true, enumName: 'roles' })
      .notNullable()
      .default('user');
  });

exports.down = (knex) => knex.schema.dropTable('users');
