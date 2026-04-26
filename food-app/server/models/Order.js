import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true
    },
    items: [orderItemSchema],
    address: {
      line1: { type: String, required: true },
      line2: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
      contactNumber: { type: String, required: true }
    },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'card', 'upi'], default: 'cod' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
      index: true
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
