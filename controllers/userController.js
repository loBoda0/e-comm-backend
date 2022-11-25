import mongoose from "mongoose";
import generateToken from "../helpers/jwt.js";

import User from '../models/userModel.js'

// @desc     Fetch all users
// @route    GET /api/v1/users
// @access   Private/Admin
const getUsers = async (req, res) => {
  const userList = await User.find().select('-password')

  if (!userList) {
    req.status(500).json({ success: false })
  }
  res.send(userList)
}

// @desc     Fetch a user
// @route    GET /api/v1/users/:id
// @access   Private
const getUserData = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (!user) {
    req.status(500).json({ success: false })
  }
  res.send(user)
}

// @desc     Delete a user
// @route    DELETE /api/v1/users/:id
// @access   Private
const deleteUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('invalid User Id')
  }

  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return res.status(404).json({ success: false, message: 'user not found!' })
  }
  return res.status(200).json({ success: true, message: 'user has been deleted!' })
}

// @desc     Register new user
// @route    POST /api/v1/users
// @access   Public
const registerUser = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email })
  if (userExists) {
    res.status(400).send('User already exists!')
  }

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
  user = await user.save()

  if (!user) {
    return res.status(500).send('User cannot be registered!')
  }

  res.send({
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id)
  })
}

// @desc     Log in user
// @route    POST /api/v1/users/login
// @access   Public
const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(404).send('User not found')
  }

  if (user && await user.matchPassword(req.body.password)) {
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(400).send('Password incorrect')
  }

}

// @desc     Update user
// @route    PUT /api/v1/users/:id
// @access   Private
const updateUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid User Id');
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send('User does not exists!');

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    }, {
    new: true
  }
  )

  if (!updatedUser) {
    return res.status(500).send('User cannot be updated!')
  }

  res.json(updatedUser)
}

// @desc     Users count
// @route    PUT /api/v1/users/get/count
// @access   Private
const usersCount = async (req, res) => {
  const userCount = await User.countDocuments()

  if (!userCount) {
    req.status(500).json({ success: false })
  }
  res.send({ userCount: userCount })
}

export {
  getUsers,
  getUserData,
  deleteUser,
  registerUser,
  loginUser,
  updateUser,
  usersCount
}