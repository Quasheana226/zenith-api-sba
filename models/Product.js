const mongoose = require('mongoose');

// A schema is like a blueprint — it defines what every product document must look like
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true   // can't create a product without a name
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0.01        // price must be greater than 0 per the requirements
  },
  category: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true    // new products are assumed to be in stock unless told otherwise
  },
  tags: {
    type: [String]   
  },
  createdAt: {
    type: Date,
    default: Date.now  // automatically stamps when the product was created
  }
});

// Compile the schema into a model this is what we use to talk to the database
const Product = mongoose.model('Product', productSchema);

module.exports = Product;