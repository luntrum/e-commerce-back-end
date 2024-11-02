const { name } = require('ejs');
const {
  createUserService,
  loginService,
  getUserService,
} = require('../services/userService');

const createUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  const data = await createUserService(name, username, email, password);

  if (data) {
    return res.status(data.status).json(data.data);
  } else {
    return res.status(400).json({ message: 'Tạo người dùng thất bại' });
  }
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  const data = await loginService(username, password);

  if (data && data.EC === 0) {
    return res
      .status(200)
      .json({ message: 'Đăng nhập thành công', user: data.user, EC: 0 });
  } else {
    return res
      .status(401)
      .json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
  }
};

const getUser = async (req, res) => {
  const { username } = req.body;
  try {
    const data = await getUserService(username);

    if (data) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'internal server error' });
  }
};

module.exports = { createUser, handleLogin, getUser };