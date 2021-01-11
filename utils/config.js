require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const SECRET_JWT = process.env.SECRET_JWT

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET_JWT
}