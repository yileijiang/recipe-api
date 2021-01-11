const mongoose = require('mongoose')
const config = require('../utils/config')


const connectDB = async () => {
  await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to DB')
  })
  .catch(() => {
    console.log('error connecting to MongoDB')
  })
}

module.exports = connectDB
