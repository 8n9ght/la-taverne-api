const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: false
  },
  image: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
});

module.exports = mongoose.model('Drink', drinkSchema);
