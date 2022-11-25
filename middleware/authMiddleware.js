import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).send('No token!')
    }

    const decoded = jwt.verify(token, process.env.SECRET)

    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      res.status(401).send('User does not Exist!')
    }

    next()
    return
  } else {
    res.status(401).send('Not Authorized!')
  }
}

export {
  protect
}