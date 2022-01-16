const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const User = require('../model/user')

describe('Creating user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  }, 20000)

  const user = {
    name: "Mekbib",
    username: "kazuma",
    password: "thePower"
  }
  const userWithSmallUsername = {
    name: "Mekbib",
    username: "kaz",
    password: "thePower"
  }
  const userWithNoName = {
    username: "kazuma",
    password: "thePower"
  }
  const userWithNoUserName = {
    name: "Mekbib",
    password: "thePower"
  }

  test("User is succesfully created when all required attributes are given", async () => {
    await api.post('/OdinBook/user')
      .send(user)
      .expect(201)

    const usersInDb = await User.find({})

    expect(usersInDb).toHaveLength(1)
  }, 15000)

  test("User is not created when required attributes are not given and\
   we recieve a proper status code", async () => {
    await api.post('/OdinBook/user')
      .send(userWithNoName)
      .expect(400)

    await api.post('/OdinBook/user')
      .send(userWithNoUserName)
      .expect(400)

    const usersInDb = await User.find({})

    expect(usersInDb).toHaveLength(0)
  }, 15000)
  test('User with the a username already taken will not be created\
  app will give appropriate response', async () => {
    await api.post('/OdinBook/user')
      .send(user)
      .expect(201)

    await api.post('/OdinBook/user')
      .send(user)
      .expect(400)

    const usersInDb = await User.find({})

    expect(usersInDb).toHaveLength(1)
  }, 15000)
  test('User with small username wont be saved', async () => {
    await api.post('/OdinBook/user')
      .send(userWithSmallUsername)
      .expect(400)

    const usersInDb = await User.find({})

    expect(usersInDb).toHaveLength(0)
  })
})

afterAll(() => {
  mongoose.connection.close()
})