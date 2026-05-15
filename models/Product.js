const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    shortDescription: String,
    price: Number,
    discountPrice: Number,
    slug: String,
    stock: Number,
    quantity: Number,
    sold: { type: Number, default: 0 },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },

    brand: String,
    tags: [String],

    images: [String],
    thumbnail: String,

    isFeatured: Boolean,
    isDeleted: { type: Boolean, default: false },

    variants: [
      {
        size: String,
        color: String,
        quantity: Number
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);