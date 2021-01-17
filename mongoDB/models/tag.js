const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
  name: String,
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }]
})

module.exports = mongoose.model('Tag', tagSchema)