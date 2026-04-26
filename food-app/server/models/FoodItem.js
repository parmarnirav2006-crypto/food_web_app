import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 300 },
    price: { type: Number, required: true, min: 0, index: true },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    isVeg: { type: Boolean, default: false, index: true },
    isAvailable: { type: Boolean, default: true, index: true },
    spiceLevel: { type: String, enum: ['mild', 'medium', 'hot'], default: 'medium' },
    rating: { type: Number, min: 0, max: 5, default: 4.3 }
  },
  { timestamps: true }
);

foodItemSchema.index({ name: 'text', description: 'text' });
foodItemSchema.index({ restaurant: 1, category: 1 });

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

export default FoodItem;
