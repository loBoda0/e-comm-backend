import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  orderItems: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem',
    required: true
  },
  shippingAddress1: {
    type: String,
    required: true
  },
  shippingAddress2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'Pending'
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
}, {
  timestamps: true,
})

// Duplicate the ID field.
orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
orderSchema.set('toJSON', {
  virtuals: true
});

const Order = mongoose.model('order', orderSchema)
export default Order