const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content:String,
  date:{
    type:Date,
    default:Date.now
  },
 user:{
   type:mongoose.Schema.Types.ObjectId,
   ref:'User'
 },
})

mongoose.set('toJSON',{
  transform:(document,returnedObject) => {
    returnedObject.id = returnedObject._id

    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Comment',commentSchema)