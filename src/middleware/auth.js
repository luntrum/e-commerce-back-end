require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const whiteLists = ['/', '/login', '/register'];
  const apiPrefix = process.env.API_PREFIX || '/v1/api';

  if (whiteLists.some((item) => req.originalUrl === `${apiPrefix}${item}`)) {
    return next();
  } else {
    if (req.headers && req.headers.authorization) {
      // Đổi điều kiện kiểm tra tại đây
      const token = req.headers.authorization.split(' ')[1]; // Sửa lỗi "slpit" thành "split"
      // Xác thực token
      try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('check decode: ', decode);
        next();
      } catch (err) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }
    } else {
      return res.status(401).json({
        message: 'bạn chưa truyền access token ở header/hoặc token hết hạn',
      });
    }
  }
};

module.exports = auth;
