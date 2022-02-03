const express = require('express')
const app = express()
const cors = require('cors')
const userRoute = require('./controller/user')
const loginRoute = require('./controller/login')
const friendRequestRoute = require('./controller/friendRequest')
const postsRoute = require('./controller/posts')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

if (process.env.NODE_ENV === "test") 
  config.initializeMongoServer()
else
  config.connectToMongoServer()

app.use(express.json())
app.use(cors())

app.use(middleware.tokenExtractor)
app.use('/OdinBook/user', userRoute)
app.use('/OdinBook/login',loginRoute)
app.use('/OdinBook/friend-request',friendRequestRoute)
app.use('/OdinBook/posts',postsRoute)
app.use(middleware.handleValidationError)

module.exports = app