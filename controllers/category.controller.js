// controllers/categoryController.js
const Category = require('../models/category.model.js');
const slugify = require('slugify'); // slug বানানোর জন্য
const fs = require('fs');
const path = require('path');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    // Duplicate check
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Category name already exists' });

    const img = req.file.path; // multer path
     // URL বানানো (Windows path fix)
    const slug = slugify(name, { lower: true });

    const category = new Category({ name, slug, img });
    await category.save();
    res.status(201).json(category);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name ? slugify(name, { lower: true }) : undefined;
    const img = req.file ? req.file.path : undefined;

    // Optional: check duplicate if name changed
    if (name) {
      const existing = await Category.findOne({ name, _id: { $ne: req.params.id } });
      if (existing) return res.status(400).json({ error: 'Category name already exists' });
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name }), ...(slug && { slug }), ...(img && { img }) },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Category
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Delete Category
exports.deleteCategory = async (req, res) => {
   try {
    // 1️⃣ Find category
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    // 2️⃣ Delete image file if exists
    if (category.img) {
      const imgPath = path.join(__dirname, '..', category.img); // relative path from DB
      fs.access(imgPath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(imgPath, (err) => {
            if (err) console.log('Image delete error:', err);
            else console.log('Image deleted:', imgPath);
          });
        } else {
          console.log('Image file not found, skipping delete:', imgPath);
        }
      });
    }

    // 3️⃣ Delete MongoDB document
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: 'Category deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};