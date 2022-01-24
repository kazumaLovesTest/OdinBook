const User = require('../model/user')
const userRoute = require('express').Router()
const bcrypt = require('bcrypt')
const middleware = require('../utils/middleware')

userRoute.post('/', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.username)
    return res.status(400).json({
      error: "Missing Content",
    })

  const saltRound = 10
  const passwordHash = bcrypt.hashSync(body.password, saltRound)

  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash: passwordHash
  })

  user.save().then(() => {
    return res.status(201).end()
  }).catch(error => next(error))

})

userRoute.post('/friend_request', middleware.userExtractor, async (req, res,next) => {
  const body = req.body
  const user = req.user

  const userToSendRequestTo = await User.findOne(body)

  userToSendRequestTo.friendRequest = userToSendRequestTo.friendRequest.concat(user._id)

  await userToSendRequestTo.save()

  res.status(201).end()

  next()

})
module.exports = userRoute