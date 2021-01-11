const express = require('express')
const server = require('./graphql/apolloServer')
const connectDB = require('./mongoDB/connectDB')
const config = require('./utils/config')


const app = express()


  connectDB()
    .then(() => server.applyMiddleware({app, path: '/graphql'}))
    .then(() => { 
      app.listen(config.PORT, () => {
        console.log(`API started on port ${config.PORT}`)
      })
    })
    .catch((error) => console.log(error))