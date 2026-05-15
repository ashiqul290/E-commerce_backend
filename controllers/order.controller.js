exports.orderAddController =  async (req, res) => {
  const { userId, productId, quantity, variant } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingItem = user.cart.find(
      item =>
        item.product.equals(productId) &&
        (!variant || (item.variant.size === variant.size && item.variant.color === variant.color))
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity, variant });
    }

    await user.save();
    res.json({ message: "Product added to cart", cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

exports.orderCodController =async (req, res) => {
  const { userId, shippingAddress } = req.body;

  try {
    const user = await User.findById(userId).populate("cart.product");
    if (!user || user.cart.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const items = user.cart.map(item => ({
      product: item.product._id,
      title: item.product.title,
      price: item.product.price,
      discountPrice: item.product.discountPrice,
      quantity: item.quantity,
      variant: item.variant,
      thumbnail: item.product.thumbnail
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * (item.discountPrice || item.price),
      0
    );

    const order = new Order({
      user: userId,
      items,
      totalAmount,
      paymentMethod: "COD",
      status: "Pending",
      shippingAddress
    });

    await order.save();

    // Clear cart
    user.cart = [];
    await user.save();

    res.json({ message: "Order placed successfully (COD)", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}