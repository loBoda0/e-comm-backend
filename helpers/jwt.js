import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  const secret = process.env.SECRET
  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  })
}

export default generateToken