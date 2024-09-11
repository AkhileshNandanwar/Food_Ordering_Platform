const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  isDelivered: { type: Boolean, default: false },
  orderDate: { type: Date, default: Date.now },
  trackingId: { type: String, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
