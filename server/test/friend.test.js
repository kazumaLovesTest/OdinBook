require('dotenv').config()
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const User = require('../model/user')

describe("Friend requests", () => {
  const saltRound = 10
  const passwordHash = bcrypt.hashSync('thePower', saltRound)
  let header;

  beforeEach(async () => {

    const user = new User({
      name: 'mekbib',
      username: 'kazuma',
      passwordHash
    })
    const secondUser = new User({
      name: 'ayalew',
      username: 'flower',
      passwordHash
    })


    await User.deleteMany({})

    await user.save()
    await secondUser.save()

    const userToLogin = {
      name: 'mekbib',
      username: 'kazuma',
      password: 'thePower'
    }
    const result = await api.post('/OdinBook/login')
      .send(userToLogin)
      .expect(200)

    header = { 'Authorization': `bearer ${result.body.token}` }
  }, 50000)



  test('user can send friend request', async () => {
    const userToSendRequestTo = {
      name: 'ayalew',
      username: 'flower',
    }
    await api.post('/OdinBook/user/friend_request')
      .send(userToSendRequestTo)
      .set(header)
      .expect(201)

    const userInDb = (await User.findOne(userToSendRequestTo)).toJSON()

    expect(userInDb.friendRequest).toHaveLength(1)
  }, 20000)

  test('user can not send friend request if no token is provided', async () => {
    const userToSendRequestTo = {
      name: 'ayalew',
      username: 'flower',
    }
    await api.post('/OdinBook/user/friend_request')
      .send(userToSendRequestTo)
      .expect(401)

    const userInDb = (await User.findOne(userToSendRequestTo)).toJSON()

    expect(userInDb.friendRequest).toHaveLength(0)
  }, 20000)
})