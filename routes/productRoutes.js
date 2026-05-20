const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST / — create a new product from the request body
// respond 201 on success, 400 if Mongoose validation fails (e.g. missing required field)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /:id — find a single product by its MongoDB _id
// respond 404 if no document matches so the client knows it doesn't exist
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /:id — update a product by ID and return the updated document
// { new: true } returns the updated doc instead of the old one
// { runValidators: true } ensures schema rules (e.g. min price) are enforced on update
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /:id — remove a product by ID
// respond 404 if it doesn't exist, otherwise confirm deletion with a message
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET / — get all products with optional filtering, sorting, and pagination
// comes AFTER /:id so Express doesn't accidentally match this route for ID lookups
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy, page, limit } = req.query;

    // build filter dynamically — only add a condition if the param was actually sent
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // convert sortBy string into a Mongoose sort object
    let sort = {};
    if (sortBy === 'price_asc') sort.price = 1;
    if (sortBy === 'price_desc') sort.price = -1;

    // default to page 1, 10 results per page; skip calculates the offset
    const currentPage = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * pageLimit;

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageLimit);

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
