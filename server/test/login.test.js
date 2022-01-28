const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const User = require('../model/user')

describe("Logging in", () =>{
  beforeEach(async() =>{
    const user = {
      name: "Mekbib",
      username: "kazuma",
      password: "thePower"
    }
    await User.deleteMany({})
    await api.post('/OdinBook/user')
             .send(user)
             .expect(201)
  },15000)

  const user = {
    name: "Mekbib",
    username: "kazuma",
    password: "thePower"
  }
  const userWithWrongPassword = {
    name: "Mekbib",
    username: "kazuma",
    password: "Water"
  }
  test("Login is succussful if given correct credintials", async() =>{
    await api.post('/OdinBook/login')
             .send(user)
             .expect(200)
  },15000)
  test("Login fails if given incorrect credintials and returns proper status code",async() =>{
    await api.post('/OdinBook/login')
             .send(userWithWrongPassword)
             .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})