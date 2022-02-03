const postsRoute = require('express').Router()
const Posts = require('../model/post')
const middleware = require('../utils/middleware')

postsRoute.post('/', middleware.userExtractor, async (req, res, next) => {
  const body = req.body
  const currentUser = req.user

  if (!body.title || !body.content)
    return res.status(400).end()
  const newPost = new Posts({
    ...body, user: currentUser._id
  })

  const postInDb = await newPost.save()

  currentUser.posts = currentUser.posts.concat(postInDb._id)

  await currentUser.save()

  res.status(201).end()

  next()
})

module.exports = postsRoute