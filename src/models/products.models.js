import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: 'No description available.'
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  category: {
    type: String,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

productSchema.virtual('itemID').get(function() {
  return this._id;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;