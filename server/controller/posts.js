const postsRoute = require('express').Router()
const Post = require('../model/post')
const middleware = require('../utils/middleware')

postsRoute.post('/', middleware.userExtractor, async (req, res, next) => {
  const body = req.body
  const user = req.user

  if (!body.title || !body.content)
    return res.status(400).end()
  const newPost = new Post({
    ...body,
    likes: 0,
    comment: null,
    user: user._id
  })

  const postInDb = await newPost.save()

  user.posts = user.posts.concat(postInDb._id)

  await user.save()

  res.status(201).end()

  next()
})

postsRoute.put('/:id', middleware.userExtractor, async (req, res, next) => {
  const user = req.user
  const body = req.body
  const id = req.params.id

  if (body.user.toString() !== user._id.toString())
    return res.status(401).end()
  
  const updatedBlog = {...body}
  delete updatedBlog.user

  const postInDb = await Post.findByIdAndUpdate(id,updatedBlog,{new:true})

  res.status(201).json(postInDb)

  next()
})

postsRoute.delete('/:id', middleware.userExtractor,async(req,res,next) => {
  const user = req.user
  const body = req.body
  const id = req.params.id

  if (body.user.toString() !== user._id.toString())
    return res.status(401).end()
  
  await Post.findByIdAndRemove(id)
  user.posts = user.posts.filter(_id => _id.toString() === id? false:true)
  await user.save()

  res.status(204).end()

  next()
})
module.exports = postsRoute