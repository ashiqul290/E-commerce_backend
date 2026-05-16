const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    title: String,

    price: Number,

    discountPrice: Number,

    thumbnail: String,

    quantity: {
      type: Number,
      default: 1,
    },

    variant: {
      size: String,
      color: String,
    },
  },
],

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "COD",
    },

    status: {
      type: String,
      default: "Pending",
    },
    shippingAddress: {

  fullName: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  city: String,

  postalCode: String,

  note: String,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);