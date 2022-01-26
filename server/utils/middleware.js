const jwt = require('jsonwebtoken')
const User = require('../model/user')

const handleValidationError = (error, req, res, next) => {
  if (error.name === 'ValidationError')
    return res.status(400).json({
      error: error.message
    })
  if (error.name === 'JsonWebTokenError')
    return res.status(401).json({
      error:error.message
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
  let decodedToken;

  try {
    decodedToken = jwt.verify(req.token,process.env.SECRET)
  }
  catch(error) {
    next(error)
  }
  const user = await User.findOne(decodedToken)

  req.user = user
  
  next()
}
module.exports = { handleValidationError,tokenExtractor,userExtractor}