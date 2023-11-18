require('express-async-errors');
require('dotenv/config');

// const migrationsRun = require('./database/sqlite/migrations');
const express = require('express');
const AppError = require('./utils/AppError');
const routes = require('./routes');
const cors = require('cors');
const uploadConfig = require('./configs/upload');

// Initialize express
const app = express();
app.use(cors());
app.use(express.json()); // Says to the server that the body is JSON

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    console.log(error);

    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  console.error(error);

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
