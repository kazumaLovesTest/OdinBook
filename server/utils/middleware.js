const JWT = require('jsonwebtoken')
const User = require('../model/user')

const handleValidationError = (error, req, res, next) => {
  if (error.name === 'ValidationError')
    return res.status(400).json({
      error: error.message
    })
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization =  req.get('Authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer '))
      req.token = authorization.substring(7)
  else
    req.token = null
  next()
}

const userExtractor = async(req,res,next) => {
  const token = req.token
  const decodedToken =  JWT.verify(token,process.env.SECRET)

  if (token === null || !decodedToken)
    res.status(401).json({
      error:error.message,
    })
  
  const user = await User.findOne(decodedToken)

  req.user = user

  next()
}
module.exports = { handleValidationError,tokenExtractor,userExtractor}