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
    recipe: recipeResolvers.recipe
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
  context: async ({ req }) => {
    const token = req.headers.authorization

    if (token && token.startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        token.substring(7), config.SECRET_JWT
      )
      const currentUser = await User.findById(decodedToken.id)
      console.log(currentUser)
      return { currentUser }
    }
  } 
})

module.exports = server  