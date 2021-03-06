const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../model/user')
const Post = require('../model/post')
const Like = require('../model/like')

describe('Posts', () => {

  let header;
  let passwordHash;

  beforeEach(async () => {
    const saltRound = 10
    passwordHash = await bcrypt.hash('thePower', saltRound)
    await User.deleteMany({});

    const userToCreatePost = new User({
      name: 'mekbib',
      username: 'kazuma',
      passwordHash
    })

    await userToCreatePost.save()

    const userToLogin = {
      name: 'mekbib',
      username: 'kazuma',
      password: 'thePower'
    }
    const result = await api.post('/OdinBook/login')
      .send(userToLogin)
      .expect(200)

    header = { 'Authorization': `bearer ${result.body.token}` }

  })
  describe('before posts have been created', () => {
    const post = {
      title: "hello World",
      content: "I am alive",
    }
    const postWithoutRequiredField = {
      title: "Hello world"
    }

    test("Post is saved when all the required fields are given and the user is signed in", async () => {
      await api.post('/OdinBook/posts')
        .send(post)
        .set(header)
        .expect(201)

      const userWhoCreatedPost = (await User.findOne({ username: 'kazuma' })).toJSON()

      expect(userWhoCreatedPost.posts).toHaveLength(1)
    }, 15000)

    test("Post is not saved when the required fields are not given", async () => {
      await api.post('/OdinBook/posts')
        .send(postWithoutRequiredField)
        .set(header)
        .expect(400)

      const userWhoCreatedPost = (await User.findOne({ username: 'kazuma' })).toJSON()

      expect(userWhoCreatedPost.posts).toHaveLength(0)
    }, 15000)
  })

  describe("After Posts have been created", () => {
    let post
    let friendUser
    let friendHeader
    let userWhoCreatedPost

    beforeEach(async () => {
      await Post.deleteMany({})
      userWhoCreatedPost = await User.findOne({ username: 'kazuma' })

      const like = new Like()
      const savedLike = await like.save()

      friendUser = new User({
        name: 'ayalew',
        username: 'flower',
        passwordHash
      })
      post = new Post({
        title: "hello World",
        content: "I am alive",
        user: userWhoCreatedPost._id,
        like: savedLike,
      })

      post = await post.save()
      friendUser = await friendUser.save()

      userWhoCreatedPost.posts = userWhoCreatedPost.posts.concat(post._id)
      userWhoCreatedPost.friends = userWhoCreatedPost.friends.concat(friendUser)

      userWhoCreatedPost = await userWhoCreatedPost.save()

      friendToLogIn = {
        name: 'ayalew',
        username: 'flower',
        password: 'thePower'
      }

      const result = await api.post('/OdinBook/login')
        .send(friendToLogIn)
        .expect(200)

      friendHeader = { 'Authorization': `bearer ${result.body.token}` }

      post = post.toJSON()
      userWhoCreatedPost = userWhoCreatedPost.toJSON()
    })

    test("Posts can be updated by the user who created it", async () => {
      const updatedPost = {
        title: "Lie",
        content: "it's kinda cool",
        user: post.user
      }
      const savedPost = await api.put(`/OdinBook/posts/${post.id}`)
        .send(updatedPost)
        .set(header)
        .expect(201)

      expect(savedPost.body.content).toBe("it's kinda cool")
    })
    test("Posts can not be updated by a user who did not create it", async () => {
      const updatedPost = {
        title: "Lie",
        content: "it's kinda cool",
        user: post.user
      }
      const savedPost = await api.put(`/OdinBook/posts/${post.id}`)
        .send(updatedPost)
        .set(friendHeader)
        .expect(401)

      expect(savedPost.body.likes).not.toBeDefined()
    })
    test("Posts can be deleted by the user who created it", async () => {
      await api.delete(`/OdinBook/posts/${post.id}`)
        .send(userWhoCreatedPost)
        .set(header)
        .expect(204)

      const postInDb = await Post.findById(post.id)
      const userInDb = (await User.findOne({ username: 'kazuma' })).toJSON()

      expect(postInDb).toBe(null)
      expect(userInDb.posts).toHaveLength(0)
    })
    test("Posts can not be deleted by anyone except for the user who created it", async () => {
      await api.delete(`/OdinBook/posts/${post.id}`)
        .send(userWhoCreatedPost)
        .set(friendHeader)
        .expect(401)

      const postInDb = await Post.findById(post.id)
      const userInDb = (await User.findOne({ username: 'kazuma' })).toJSON()

      expect(postInDb).toBeDefined()
      expect(userInDb.posts).toHaveLength(1)
    })
    test("Posts can be liked by user who created it and by other users", async () => {

      const likeId = post.like.id

      let like = await api.put(`/OdinBook/posts/like/${likeId}`)
        .set(header)
        .expect(201)

      expect(like.body.count).toBe(1)
      expect(like.body.authors).toHaveLength(1)

      like = await api.put(`/OdinBook/posts/like/${likeId}`)
        .set(friendHeader)
        .expect(201)

      expect(like.body.count).toBe(2)
      expect(like.body.authors).toHaveLength(2)
    })

    test.only("Posts can be commented by user who created it and by other users", async () => {

      const comment = {
        content: "this Post is amazing"
      }
      let updatedPost = await api.put(`/OdinBook/posts/comment/${post.id}`)
        .send(comment)
        .set(header)
        .expect(201)

      let comments = updatedPost.body.comments
      expect(comments).toHaveLength(1)

      const secondComment = {
        content: "this Post sucks"
      }
      updatedPost = await api.put(`/OdinBook/posts/comment/${post.id}`)
        .send(secondComment)
        .set(friendHeader)
        .expect(201)

      comments = updatedPost.body.comments

      expect(comments).toHaveLength(2)
    })
  })
})



afterAll(() => {
  mongoose.connection.close()
})