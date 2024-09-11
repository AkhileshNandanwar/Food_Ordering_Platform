const Product = require('../models/Product');

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, category, price, stock, description, imageUrl } = req.body;
  try {
    const product = new Product({ name, category, price, stock, description, imageUrl });
    await product.save();
    return res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Failed to add product',
      error: err.message,
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Failed to retrieve products',
      error: err.message,
    });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Failed to retrieve product',
      error: err.message,
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { name, category, price, stock, description, imageUrl } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, stock, description, imageUrl },
      { new: true, runValidators: true } // `runValidators` ensures validation is applied during updates
    );
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      updatedProduct,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update product',
      error: err.message,
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Failed to delete product',
      error: err.message,
    });
  }
};
