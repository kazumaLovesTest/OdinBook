const mongoose = require('mongoose')

const likesSchema = new mongoose.Schema({
  count:{
    type:Number,
    default:0
  },
  authors:[{
    default:null,
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }]
})

likesSchema.set('toJSON',{
  transform:(document,returnedObject) => {
  returnedObject.id = returnedObject._id.toString()

  delete returnedObject._id
  delete returnedObject._id
}})

module.exports = mongoose.model("Like", likesSchema)