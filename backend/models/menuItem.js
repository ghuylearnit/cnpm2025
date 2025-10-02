// models/menuItem.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  isVeg: Boolean,
  images: Array,
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  ratings: Number,
  numOfReviews: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'menus' // <-- QUAN TRỌNG: đúng tên collection bạn đã insert
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
