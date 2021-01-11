const mongoose = require('mongoose')
const recipe = require('./recipe')

const ingredientSchema = new mongoose.Schema({
  name: String,
  quantity: String,
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }
})


module.exports = mongoose.model('Ingredient', ingredientSchema)