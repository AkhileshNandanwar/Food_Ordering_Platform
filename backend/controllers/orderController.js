const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { products, totalAmount } = req.body;
  const userId = req.user.userId;

  // Validate stock availability
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `${product.name} is out of stock` });
    }
  }

  // Create the order
  try {
    const order = new Order({
      user: userId,
      products,
      totalAmount,
      trackingId: `ORD-${Math.floor(Math.random() * 100000)}`,
    });
    await order.save();

    // Update stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json({ success: true, message: 'Order placed successfully', orderId: order.trackingId });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
