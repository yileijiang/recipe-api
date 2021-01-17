const { ApolloServer } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const typeDefs = require('./schema')
const recipeResolvers = require('./recipeResolvers')
const userResolvers = require('./userResolvers')
const User = require('../mongoDB/models/user')
const config = require('../utils/config')




const resolvers = {
  Query: {
    recipes: recipeResolvers.recipeList,
    recipe: recipeResolvers.recipe,
    recipesUser: recipeResolvers.recipeListUser,
    recipesFavorites: recipeResolvers.recipeListFavorites
  },
  Mutation: {
    recipeAdd: recipeResolvers.recipeAdd,
    recipeDelete: recipeResolvers.recipeDelete,
    recipeUpdate: recipeResolvers.recipeUpdate,
    favoriteRecipeAdd: recipeResolvers.favoriteRecipeAdd,
    userAdd: userResolvers.userAdd,
    userLogin: userResolvers.userLogin
  }
}




const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: false,
  playground: true,
  context: async ({ req }) => {
    if (req.headers.cookie) {
      const token = req.headers.cookie.substring(6)
      const decoded = jwt.verify(token, config.JWT_SECRET)
      const user = await User.findById(decoded.id)
      user.passwordHash = null
      return user
    } else {
      return null
    }

  },
  introspection:true 
})

module.exports = server  