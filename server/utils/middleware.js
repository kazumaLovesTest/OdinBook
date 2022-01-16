const handleValidationError = (error,req,res,next) => {
  console.log(error.name)
  if (error.name === 'ValidationError')
    return res.status(400).json({
      error: error.message
    })
  next()
}

module.exports = {handleValidationError}