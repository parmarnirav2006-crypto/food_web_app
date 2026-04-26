import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Order from '../models/Order.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [usersCount, restaurantsCount, ordersCount, revenueData, latestOrders] = await Promise.all([
    User.countDocuments(),
    Restaurant.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'preparing', 'out_for_delivery', 'delivered'] } } },
      { $group: { _id: null, revenue: { $sum: '$total' } } }
    ]),
    Order.find().populate('user', 'name').populate('restaurant', 'name').sort({ createdAt: -1 }).limit(5)
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        usersCount,
        restaurantsCount,
        ordersCount,
        revenue: revenueData[0]?.revenue || 0
      },
      latestOrders
    }
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const query = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(query).select('-password -refreshToken -otp.code').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(query)
  ]);

  res.status(200).json({ success: true, data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const getRestaurantsAdmin = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: restaurants });
});

export const reviewRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  restaurant.approvalStatus = req.body.approvalStatus || restaurant.approvalStatus;
  restaurant.isActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : restaurant.isActive;
  await restaurant.save();

  res.status(200).json({ success: true, message: 'Restaurant updated', data: restaurant });
});

export const getOrdersAdmin = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('restaurant', 'name slug')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = req.body.status || order.status;
  order.statusHistory.push({ status: order.status, note: req.body.note || 'Status updated by admin' });
  await order.save();

  res.status(200).json({ success: true, message: 'Order status updated', data: order });
});
