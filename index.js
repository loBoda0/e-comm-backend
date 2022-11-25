import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import productsRouter from './routes/productRoutes.js'
import usersRouter from './routes/usersRoutes.js'
import ordersRouter from './routes/ordersRoutes.js'
import categoriesRouter from './routes/categoriesRoutes.js'

import { connectDB } from './config/db.js';
import authJwt from './helpers/jwt.js';
import { errorHandler } from './helpers/error-handler.js';

dotenv.config()

connectDB()

const app = express()

const api = process.env.API

app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(morgan('tiny'))
/* app.use(authJwt) */
app.use(errorHandler)

app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/orders`, ordersRouter)
app.use(`${api}/products`, productsRouter)
app.use(`${api}/users`, usersRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const port = process.env.PORT || 5000


app.listen(port, () => {
  console.log(`Example app running at port ${port}`)
})