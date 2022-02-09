const postRoute = require('express').Router()
const Post = require('../model/post')
const Like = require('../model/like')
const Comment = require('../model/comment')
const middleware = require('../utils/middleware')

postRoute.post('/', middleware.userExtractor, async (req, res, next) => {
  const body = req.body
  const user = req.user

  if (!body.title || !body.content)
    return res.status(400).end()

  const like = new Like()
  const savedLike = await like.save()

  const newPost = new Post({
    ...body,
    user: user._id,
    like: savedLike
  })

  const postInDb = await newPost.save()

  user.posts = user.posts.concat(postInDb._id)

  await user.save()

  res.status(201).end()

  next()
})

postRoute.put('/:id', middleware.userExtractor, async (req, res, next) => {
  const user = req.user
  const body = req.body
  const id = req.params.id

  if (body.user.toString() !== user._id.toString())
    return res.status(401).end()

  const updatedBlog = { ...body }

  const postInDb = await Post.findByIdAndUpdate(id, updatedBlog, { new: true })

  res.status(201).json(postInDb)

  next()
})

postRoute.put('/like/:id', middleware.userExtractor, async (req, res, next) => {
  const user = req.user
  const id = req.params.id

  const like = await Like.findById(id)
  like.count += 1
  like.authors = like.authors.concat(user._id)
  
  const savedLike = await like.save()

  res.status(201).json(savedLike)

  next()
})

postRoute.put('/comment/:id', middleware.userExtractor, async (req, res, next) => {
  const body = req.body
  const user = req.user
  const id = req.params.id

  const comment = new Comment ({
    content:body.content,
    user:user._id
  })

  const savedComment = await comment.save()

  const post = await Post.findById(id)
  post.comments = post.comments.concat(savedComment._id)

  const updatedPost = await post.save()

  res.status(201).json(updatedPost)

  next()
})

postRoute.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  const user = req.user
  const body = req.body
  const id = req.params.id

  if (body.id.toString() !== user._id.toString())
    return res.status(401).end()

  await Post.findByIdAndRemove(id)
  user.posts = user.posts.filter(_id => _id.toString() === id ? false : true)
  await user.save()

  res.status(204).end()

  next()
})
module.exports = postRoute