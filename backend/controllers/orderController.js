const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order
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

  try {
    // Create the order
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

// Get a specific order by ID
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ success: true, message: 'Order updated successfully', order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
