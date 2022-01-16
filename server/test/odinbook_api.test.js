const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const User = require('../model/user')

describe('Creating user', () => {
  jest.setTimeout(() => {
    
  }, 15000);
  beforeEach(async () => {
    await User.deleteMany({})
  },15000)

  const user = {
    name:"Mekbib",
    username:"kazuma",
    password:"thePower"
  }
  const userWithNoName = {
    username:"kazuma",
    password:"thePower"
  }
  const userWithNoUserName = {
    name:"Mekbib",
    password:"thePower"
  }

  test("User is succesfully created when all required attributes are given", async () => {
    await api.post('/OdinBook/user')
    .send(user)
    .expect(201)

    const usersInDb  = await User.find({})

    expect(usersInDb).toHaveLength(1)
  },15000)

  test("User is not created when required attributes are not given and\
   we recieve a proper status code", async()=>{
    await api.post('/OdinBook/user')
    .send(userWithNoName)
    .expect(400)

    await api.post('/OdinBook/user')
      .send(userWithNoUserName)
      .expect(400)

    const usersInDb = await User.find({})

    expect(usersInDb).toHaveLength(0)
  },15000)
})

afterAll(() => {
  mongoose.connection.close()
})