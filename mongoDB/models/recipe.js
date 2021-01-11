const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  instruction: String,
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})


module.exports = mongoose.model('Recipe', recipeSchema)