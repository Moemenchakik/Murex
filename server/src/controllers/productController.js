const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Product");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category } = req.query;
  
  let query = {};
  
  if (keyword) {
    query.name = {
      $regex: keyword,
      $options: "i",
    };
  }
  
  if (category && category !== "All") {
    query.category = category;
  }

  const products = await Product.find(query).sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, brand, category, stock, description, images, slug, gender } = req.body;
  
  const product = new Product({
    name: name || "Sample Name",
    price: price || 0,
    user: req.user._id,
    images: (images && images.length > 0) ? images : ["https://via.placeholder.com/400?text=No+Image+Available"],
    brand: brand || "Sample Brand",
    category: category || "Sample Category",
    stock: stock || 0,
    description: description || "Sample Description",
    slug: slug || "sample-slug-" + Date.now(),
    gender: gender || "unisex",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    brand,
    category,
    stock,
    gender,
    sizes,
    colors,
    slug
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.images = (images && images.length > 0) ? images : product.images;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.gender = gender || product.gender;
    product.sizes = sizes || product.sizes;
    product.colors = colors || product.colors;
    product.slug = slug || product.slug;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.reviewsCount = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
