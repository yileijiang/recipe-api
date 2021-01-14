const Recipe = require('../mongoDB/models/recipe')
const User = require('../mongoDB/models/user')
const Ingredient = require('../mongoDB/models/ingredient')

const recipeList = async () => {
  return await Recipe.find({}).populate('ingredients')
}

const recipeListUser = async (parents, args, context) => {
  if(context._id) {
    const recipes = await Recipe.find({user: context._id}).populate('ingredients')
    return recipes
  }
}

const recipe = async (_, {id}) => {
  const recipe = await Recipe.findById(id).populate('ingredients')
  return recipe
}

const recipeAdd = async (parents, args, context) => {

  if (!context._id) {
    throw "user is not logged in"
  } else {
    const recipeInput = args.recipeInput
    const user = await User.findById(context._id)
    const ingredientIds = await ingredientAdd(recipeInput.ingredients)

    const newRecipe = new Recipe({
      title: recipeInput.title,
      description: recipeInput.description,
      instruction: recipeInput.instruction,
      ingredients: ingredientIds,
      user: context._id
    })
    
    const savedRecipe = await newRecipe.save()
    user.recipes.push(savedRecipe)
    await user.save()
    await savedRecipe.populate('ingredients').execPopulate()

    return savedRecipe
  }
  
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


module.exports = { recipeList, recipeListUser, recipe, recipeAdd, recipeDelete}