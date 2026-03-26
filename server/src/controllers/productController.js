const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
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
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

const createProduct = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
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

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.images = (images && images.length > 0) ? images : (product.images.length > 0 ? product.images : ["https://via.placeholder.com/400?text=No+Image+Available"]);
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
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
// ... existing delete logic
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: "Product already reviewed" });
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
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};