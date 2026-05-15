// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  img: {
    type: String, // সাধারণত URL বা ফাইলপাথ
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);