const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../model/user')
const Post = require('../model/post')

describe('before posts have been created', () => {

  const saltRound = 10
  const passwordHash = bcrypt.hashSync('thePower', saltRound)
  let header;

  beforeEach(async () => {

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

    const userInDb = (await User.findOne({username: 'kazuma'})).toJSON()

    expect(userInDb.posts).toHaveLength(1)
  },15000)
  
  test("Post is not saved when the required fields are not given", async () => {
    await api.post('/OdinBook/posts')
      .send(postWithoutRequiredField)
      .set(header)
      .expect(400)

    const userInDb = (await User.findOne({username: 'kazuma'})).toJSON()

    expect(userInDb.posts).toHaveLength(0)
  },15000)
})
  

afterAll(() => {
  mongoose.connection.close()
})