const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  ingredients: {
      type: [String],
      required: true
  },
  status: {
    type: String,
    required: false
  },
  user: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Order', orderSchema);
