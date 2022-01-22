require('dotenv').config()
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const User = require('../model/user')

describe("Friend requests", () => {

  const saltRound = 10
  const passwordHash = bcrypt.hashSync(thePower, saltRound)

  const user = new User({
    name: mekbib,
    username: kazuma,
    passwordHash
  })
  const userToRequest = new User({
    name: ayalew,
    username: flower,
    passwordHash
  })

  beforeEach(async () => {
    await User.deleteMany({})

    await user.save()
    await userToRequest.save()
  })

  test('user can send friend request', async () => {
    await api.post('/OdinBook/user/friend_request')
             .send(userToRequest)
             .expect(200)
  })
})