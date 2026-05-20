const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/connection');
const productRoutes = require('./routes/productRoutes');

// load environment variables from .env before anything else reads them
dotenv.config();

// connect to MongoDB called early so the DB is ready before requests come in
connectDB();

const app = express();

// parse incoming JSON request bodies so req.body is available in routes
app.use(express.json());

// mount product routes all product endpoints will be prefixed with /api/products
app.use('/api/products', productRoutes);

// fall back to 1738 if PORT is not defined in .env
const PORT = process.env.PORT || 1738;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
