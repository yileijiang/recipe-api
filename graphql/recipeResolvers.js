const Recipe = require('../mongoDB/models/recipe')
const Ingredient = require('../mongoDB/models/ingredient')

const recipeList = async () => {
  return await Recipe.find({}).populate('ingredients')
}

const recipe = async (_, {id}) => {
  const recipe = await Recipe.findById(id).populate('ingredients')
  return recipe
}

const recipeAdd = async (_, {recipeInput}) => {
  const ingredientIds = await ingredientAdd(recipeInput.ingredients)

  const newRecipe = new Recipe({
    title: recipeInput.title,
    description: recipeInput.description,
    instruction: recipeInput.instruction,
    ingredients: ingredientIds
  })
  
  const savedRecipe = await newRecipe.save()
  await savedRecipe.populate('ingredients').execPopulate()
  return savedRecipe
} 

const recipeDelete = async (_, {id}) => {
  
  const deleteRecipe = await Recipe.findById(id)
  const ingredientsIds = deleteRecipe.ingredients
  ingredientDelete(ingredientsIds)
  
  const deletedRecipe = await Recipe.findByIdAndDelete(id)
  return deletedRecipe
}

const ingredientAdd = async (ingredients) => {
  const ingredientsIds = []

  for (let ingredient of ingredients ) {
    const newIngredient = new Ingredient({
      name: ingredient.name,
      quantity: ingredient.quantity
      })

    const savedIngredient = await newIngredient.save()
    ingredientsIds.push(savedIngredient.id)
  }  
  return ingredientsIds
}

const ingredientDelete = async (ingredientsIds) => {
  for (let id of ingredientsIds) {
    await Ingredient.findByIdAndDelete(id)
  }
}


module.exports = { recipeList, recipe, recipeAdd, recipeDelete}