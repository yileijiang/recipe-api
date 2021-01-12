const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../mongoDB/models/user')
const config = require('../utils/config')

const userAdd = async (_, {userInput}) => {
  const passwordHash = await bcrypt.hash(userInput.password, 10)

  const newUser = new User({
    name: userInput.name,
    username: userInput.username,
    passwordHash: passwordHash
  })

  const savedUser = await newUser.save()
  return savedUser
}

const userLogin = async (_, {userInputLogin}) => {

  const user = await User.findOne({username: userInputLogin.username})
  const passwordCorrect = await bcrypt.compare(userInputLogin.password, user.passwordHash)

  if (!user || !passwordCorrect ) {
    throw error ("ERROR, WRONG CREDENTIALS")
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  return { value: jwt.sign(userForToken, config.JWT_SECRET)}
}


module.exports = { userAdd, userLogin }