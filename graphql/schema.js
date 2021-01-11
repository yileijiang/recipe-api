const { gql } = require('apollo-server')

const typeDefs = gql`

  type Ingredient {
    id: ID!
    name: String
    quantity: String
  }

  type Recipe {
    id: ID!
    title: String!
    description: String!
    instruction: String!
    ingredients: [Ingredient]!
  }

  type User {
    id: ID!
    name: String!
    username: String!
    passwordHash: String!
  }

  type Token {
    value: String!
  }

  input IngredientInput {
    name: String!
    quantity: String
  }

  input RecipeInput {
    title: String!
    description: String!
    instruction: String!
    ingredients: [IngredientInput!]!
  }

  input UserInput {
    name: String!
    username: String!
    password: String!
  }

  input UserInputLogin {
    username: String!
    password: String!
  }

  type Query {
    recipes: [Recipe]!
    recipe(id: ID!): Recipe!
  }  
  
  type Mutation {
    recipeAdd(recipeInput: RecipeInput!): Recipe!
    recipeDelete(id: ID!): Recipe!
    userAdd(userInput: UserInput!): User!
    userLogin(userInputLogin: UserInputLogin!): Token!
  }
`

module.exports = typeDefs