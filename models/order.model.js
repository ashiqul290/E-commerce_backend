const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        title: String,                  // Product Title at time of order
        price: Number,                  // Price at time of order
        discountPrice: Number,          // Discounted price if any
        quantity: Number,               // Quantity ordered
        variant: {                      // Optional variant info
          size: String,
          color: String
        },
        thumbnail: String               // Product thumbnail
      }
    ],

    totalAmount: Number,                // Total order amount
    paymentMethod: { 
      type: String, 
      enum: ["COD", "Online"], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["Pending", "Confirmed", "Shipped", "Delivered"], 
      default: "Pending" 
    },

    shippingAddress: {
      name: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);