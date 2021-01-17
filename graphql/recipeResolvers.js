const Recipe = require('../mongoDB/models/recipe')
const User = require('../mongoDB/models/user')
const Ingredient = require('../mongoDB/models/ingredient')

const recipeList = async () => {
  return await Recipe.find({}).populate('ingredients')
}

const recipeListUser = async (parents, args, context) => {
  if(context._id) {
    const user = context
    await user.populate('recipes').execPopulate()
    // ingredients are not populated!
    return user.recipes
  }
}

const recipeListFavorites = async (parents, args, context) => {
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

const recipeUpdate = async (parents, args, context) => {

  // add user is not logged in functionality
  
  const toUpdateRecipe = args.recipeInput
  console.log(toUpdateRecipe)

  const ingredientsNew = toUpdateRecipe.ingredients.filter(i => !i.id)
  const ingredientIdsNew = await ingredientAdd(ingredientsNew)
  console.log("new Ingredients", ingredientIdsNew)

  const oldRecipe = await Recipe.findById(toUpdateRecipe.id)
  const oldRecipeIngredientIds = oldRecipe.ingredients
  console.log(oldRecipeIngredientIds)

  const toUpdateRecipeIngredientIds = toUpdateRecipe.ingredients.filter(i => i.id).map(i => i.id)
  console.log(toUpdateRecipeIngredientIds) 

  oldRecipeIngredientIds.forEach((id) => {
    if (toUpdateRecipeIngredientIds.includes(id.toString()) ) {
      const toUpdateIngredient = toUpdateRecipe.ingredients.filter(ing => ing.id === id.toString())
      ingredientUpdate(toUpdateIngredient)
    } else {
      ingredientDelete([id])
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
  ingredientDelete(ingredientIds)
  
  const deletedRecipe = await Recipe.findByIdAndDelete(id)
  return deletedRecipe
}

const favoriteRecipeAdd = async (parents, args, context) => {
  let user = context
  const recipeId = args.id
  user.favoriteRecipes.push(args.id)
  await user.save()
}

const ingredientAdd = async (ingredients) => {
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


module.exports = { recipeList, recipeListUser, recipeListFavorites, recipe, recipeAdd, recipeUpdate, recipeDelete, favoriteRecipeAdd}