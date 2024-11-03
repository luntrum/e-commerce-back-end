const {
  createProductService,
  getProductService,
  getAllProductsService,
} = require('../services/productService');

const createProductController = async (req, res) => {
  const data = req.body;

  const dataProduct = await createProductService(data);
  if (dataProduct) {
    return res.status(dataProduct.status).json(dataProduct.data);
  } else {
    return res.status(400).json({ message: 'Tạo sản phẩm thất bại' });
  }
};

const getProductController = async (req, res) => {
  const { name } = req.body;
  try {
    const data = await getProductService(name);
    console.log(data);
    if (data) {
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'internal server error' });
  }
};
const getAllProductsController = async (req, res) => {
  try {
    const dataProduct = await getAllProductsService();
    return res.status(dataProduct.status).json(dataProduct.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createProductController,
  getProductController,
  getAllProductsController,
};
