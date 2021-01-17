const { gql } = require('apollo-server')


const typeDefs = gql`

  type Ingredient {
    id: ID
    name: String
    quantity: String
  }

  type Tag {
    id: ID
    name: String
    recipes: [Recipe]!
  }

  type Recipe {
    id: ID!
    title: String!
    description: String!
    instruction: String!
    ingredients: [Ingredient]!
    tags: [Tag]!
  }

  type User {
    id: ID!
    name: String!
    username: String!
    passwordHash: String!
    recipes: [Recipe]!
    favoriteRecipes: [Recipe]!
  }

  type Token {
    value: String!
    userId : String!
  }

  input IngredientInput {
    id: String
    name: String!
    quantity: String
  }

  input RecipeInput {
    id: String
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
    recipesUser: [Recipe]! 
    recipesFavorites: [Recipe]!
  }  
  
  type Mutation {
    recipeCreate(recipeInput: RecipeInput!): Recipe!
    recipeDelete(id: ID!): Recipe!
    recipeUpdate(recipeInput: RecipeInput!): Recipe!
    favoriteRecipeAdd(id: ID!): Recipe!
    userCreate(userInput: UserInput!): User!
    userLogin(userInputLogin: UserInputLogin!): Token!
  }
`

module.exports = typeDefs
