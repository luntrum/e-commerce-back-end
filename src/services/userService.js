require('dotenv').config();
const User = require('../models/user');

// Hàm tạo người dùng
const createUserService = async (name, username, email, password) => {
  try {
    // Kiểm tra xem email đã tồn tại hay chưa
    const user = await User.findOne({ email: email }).exec();
    if (user) {
      return {
        status: 400,
        message: `Email already exists: ${email}`,
      };
    }

    // Lưu thông tin người dùng vào cơ sở dữ liệu mà không cần mã hóa mật khẩu
    const result = await User.create({
      name,
      username,
      email,
      password, // Lưu trực tiếp, không cần mã hóa
      role: 'dân thường',
    });
    return {
      status: 200,
      data: result,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Hàm đăng nhập
const loginService = async (username, password) => {
  try {
    const user = await User.findOne({
      username: username,
      password: password,
    })
      .select('-password  -__v')
      .exec();
    if (user) {
      return {
        EC: 0,
        user: user,
      };
    } else {
      return { EC: 1, EM: 'Username/password not found' };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Hàm lấy thông tin người dùng
const getUserService = async (username) => {
  try {
    const user = await User.findOne({ username })
      .select('-password  -__v')
      .exec();
    if (user) {
      return {
        status: 200,
        data: user,
      };
    } else {
      return {
        status: 400,
        message: 'User not found',
      };
    }
  } catch (error) {
    return null;
  }
};

const updateUserService = async (userId, data) => {
  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    const updateReq = data.updateReq;

    if (updateReq === 'update_items') {
      for (const item of data.items) {
        const { productId, quantity } = item;
        const existingProductIndex = user.selectedProducts.findIndex(
          (product) => product.productId.toString() === productId.toString(),
        );
        console.log('>>>existingProduct', existingProductIndex);

        if (existingProductIndex !== -1) {
          user.selectedProducts[existingProductIndex].quantity = quantity;
        } else {
          user.selectedProducts.push({ productId, quantity });
        }
      }
    } else {
      switch (updateReq) {
        case 'delete_all_items':
          user.selectedProducts = [];
          break;
        case 'delete_item':
          user.selectedProducts = user.selectedProducts.filter(
            (sp) => sp.productId !== data.item,
          );
          break;
        case 'update_item':
          const productIndex = user.selectedProducts.findIndex(
            (sp) => sp.productId === data.productId,
          );
          if (productIndex !== -1) {
            user.selectedProducts[productIndex].quantity = data.quantity;
          }
          break;
        case 'remove_purchase_items':
          const productIdsToRemove = data.data.map((item) => item.productId);
          user.selectedProducts = user.selectedProducts.filter(
            (sp) => !productIdsToRemove.includes(sp.productId),
          );
          break;
        default:
          break;
      }
    }

    await user.save();
    return {
      status: 200,
      data: user,
    };
  } catch (error) {
    console.log(error);
    if (error.message === 'User not found') {
      throw { status: 404, message: 'User not found' };
    }
    return null;
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
  updateUserService,
};
