const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema ({
  name: String,
  username: String,
  passwordHash: String,
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }]
})

module.exports = mongoose.model('User', UserSchema)