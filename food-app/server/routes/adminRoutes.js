import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getUsers,
  getRestaurantsAdmin,
  reviewRestaurant,
  getOrdersAdmin,
  updateOrderStatus
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/restaurants', getRestaurantsAdmin);
router.patch('/restaurants/:id/review', reviewRestaurant);
router.get('/orders', getOrdersAdmin);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
