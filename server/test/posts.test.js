const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../model/user')
const Post = require('../model/post')
const user = require('../model/user')

describe('Posts', () => {

  let header;

  beforeEach(async () => {
    const saltRound = 10
    const passwordHash = await bcrypt.hash('thePower', saltRound)
    await User.deleteMany({});
    const user = new User({
      name: 'mekbib',
      username: 'kazuma',
      passwordHash
    })

    await user.save()

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

      const userInDb = (await User.findOne({ username: 'kazuma' })).toJSON()

      expect(userInDb.posts).toHaveLength(1)
    }, 15000)

    test("Post is not saved when the required fields are not given", async () => {
      await api.post('/OdinBook/posts')
        .send(postWithoutRequiredField)
        .set(header)
        .expect(400)

      const userInDb = (await User.findOne({ username: 'kazuma' })).toJSON()

      expect(userInDb.posts).toHaveLength(0)
    }, 15000)
  })

  describe("After Posts have been created", () => {
    let postInDb

    beforeEach(async () => {
      await Post.deleteMany({})
      const user = await User.findOne({ username: 'kazuma' })

      const post = new Post({
        title: "hello World",
        content: "I am alive",
        user: user._id
      })

      postInDb = await post.save()

      user.posts = user.posts.concat(postInDb._id)
      await user.save()
    })


    test("Posts can be updated by the user who created it", async () => {
      postInDb = postInDb.toJSON()
      const updatedPost = {
        title: "Lie",
        content: "it's kinda cool",
        likes: 1,
        comment: "this is amazing",
        user: postInDb.user
      }
      postInDb = await api.put(`/OdinBook/posts/${postInDb.id}`)
        .send(updatedPost)
        .set(header)
        .expect(201)

      expect(postInDb.body.likes).toBe(1)
    })
    test("Posts can not be updated by a user who did not create it", async () => {
      postInDb = postInDb.toJSON()
      const updatedPost = {
        title: "Lie",
        content: "it's kinda cool",
        likes: 1,
        comment: "this is amazing",
        user: postInDb.user
      }
      postInDb = await api.put(`/OdinBook/posts/${postInDb.id}`)
        .send(updatedPost)
        .expect(401)

      expect(postInDb.body.likes).not.toBeDefined()
    })
    test("Posts can be deleted by the user who created it", async() => {
      postInDb = postInDb.toJSON()
      await api.delete(`/OdinBook/posts/${postInDb.id}`)
        .send(postInDb)
        .set(header)
        .expect(204)

      postInDb = await Post.findById(postInDb.id)
      const userInDb = (await User.findOne({username: 'kazuma'})).toJSON()

      expect(postInDb).toBe(null)
      expect(userInDb.posts).toHaveLength(0)
    })
    test("Posts can not be deleted by anyone except for the user who created it", async() => {
      postInDb = postInDb.toJSON()
      await api.delete(`/OdinBook/posts/${postInDb.id}`)
        .send(postInDb)
        .expect(401)

      postInDb = await Post.findById(postInDb.id)
      const userInDb = (await User.findOne({username: 'kazuma'})).toJSON()

      expect(postInDb).toBeDefined()
      expect(userInDb.posts).toHaveLength(1)
    })
  })
})



afterAll(() => {
  mongoose.connection.close()
})