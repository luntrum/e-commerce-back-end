const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  selectedProducts: [
    {
      productId: {
        type: Number,
        unique: true,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // Số lượng tối thiểu là 1
      },
    },
  ],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
