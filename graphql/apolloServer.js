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
  cors: false,
  context: ({ req }) => {
    const token = req.headers.cookie

    const temp = req.body.query

    
    // return { user };
  },
})

module.exports = server  