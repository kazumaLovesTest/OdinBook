const User = require('../model/user')
const friendRequestRoute = require('express').Router()
const bcrypt = require('bcrypt')
const middleware = require('../utils/middleware')

friendRequestRoute.post('/', middleware.userExtractor, async (req, res, next) => {
  const body = req.body
  const user = req.user

  const userToSendRequestTo = await User.findOne(body)

  userToSendRequestTo.friendRequests = userToSendRequestTo.friendRequests.concat(user._id)

  await userToSendRequestTo.save()

  res.status(201).end()

  next()

})

friendRequestRoute.post('/accept', middleware.userExtractor, async (req, res, next) => {
  const body = req.body
  const user = req.user

  if (user.username !== body.loggedInUser.username)
    res.status(401).json({
      error: "Token doesn't match user"
    })
  
  const friendRequestUser = await User.findOne(body.friendRequestUser)

  user.friends = user.friends.concat(friendRequestUser._id)
  friendRequestUser.friends = friendRequestUser.friends.concat(user._id)

  user.friendRequests = user.friendRequests.filter(_id => _id.toString() 
  === friendRequestUser._id.toString()?false : true)

  await user.save()
  await friendRequestUser.save()
  res.status(201).json(friendRequestUser)

  next()
})


module.exports = friendRequestRoute