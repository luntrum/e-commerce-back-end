require('dotenv').config();

const { default: mongoose } = require('mongoose');
const Product = require('../models/products');
const User = require('../models/user');
const createProductService = async (data) => {
  try {
    const product = await Product.findOne({ name: data.name }).exec();
    if (product) {
      return {
        status: 400,
        message: `Product already exists`,
      };
    }
    const result = await Product.create(data);
    return { status: 200, data: result };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getProductService = async (name) => {
  try {
    const result = await Product.find({ name: { $regex: name, $options: 'i' } })
      .select('-_id -__v')
      .exec();
    if (result) {
      return { status: 200, data: result };
    } else {
      return { status: 400, message: 'Product not found' };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
const getAllProductsService = async () => {
  try {
    const result = await Product.find().select('-__v').exec();
    return { status: 200, data: result };
  } catch (error) {
    console.log(error);
    return { status: 500, message: 'Internal server error' };
  }
};

const selectProductService = async (userId, productId) => {

  try {
    const updateUser = await User.findById(userId).exec();
    if (!updateUser) {
      return { status: 400, message: 'User not found' };
    } else {
      const productExist = updateUser.selectedProducts.find(
        (sp) => sp.productId === productId,
      );
      if (productExist) {
        await User.updateOne(
          { _id: userId, 'selectedProducts.productId': productId },
          { $inc: { 'selectedProducts.$.quantity': 1 } },
        );
      } else {
        await User.updateOne(
          { _id: userId },
          { $addToSet: { selectedProducts: { productId, quantity: 1 } } },
        );
      }
    }
    const resdata = updateUser.selectedProducts;
    return {
      status: 200,
      data: resdata,
      message: 'Product added to user successfully',
    };
  } catch (error) {
    console.log(error);
    return { status: 500, message: 'Internal server error' };
  }
};

module.exports = {
  createProductService,
  getProductService,
  getAllProductsService,
  selectProductService,
};
