const User = require('../model/user')
const userRoute = require('express').Router()
const bcrypt = require('bcrypt')

userRoute.post('/', (req, res) => {
  const body = req.body

  const saltRound = 10
  const passwordHash = bcrypt.hash(saltRound, body.password, function(err,hash){
    return hash
  })

  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash: passwordHash
  })

  user.save().then(() => {
    return res.status(201).end()
  })
})

module.exports = userRoute