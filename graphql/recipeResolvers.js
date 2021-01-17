const Recipe = require('../mongoDB/models/recipe')
const User = require('../mongoDB/models/user')
const ingredientsHelper = require('./ingredientsHelper')



const recipes = async () => {
  return await Recipe.find({}).populate('ingredients')
}

const recipesUser = async (parents, args, context) => {
  if(context._id) {
    const user = context
    await user.populate('recipes').execPopulate()
    // ingredients are not populated!
    return user.recipes
  }
}

const recipesFavorites = async (parents, args, context) => {
  if(context._id) {
    const user = context
    await user.populate('favoriteRecipes').execPopulate()
    // ingredients are not populated!
    return user.favoriteRecipes
  }
}

const recipe = async (_, {id}) => {
  const recipe = await Recipe.findById(id).populate('ingredients')
  return recipe
}

const recipeCreate = async (parents, args, context) => {

  if (!context._id) {
    throw "user is not logged in"
  } else {
    const recipeInput = args.recipeInput
    const user = await User.findById(context._id)
    const ingredientIds = await ingredientsHelper.ingredientCreate(recipeInput.ingredients)

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

const recipeUpdate = async (parents, args, context) => {

  // add user is not logged in functionality
  
  const toUpdateRecipe = args.recipeInput
  console.log(toUpdateRecipe)

  const ingredientsNew = toUpdateRecipe.ingredients.filter(i => !i.id)
  const ingredientIdsNew = await ingredientsHelper.ingredientCreate(ingredientsNew)
  console.log("new Ingredients", ingredientIdsNew)

  const oldRecipe = await Recipe.findById(toUpdateRecipe.id)
  const oldRecipeIngredientIds = oldRecipe.ingredients
  console.log(oldRecipeIngredientIds)

  const toUpdateRecipeIngredientIds = toUpdateRecipe.ingredients.filter(i => i.id).map(i => i.id)
  console.log(toUpdateRecipeIngredientIds) 

  oldRecipeIngredientIds.forEach((id) => {
    if (toUpdateRecipeIngredientIds.includes(id.toString()) ) {
      const toUpdateIngredient = toUpdateRecipe.ingredients.filter(ing => ing.id === id.toString())
      ingredientsHelper.ingredientUpdate(toUpdateIngredient)
    } else {
      ingredientsHelper.ingredientDelete([id])
    }
  })

  toUpdateRecipe.ingredients = toUpdateRecipeIngredientIds.concat(ingredientIdsNew)


  const updatedRecipe = await Recipe.findByIdAndUpdate(toUpdateRecipe.id, toUpdateRecipe, { new: true })
  
  await updatedRecipe.populate('ingredients').execPopulate()

  return updatedRecipe
  
}

const recipeDelete = async (_, {id}) => {
  
  const deleteRecipe = await Recipe.findById(id)
  const ingredientIds = deleteRecipe.ingredients
  ingredientsHelper.ingredientDelete(ingredientIds)
  
  const deletedRecipe = await Recipe.findByIdAndDelete(id)
  return deletedRecipe
}

const favoriteRecipeAdd = async (parents, args, context) => {
  let user = context
  const recipeId = args.id
  if (!(user.favoriteRecipes.includes(args.id))) {
    user.favoriteRecipes.push(args.id)
    await user.save()
    return Recipe.findById(recipeId)
  } else {
    throw error
  }

}



module.exports = { recipes, recipesUser, recipesFavorites, recipe, recipeCreate, recipeUpdate, recipeDelete, favoriteRecipeAdd}