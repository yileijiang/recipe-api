const Ingredient = require('../mongoDB/models/ingredient')


const ingredientCreate = async (ingredients) => {
  const ingredientIds = []

  for (let ingredient of ingredients ) {
    const newIngredient = new Ingredient({
      name: ingredient.name,
      quantity: ingredient.quantity
      })

    const savedIngredient = await newIngredient.save()
    ingredientIds.push(savedIngredient.id)
  }  
  
  return ingredientIds
}

const ingredientUpdate = async (ingredient) => {
  await Ingredient.findByIdAndUpdate(ingredient[0].id, ingredient[0])
}

const ingredientDelete = async (ingredientIds) => {
  for (let id of ingredientIds) {
    await Ingredient.findByIdAndDelete(id)
  }
}


module.exports = { ingredientCreate, ingredientUpdate, ingredientDelete }