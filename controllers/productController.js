import mongoose from 'mongoose';

import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

// @desc     Fetch all products
// @route    GET /api/v1/products
// @access   Public
const getProducts = async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') };
  }

  const productList = await Product.find(filter).populate('category');

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
}

// @desc     Fetch single product
// @route    GET /api/v1/products/:id
// @access   Public
const getProductById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('invalid Category Id')
  }

  const product = await Product.findById(req.params.id).populate('category');

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
}

// @desc     DELETE a product
// @route    DELETE /api/v1/products/:id
// @access   Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404).send('Product not found')
  }
}

// @desc     Create a product
// @route    POST /api/v1/products
// @access   Private/Admin
const createProduct = async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category');

  const file = req.file;
  if (!file) return res.status(400).send('No image in the request');

  const fileName = file.filename;
  /* const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`; */
  const basePath = `/public/uploads/`;
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured
  });

  product = await product.save();

  if (!product) return res.status(500).send('The product cannot be created');

  res.send(product);
}

// @desc     Update product
// @route    PUT /api/v1/products/:id
// @access   Private/Admin
const updateProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product Id');
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category');

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send('Invalid Product!');

  const file = req.file;
  let imagepath;

  if (file) {
    const fileName = file.filename;
    /* const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`; */
    const basePath = `/public/uploads/`;
    imagepath = `${basePath}${fileName}`;
  } else {
    imagepath = product.image;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagepath,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured
    },
    { new: true }
  );

  if (!updatedProduct) return res.status(500).send('the product cannot be updated!');

  res.send(updatedProduct);
};

// @desc     Total of products
// @route    POST /api/v1/get/count
// @access   Private/Admin
const productsCount = async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount
  });
}

// @desc     Get featured products
// @route    POST /api/v1/get/featured/:count
// @access   Public
const featuredProducts = async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
}

// @desc     Upload image gallery
// @route    POST /api/v1/gallery-images/:id
// @access   Private/Admin
const uploadImageGallery = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product Id');
  }
  const files = req.files;
  let imagesPaths = [];
  /* const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`; */
  const basePath = `/public/uploads/`;

  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      images: imagesPaths
    },
    { new: true }
  );

  if (!product) return res.status(500).send('the gallery cannot be updated!');

  res.send(product);
}

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  productsCount,
  featuredProducts,
  uploadImageGallery
}