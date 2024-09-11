const Product = require('../models/Product');

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, category, price, stock, description, imageUrl } = req.body;
  try {
    const product = new Product({ name, category, price, stock, description, imageUrl });
    await product.save();
    res.status(201).json({ success: true, message: 'Product added' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update a product
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

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
