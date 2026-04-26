import express from 'express';
import { body } from 'express-validator';
import {
  listRestaurants,
  getRestaurantByIdentifier,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem
} from '../controllers/restaurantController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', listRestaurants);
router.get('/:identifier', getRestaurantByIdentifier);
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Restaurant name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('deliveryTime').isNumeric().withMessage('Delivery time is required'),
    body('priceLevel').isNumeric().withMessage('Price level is required')
  ],
  createRestaurant
);
router.put('/:id', protect, authorize('admin'), updateRestaurant);
router.delete('/:id', protect, authorize('admin'), deleteRestaurant);
router.post('/:restaurantId/menu', protect, authorize('admin'), createFoodItem);
router.put('/menu/:foodItemId', protect, authorize('admin'), updateFoodItem);
router.delete('/menu/:foodItemId', protect, authorize('admin'), deleteFoodItem);

export default router;
