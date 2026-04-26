import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

export const placeOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('restaurant', 'name');

  if (!cart || !cart.items.length) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const { address, paymentMethod = 'cod' } = req.body;

  if (!address?.line1 || !address?.city || !address?.state || !address?.postalCode || !address?.contactNumber) {
    res.status(400);
    throw new Error('Delivery address is incomplete');
  }

  const order = await Order.create({
    user: req.user._id,
    restaurant: cart.restaurant._id,
    items: cart.items.map((item) => ({
      foodItem: item.foodItem,
      name: item.nameSnapshot,
      image: item.imageSnapshot,
      price: item.priceSnapshot,
      quantity: item.quantity
    })),
    address,
    subtotal: cart.subtotal,
    deliveryFee: cart.deliveryFee,
    tax: cart.tax,
    total: cart.total,
    paymentMethod,
    statusHistory: [{ status: 'pending', note: 'Order placed successfully' }]
  });

  cart.items = [];
  cart.restaurant = null;
  cart.recalculate();
  await cart.save();

  const populatedOrder = await Order.findById(order._id)
    .populate('restaurant', 'name slug coverImage')
    .populate('user', 'name email');

  res.status(201).json({ success: true, message: 'Order placed successfully', data: populatedOrder });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('restaurant', 'name slug coverImage')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name slug coverImage deliveryTime')
    .populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not allowed to view this order');
  }

  res.status(200).json({ success: true, data: order });
});
