const express = require('express')
const app = express()
const cors = require('cors')
const moongose = require('mongoose')
const userRoute = require('./controller/user')
const loginRoute = require('./controller/login')
const resetRoute = require('./controller/reset')
const config = require('./utils/config')
const middleware = require('./utils/middleware')



moongose.connect(config.MONGODB_URI, () => {
  console.log(`connected to ${config.MONGODB_URI}`)
}).catch(err =>{
  console.log(`couldnt connect because ${err.message}`)
})

app.use(express.json())
app.use(cors())

app.use(middleware.tokenExtractor)
app.use('/OdinBook/user', userRoute)
app.use('/OdinBook/login',loginRoute)
app.use(middleware.handleValidationError)


if (process.env.NODE_ENV === "test")
  app.use('/OdinBook/reset',resetRoute)
module.exports = app