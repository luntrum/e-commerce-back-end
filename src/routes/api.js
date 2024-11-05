const express = require('express');
const {
  createUser,
  handleLogin,
  getUser,
} = require('../controllers/userController');
const {
  createProductController,
  getProductController,
  getAllProductsController,
  selectProductController,
} = require('../controllers/productController');
const routerAPI = express.Router();

// routerAPI.all('*', auth);

routerAPI.get('/', (req, res) => {
  res.status(200).json({ message: 'api ok' });
});
//for user
routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);
routerAPI.post('/user', getUser);

routerAPI.post('/addProduct', createProductController);
routerAPI.get('/getProduct', getProductController);
routerAPI.get('/getAllProduct', getAllProductsController);
routerAPI.post('/selectProduct', selectProductController);
module.exports = routerAPI;
