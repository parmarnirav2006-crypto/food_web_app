import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    nameSnapshot: { type: String, required: true },
    imageSnapshot: { type: String, default: '' },
    priceSnapshot: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, max: 20 }
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', default: null },
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  { timestamps: true }
);

cartSchema.methods.recalculate = function recalculate() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);
  this.deliveryFee = this.items.length ? 40 : 0;
  this.tax = Number((this.subtotal * 0.05).toFixed(2));
  this.total = this.subtotal + this.deliveryFee + this.tax;
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
