import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true
  },
  prduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
})

// Duplicate the ID field.
orderItemSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
orderItemSchema.set('toJSON', {
  virtuals: true
});

const OrderItem = mongoose.model('orderItem', orderItemSchema)
export default OrderItem