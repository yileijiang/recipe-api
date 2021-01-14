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
    recipesUser: recipeResolvers.recipeListUser
  },
  Mutation: {
    recipeAdd: recipeResolvers.recipeAdd,
    recipeDelete: recipeResolvers.recipeDelete,
    userAdd: userResolvers.userAdd,
    userLogin: userResolvers.userLogin
  }
}




const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: false,
  context: async ({ req }) => {
    if (req.headers.cookie) {
      const token = req.headers.cookie.substring(6)
      const decoded = jwt.verify(token, config.JWT_SECRET)
      const user = await User.findById(decoded.id)
      user.passwordHash = null
      console.log(user)
      return user

    } else {
      return null
    }

  },
})

module.exports = server  