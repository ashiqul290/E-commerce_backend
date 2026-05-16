const Product = require("../models/Product");
const User = require("../models/User");
const orderModel = require("../models/order.model");

exports.addtoController = async (req, res) => {

  const {
    userId,
    productId,
    quantity = 1,
    variant
  } = req.body;

  try {

    // user check
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // product check
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // cart না থাকলে create
    if (!user.cart) {
      user.cart = [];
    }

    // already exists check
    const existingItem = user.cart.find(
      (item) =>
        item.product.toString() === productId &&
        (
          !variant ||
          (
            item.variant?.size === variant?.size &&
            item.variant?.color === variant?.color
          )
        )
    );

    // quantity increase
    if (existingItem) {

      existingItem.quantity += quantity;

    } else {

      // add new item
      user.cart.push({
        product: productId,
        quantity,
        variant,
      });
    }

    await user.save();

    res.status(200).json({
      message: "Product added to cart",
      cart: user.cart,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.orderCodController = async (req, res) => {

  const { userId, shippingAddress } = req.body;

  try {

    const user = await User.findById(userId)
      .populate("cart.product");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // validation
    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.address
    ) {
      return res.status(400).json({
        message: "Shipping information required",
      });
    }

    const items = user.cart.map((item) => ({

      product: item.product._id,

      title: item.product.title,

      price: item.product.price,

      discountPrice: item.product.discountPrice,

      quantity: item.quantity || 1,

      variant: item.variant,

      thumbnail: item.product.thumbnail,

    }));

    const totalPrice = items.reduce(

      (sum, item) =>

        sum +
        (item.price || item.discountPrice) *
        item.quantity,

      0
    );

    const order = await orderModel.create({

      user: userId,

      items,

      totalPrice,

      paymentMethod: "COD",

      status: "Pending",

      shippingAddress,

    });

    // clear cart
    user.cart = [];

    await user.save();

    res.status(201).json({

      message: "Order placed successfully",

      order,

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};


exports.getAllOrdersController = async (req, res) => {
 try {

    const allorders = await orderModel
      .find()
      .populate("user")
      .populate("items.product");

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: allorders,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

exports.orderOnlineController = async (req, res) => {
  res.send("order Online")
}