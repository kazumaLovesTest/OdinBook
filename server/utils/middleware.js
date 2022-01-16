const handleValidationError = (error,req,res,next) => {
  if (error.name === 'ValidationError')
    return res.status(400).json({
      error: "User name already Taken"
    })
  next()
}

module.exports = {handleValidationError}