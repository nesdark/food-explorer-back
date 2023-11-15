const { Router } = require('express');
const multer = require('multer');

const ProductsControllers = require('../controllers/ProductsControllers');
const DishImageController = require('../controllers/DishImageController');

const productsRoutes = Router();

const productsControllers = new ProductsControllers();
const dishImageController = new DishImageController();

const uploadConfig = require('../configs/upload');

const verifyUserAuthorization = require('../middlewares/verifyUserAuthorization');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const upload = multer(uploadConfig.MULTER);

productsRoutes.get('/:id', productsControllers.show);
productsRoutes.get('/', productsControllers.index);

productsRoutes.use(ensureAuthenticated);
productsRoutes.use(verifyUserAuthorization('admin'));

productsRoutes.post('/create', productsControllers.create);

productsRoutes.patch(
  '/image/:id',
  upload.single('image'),
  dishImageController.update
);

productsRoutes.delete('/:id', productsControllers.delete);

module.exports = productsRoutes;
