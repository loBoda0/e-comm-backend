import express from "express";
import OrderItem from "../models/orderItemModel.js";

import Order from '../models/orderModel.js'
const router = express.Router()

router.get('/', async (req, res) => {
  const productList = await Order.find().populate('user').populate({ path: 'orderItems', populate: 'product' })

  if (!productList) {
    req.status(500).json({ success: false })
  }
  res.send(productList)
})

router.post('/', async (req, res) => {
  const orderItemsId = req.body.orderItems.map(async (orderItem) => {
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    })

    newOrderItem = await newOrderItem.save()

    return newOrderItem._id
  })

  const orderItemsIdResolved = await orderItemsId

  const totalPrices = await Promise.all(orderItemsIdResolved.map(async (orderItemsId) => {
    const orderItem = await OrderItem.findById(orderItemsId).populate('price')
    const totalPrice = orderItem.product.price * orderItem.quantity
    return totalPrice
  }))

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

  let order = new Order({
    orderItems: orderItemsIdResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  })
  order = await order.save()

  if (!order) {
    return res.status(500).send('Order cannot be created!')
  }

  res.send(order)
})

router.put('/:id', async (req, res) => {
  if (mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('invalid Category Id')
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status
    },
    { new: true }
  )

  if (!order) {
    req.status(500).json({ success: false, message: 'order not found!' })
  }
  res.status(200).send(order)
})

router.delete('/:id', (req, res) => {
  Order.findByIdAndRemove(req.params.id).then(async order => {
    if (order) {
      await order.orderItems.map(async orderItem => {
        await OrderItem.findByIdAndRemove(orderItem)
      })
      return res.status(200).json({ success: true, message: 'the order is deleted!' })
    } else {
      return res.status(404).json({ success: false, message: "order not found!" })
    }
  }).catch(err => {
    return res.status(500).json({ success: false, error: err })
  })
})

router.get('/get/totalsales', async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
  ])

  if (!totalSales) {
    return res.status(400).send('The order sales cannot be created')
  }

  res.send({ totalSales: totalSales.pop().totalSales })
})

router.get('/get/userorders/:userid', async (req, res) => {
  const productList = await Order.find({ user: req.params.userid }).populate({ path: 'orderItems', populate: 'product' }).sort({ 'timestamp': -1 })

  if (!productList) {
    req.status(500).json({ success: false })
  }
  res.send(productList)
})

export default router