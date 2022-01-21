const resetRoute = require('express').Router()
const User = require('../model/user')

resetRoute.delete('/', async (req,res) => {
  await User.deleteMany({})
  res.status(204).end()
})

module.exports = resetRoute