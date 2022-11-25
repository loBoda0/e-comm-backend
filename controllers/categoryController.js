import mongoose from 'mongoose';

import Category from '../models/categoryModel.js';

// @desc     Fetch all categories
// @route    GET /api/v1/categories
// @access   Public 
const getCategories = async (req, res) => {
  const categoryList = await Category.find()

  if (!categoryList) {
    req.status(500).json({ success: false })
  }
  res.status(200).send(categoryList)
}

// @desc     Fetch single category
// @route    GET /api/v1/categories/:id
// @access   Public
const getCategoryById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('invalid Category Id')
  }

  const category = await Category.findById(req.params.id)

  if (!category) {
    req.status(500).json({ success: false, message: 'category not found!' })
  }
  res.status(200).send(category)
}

// @desc     DELETE a category
// @route    DELETE /api/v1/categories/:id
// @access   Private/Admin
const deleteCategory = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('invalid Category Id')
  }

  const category = await Category.findByIdAndDelete(req.params.id)

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found!' })
  }
  return res.status(200).json({ success: true, message: 'Category has been deleted!' })
}

// @desc     Create a category
// @route    POST /api/v1/categories
// @access   Private/Admin
const createCategory = async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color
  })
  category = await category.save()

  if (!category) {
    return res.status(500).send('Categpry cannot be created!')
  }

  res.send(category)
}

// @desc     Update category
// @route    PUT /api/v1/categories/:id
// @access   Private/Admin
const updateCategory = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('invalid Category Id')
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  )

  if (!category) {
    req.status(500).json({ success: false, message: 'category not found!' })
  }
  res.status(200).send(category)
}

export {
  getCategories,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory
}