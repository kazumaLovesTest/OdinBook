const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  username:{
    type:String,
    minlength:[6, 'Must be atleast 6 but got {Value}'],
    required:true,
    unique:true,
  },
  passwordHash:{
    type:String,
    required:true,
  },
  friends:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }],
  friendRequests:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON',{
  transform:(document,returnedObject) =>{
    returnedObject.id = returnedObject._id.toString()
    
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User',userSchema)
