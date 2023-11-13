// const sqliteConnection = require('../../sqlite');

// const createUsers = require('./createUsers');

// async function migrationsRun() {
//   const schemas = [createUsers].join('\n'); // Se refere as tabelas que o banco de dados vai ter, por isso é usado o array

//   sqliteConnection()
//     .then((db) => db.exec(schemas))
//     .catch((error) => console.error(error));
// }

// module.exports = migrationsRun;
