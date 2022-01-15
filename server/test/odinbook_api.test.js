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
  test("User is succesfully created when all required restrictions are met", async () => {
    await api.post('/OdinBook/user')
    .send(user)
    .expect(201)
    .expect('Content-Type',/application\/json/)

    const usersInDb  = await User.find({})

    expect(usersInDb).toHaveLength(1)
  },15000)
})
// describe('Logging in', () => {
//   beforeEach(async () => {
//     const user = {
//       name:Mekbib,
//       password:the
//     }
//     User.deleteMany({})
    
//   })
// })
afterAll(() => {
  mongoose.connection.close()
})