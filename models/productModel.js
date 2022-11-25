import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  richDescription: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  brand: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  countInStock: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
})

// Duplicate the ID field.
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
productSchema.set('toJSON', {
  virtuals: true
});

const Product = mongoose.model('product', productSchema)
export default Product