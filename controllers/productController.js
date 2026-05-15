const Product = require("../models/Product");

// GET PRODUCTS (SEARCH + FILTER + PAGINATION)
exports.getProducts = async (req, res) => {
  const { search, category, page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .skip(skip)
    .limit(limit);

  res.json({ success: true, products });
};

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};