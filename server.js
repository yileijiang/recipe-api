const express = require('express')
const server = require('./graphql/apolloServer')
const connectDB = require('./mongoDB/connectDB')
const config = require('./utils/config')
const cors = require('cors')


const app = express()

const corsOptions = {
  // origin: 'http://localhost:3000',
  origin: 'https://calm-mesa-69319.herokuapp.com/',
  credentials: true  
};

app.use(cors(corsOptions));





connectDB()
  .then(() => server.applyMiddleware({app, path: '/graphql', cors: false}))
  .then(() => { 
    app.listen(config.PORT, () => {
      console.log(`API started on port ${config.PORT}`)
    })
  })
  .catch((error) => console.log(error))
