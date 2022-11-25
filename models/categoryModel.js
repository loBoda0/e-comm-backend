import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
})

// Duplicate the ID field.
categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
categorySchema.set('toJSON', {
  virtuals: true
});

const Category = mongoose.model('category', categorySchema)
export default Category