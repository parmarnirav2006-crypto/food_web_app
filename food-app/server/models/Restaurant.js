import mongoose from 'mongoose';
import slugify from 'slugify';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    cuisines: [{ type: String, trim: true, index: true }],
    images: [imageSchema],
    coverImage: imageSchema,
    rating: { type: Number, min: 0, max: 5, default: 4.2, index: true },
    totalRatings: { type: Number, default: 0 },
    deliveryTime: { type: Number, required: true, min: 10, max: 120, index: true },
    priceLevel: { type: Number, required: true, min: 1, max: 4, index: true },
    minOrderAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'blocked'],
      default: 'pending',
      index: true
    },
    address: {
      line1: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true }
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

restaurantSchema.index({ name: 'text', description: 'text', cuisines: 'text' });
restaurantSchema.index({ createdAt: -1 });

restaurantSchema.pre('validate', function setSlug(next) {
  if (this.isModified('name')) {
    this.slug = slugify(`${this.name}-${this._id || Date.now()}`, {
      lower: true,
      strict: true
    });
  }
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
