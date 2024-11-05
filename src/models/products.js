const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes leading/trailing spaces
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensures price can't be negative
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'apparel', 'home', 'books', 'other'], // Limits categories
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    match: /^https?:\/\/.*\.(jpeg|jpg|png|gif)$/i, // Ensures the string is a URL for an image file
  },
  product_id: {
    type: Number,
    unique: true,
  },
});

productSchema.plugin(AutoIncrement, {
  inc_field: 'product_id',
  id: 'auto',
  start_seq: 1,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
