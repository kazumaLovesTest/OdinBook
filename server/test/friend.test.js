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
    await api.post('/OdinBook/friend-request')
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
    await api.post('/OdinBook/friend-request')
      .send(userToSendRequestTo)
      .expect(401)

    const userInDb = (await User.findOne(userToSendRequestTo)).toJSON()

    expect(userInDb.friendRequests).toHaveLength(0)
  }, 20000)

  describe('accepting and rejecting friend requests', () => {
    beforeEach(async () => {
      const loggedInUser = await User.findOne({ username: 'kazuma' })
      const friendRequestUser = await User.findOne({ username: 'flower' })

      loggedInUser.friendRequests = loggedInUser.friendRequests.concat(friendRequestUser._id)

      await loggedInUser.save()
    }, 20000)

    test("Accepting friend requests", async () => {
      const users = {
        loggedInUser: {
          username: 'kazuma'
        },
        friendRequestUser: {
          username: 'flower'
        }
      }
      await api.post('/OdinBook/friend-request/accept')
        .send(users)
        .set(header)
        .expect(201)

      const loggedInUserInDb = (await User.findOne({ username: 'kazuma' })).toJSON()
      const friendRequestUserInDb = (await User.findOne({ username: 'flower' })).toJSON()

      expect(loggedInUserInDb.friendRequests).toHaveLength(0)
      expect(loggedInUserInDb.friends).toHaveLength(1)
      expect(friendRequestUserInDb.friends).toHaveLength(1)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})