import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import FoodItem from '../models/FoodItem.js';

const populateCart = (query) =>
  query.populate('restaurant', 'name slug coverImage deliveryTime').populate({
    path: 'items.foodItem',
    select: 'name price image isAvailable restaurant'
  });

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const populatedCart = await populateCart(Cart.findById(cart._id));

  res.status(200).json({ success: true, data: populatedCart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { foodItemId, quantity = 1 } = req.body;
  const foodItem = await FoodItem.findById(foodItemId).populate('restaurant');

  if (!foodItem || !foodItem.isAvailable) {
    res.status(404);
    throw new Error('Food item unavailable');
  }

  const cart = await getOrCreateCart(req.user._id);

  if (cart.restaurant && cart.restaurant.toString() !== foodItem.restaurant._id.toString() && cart.items.length) {
    res.status(400);
    throw new Error('Your cart contains items from another restaurant. Clear cart to continue.');
  }

  cart.restaurant = foodItem.restaurant._id;

  const existingItem = cart.items.find((item) => item.foodItem.toString() === foodItemId);

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      foodItem: foodItem._id,
      restaurant: foodItem.restaurant._id,
      nameSnapshot: foodItem.name,
      imageSnapshot: foodItem.image?.url || '',
      priceSnapshot: foodItem.price,
      quantity: Number(quantity)
    });
  }

  cart.recalculate();
  await cart.save();

  const populatedCart = await populateCart(Cart.findById(cart._id));
  res.status(200).json({ success: true, message: 'Item added to cart', data: populatedCart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  item.quantity = Number(req.body.quantity);

  if (item.quantity <= 0) {
    item.deleteOne();
  }

  if (!cart.items.length) {
    cart.restaurant = null;
  }

  cart.recalculate();
  await cart.save();

  const populatedCart = await populateCart(Cart.findById(cart._id));
  res.status(200).json({ success: true, message: 'Cart updated', data: populatedCart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  item.deleteOne();
  if (!cart.items.length) {
    cart.restaurant = null;
  }

  cart.recalculate();
  await cart.save();
  const populatedCart = await populateCart(Cart.findById(cart._id));

  res.status(200).json({ success: true, message: 'Item removed from cart', data: populatedCart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  cart.restaurant = null;
  cart.recalculate();
  await cart.save();

  res.status(200).json({ success: true, message: 'Cart cleared', data: cart });
});
