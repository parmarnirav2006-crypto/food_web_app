import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, index: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', default: null },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

categorySchema.pre('validate', function createSlug(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.index({ restaurant: 1, slug: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
