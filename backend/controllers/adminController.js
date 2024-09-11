const Product = require('../models/Product');
const Order = require('../models/Order');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

//Register Admin
exports.registerAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ success: false, message: 'Admin already exists' });
      }
  
      // Create a new admin
      const admin = new Admin({ email, password });
      await admin.save();
  
      res.status(201).json({ success: true, message: 'Admin registered successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

//Admin Login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Validate admin credentials
      const admin = await Admin.findOne({ email });
  
      if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ success: true, token });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
// Add a new product (Admin only)
exports.addProduct = async (req, res) => {
  const { name, category, price, stock, description, imageUrl } = req.body;
  try {
    const product = new Product({ name, category, price, stock, description, imageUrl });
    await product.save();
    res.status(201).json({ success: true, message: 'Product added successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update a product (Admin only)
exports.updateProduct = async (req, res) => {
  const { name, category, price, stock, description, imageUrl } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, stock, description, imageUrl },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product updated', updatedProduct });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = status;
    await order.save();
    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
