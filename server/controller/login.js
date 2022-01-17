require('dotenv')
const User = require('../model/user')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRoute = require('express').Router()

loginRoute.post('/', async (req,res) => {
  const body = req.body

  const user = await User.findOne({username:body.username})
  const isCorrectPassword = await bcrypt.compare(body.password,user.passwordHash)

  if (isCorrectPassword == false)
    return res.status(401).json({
      error:"Wrong username or Password"
    })
  
  const payload = {
    username: user.username,
    id:user._id
  }

  const token = JWT.sign(payload,process.env.SECRET)

  return res.status(200).send({token,username:user.username,name:user.name})
})

module.exports = loginRoute