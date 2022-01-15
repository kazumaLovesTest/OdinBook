const express = require('express')
const app = express()
const moongose = require('mongoose')
const userRoute = require('./controller/user')
const config = require('./utils/config')

moongose.connect(config.MONGODB_URI, () => {
  console.log(`connected to ${config.MONGODB_URI}`)
}).catch(err =>{
  console.log(`couldnt connect because ${err.message}`)
})

app.use(express.json())
app.use('/OdinBook/user', userRoute)

module.exports = app