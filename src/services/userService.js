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

module.exports = {
  createUserService,
  loginService,
  getUserService,
};
