import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import FoodItem from '../models/FoodItem.js';
import Category from '../models/Category.js';

const assertValidRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 400;
    throw error;
  }
};

export const listRestaurants = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    cuisines,
    minRating,
    priceLevel,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  const query = {
    isActive: true,
    approvalStatus: 'approved'
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { cuisines: { $elemMatch: { $regex: search, $options: 'i' } } }
    ];
  }

  if (cuisines) {
    query.cuisines = {
      $in: cuisines
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    };
  }

  if (minRating) {
    query.rating = { ...query.rating, $gte: Number(minRating) };
  }

  if (priceLevel) {
    query.priceLevel = Number(priceLevel);
  }

  const sortOptions = {
    rating: { rating: order === 'asc' ? 1 : -1 },
    deliveryTime: { deliveryTime: order === 'asc' ? 1 : -1 },
    priceLevel: { priceLevel: order === 'asc' ? 1 : -1 },
    name: { name: order === 'asc' ? 1 : -1 },
    createdAt: { createdAt: order === 'asc' ? 1 : -1 }
  };

  const pageNumber = Number(page);
  const pageSize = Number(limit);

  const [restaurants, total] = await Promise.all([
    Restaurant.find(query)
      .sort(sortOptions[sortBy] || sortOptions.createdAt)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize),
    Restaurant.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    data: restaurants,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize)
    }
  });
});

export const getRestaurantByIdentifier = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);

  const restaurant = await Restaurant.findOne(
    isObjectId
      ? { _id: identifier, isActive: true, approvalStatus: 'approved' }
      : { slug: identifier, isActive: true, approvalStatus: 'approved' }
  );

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  const foodItems = await FoodItem.find({ restaurant: restaurant._id, isAvailable: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { restaurant, menu: foodItems } });
});

export const createRestaurant = asyncHandler(async (req, res) => {
  assertValidRequest(req);

  const restaurant = await Restaurant.create({
    ...req.body,
    approvalStatus: 'approved'
  });

  res.status(201).json({ success: true, message: 'Restaurant created successfully', data: restaurant });
});

export const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  Object.assign(restaurant, req.body);
  await restaurant.save();

  res.status(200).json({ success: true, message: 'Restaurant updated successfully', data: restaurant });
});

export const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  await FoodItem.deleteMany({ restaurant: restaurant._id });
  await Category.deleteMany({ restaurant: restaurant._id });
  await restaurant.deleteOne();

  res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
});

export const createFoodItem = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  let category = await Category.findOne({
    name: req.body.categoryName,
    restaurant: restaurant._id
  });

  if (!category) {
    category = await Category.create({
      name: req.body.categoryName,
      restaurant: restaurant._id
    });
  }

  const foodItem = await FoodItem.create({
    restaurant: restaurant._id,
    category: category._id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    isVeg: req.body.isVeg,
    isAvailable: req.body.isAvailable,
    spiceLevel: req.body.spiceLevel
  });

  res.status(201).json({ success: true, message: 'Food item created', data: foodItem });
});

export const updateFoodItem = asyncHandler(async (req, res) => {
  const foodItem = await FoodItem.findById(req.params.foodItemId);

  if (!foodItem) {
    res.status(404);
    throw new Error('Food item not found');
  }

  if (req.body.categoryName) {
    let category = await Category.findOne({
      name: req.body.categoryName,
      restaurant: foodItem.restaurant
    });

    if (!category) {
      category = await Category.create({
        name: req.body.categoryName,
        restaurant: foodItem.restaurant
      });
    }

    foodItem.category = category._id;
  }

  Object.assign(foodItem, req.body);
  await foodItem.save();

  res.status(200).json({ success: true, message: 'Food item updated', data: foodItem });
});

export const deleteFoodItem = asyncHandler(async (req, res) => {
  const foodItem = await FoodItem.findById(req.params.foodItemId);

  if (!foodItem) {
    res.status(404);
    throw new Error('Food item not found');
  }

  await foodItem.deleteOne();
  res.status(200).json({ success: true, message: 'Food item deleted' });
});
